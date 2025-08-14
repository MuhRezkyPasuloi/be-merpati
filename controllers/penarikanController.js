const { Penarikan, Nasabah } = require('../models');

// exports.ajukanPenarikan = async (req, res) => {
//   try {
//     const { id_nasabah, nominal, metode, bank, no_rekening } = req.body;
    

//     const nasabah = await Nasabah.findByPk(id_nasabah);
//     if (!nasabah) return res.status(404).json({ message: "Nasabah tidak ditemukan" });

//     if (nominal > nasabah.saldo) {
//       return res.status(400).json({ message: "Saldo tidak mencukupi" });
//     }

//     if (metode === 'transfer' && (!bank || !no_rekening)) {
//       return res.status(400).json({ message: "Bank dan No Rekening wajib diisi untuk transfer" });
//     }

//     const penarikan = await Penarikan.create({
//       id_nasabah,
//       nominal,
//       metode,
//       bank: metode === 'transfer' ? bank : null,
//       no_rekening: metode === 'transfer' ? no_rekening : null,
//       status: 'pending'
//     });

//     res.status(201).json({ message: "Pengajuan penarikan berhasil dikirim", data: penarikan });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Tentukan tanggal Idul Fitri untuk beberapa tahun (sesuai perhitungan kalender Hijriyah)
const idulFitriDates = {
  2025: new Date(2025, 2, 30), // 30 Maret 2025
  2026: new Date(2026, 2, 20), // 20 Maret 2026
  2027: new Date(2027, 2, 9),  // 9 Maret 2027
  2028: new Date(2028, 1, 26), // 26 Februari 2028
  2029: new Date(2029, 1, 14)  // 14 Februari 2029
};

exports.ajukanPenarikan = async (req, res) => {
  try {
    const { id_nasabah, nominal, metode, bank, no_rekening } = req.body;

    const nasabah = await Nasabah.findByPk(id_nasabah);
    if (!nasabah) return res.status(404).json({ message: "Nasabah tidak ditemukan" });

    // Pastikan saldo cukup
    if (nominal > nasabah.saldo) {
      return res.status(400).json({ message: "Saldo tidak mencukupi" });
    }

    // Pastikan input bank & no rekening untuk transfer
    if (metode === 'transfer' && (!bank || !no_rekening)) {
      return res.status(400).json({ message: "Bank dan No Rekening wajib diisi untuk transfer" });
    }

    // =============================
    // BATASAN WAKTU PENARIKAN
    // =============================
    const today = new Date();
    const currentYear = today.getFullYear();

    const idulFitriDate = idulFitriDates[currentYear];
    if (!idulFitriDate) {
      return res.status(400).json({ message: "Tanggal Idul Fitri tahun ini belum diatur di sistem" });
    }

    // Hitung 3 hari sebelum Idul Fitri
    const startDate = new Date(idulFitriDate);
    startDate.setDate(startDate.getDate() - 3); // 3 hari sebelum

    // Batas terakhir = 1 hari sebelum Idul Fitri
    const endDate = new Date(idulFitriDate);
    endDate.setDate(endDate.getDate() - 1);

    // Cek apakah tanggal sekarang dalam rentang yang diizinkan
    if (!(today >= startDate && today <= endDate)) {
      return res.status(400).json({
        message: `Penarikan saldo hanya diizinkan antara ${startDate.toLocaleDateString('id-ID')} dan ${endDate.toLocaleDateString('id-ID')}`
      });
    }

    // =============================
    // BATASAN 1x PENARIKAN PER TAHUN
    // =============================
    const existingWithdrawal = await Penarikan.findOne({
      where: {
        id_nasabah,
        status: ['pending', 'disetujui']
      }
    });

    if (existingWithdrawal) {
      const tahunPenarikan = new Date(existingWithdrawal.createdAt).getFullYear();
      if (tahunPenarikan === currentYear) {
        return res.status(400).json({ message: "Anda sudah melakukan penarikan tahun ini" });
      }
    }

    // =============================
    // SIMPAN DATA PENARIKAN
    // =============================
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
