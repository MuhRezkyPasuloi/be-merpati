const {Admin}  = require('../models');

exports.getAll = async (req, res) => {
  const data = await Admin.findAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await Admin.findByPk(req.params.id);
  res.json(data);
};

exports.create = async (req, res) => {
  const { nama, no_hp, alamat } = req.body;

  const newAdmin = await Admin.create({
    id_login: req.user.id_login, // dari token
    nama,
    no_hp,
    alamat,
  });

  res.json(newAdmin);
};

exports.update = async (req, res) => {
  try {
    const data = await Admin.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    await data.update(req.body);

    res.json(data);
  } catch (error) {
    console.error("Gagal update admin:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengupdate admin" });
  }
};

exports.delete = async (req, res) => {
  await Admin.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
};