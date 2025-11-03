const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Path ke public_html/uploads
// Di cPanel: /home/username/public_html/uploads
// Di local dev: akan membuat folder uploads di root project
const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../../public_html/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

// Konfigurasi storage untuk disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = path.extname(file.originalname);
    cb(null, `${timestamp}-${randomString}${extension}`);
  }
});

// Konfigurasi multer untuk disk storage
const upload = multer({
  storage: storage,
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