// // ==== controller/tabunganController.js ====
// const { Tabungan, Sampah, Nasabah } = require('../models');

// // Tambah data tabungan
// exports.create = async (req, res) => {
//   try {
//     const { id_nasabah, jenis_sampah, berat } = req.body;

//     if (!id_nasabah || !jenis_sampah || !berat) {
//       return res.status(400).json({ message: 'id_nasabah, jenis_sampah, dan berat wajib diisi' });
//     }

//     const nasabah = await Nasabah.findByPk(id_nasabah);
//     if (!nasabah) return res.status(404).json({ message: 'Nasabah tidak ditemukan' });

//     const sampah = await Sampah.findOne({ where: { jenis_sampah } });
//     if (!sampah) return res.status(404).json({ message: 'Jenis sampah tidak ditemukan' });

//     const harga = sampah.harga;
//     const total = harga * parseFloat(berat);

//     sampah.stok += parseFloat(berat);
//     await sampah.save();

//     const tabungan = await Tabungan.create({
//       id_nasabah,
//       jenis_sampah,
//       harga,
//       berat,
//       total,
//       harga_saat_input: harga,
//       is_finalized: false
//     });

//     await Nasabah.increment({ saldo: total }, { where: { id: id_nasabah } });

//     res.status(201).json({ message: 'Tabungan berhasil ditambahkan', data: tabungan });

//   } catch (err) {
//     res.status(500).json({ message: 'Gagal menambahkan data', error: err.message });
//   }
// };

// // Ambil semua data
// exports.getAll = async (req, res) => {
//   try {
//     const data = await Tabungan.findAll();

//     const updatedData = await Promise.all(
//       data.map(async (item) => {
//         if (item.is_finalized) {
//           item.harga = item.harga_saat_input;
//         } else {
//           const sampah = await Sampah.findOne({ where: { jenis_sampah: item.jenis_sampah } });
//           if (sampah) item.harga = sampah.harga;
//         }

//         item.total = item.harga * item.berat;
//         return item;
//       })
//     );

//     res.json({ message: 'Data semua tabungan', data: updatedData });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
//   }
// };


// // Finalisasi data tabungan (harga tidak bisa diubah lagi)
// exports.finalize = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const tabungan = await Tabungan.findByPk(id);

//     if (!tabungan) return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });
//     if (tabungan.is_finalized) return res.status(400).json({ message: 'Data sudah difinalisasi' });

//     const sampah = await Sampah.findOne({ where: { jenis_sampah: tabungan.jenis_sampah } });
//     if (!sampah) return res.status(404).json({ message: 'Data harga sampah tidak ditemukan' });

//     const totalBaru = tabungan.berat * sampah.harga;
//     const selisihTotal = totalBaru - tabungan.total;

//     // Update tabungan
//     tabungan.harga_saat_input = sampah.harga;
//     tabungan.total = totalBaru;
//     tabungan.is_finalized = true;
//     await tabungan.save();

//     // Update saldo nasabah
//     await Nasabah.increment({ saldo: selisihTotal }, { where: { id: tabungan.id_nasabah } });

//     res.json({ message: 'Data berhasil difinalisasi dan saldo diperbarui', data: tabungan });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal finalisasi', error: err.message });
//   }
// };


// // Ambil data berdasarkan login nasabah
// exports.getByNasabah = async (req, res) => {
//   try {
//     const id_login = req.user.id_login;
//     const nasabah = await Nasabah.findOne({ where: { id_login } });
//     if (!nasabah) return res.status(404).json({ message: 'Nasabah tidak ditemukan' });

//     const data = await Tabungan.findAll({ where: { id_nasabah: nasabah.id } });

//     const updatedData = await Promise.all(
//       data.map(async (item) => {
//         if (item.is_finalized) {
//           item.harga = item.harga_saat_input;
//         } else {
//           const sampah = await Sampah.findOne({ where: { jenis_sampah: item.jenis_sampah } });
//           if (sampah) item.harga = sampah.harga;
//         }

