const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Nasabah = sequelize.define('Nasabah', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id_login: {type: DataTypes.INTEGER, allowNull: false}, // ⬅️ foreign key ke tabel login
     // ⬅️ untuk display saja
    nama: DataTypes.STRING,
    no_hp: DataTypes.BIGINT,
    alamat: DataTypes.TEXT,
    foto_url: DataTypes.STRING,
    saldo: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    freezeTableName: true,
    tableName: 'nasabah'
  });

  Nasabah.associate = (models) => {
  Nasabah.hasMany(models.Tabungan, {
    foreignKey: 'id_nasabah',
    as: 'Tabungans'
  });
  Nasabah.belongsTo(models.Login, {
    foreignKey: 'id_login',
    as: 'login'
  });
};

  return Nasabah;
};
