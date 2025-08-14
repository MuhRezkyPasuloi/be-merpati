// routes/laporanRoutes.js
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// GET laporan dan simpan ke arsip
router.get('/bulanan', authenticate, authorize('admin'), laporanController.generateLaporanBulanan);
router.get('/tahunan', authenticate, authorize('admin'), laporanController.generateLaporanTahunan);

// GET arsip laporan
router.get('/arsip', authenticate, authorize('admin'), laporanController.getArsipLaporan);

module.exports = router;
