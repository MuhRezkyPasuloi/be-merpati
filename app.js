// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const app = express();
// const sequelize = require('./config/database');

// app.use(cors());
// app.use(bodyParser.json());

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// app.use('/api', authRoutes);

// // Tes koneksi database dan sync
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database terkoneksi...');
//     return sequelize.sync();
//   })
//   .then(() => console.log('Database sinkron'))
//   .catch(err => console.error('Koneksi gagal:', err));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));


// app.js
require('dotenv').config();
const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // akses file gambar

// Import semua routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const petugasRoutes = require('./routes/petugasRoutes');
const nasabahRoutes = require('./routes/nasabahRoutes');
const sampahRoutes = require('./routes/sampahRoutes');
const tabunganRoutes = require('./routes/tabunganRoutes');
const penarikanRoutes = require('./routes/penarikanRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const penjualanRoutes = require('./routes/penjualanRoutes');
// const transaksiRoutes = require('./routes/transaksiRoutes');

// Gunakan semua rute
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/petugas', petugasRoutes);
app.use('/api/nasabah', nasabahRoutes);
app.use('/api/sampah', sampahRoutes);
app.use('/api/tabungan', tabunganRoutes);
app.use('/api/penarikan', penarikanRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/penjualan', penjualanRoutes);
// app.use('/api/transaksi', transaksiRoutes);
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// Tes koneksi database dan sync
sequelize.authenticate()
  .then(() => {
    console.log('Database terkoneksi...');
    return sequelize.sync();
  })
  .then(() => console.log('Database sinkron'))
  .catch(err => console.error('Koneksi gagal:', err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

module.exports = app; // untuk testing jika diperlukan
