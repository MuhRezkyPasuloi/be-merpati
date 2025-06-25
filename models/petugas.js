const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Petugas = sequelize.define('Petugas', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    id_login: {type: DataTypes.INTEGER, allowNull: false},
     // ⬅️ untuk display saja
    nama: DataTypes.STRING,
    posisi: DataTypes.STRING,
    no_hp: DataTypes.BIGINT,
    alamat: DataTypes.TEXT,
    foto_url: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at' // ⬅️ mapping kolom
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at' // ⬅️ mapping kolom
    },
}, {
  freezeTableName: true, // ⬅️ Tambahkan ini
} );
Petugas.associate = (models) => {
  Petugas.belongsTo(models.Login, {
    foreignKey: "id_login",
    as: "login",
  });
};
  return Petugas;
};