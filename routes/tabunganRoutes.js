const express = require('express');
const router = express.Router();
const tabunganController = require('../controllers/tabunganController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Petugas
router.post('/', authenticate, authorize('petugas'), tabunganController.create);
router.get('/', authenticate, authorize('petugas'), tabunganController.getAll);
router.delete('/:id', authenticate, authorize('petugas'), tabunganController.delete);
// Update data tabungan (hanya petugas)
router.put('/:id', authenticate, authorize('petugas'), tabunganController.update);

// Nasabah
router.get('/me', authenticate, authorize('nasabah'), tabunganController.getByNasabah);

module.exports = router;
