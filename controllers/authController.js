const { Login, Admin, Nasabah, Petugas } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validasi input dasar
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    // Cari user berdasarkan username
    const user = await Login.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Username tidak ditemukan' });
    }

    // Bandingkan password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Ambil data profil berdasarkan role
    let profile = null;
    switch (user.role) {
      case 'admin':
        profile = await Admin.findOne({ where: { id_login: user.id } });
        break;
      case 'petugas':
        profile = await Petugas.findOne({ where: { id_login: user.id } });
        break;
      case 'nasabah':
        profile = await Nasabah.findOne({ where: { id_login: user.id } });
        break;
    }

    if (!profile) {
      return res.status(404).json({ message: 'Data pengguna tidak ditemukan' });
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        id_login: user.id,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET || 'defaultsecretkey', // fallback jika .env belum diatur
      { expiresIn: '1d' }
    );

    // Kirim response
    res.json({
      message: 'Login berhasil',
      token,
      role: user.role,
      profile
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
