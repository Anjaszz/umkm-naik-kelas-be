const { body, validationResult } = require('express-validator');

const validateProduct = [
  body('nama').trim().notEmpty().withMessage('Nama produk wajib diisi'),
  body('deskripsi').trim().notEmpty().withMessage('Deskripsi produk wajib diisi'),
  body('harga').isNumeric().withMessage('Harga harus berupa angka')
    .custom(value => value > 0).withMessage('Harga harus lebih dari 0'),
  body('kategori').trim().notEmpty().withMessage('Kategori wajib dipilih'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }
    next();
  }
];

module.exports = { validateProduct };