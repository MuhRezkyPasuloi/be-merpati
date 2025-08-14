// controllers/laporanController.js
const { Tabungan, Nasabah, Laporan } = require('../models');
const { Op } = require('sequelize');

exports.generateLaporanBulanan = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;

    if (!bulan || !tahun) {
      return res.status(400).json({ message: 'Bulan dan tahun wajib diisi' });
    }

    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0);

    const tabunganData = await Tabungan.findAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Nasabah,
        as: 'nasabah'
      }]
    });

    // Ubah setiap transaksi menjadi baris laporan
    const laporanArray = tabunganData.map(item => ({
      id_nasabah: item.id_nasabah,
      nama_nasabah: item.nasabah?.nama || 'Tidak Diketahui',
      jenis_sampah: item.jenis_sampah,
      tanggal_menabung: item.created_at,
      total_berat: parseFloat(item.berat),
      total_nominal: parseFloat(item.total)
    }));

    const laporanExist = await Laporan.findOne({ where: { bulan, tahun } });

    if (laporanExist) {
      await laporanExist.update({ data: laporanArray });
    } else {
      await Laporan.create({
        bulan,
        tahun,
        data: laporanArray
      });
    }

    res.json({
      message: 'Laporan bulanan berhasil dibuat',
      bulan: parseInt(bulan),
      tahun: parseInt(tahun),
      data: laporanArray
    });

  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat laporan', error: err.message });
  }
};

// === FUNGSI BARU: Laporan Tahunan ===
exports.generateLaporanTahunan = async (req, res) => {
  try {
    const { tahun } = req.query;

    if (!tahun) {
      return res.status(400).json({ message: 'Tahun wajib diisi' });
    }

    const startDate = new Date(tahun, 0, 1); // 1 Jan
    const endDate = new Date(tahun, 11, 31, 23, 59, 59); // 31 Des

    const tabunganData = await Tabungan.findAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Nasabah,
        as: 'nasabah'
      }]
    });

    // Group data per bulan
    const laporanArray = tabunganData.map(item => ({
      id_nasabah: item.id_nasabah,
      nama_nasabah: item.nasabah?.nama || 'Tidak Diketahui',
      jenis_sampah: item.jenis_sampah,
      tanggal_menabung: item.created_at,
      total_berat: parseFloat(item.berat),
      total_nominal: parseFloat(item.total)
    }));

    const laporanExist = await Laporan.findOne({ where: { bulan: 0, tahun } });

    if (laporanExist) {
      await laporanExist.update({ data: laporanArray });
    } else {
      await Laporan.create({
        bulan: 0, // penanda laporan tahunan
        tahun,
        data: laporanArray
      });
    }

    res.json({
      message: 'Laporan tahunan berhasil dibuat',
      tahun: parseInt(tahun),
      data: laporanArray
    });

  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat laporan tahunan', error: err.message });
  }
};


exports.getArsipLaporan = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;
    const whereClause = {};

    if (bulan) whereClause.bulan = bulan;
    if (tahun) whereClause.tahun = tahun;

    const arsip = await Laporan.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    res.json({
      message: 'Data arsip laporan',
      data: arsip.map(item => ({
        id: item.id,
        bulan: item.bulan,
        tahun: item.tahun,
        data: item.data, // Sudah otomatis diparse sebagai array
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil arsip', error: err.message });
  }
};