//         item.total = item.harga * item.berat;
//         return item;
//       })
//     );

//     res.json({ message: 'Data tabungan Anda', data: updatedData });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
//   }
// };


// // Update data tabungan (selama belum difinalisasi)
// exports.update = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { jenis_sampah, berat } = req.body;

//     if (!jenis_sampah || !berat) {
//       return res.status(400).json({ message: 'jenis_sampah dan berat wajib diisi' });
//     }

//     const tabungan = await Tabungan.findByPk(id);
//     if (!tabungan) return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });

//     if (tabungan.is_finalized) {
//       return res.status(400).json({ message: 'Data sudah difinalisasi dan tidak bisa diubah' });
//     }

//     const sampahBaru = await Sampah.findOne({ where: { jenis_sampah } });
//     if (!sampahBaru) return res.status(404).json({ message: 'Jenis sampah tidak ditemukan' });

//     const beratBaru = parseFloat(berat);
//     const hargaBaru = sampahBaru.harga;
//     const totalLama = tabungan.total;
//     const totalBaru = hargaBaru * beratBaru;

//     // Stok
//     if (jenis_sampah !== tabungan.jenis_sampah) {
//       const sampahLama = await Sampah.findOne({ where: { jenis_sampah: tabungan.jenis_sampah } });
//       if (sampahLama) {
//         sampahLama.stok -= tabungan.berat;
//         await sampahLama.save();
//       }
//       sampahBaru.stok += beratBaru;
//       await sampahBaru.save();
//     } else {
//       const selisihBerat = beratBaru - tabungan.berat;
//       sampahBaru.stok += selisihBerat;
//       await sampahBaru.save();
//     }

//     // Update tabungan
//     tabungan.jenis_sampah = jenis_sampah;
//     tabungan.harga = hargaBaru;
//     tabungan.berat = beratBaru;
//     tabungan.total = totalBaru;
//     await tabungan.save();

//     // Update saldo
//     const selisihSaldo = totalBaru - totalLama;
//     await Nasabah.increment({ saldo: selisihSaldo }, { where: { id: tabungan.id_nasabah } });

//     res.json({ message: 'Data tabungan berhasil diperbarui', data: tabungan });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal memperbarui data', error: err.message });
//   }
// };

// // Hapus data tabungan (selama belum difinalisasi)
// exports.delete = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const tabungan = await Tabungan.findByPk(id);
//     if (!tabungan) return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });

//     if (tabungan.is_finalized) {
//       return res.status(400).json({ message: 'Data sudah difinalisasi dan tidak bisa dihapus' });
//     }

//     const nasabah = await Nasabah.findByPk(tabungan.id_nasabah);
//     if (!nasabah) return res.status(404).json({ message: 'Nasabah tidak ditemukan' });

//     if (nasabah.saldo < tabungan.total) {
//       return res.status(400).json({ message: 'Saldo nasabah tidak mencukupi untuk menghapus tabungan ini' });
//     }

//     await Nasabah.increment({ saldo: -tabungan.total }, { where: { id: tabungan.id_nasabah } });
//     await tabungan.destroy();

//     res.json({ message: 'Data tabungan berhasil dihapus' });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal menghapus data', error: err.message });
//   }
// };


const { Tabungan, Sampah, Nasabah, Penjualan } = require('../models');

