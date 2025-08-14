// const { Penjualan, Tabungan, Nasabah, Sampah } = require('../models');

// module.exports = {
//   async getAllPenjualan(req, res) {
//     try {
//       const data = await Penjualan.findAll({
//         include: [
//           { model: Tabungan, as: 'tabungan', include: [{ model: Nasabah, as: 'nasabah' }] },
//           { model: Nasabah, as: 'nasabah' }
//         ],
//         order: [['tanggal_penjualan', 'DESC']]
//       });
//       res.status(200).json(data);
//     } catch (error) {
//       console.error('Error fetching penjualan:', error);
//       res.status(500).json({ message: 'Gagal mengambil data penjualan', error });
//     }
//   },

//   async createPenjualan(req, res) {
//     const {
//       id_tabungan,
//       id_nasabah,
//       jenis_sampah,
//       berat,
//       harga,
//       harga_vendor
//     } = req.body;

//     try {
//       const total = berat * harga;

//       // Simpan penjualan
//       const newPenjualan = await Penjualan.create({
//         id_tabungan,
//         id_nasabah,
//         jenis_sampah,
//         berat,
//         harga,
//         total,
//         harga_vendor
//       });

//       // Kurangi saldo nasabah
//       const dataTabungan = await Tabungan.findByPk(id_tabungan);
//       if (dataTabungan) {
//         const nasabahData = await Nasabah.findByPk(dataTabungan.id_nasabah);
//         if (nasabahData) {
//           nasabahData.saldo -= total;
//           await nasabahData.save();
//         }
//       }

//       // ✅ Update harga & harga_vendor ke tabel Sampah
//       const sampahData = await Sampah.findOne({ where: { jenis_sampah } });
//       if (sampahData) {
//         await sampahData.update({
//           harga: parseInt(harga),
//           harga_vendor: parseInt(harga_vendor)
//         });
//       }

//       res.status(201).json({ message: 'Penjualan berhasil ditambahkan', data: newPenjualan });
//     } catch (error) {
//       console.error('Error creating penjualan:', error);
//       res.status(500).json({ message: 'Gagal menambahkan data penjualan', error });
//     }
//   },

//   async deletePenjualan(req, res) {
//     const { id } = req.params;
//     try {
//       const penjualanData = await Penjualan.findByPk(id);
//       if (!penjualanData) {
//         return res.status(404).json({ message: 'Penjualan tidak ditemukan' });
//       }

//       await penjualanData.destroy();
//       res.status(200).json({ message: 'Penjualan berhasil dihapus' });
//     } catch (error) {
//       console.error('Error deleting penjualan:', error);
//       res.status(500).json({ message: 'Gagal menghapus penjualan', error });
//     }
//   }
// };


// const { Penjualan, Tabungan, Nasabah, Sampah } = require('../models');

// module.exports = {
//   async getAllPenjualan(req, res) {
//     try {
//       const data = await Penjualan.findAll({
//         include: [
//           {
//             model: Tabungan,
//             as: 'tabungan',
//             include: [
//               { model: Nasabah, as: 'nasabah' },
//               { model: Sampah, as: 'sampah' }
//             ]
//           },
//           { model: Nasabah, as: 'nasabah' }
//         ],
//         order: [['tanggal_penjualan', 'DESC']]
//       });
//       res.status(200).json(data);
//     } catch (error) {
//       console.error('Error fetching penjualan:', error);
//       res.status(500).json({ message: 'Gagal mengambil data penjualan', error });
//     }
//   },

//   async createPenjualan(req, res) {
//     try {
//       const {
//         id_tabungan,
//         id_nasabah,
//         jenis_sampah,
//         berat,
//         harga_vendor
//       } = req.body;

//       // Validasi
//       if (!id_tabungan || !id_nasabah || !berat || !harga_vendor) {
//         return res.status(400).json({ error: 'Data tidak lengkap untuk penjualan' });
//       }

//       // Hitung harga dan total
//       const harga_jual = harga_vendor * 0.8;
//       const total_jual = harga_jual * berat;

//       // Ambil data tabungan
//       const tabungan = await Tabungan.findByPk(id_tabungan);
//       if (!tabungan) return res.status(404).json({ error: 'Tabungan tidak ditemukan' });

//       if (tabungan.sudah_dijual) {
//         return res.status(400).json({ error: 'Tabungan sudah dijual sebelumnya' });
//       }

//       // Ambil nasabah
//       const nasabah = await Nasabah.findByPk(id_nasabah);
//       if (!nasabah) return res.status(404).json({ error: 'Nasabah tidak ditemukan' });

//       // Hitung ulang saldo: saldo - total_lama + total_jual
//       const saldoBaru = nasabah.saldo - tabungan.total + total_jual;
//       await nasabah.update({ saldo: saldoBaru });

//       // Update tabungan
//       await tabungan.update({
//         harga: harga_jual,
//         total: total_jual,
//         sudah_dijual: true
//       });

