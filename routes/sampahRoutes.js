const express = require("express");
const router = express.Router();
const controller = require("../controllers/sampahController");
const upload = require("../middleware/uploadMiddleware"); // sesuaikan path kalau berbeda

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", upload.single("foto"), controller.create);
router.put("/:id", upload.single("foto"), controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
