const { Tabungan, Sampah, Nasabah } = require('../models');

exports.create = async (req, res) => {
  try {
    const { id_nasabah, jenis_sampah, berat } = req.body;

    if (!id_nasabah || !jenis_sampah || !berat) {
      return res.status(400).json({ message: 'id_nasabah, jenis_sampah, dan berat wajib diisi' });
    }

    const nasabah = await Nasabah.findByPk(id_nasabah);
    if (!nasabah) {
      return res.status(404).json({ message: 'Nasabah tidak ditemukan' });
    }

    const sampah = await Sampah.findOne({ where: { jenis_sampah } });
    if (!sampah) {
      return res.status(404).json({ message: 'Jenis sampah tidak ditemukan' });
    }

    const harga = sampah.harga;
    const total = harga * parseFloat(berat);

    // Update stok sampah
    sampah.stok += parseFloat(berat);
    await sampah.save();

    const tabungan = await Tabungan.create({
      id_nasabah,
      jenis_sampah,
      harga,
      berat,
      total
    });

    await Nasabah.increment(
      { saldo: total },
      { where: { id: id_nasabah } }
    );

    res.status(201).json({
      message: 'Tabungan berhasil ditambahkan',
      data: tabungan
    });

  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan data', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Tabungan.findAll();
    res.json({ message: 'Data semua tabungan', data });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

exports.getByNasabah = async (req, res) => {
  try {
    const id_login = req.user.id_login;

    const nasabah = await Nasabah.findOne({ where: { id_login } });
    if (!nasabah) {
      return res.status(404).json({ message: 'Nasabah tidak ditemukan' });
    }

    const data = await Tabungan.findAll({
      where: { id_nasabah: nasabah.id }
    });

    res.json({ message: 'Data tabungan Anda', data });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { jenis_sampah, berat } = req.body;

    if (!jenis_sampah || !berat) {
      return res.status(400).json({ message: 'jenis_sampah dan berat wajib diisi' });
    }

    const tabungan = await Tabungan.findByPk(id);
    if (!tabungan) {
      return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });
    }

    const sampahBaru = await Sampah.findOne({ where: { jenis_sampah } });
    if (!sampahBaru) {
      return res.status(404).json({ message: 'Jenis sampah tidak ditemukan' });
    }

    const beratBaru = parseFloat(berat);
    const hargaBaru = sampahBaru.harga;
    const totalLama = tabungan.total;
    const totalBaru = hargaBaru * beratBaru;

    // Kelola stok
    if (jenis_sampah !== tabungan.jenis_sampah) {
      // Kembalikan stok sampah lama
      const sampahLama = await Sampah.findOne({ where: { jenis_sampah: tabungan.jenis_sampah } });
      if (sampahLama) {
        sampahLama.stok -= tabungan.berat;
        await sampahLama.save();
      }

      // Tambahkan ke stok sampah baru
      sampahBaru.stok += beratBaru;
      await sampahBaru.save();
    } else {
      // Update stok berdasarkan selisih berat
      const selisihBerat = beratBaru - tabungan.berat;
      sampahBaru.stok += selisihBerat;
      await sampahBaru.save();
    }

    // Update data tabungan
    tabungan.jenis_sampah = jenis_sampah;
    tabungan.harga = hargaBaru;
    tabungan.berat = beratBaru;
    tabungan.total = totalBaru;
    tabungan.updated_at = new Date();
    await tabungan.save();

    // Update saldo nasabah berdasarkan selisih total
    const selisihSaldo = totalBaru - totalLama;
    await Nasabah.increment(
      { saldo: selisihSaldo },
      { where: { id: tabungan.id_nasabah } }
    );

    res.json({ message: 'Data tabungan berhasil diperbarui', data: tabungan });

  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui data', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const tabungan = await Tabungan.findByPk(id);
    if (!tabungan) {
      return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });
    }

    // Cek saldo nasabah
    const nasabah = await Nasabah.findByPk(tabungan.id_nasabah);
    if (!nasabah) {
      return res.status(404).json({ message: 'Nasabah tidak ditemukan' });
    }

    if (nasabah.saldo < tabungan.total) {
      return res.status(400).json({ message: 'Saldo nasabah tidak mencukupi untuk menghapus tabungan ini' });
    }

    // Kurangi saldo nasabah
    await Nasabah.increment(
      { saldo: -tabungan.total },
      { where: { id: tabungan.id_nasabah } }
    );

    await tabungan.destroy();
    res.json({ message: 'Data tabungan berhasil dihapus' });

  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus data', error: err.message });
  }
};
