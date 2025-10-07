const express = require('express');
const router = express.Router();
const {
  registerBuyer,
  registerSeller,
  forgotPassword,
  resetPassword,
  login,
  getMe,
  logout
} = require('../controllers/authController');
const protect = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  validateRegisterBuyer,
  validateRegisterSeller,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} = require('../validators/authValidator');

// Public routes
router.post('/register/buyer', validateRegisterBuyer, registerBuyer);
router.post('/register/seller', uploadSingle, validateRegisterSeller, registerSeller);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;