const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = require('./admin')(sequelize, DataTypes);
const Petugas = require('./petugas')(sequelize, DataTypes);
const Nasabah = require('./nasabah')(sequelize, DataTypes);
const Login = require('./login');
const Sampah = require('./sampah')(sequelize, DataTypes); // ✅ Tambahkan ini
const Tabungan = require('./tabungan')(sequelize, DataTypes)
const Penarikan = require('./penarikan')(sequelize, DataTypes);
const Laporan = require('./laporan')(sequelize, DataTypes); // ✅ Tambahkan ini jika ada
const Penjualan = require('./penjualan')(sequelize, DataTypes); // ✅ Tambahkan ini jika ada

const db = {
  sequelize,
  Sequelize,
  Admin,
  Petugas,
  Nasabah,
  Login,
  Sampah, // ✅ Tambahkan ini
  Tabungan,
  Penarikan,
  Laporan,
  Penjualan
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});



module.exports = db;
