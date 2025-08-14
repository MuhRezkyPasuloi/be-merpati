// routes/penjualanRoutes.js
const express = require('express');
const router = express.Router();
const penjualanController = require('../controllers/penjualanController');

router.get('/', penjualanController.getAllPenjualan);
router.post('/', penjualanController.createPenjualan);
router.delete('/:id', penjualanController.deletePenjualan);

module.exports = router;
