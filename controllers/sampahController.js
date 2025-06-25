const fs = require("fs");
const path = require("path");
const { Sampah } = require("../models");

// Helper: Buat URL gambar publik
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/images/${filename}`;
};

module.exports = {
  // Ambil semua data sampah
  getAll: async (req, res) => {
    try {
      const data = await Sampah.findAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data", detail: err.message });
    }
  },

  // Ambil data sampah berdasarkan ID
  getById: async (req, res) => {
    try {
      const sampah = await Sampah.findByPk(req.params.id);
      if (!sampah) return res.status(404).json({ message: "Data tidak ditemukan" });
      res.json(sampah);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data", detail: err.message });
    }
  },

  // Tambah data sampah baru
  create: async (req, res) => {
    try {
      const { jenis_sampah, stok, harga } = req.body;

      const data = {
        jenis_sampah,
        stok: parseInt(stok),
        harga: parseInt(harga)
      };

      if (req.file) {
        data.foto_url = getImageUrl(req, req.file.filename);
      }

      const newSampah = await Sampah.create(data);
      res.status(201).json({ message: "Data berhasil ditambahkan", data: newSampah });
    } catch (err) {
      res.status(500).json({ error: "Gagal menambahkan data", detail: err.message });
    }
  },

  // Update data sampah
  update: async (req, res) => {
    try {
      const sampah = await Sampah.findByPk(req.params.id);
      if (!sampah) return res.status(404).json({ message: "Data tidak ditemukan" });

      const { jenis_sampah, stok, harga } = req.body;

      const data = {
        jenis_sampah,
        stok: stok !== undefined ? parseInt(stok) : sampah.stok,
        harga: harga !== undefined ? parseInt(harga) : sampah.harga
      };

      // Jika ada file baru, hapus gambar lama
      if (req.file) {
        if (sampah.foto_url) {
          const oldFile = sampah.foto_url.split("/images/")[1];
          const oldPath = path.join(__dirname, "..", "public", "images", oldFile);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        data.foto_url = getImageUrl(req, req.file.filename);
      }

      await sampah.update(data);
      res.json({ message: "Data berhasil diupdate", data: sampah });
    } catch (err) {
      res.status(500).json({ error: "Gagal mengupdate data", detail: err.message });
    }
  },

  // Hapus data sampah
  delete: async (req, res) => {
    try {
      const sampah = await Sampah.findByPk(req.params.id);
      if (!sampah) return res.status(404).json({ message: "Data tidak ditemukan" });

      // Hapus gambar jika ada
      if (sampah.foto_url) {
        const filename = sampah.foto_url.split("/images/")[1];
        const filepath = path.join(__dirname, "..", "public", "images", filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      }

      await sampah.destroy();
      res.json({ message: "Data berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: "Gagal menghapus data", detail: err.message });
    }
  }
};
