const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ubah ke public/uploads (bukan images)
const uploadPath = path.join(__dirname, "../public/images");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = [".jpg", ".jpeg", ".png"];
    if (!allowedExts.includes(ext)) {
      return cb(new Error("Only .jpg, .jpeg, .png files are allowed"));
    }
    cb(null, true);
  }
});

module.exports = upload;
