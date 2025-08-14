const { Login, Admin, Nasabah, Petugas } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    const user = await Login.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Username tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Password salah' });
    }

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

    const token = jwt.sign(
      {
        id_login: user.id,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET || 'defaultsecretkey',
      { expiresIn: '1d' }
    );

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

exports.updateLogin = async (req, res) => {
  const { id } = req.params;
  const { username, password, email } = req.body;

  try {
    const login = await Login.findByPk(id);
    if (!login) {
      return res.status(404).json({ message: 'Login tidak ditemukan' });
    }

    // Perbarui username
    if (username) login.username = username;
    if (email) login.email = email;

    // Perbarui password jika dikirim
    if (password && password.trim() !== '') {
      const hashed = await bcrypt.hash(password, 10);
      login.password = hashed;
    }

    await login.save();

    res.json({ message: 'Data login berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui login', error: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Cek apakah email ada
    const user = await Login.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    // Buat token reset password (berlaku 1 jam)
    const token = jwt.sign(
      { id_login: user.id },
      process.env.JWT_SECRET || "defaultsecretkey",
      { expiresIn: "1h" }
    );

    // Buat link reset password
    const resetLink = `http://localhost:5173/reset-password/${token}`; // ganti domain sesuai frontend

    // Kirim email via nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // email pengirim
        pass: process.env.EMAIL_PASS, // password/aplikasi token
      },
    });

    await transporter.sendMail({
      from: `"Bank Sampah" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password Bank Sampah",
      html: `
        <p>Anda menerima email ini karena permintaan reset password.</p>
        <p>Klik link berikut untuk mereset password Anda:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link ini berlaku selama 1 jam.</p>
      `,
    });

    res.json({ message: "Link reset password telah dikirim ke email Anda" });
  } catch (err) {
    console.error("Error forgotPassword:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};



exports.resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Konfirmasi password tidak cocok" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecretkey");

    // Cari user
    const user = await Login.findByPk(decoded.id_login);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password berhasil direset" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token kadaluarsa, silakan minta ulang" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
