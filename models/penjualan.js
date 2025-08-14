module.exports = (sequelize, DataTypes) => {
  const Penjualan = sequelize.define('Penjualan', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_tabungan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_nasabah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenis_sampah: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    berat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tanggal_penjualan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    harga_vendor: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'penjualan',
    timestamps: false
  });

  Penjualan.associate = (models) => {
    Penjualan.belongsTo(models.Tabungan, { foreignKey: 'id_tabungan', as: 'tabungan' });
    Penjualan.belongsTo(models.Nasabah, { foreignKey: 'id_nasabah', as: 'nasabah' });
  };

  return Penjualan;
};