// Tambah data tabungan
exports.create = async (req, res) => {
  try {
    const { id_nasabah, jenis_sampah, berat } = req.body;
    if (!id_nasabah || !jenis_sampah || !berat) {
      return res.status(400).json({ message: 'id_nasabah, jenis_sampah, dan berat wajib diisi' });
    }

    const nasabah = await Nasabah.findByPk(id_nasabah);
    if (!nasabah) return res.status(404).json({ message: 'Nasabah tidak ditemukan' });

    const sampah = await Sampah.findOne({ where: { jenis_sampah } });
    if (!sampah) return res.status(404).json({ message: 'Jenis sampah tidak ditemukan' });

    const harga = sampah.harga;
    const total = harga * parseFloat(berat);

    sampah.stok += parseFloat(berat);
    await sampah.save();

    const tabungan = await Tabungan.create({
      id_nasabah,
      jenis_sampah,
      berat,
      harga,
      total,
      sudah_dijual: false
    });

    await Nasabah.increment({ saldo: total }, { where: { id: id_nasabah } });

    res.status(201).json({ message: 'Tabungan berhasil ditambahkan', data: tabungan });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan data', error: err.message });
  }
};

// Ambil semua data
exports.getAll = async (req, res) => {
  try {
    const data = await Tabungan.findAll();
    res.json({ message: 'Data semua tabungan', data });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

// Ambil tabungan berdasarkan login
exports.getByNasabah = async (req, res) => {
  try {
    const id_login = req.user.id_login;
    const nasabah = await Nasabah.findOne({ where: { id_login } });
    if (!nasabah) return res.status(404).json({ message: 'Nasabah tidak ditemukan' });

    const data = await Tabungan.findAll({ where: { id_nasabah: nasabah.id } });
    res.json({ message: 'Data tabungan Anda', data });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

// Update data tabungan (hanya jika belum dijual)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { jenis_sampah, berat } = req.body;

    if (!jenis_sampah || !berat) {
      return res.status(400).json({ message: 'jenis_sampah dan berat wajib diisi' });
    }

    const tabungan = await Tabungan.findByPk(id);
    if (!tabungan) return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });

    if (tabungan.sudah_dijual) {
      return res.status(400).json({ message: 'Data tabungan sudah dijual dan tidak bisa diubah' });
    }

    const sampahBaru = await Sampah.findOne({ where: { jenis_sampah } });
    if (!sampahBaru) return res.status(404).json({ message: 'Jenis sampah tidak ditemukan' });

    const beratBaru = parseFloat(berat);
    const hargaBaru = sampahBaru.harga;
    const totalBaru = hargaBaru * beratBaru;

    // Update stok
    const selisihBerat = beratBaru - tabungan.berat;
    sampahBaru.stok += selisihBerat;
    await sampahBaru.save();

    // Update tabungan
    const selisihSaldo = totalBaru - tabungan.total;
    tabungan.jenis_sampah = jenis_sampah;
    tabungan.berat = beratBaru;
    tabungan.harga = hargaBaru;
    tabungan.total = totalBaru;
    await tabungan.save();

    // Update saldo nasabah
    await Nasabah.increment({ saldo: selisihSaldo }, { where: { id: tabungan.id_nasabah } });

    res.json({ message: 'Data tabungan berhasil diperbarui', data: tabungan });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui data', error: err.message });
  }
};

// Hapus tabungan jika belum dijual
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const tabungan = await Tabungan.findByPk(id);
    if (!tabungan) return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });

    if (tabungan.sudah_dijual) {
      return res.status(400).json({ message: 'Tabungan sudah dijual dan tidak bisa dihapus' });
    }

    await Nasabah.increment({ saldo: -tabungan.total }, { where: { id: tabungan.id_nasabah } });
    await tabungan.destroy();

    res.json({ message: 'Data tabungan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus data', error: err.message });
  }
};

// ✅ Dipanggil saat penjualan berhasil, override saldo dan tandai tabungan sudah dijual
exports.tandaiSudahDijual = async (idTabungan, hargaBaru) => {
  const tabungan = await Tabungan.findByPk(idTabungan);
  if (!tabungan) throw new Error('Tabungan tidak ditemukan');

  const totalLama = tabungan.total;
  const totalBaru = hargaBaru * tabungan.berat;

  const nasabah = await Nasabah.findByPk(tabungan.id_nasabah);
  if (!nasabah) throw new Error('Nasabah tidak ditemukan');

  // Hitung saldo baru: saldo lama - total tabungan lama + total hasil jual
  const saldoBaru = nasabah.saldo - totalLama + totalBaru;
  await nasabah.update({ saldo: saldoBaru });

  tabungan.harga = hargaBaru;
  tabungan.total = totalBaru;
  tabungan.sudah_dijual = true;
  await tabungan.save();
};


