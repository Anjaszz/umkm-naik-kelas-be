const { body, validationResult } = require('express-validator');

const validateBuyerProfile = [
  body('nama').optional().trim().notEmpty().withMessage('Nama tidak boleh kosong'),
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

const validateSellerProfile = [
  body('namaToko').optional().trim().notEmpty().withMessage('Nama toko tidak boleh kosong'),
  body('domisili').optional().trim().notEmpty().withMessage('Domisili tidak boleh kosong'),
  body('jenisUsaha').optional().trim().notEmpty().withMessage('Jenis usaha tidak boleh kosong'),
  body('nomorIzinUsaha').optional().trim().notEmpty().withMessage('Nomor izin usaha tidak boleh kosong'),
  body('alamatUsaha').optional().trim().notEmpty().withMessage('Alamat usaha tidak boleh kosong'),
  body('whatsapp').optional().trim().notEmpty().withMessage('Nomor WhatsApp tidak boleh kosong'),
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

module.exports = {
  validateBuyerProfile,
  validateSellerProfile
};