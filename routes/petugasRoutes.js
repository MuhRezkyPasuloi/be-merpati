const express = require('express');
const router = express.Router();
const petugasController = require('../controllers/petugasController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', petugasController.getAll);
router.get('/:id', petugasController.getById);
router.post('/', upload.single('foto'), petugasController.create);
router.put('/:id', upload.single('foto'), petugasController.update);
router.delete('/:id', petugasController.delete);

module.exports = router;