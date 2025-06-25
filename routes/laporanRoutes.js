// routes/laporanRoutes.js
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { authenticate } = require('../middleware/authMiddleware');

// GET laporan dan simpan ke arsip
router.get('/bulanan', authenticate, laporanController.generateLaporanBulanan);

// GET arsip laporan
router.get('/arsip', authenticate, laporanController.getArsipLaporan);

module.exports = router;
