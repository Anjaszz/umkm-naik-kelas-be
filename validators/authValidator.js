const { body, validationResult } = require('express-validator');

const validateRegisterBuyer = [
  body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
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

const validateRegisterSeller = [
  body('namaToko').trim().notEmpty().withMessage('Nama toko wajib diisi'),
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('domisili').trim().notEmpty().withMessage('Domisili wajib diisi'),
  body('jenisUsaha').trim().notEmpty().withMessage('Jenis usaha wajib diisi'),
  body('nomorIzinUsaha').trim().notEmpty().withMessage('Nomor izin usaha wajib diisi'),
  body('alamatUsaha').trim().notEmpty().withMessage('Alamat usaha wajib diisi'),
  body('whatsapp').trim().notEmpty().withMessage('Nomor WhatsApp wajib diisi'),
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

const validateLogin = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
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

const validateForgotPassword = [
  body('email').isEmail().withMessage('Email tidak valid'),
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

const validateVerifyOTP = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP harus 4 digit'),
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

const validateResetPassword = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
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
  validateRegisterBuyer,
  validateRegisterSeller,
  validateLogin,
  validateForgotPassword,
  validateVerifyOTP,
  validateResetPassword
};