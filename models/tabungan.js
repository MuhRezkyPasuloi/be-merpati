module.exports = (sequelize, DataTypes) => {
  const Tabungan = sequelize.define('Tabungan', {
    id_nasabah: DataTypes.INTEGER,
    jenis_sampah: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    berat: DataTypes.FLOAT,
    total: DataTypes.INTEGER,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'tabungan',
    timestamps: true,
    createdAt: 'created_at', // ⬅️ mapping manual
    updatedAt: 'updated_at'  // ⬅️ mapping manual
  });

  Tabungan.associate = (models) => {
    Tabungan.belongsTo(models.Nasabah, {
      foreignKey: 'id_nasabah',
      as: 'Nasabah'
    });
  };


  return Tabungan;
};
