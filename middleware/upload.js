const multer = require('multer');
const path = require('path');

// Filter untuk file gambar saja
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpeg, jpg, png) yang diperbolehkan!'));
  }
};

// Konfigurasi multer untuk memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // Max 2MB per file
  },
  fileFilter: fileFilter
});

// Upload single file (untuk foto profil)
const uploadSingle = upload.single('fotoProfil');

// Upload multiple files (untuk foto produk, max 5)
const uploadMultiple = upload.array('foto', 5);

module.exports = {
  uploadSingle,
  uploadMultiple
};