// const { Tabungan, Sampah, Nasabah, Penjualan } = require('../models');
// const { sequelize } = require('../models');

// // Tambah data tabungan
// exports.create = async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const { id_nasabah, jenis_sampah, berat } = req.body;
    
//     if (!id_nasabah || !jenis_sampah || !berat) {
//       await transaction.rollback();
//       return res.status(400).json({ message: 'id_nasabah, jenis_sampah, dan berat wajib diisi' });
//     }

//     if (isNaN(berat) || parseFloat(berat) <= 0) {
//       await transaction.rollback();
//       return res.status(400).json({ message: 'Berat harus berupa angka positif' });
//     }

//     const nasabah = await Nasabah.findByPk(id_nasabah, { transaction });
//     if (!nasabah) {
//       await transaction.rollback();
//       return res.status(404).json({ message: 'Nasabah tidak ditemukan' });
//     }

//     const sampah = await Sampah.findOne({ 
//       where: { jenis_sampah },
//       transaction,
//       lock: true
//     });
//     if (!sampah) {
//       await transaction.rollback();
//       return res.status(404).json({ message: 'Jenis sampah tidak ditemukan' });
//     }

//     const beratFloat = parseFloat(berat);
//     const harga = sampah.harga; // Harga nasabah dari master data
//     const total = harga * beratFloat;

//     // Update stok sampah
//     await sampah.update({ 
//       stok: sampah.stok + beratFloat 
//     }, { transaction });

//     // Buat data tabungan
//     const tabungan = await Tabungan.create({
//       id_nasabah,
//       jenis_sampah,
//       berat: beratFloat,
//       harga,
//       total,
//       harga_saat_input: harga, // Simpan harga saat input untuk restore nanti
//       sudah_dijual: false
//     }, { transaction });

//     // Update saldo nasabah
//     await Nasabah.increment({ 
//       saldo: total 
//     }, { 
//       where: { id: id_nasabah },
//       transaction 
//     });

//     await transaction.commit();

//     // Ambil data lengkap untuk response
//     const tabunganWithDetails = await Tabungan.findByPk(tabungan.id, {
//       include: [
//         { model: Nasabah, as: 'nasabah' },
//         { model: Sampah, as: 'sampah' }
//       ]
//     });

//     res.status(201).json({ 
//       message: 'Tabungan berhasil ditambahkan', 
//       data: tabunganWithDetails 
//     });
//   } catch (err) {
//     await transaction.rollback();
//     console.error('Error creating tabungan:', err);
//     res.status(500).json({ message: 'Gagal menambahkan data', error: err.message });
//   }
// };

// // Ambil semua data
// exports.getAll = async (req, res) => {
//   try {
//     const data = await Tabungan.findAll({
//       include: [
//         { model: Nasabah, as: 'nasabah' },
//         { model: Sampah, as: 'sampah' }
//       ],
//       order: [['createdAt', 'DESC']]
//     });
//     res.json({ message: 'Data semua tabungan', data });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
//   }
// };

// // Ambil tabungan berdasarkan login
// exports.getByNasabah = async (req, res) => {
//   try {
//     const id_login = req.user.id_login;
//     const nasabah = await Nasabah.findOne({ where: { id_login } });
//     if (!nasabah) return res.status(404).json({ message: 'Nasabah tidak ditemukan' });

//     const data = await Tabungan.findAll({ 
//       where: { id_nasabah: nasabah.id },
//       include: [
//         { model: Sampah, as: 'sampah' }
//       ],
//       order: [['createdAt', 'DESC']]
//     });
//     res.json({ message: 'Data tabungan Anda', data });
//   } catch (err) {
//     res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
//   }
// };

