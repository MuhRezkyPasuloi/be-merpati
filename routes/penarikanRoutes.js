const express = require("express");
const router = express.Router();
const penarikanController = require("../controllers/penarikanController");

// Pengajuan oleh nasabah
router.post("/", penarikanController.ajukanPenarikan);

// Konfirmasi oleh petugas
router.patch("/:id/konfirmasi", penarikanController.konfirmasiPenarikan);

// Get semua data
router.get("/", penarikanController.getAll);

module.exports = router;
