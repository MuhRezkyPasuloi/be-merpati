const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    id_login: DataTypes.STRING,
    nama: DataTypes.STRING,
    no_hp: DataTypes.BIGINT,
    alamat: DataTypes.TEXT,
  }, {
    tableName: 'admin', // sesuai nama tabel di database
    timestamps: false   // jika kamu tidak pakai createdAt / updatedAt
  });

  return Admin;
};