// // Update data tabungan (hanya jika belum dijual)
// exports.update = async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const { id } = req.params;
//     const { jenis_sampah, berat } = req.body;

//     if (!jenis_sampah || !berat) {
//       await transaction.rollback();
//       return res.status(400).json({ message: 'jenis_sampah dan berat wajib diisi' });
//     }

//     if (isNaN(berat) || parseFloat(berat) <= 0) {
//       await transaction.rollback();
//       return res.status(400).json({ message: 'Berat harus berupa angka positif' });
//     }

//     const tabungan = await Tabungan.findByPk(id, { 
//       transaction,
//       lock: true
//     });
//     if (!tabungan) {
//       await transaction.rollback();
//       return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });
//     }

//     if (tabungan.sudah_dijual) {
//       await transaction.rollback();
//       return res.status(400).json({ message: 'Data tabungan sudah dijual dan tidak bisa diubah' });
//     }

//     // Ambil data sampah lama untuk update stok
//     const sampahLama = await Sampah.findOne({ 
//       where: { jenis_sampah: tabungan.jenis_sampah },
//       transaction,
//       lock: true
//     });

//     const sampahBaru = await Sampah.findOne({ 
//       where: { jenis_sampah },
//       transaction,
//       lock: true
//     });
//     if (!sampahBaru) {
//       await transaction.rollback();
//       return res.status(404).json({ message: 'Jenis sampah tidak ditemukan' });
//     }

//     const beratBaru = parseFloat(berat);
//     const hargaBaru = sampahBaru.harga; // Harga nasabah
//     const totalBaru = hargaBaru * beratBaru;

//     // Update stok sampah
//     const selisihBerat = beratBaru - tabungan.berat;
    
//     // Kurangi stok dari sampah lama jika berbeda jenis
//     if (sampahLama && sampahLama.jenis_sampah !== jenis_sampah) {
//       await sampahLama.update({
//         stok: sampahLama.stok - tabungan.berat
//       }, { transaction });
//     }
    
//     // Update stok sampah baru
//     if (sampahLama && sampahLama.jenis_sampah === jenis_sampah) {
//       // Jenis sama, hanya selisih berat
//       await sampahBaru.update({
//         stok: sampahBaru.stok + selisihBerat
//       }, { transaction });
//     } else {
//       // Jenis berbeda, tambah semua berat baru
//       await sampahBaru.update({
//         stok: sampahBaru.stok + beratBaru
//       }, { transaction });
//     }

//     // Update saldo nasabah
//     const selisihSaldo = totalBaru - tabungan.total;
//     await Nasabah.increment({ 
//       saldo: selisihSaldo 
//     }, { 
//       where: { id: tabungan.id_nasabah },
//       transaction 
//     });

//     // Update tabungan
//     await tabungan.update({
//       jenis_sampah: jenis_sampah,
//       berat: beratBaru,
//       harga: hargaBaru,
//       total: totalBaru,
//       harga_saat_input: hargaBaru // Update harga saat input juga
//     }, { transaction });

//     await transaction.commit();

//     // Ambil data lengkap untuk response
//     const tabunganWithDetails = await Tabungan.findByPk(id, {
//       include: [
//         { model: Nasabah, as: 'nasabah' },
//         { model: Sampah, as: 'sampah' }
//       ]
//     });

//     res.json({ message: 'Data tabungan berhasil diperbarui', data: tabunganWithDetails });
//   } catch (err) {
//     await transaction.rollback();
//     console.error('Error updating tabungan:', err);
//     res.status(500).json({ message: 'Gagal memperbarui data', error: err.message });
//   }
// };

