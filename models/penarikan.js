module.exports = (sequelize, DataTypes) => {
  const Penarikan = sequelize.define('Penarikan', {
    id_nasabah: DataTypes.INTEGER,
    id_petugas: DataTypes.INTEGER,
    nominal: DataTypes.INTEGER,
    metode: DataTypes.ENUM('transfer', 'tunai'),
    status: {
      type: DataTypes.ENUM('pending', 'disetujui', 'ditolak'),
      defaultValue: 'pending'
    },
    tgl_penarikan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    bank: {
      type: DataTypes.STRING,
      allowNull: true
    },
    no_rekening: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'penarikan',
    timestamps: false
  });

  return Penarikan;
};
