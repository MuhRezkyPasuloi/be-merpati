const express = require('express');
const router = express.Router();
const tabunganController = require('../controllers/tabunganController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// ========== ROUTE UNTUK PETUGAS DAN ADMIN ========== //

// Tambah tabungan
router.post('/', authenticate, authorize('petugas'), tabunganController.create);

// Ambil semua tabungan (untuk petugas dan admin)
router.get('/', authenticate, authorize('petugas', 'admin'), tabunganController.getAll);

// Update tabungan (hanya jika belum dijual)
router.put('/:id', authenticate, authorize('petugas'), tabunganController.update);

// Hapus tabungan (hanya jika belum dijual)
router.delete('/:id', authenticate, authorize('petugas'), tabunganController.delete);


// ========== ROUTE UNTUK NASABAH ========== //

// Ambil tabungan milik sendiri
router.get('/me', authenticate, authorize('nasabah'), tabunganController.getByNasabah);

module.exports = router;
