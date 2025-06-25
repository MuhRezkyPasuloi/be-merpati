// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const sequelize = require('../config/database');
// const { DataTypes } = require('sequelize');
// const Nasabah = require('../models/nasabah')(sequelize, DataTypes);

// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await Nasabah.findOne({ where: { username } });
//     if (!user) return res.status(401).json({ message: 'User tidak ditemukan' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: 'Password salah' });

//     const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Terjadi kesalahan', error });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Maksimal 5 percobaan login per IP setiap 15 menit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, authController.login);

module.exports = router;
