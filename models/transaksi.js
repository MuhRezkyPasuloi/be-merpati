module.exports = (sequelize, DataTypes) => {
  const Transaksi = sequelize.define("Transaksi", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    nasabah_id: DataTypes.STRING,
    jenis_sampah_id: DataTypes.STRING,
    berat: DataTypes.FLOAT,
    total: DataTypes.INTEGER,
    tanggal: DataTypes.DATE
  });
  return Transaksi;
};