// // Hapus tabungan jika belum dijual
// exports.delete = async (req, res) => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     const { id } = req.params;
//     const tabungan = await Tabungan.findByPk(id, { 
//       transaction,
//       lock: true
//     });
//     if (!tabungan) {
//       await transaction.rollback();
//       return res.status(404).json({ message: 'Data tabungan tidak ditemukan' });
//     }

//     if (tabungan.sudah_dijual) {
//       await transaction.rollback();
//       return res.status(400).json({ message: 'Tabungan sudah dijual dan tidak bisa dihapus' });
//     }

//     // Update stok sampah (kembalikan stok)
//     const sampah = await Sampah.findOne({
//       where: { jenis_sampah: tabungan.jenis_sampah },
//       transaction,
//       lock: true
//     });
    
//     if (sampah) {
//       await sampah.update({
//         stok: sampah.stok - tabungan.berat
//       }, { transaction });
//     }

//     // Kurangi saldo nasabah
//     await Nasabah.increment({ 
//       saldo: -tabungan.total 
//     }, { 
//       where: { id: tabungan.id_nasabah },
//       transaction 
//     });

//     await tabungan.destroy({ transaction });
//     await transaction.commit();

//     res.json({ message: 'Data tabungan berhasil dihapus' });
//   } catch (err) {
//     await transaction.rollback();
//     console.error('Error deleting tabungan:', err);
//     res.status(500).json({ message: 'Gagal menghapus data', error: err.message });
//   }
// };

// // ✅ Dipanggil saat penjualan berhasil, override saldo dan tandai tabungan sudah dijual
// exports.tandaiSudahDijual = async (idTabungan, hargaNasabah, transaction = null) => {
//   const useTransaction = transaction || await sequelize.transaction();
//   const shouldCommit = !transaction; // Commit hanya jika transaction dibuat di sini
  
//   try {
//     const tabungan = await Tabungan.findByPk(idTabungan, { 
//       transaction: useTransaction,
//       lock: true
//     });
//     if (!tabungan) throw new Error('Tabungan tidak ditemukan');

//     if (tabungan.sudah_dijual) {
//       throw new Error('Tabungan sudah dijual sebelumnya');
//     }

//     const totalLama = tabungan.total;
//     const totalBaru = hargaNasabah * tabungan.berat; // Gunakan harga nasabah

//     const nasabah = await Nasabah.findByPk(tabungan.id_nasabah, {
//       transaction: useTransaction,
//       lock: true
//     });
//     if (!nasabah) throw new Error('Nasabah tidak ditemukan');

//     // Hitung saldo baru: saldo lama - total tabungan lama + total hasil penjualan
//     const saldoBaru = nasabah.saldo - totalLama + totalBaru;
    
//     // Validasi saldo tidak negatif (opsional)
//     if (saldoBaru < 0) {
//       throw new Error('Perhitungan saldo menghasilkan nilai negatif');
//     }

//     await nasabah.update({ saldo: saldoBaru }, { transaction: useTransaction });

//     // Update tabungan dengan harga nasabah
//     await tabungan.update({
//       harga: hargaNasabah,    // Simpan harga nasabah (bukan vendor)
//       total: totalBaru,       // Total berdasarkan harga nasabah
//       sudah_dijual: true
//     }, { transaction: useTransaction });

//     if (shouldCommit) {
//       await useTransaction.commit();
//     }

//     return {
//       tabungan,
//       nasabah,
//       saldoBaru,
//       totalBaru,
//       totalLama
//     };
//   } catch (error) {
//     if (shouldCommit) {
//       await useTransaction.rollback();
//     }
//     throw error;
//   }
// };

// // ✅ Fungsi untuk mengembalikan status tabungan (untuk rollback penjualan)
// exports.kembalikanStatusTabungan = async (idTabungan, transaction = null) => {
//   const useTransaction = transaction || await sequelize.transaction();
//   const shouldCommit = !transaction;
  
//   try {
//     const tabungan = await Tabungan.findByPk(idTabungan, { 
//       transaction: useTransaction,
//       lock: true
//     });
//     if (!tabungan) throw new Error('Tabungan tidak ditemukan');

