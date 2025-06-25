module.exports = (sequelize, DataTypes) => {
  const Sampah = sequelize.define("Sampah", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    jenis_sampah: DataTypes.STRING,
    foto_url: DataTypes.STRING,
    stok: DataTypes.INTEGER,
    harga: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: "sampah",
    timestamps: true,                 // ✅ aktifkan timestamps
    createdAt: 'created_at',          // ✅ mapping ke kolom yang benar
    updatedAt: 'updated_at'           // ✅ mapping ke kolom yang benar
  });

  return Sampah;
};
