// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const app = express();

// dotenv.config();
// app.use(cors());
// app.use(express.json());

// const loginRoutes = require("./routes/loginRoutes");
// app.use("/api/login", loginRoutes);
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);
// const petugasRoutes = require("./routes/petugasRoutes");
// app.use("/api/petugas", petugasRoutes);
// const nasabahRoutes = require("./routes/nasabahRoutes");
// app.use("/api/nasabah", nasabahRoutes);
// const sampahRoutes = require("./routes/sampahRoutes");
// app.use("/api/sampah", sampahRoutes);
// const tabunganRoutes = require("./routes/tabunganRoutes");
// app.use("/api/tabungan", tabunganRoutes);
// const penarikanRoutes = require("./routes/penarikanRoutes");
// app.use("/api/penarikan", penarikanRoutes);
// app.use(express.static("public")); // tambahkan ini
// const transaksiRoutes = require("./routes/transaksiRoutes");
// app.use("/api/transaksi", transaksiRoutes);

// app.listen(process.env.PORT || 3000, () => {
//   console.log("Server running on port", process.env.PORT || 3000);
// });

// const Sequelize = require('sequelize');
// const sequelize = require('./config/database');
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const app = express();

// dotenv.config();
// app.use(cors());
// app.use(express.json());

// // === HANYA AKTIFKAN RUTE NASABAH SAJA ===
// const Login = require('/login')(sequelize, Sequelize);
// const Admin = require('/admin')(sequelize, Sequelize);

// // === SERVE FILE GAMBAR (untuk akses foto) ===
// app.use(express.static("public"));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });


const app = require('./app'); // pastikan app.js pakai `module.exports = app;` di akhir

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});