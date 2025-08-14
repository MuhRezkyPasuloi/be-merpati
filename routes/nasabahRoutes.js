// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/nasabahController");

// router.get("/", controller.getAll);
// router.get("/:id", controller.getById);
// router.post("/", controller.create);
// router.put("/:id", controller.update);
// router.delete("/:id", controller.delete);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/nasabahController");
// const upload = require("../middleware/upload");

// router.get("/", controller.getAll);
// router.get("/:id", controller.getById);
// router.post("/", upload.single("foto"), controller.create);
// router.put("/:id", upload.single("foto"), controller.update);
// router.delete("/:id", controller.delete);

// module.exports = router;


const express = require('express');
const router = express.Router();
const nasabahController = require('../controllers/nasabahController');
const upload = require('../middleware/uploadMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
router.get('/', nasabahController.getAll);
router.get('/:id', authenticate, nasabahController.getById);;
router.post('/', upload.single('foto'), nasabahController.create);
router.put('/:id', upload.single('foto'), nasabahController.update);
router.delete('/:id', nasabahController.delete);

module.exports = router;

