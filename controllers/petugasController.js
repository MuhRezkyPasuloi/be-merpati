const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { Petugas, Login } = require("../models");

const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/images/${filename}`;
};

exports.getAll = async (req, res) => {
  try {
    const data = await Petugas.findAll({
      include: {
        model: Login,
        as: "login",
        attributes: ["username"]
      }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Petugas.findByPk(req.params.id, {
      include: {
        model: Login,
        as: "login",
        attributes: ["username"]
      }
    });
    if (!data) return res.status(404).json({ message: "Petugas tidak ditemukan" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { username, password, nama, posisi, no_hp, alamat } = req.body;

    const exist = await Login.findOne({ where: { username } });
    if (exist) return res.status(400).json({ message: "Username sudah digunakan" });

    const hashedPassword = await bcrypt.hash(password || "petugas123", 10);

    const login = await Login.create({
      username,
      password: hashedPassword,
      role: "petugas",
    });

    const data = {
      id_login: login.id,
      nama,
      posisi,
      no_hp,
      alamat,
    };

    if (req.file) {
      data.foto_url = getImageUrl(req, req.file.filename);
    }

    const newPetugas = await Petugas.create(data);
    res.status(201).json(newPetugas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const petugas = await Petugas.findByPk(req.params.id);
    if (!petugas) return res.status(404).json({ message: "Petugas tidak ditemukan" });

    const data = req.body;

    if (req.file) {
      if (petugas.foto_url) {
        const oldFile = petugas.foto_url.split("/images/")[1];
        const oldPath = path.join(__dirname, "..", "public", "images", oldFile);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      data.foto_url = getImageUrl(req, req.file.filename);
    }

    await petugas.update(data);
    res.json({ message: "Petugas berhasil diupdate", petugas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const petugas = await Petugas.findByPk(req.params.id);
    if (!petugas) return res.status(404).json({ message: "Petugas tidak ditemukan" });

    if (petugas.foto_url) {
      const filename = petugas.foto_url.split("/images/")[1];
      const filepath = path.join(__dirname, "..", "public", "images", filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    if (petugas.id_login) {
      await Login.destroy({ where: { id: petugas.id_login } });
    }

    await petugas.destroy();
    res.json({ message: "Petugas berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
