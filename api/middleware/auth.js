const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Tidak ada token, akses ditolak'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password -otp -otpExpiry');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: 'Akun belum diverifikasi. Silakan verifikasi email Anda.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error pada autentikasi'
    });
  }
};

module.exports = protect;