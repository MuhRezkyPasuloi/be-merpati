// controllers/laporanController.js
const { Tabungan, Nasabah, Laporan } = require('../models');
const { Op } = require('sequelize');

// exports.generateLaporanBulanan = async (req, res) => {
//   try {
//     const { bulan, tahun } = req.query;

//     if (!bulan || !tahun) {
//       return res.status(400).json({ message: 'Bulan dan tahun wajib diisi' });
//     }

//     const startDate = new Date(tahun, bulan - 1, 1);
//     const endDate = new Date(tahun, bulan, 0);

//     const tabunganData = await Tabungan.findAll({
//         where: {
//             created_at: {
//             [Op.between]: [startDate, endDate]
//             }
//         },
//         include: [{
//             model: Nasabah,
//             as: 'Nasabah' // ✅ WAJIB SESUAIKAN DENGAN ALIAS
//         }]
//     });

//     const laporan = {};

//     tabunganData.forEach(item => {
//       const key = `${item.id_nasabah}-${item.jenis_sampah}`;
//       if (!laporan[key]) {
//         laporan[key] = {
//           id_nasabah: item.id_nasabah,
//           nama_nasabah: item.Nasabah?.nama || 'Tidak Diketahui',
//           jenis_sampah: item.jenis_sampah,
//           tanggal_menabung: [],
//           total_berat: 0,
//           total_nominal: 0
//         };
//       }

//       laporan[key].tanggal_menabung.push(item.created_at);
//       laporan[key].total_berat += parseFloat(item.berat);
//       laporan[key].total_nominal += parseFloat(item.total);
//     });

//     const laporanArray = Object.values(laporan);

//     // Simpan ke tabel arsip laporan
//     const laporanExist = await Laporan.findOne({ where: { bulan, tahun } });

//     if (laporanExist) {
//       await laporanExist.update({ data: laporanArray });
//     } else {
//       await Laporan.create({
//         bulan,
//         tahun,
//         data: laporanArray
//       });
//     }

//     res.json({
//       message: 'Laporan bulanan berhasil dibuat',
//       bulan: parseInt(bulan),
//       tahun: parseInt(tahun),
//       data: laporanArray
//     });

//   } catch (err) {
//     res.status(500).json({ message: 'Gagal membuat laporan', error: err.message });
//   }
// };

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
        as: 'Nasabah'
      }]
    });

    // Ubah setiap transaksi menjadi baris laporan
    const laporanArray = tabunganData.map(item => ({
      id_nasabah: item.id_nasabah,
      nama_nasabah: item.Nasabah?.nama || 'Tidak Diketahui',
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