//       // Update harga sampah
//       const sampah = await Sampah.findOne({ where: { jenis_sampah } });
//       if (sampah) {
//         await sampah.update({
//           harga_vendor: harga_vendor,
//           harga: harga_jual
//         });
//       }

//       // Simpan data penjualan
//       const penjualan = await Penjualan.create({
//         id_tabungan,
//         id_nasabah,
//         jenis_sampah,
//         berat,
//         harga: harga_jual,
//         total: total_jual,
//         harga_vendor,
//         tanggal_penjualan: new Date()
//       });

//       res.status(201).json({ message: 'Penjualan berhasil', data: penjualan });
//     } catch (err) {
//       console.error('Penjualan error:', err);
//       res.status(500).json({ error: 'Terjadi kesalahan saat melakukan penjualan' });
//     }
//   },

//   async deletePenjualan(req, res) {
//     const { id } = req.params;
//     try {
//       const penjualanData = await Penjualan.findByPk(id);
//       if (!penjualanData) {
//         return res.status(404).json({ message: 'Penjualan tidak ditemukan' });
//       }

//       await penjualanData.destroy();
//       res.status(200).json({ message: 'Penjualan berhasil dihapus' });
//     } catch (error) {
//       console.error('Error deleting penjualan:', error);
//       res.status(500).json({ message: 'Gagal menghapus penjualan', error });
//     }
//   }
// };

const { Penjualan, Tabungan, Nasabah, Sampah } = require('../models');

module.exports = {
  async getAllPenjualan(req, res) {
    try {
      const data = await Penjualan.findAll({
        include: [
          {
            model: Tabungan,
            as: 'tabungan',
            include: [
              { model: Nasabah, as: 'nasabah' },
              { model: Sampah, as: 'sampah' }
            ]
          },
          { model: Nasabah, as: 'nasabah' }
        ],
        order: [['tanggal_penjualan', 'DESC']]
      });
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching penjualan:', error);
      res.status(500).json({ message: 'Gagal mengambil data penjualan', error });
    }
  },

  async createPenjualan(req, res) {
    try {
      const { id_tabungan, id_nasabah, jenis_sampah, harga_vendor } = req.body;

      if (!id_tabungan || !id_nasabah || !harga_vendor) {
        return res.status(400).json({ error: 'Data tidak lengkap untuk penjualan' });
      }

      const tabungan = await Tabungan.findByPk(id_tabungan);
      if (!tabungan) return res.status(404).json({ error: 'Tabungan tidak ditemukan' });
      if (tabungan.sudah_dijual) {
        return res.status(400).json({ error: 'Tabungan sudah dijual sebelumnya' });
      }

      const berat = tabungan.berat;
      if (berat <= 0 || harga_vendor <= 0) {
        return res.status(400).json({ error: 'Berat atau harga vendor tidak valid' });
      }

      const hargaNasabah = Math.floor(harga_vendor * 0.8);
      const total = hargaNasabah * berat;

      const nasabah = await Nasabah.findByPk(id_nasabah);
      if (!nasabah) return res.status(404).json({ error: 'Nasabah tidak ditemukan' });

      // Perbaikan saldo:
      // Kurangi saldo lama dengan total tabungan sebelumnya, lalu tambahkan total penjualan
      let saldoBaru = nasabah.saldo;

      // Jika saldo sudah termasuk nilai tabungan lama, maka kurangi dulu
      if (tabungan.total > 0) {
        saldoBaru -= tabungan.total;
      }

      // Tambahkan total dari penjualan baru
      saldoBaru += total;

      await nasabah.update({ saldo: saldoBaru });

      // Update tabungan dengan harga & status sudah dijual
      await tabungan.update({
        harga: hargaNasabah,
        total: total,
        sudah_dijual: true
      });

      // Update harga di tabel Sampah
      const sampah = await Sampah.findOne({ where: { jenis_sampah } });
      if (sampah) {
        await sampah.update({
          harga_vendor: harga_vendor,
          harga: hargaNasabah
        });
      }

      // Simpan data penjualan
      const penjualan = await Penjualan.create({
        id_tabungan,
        id_nasabah,
        jenis_sampah,
        berat,
        harga: hargaNasabah,
        total,
        harga_vendor,
        tanggal_penjualan: new Date()
      });

      res.status(201).json({ message: 'Penjualan berhasil', data: penjualan });

    } catch (err) {
      console.error('Penjualan error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat melakukan penjualan' });
    }
  },

  async deletePenjualan(req, res) {
    const { id } = req.params;
    try {
      const penjualanData = await Penjualan.findByPk(id);
      if (!penjualanData) {
        return res.status(404).json({ message: 'Penjualan tidak ditemukan' });
      }

      await penjualanData.destroy();
      res.status(200).json({ message: 'Penjualan berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting penjualan:', error);
      res.status(500).json({ message: 'Gagal menghapus penjualan', error });
    }
  }
};

