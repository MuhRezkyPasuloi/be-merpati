// module.exports = (sequelize, DataTypes) => {
//   const Tabungan = sequelize.define('Tabungan', {
//     id_nasabah: DataTypes.INTEGER,
//     jenis_sampah: DataTypes.STRING,
//     harga: DataTypes.INTEGER,
//     berat: DataTypes.FLOAT,
//     total: DataTypes.INTEGER,
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//       defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
//     }
//   }, {
//     tableName: 'tabungan',
//     timestamps: true,
//     createdAt: 'created_at', // ⬅️ mapping manual
//     updatedAt: 'updated_at'  // ⬅️ mapping manual
//   });

//   Tabungan.associate = (models) => {
//     Tabungan.belongsTo(models.Nasabah, {
//       foreignKey: 'id_nasabah',
//       as: 'Nasabah'
//     });
//   };


//   return Tabungan;
// };


// module.exports = (sequelize, DataTypes) => {
//   const Tabungan = sequelize.define('Tabungan', {
//     id_nasabah: DataTypes.INTEGER,
//     jenis_sampah: DataTypes.STRING,
//     harga: DataTypes.INTEGER,
//     harga_saat_input: DataTypes.INTEGER,
//     berat: DataTypes.FLOAT,
//     total: DataTypes.INTEGER,
//     sudah_dijual: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },

//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//       defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
//     }
//   }, {
//     tableName: 'tabungan',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at'
//   });

//   Tabungan.associate = (models) => {
//     Tabungan.belongsTo(models.Nasabah, {
//       foreignKey: 'id_nasabah',
//       as: 'nasabah'
//     });

//     Tabungan.hasMany(models.Penjualan, {
//       foreignKey: 'id_tabungan',
//       as: 'penjualan'
//     });
//   };

//   return Tabungan;
// };


module.exports = (sequelize, DataTypes) => {
  const Tabungan = sequelize.define('Tabungan', {
    id_nasabah: DataTypes.INTEGER,
    jenis_sampah: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    harga_saat_input: DataTypes.INTEGER,
    berat: DataTypes.FLOAT,
    total: DataTypes.INTEGER,
    sudah_dijual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
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
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Tabungan.associate = (models) => {
    Tabungan.belongsTo(models.Nasabah, {
      foreignKey: 'id_nasabah',
      as: 'nasabah'
    });

    Tabungan.belongsTo(models.Sampah, {
      foreignKey: 'jenis_sampah',
      targetKey: 'jenis_sampah',
      as: 'sampah'
    });

    Tabungan.hasMany(models.Penjualan, {
      foreignKey: 'id_tabungan',
      as: 'penjualan'
    });
  };

  return Tabungan;
};
