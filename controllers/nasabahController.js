const fs = require("fs");
const path = require("path");
const { Nasabah, Login } = require("../models");
const bcrypt = require("bcrypt");

// Helper untuk membuat URL gambar
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/images/${filename}`;
};

module.exports = {
  // Ambil semua nasabah
  getAll: async (req, res) => {
    try {
      const nasabah = await Nasabah.findAll({
        include: {
          model: Login,
          as: 'login',
          attributes: ['username']
        }
      });
      res.json(nasabah);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Ambil 1 nasabah berdasarkan ID
  getById: async (req, res) => {
    try {
      const nasabah = await Nasabah.findByPk(req.params.id, {
        include: {
          model: Login,
          as: 'login',
          attributes: ['username']
        }
      });
      if (!nasabah) return res.status(404).json({ message: "Nasabah tidak ditemukan" });
      res.json(nasabah);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Buat nasabah baru + buat akun login
  create: async (req, res) => {
    try {
      const { username, password, nama, no_hp, alamat } = req.body;

      const exist = await Login.findOne({ where: { username } });
      if (exist) return res.status(400).json({ message: "Username sudah digunakan" });

      const hashedPassword = await bcrypt.hash(password || "nasabah123", 10);

      const login = await Login.create({
        username,
        password: hashedPassword,
        role: "nasabah"
      });

      const data = {
        id_login: login.id,
        nama,
        no_hp,
        alamat,
      };

      if (req.file) {
        data.foto_url = getImageUrl(req, req.file.filename);
      }

      const newNasabah = await Nasabah.create(data);
      res.json(newNasabah);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update data nasabah
  update: async (req, res) => {
    try {
      const nasabah = await Nasabah.findByPk(req.params.id);
      if (!nasabah) return res.status(404).json({ message: "Nasabah tidak ditemukan" });

      const data = req.body;

      if (req.file) {
        if (nasabah.foto_url) {
          const oldFile = nasabah.foto_url.split("/images/")[1];
          const oldPath = path.join(__dirname, "..", "public", "images", oldFile);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        data.foto_url = getImageUrl(req, req.file.filename);
      }

      await nasabah.update(data);
      res.json({ message: "Nasabah berhasil diupdate", nasabah });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Hapus nasabah + akun login
  delete: async (req, res) => {
    try {
      const nasabah = await Nasabah.findByPk(req.params.id);
      if (!nasabah) return res.status(404).json({ message: "Nasabah tidak ditemukan" });

      if (nasabah.foto_url) {
        const filename = nasabah.foto_url.split("/images/")[1];
        const filepath = path.join(__dirname, "..", "public", "images", filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      }

      if (nasabah.id_login) {
        await Login.destroy({ where: { id: nasabah.id_login } });
      }

      await nasabah.destroy();
      res.json({ message: "Nasabah berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};