const { Penarikan, Nasabah } = require('../models');

exports.ajukanPenarikan = async (req, res) => {
  try {
    const { id_nasabah, nominal, metode, bank, no_rekening } = req.body;
    

    const nasabah = await Nasabah.findByPk(id_nasabah);
    if (!nasabah) return res.status(404).json({ message: "Nasabah tidak ditemukan" });

    if (nominal > nasabah.saldo) {
      return res.status(400).json({ message: "Saldo tidak mencukupi" });
    }

    if (metode === 'transfer' && (!bank || !no_rekening)) {
      return res.status(400).json({ message: "Bank dan No Rekening wajib diisi untuk transfer" });
    }

    const penarikan = await Penarikan.create({
      id_nasabah,
      nominal,
      metode,
      bank: metode === 'transfer' ? bank : null,
      no_rekening: metode === 'transfer' ? no_rekening : null,
      status: 'pending'
    });

    res.status(201).json({ message: "Pengajuan penarikan berhasil dikirim", data: penarikan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.konfirmasiPenarikan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, id_petugas } = req.body;

    const penarikan = await Penarikan.findByPk(id);
    if (!penarikan) return res.status(404).json({ message: "Data penarikan tidak ditemukan" });

    if (penarikan.status !== 'pending') {
      return res.status(400).json({ message: "Penarikan sudah diproses sebelumnya" });
    }

    const nasabah = await Nasabah.findByPk(penarikan.id_nasabah);
    if (!nasabah) return res.status(404).json({ message: "Nasabah tidak ditemukan" });

    if (status === 'disetujui') {
      if (penarikan.nominal > nasabah.saldo) {
        return res.status(400).json({ message: "Saldo nasabah tidak mencukupi" });
      }

      nasabah.saldo -= penarikan.nominal;
      await nasabah.save();
    }

    penarikan.status = status;
    penarikan.id_petugas = id_petugas;
    penarikan.tgl_penarikan = new Date();
    await penarikan.save();

    res.json({ message: `Penarikan berhasil ${status}`, data: penarikan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Penarikan.findAll();
    res.json({ message: "Data semua penarikan", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