//     if (!tabungan.sudah_dijual) {
//       throw new Error('Tabungan belum dijual, tidak perlu dikembalikan');
//     }

//     const nasabah = await Nasabah.findByPk(tabungan.id_nasabah, {
//       transaction: useTransaction,
//       lock: true
//     });
//     if (!nasabah) throw new Error('Nasabah tidak ditemukan');

//     // Kembalikan ke harga saat input jika ada, atau gunakan harga dari master sampah
//     let hargaAsli = tabungan.harga_saat_input;
//     if (!hargaAsli) {
//       const sampah = await Sampah.findOne({
//         where: { jenis_sampah: tabungan.jenis_sampah },
//         transaction: useTransaction
//       });
//       hargaAsli = sampah ? sampah.harga : tabungan.harga;
//     }

//     const totalAsli = hargaAsli * tabungan.berat;
//     const totalPenjualan = tabungan.total;

//     // Hitung saldo baru: saldo sekarang - total penjualan + total asli
//     const saldoBaru = nasabah.saldo - totalPenjualan + totalAsli;

//     await nasabah.update({ saldo: saldoBaru }, { transaction: useTransaction });

//     // Kembalikan tabungan ke kondisi semula
//     await tabungan.update({
//       harga: hargaAsli,
//       total: totalAsli,
//       sudah_dijual: false
//     }, { transaction: useTransaction });

//     if (shouldCommit) {
//       await useTransaction.commit();
//     }

//     return {
//       tabungan,
//       nasabah,
//       saldoBaru,
//       totalAsli,
//       totalPenjualan
//     };
//   } catch (error) {
//     if (shouldCommit) {
//       await useTransaction.rollback();
//     }
//     throw error;
//   }
// };

// // Method tambahan untuk mendapatkan history tabungan nasabah
// exports.getHistoryByNasabah = async (req, res) => {
//   try {
//     const { id_nasabah } = req.params;
    
//     const data = await Tabungan.findAll({
//       where: { id_nasabah },
//       include: [
//         { 
//           model: Sampah, 
//           as: 'sampah',
//           attributes: ['jenis_sampah', 'harga_vendor'] 
//         },
//         {
//           model: Penjualan,
//           as: 'penjualan',
//           required: false // LEFT JOIN untuk tabungan yang belum dijual
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     });
    
//     res.json({ 
//       message: `History tabungan untuk nasabah ID ${id_nasabah}`, 
//       data 
//     });
//   } catch (err) {
//     console.error('Error fetching history tabungan:', err);
//     res.status(500).json({ message: 'Gagal mengambil history tabungan', error: err.message });
//   }
// };

// // Method untuk mendapatkan ringkasan tabungan per nasabah
// exports.getRingkasanTabungan = async (req, res) => {
//   try {
//     const ringkasan = await Tabungan.findAll({
//       attributes: [
//         'id_nasabah',
//         'sudah_dijual',
//         [sequelize.fn('COUNT', sequelize.col('id')), 'jumlah_tabungan'],
//         [sequelize.fn('SUM', sequelize.col('berat')), 'total_berat'],
//         [sequelize.fn('SUM', sequelize.col('total')), 'total_nilai']
//       ],
//       include: [{
//         model: Nasabah,
//         as: 'nasabah',
//         attributes: ['nama', 'saldo']
//       }],
//       group: ['id_nasabah', 'sudah_dijual', 'nasabah.id'],
//       order: [['id_nasabah', 'ASC'], ['sudah_dijual', 'ASC']]
//     });

//     res.json({ 
//       message: 'Ringkasan tabungan per nasabah', 
//       data: ringkasan 
//     });
//   } catch (err) {
//     console.error('Error fetching ringkasan tabungan:', err);
//     res.status(500).json({ message: 'Gagal mengambil ringkasan tabungan', error: err.message });
//   }
// };