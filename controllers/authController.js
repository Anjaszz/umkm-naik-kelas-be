const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/sendEmail');
const { uploadToS3 } = require('../utils/uploadToS3');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register Buyer
// @route   POST /api/auth/register/buyer
// @access  Public
const registerBuyer = async (req, res, next) => {
  try {
    const { nama, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Create user and set as verified
    const user = await User.create({
      role: 'buyer',
      nama,
      email,
      password,
      isVerified: true
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Akun Anda sudah aktif',
      data: {
        token,
        user: {
          id: user._id,
          nama: user.nama,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Seller
// @route   POST /api/auth/register/seller
// @access  Public
const registerSeller = async (req, res, next) => {
  try {
    const {
      namaToko,
      email,
      password,
      domisili,
      jenisUsaha,
      nomorIzinUsaha,
      alamatUsaha,
      whatsapp,
      facebook,
      instagram
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Check if foto profil uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Foto profil wajib diupload'
      });
    }

    // Upload foto profil to Firebase
    const fotoProfilUrl = await uploadToS3(req.file, 'profil-toko');

    // Create user and set as verified
    const user = await User.create({
      role: 'seller',
      namaToko,
      email,
      password,
      fotoProfil: fotoProfilUrl,
      domisili,
      jenisUsaha,
      nomorIzinUsaha,
      alamatUsaha,
      whatsapp,
      facebook: facebook || null,
      instagram: instagram || null,
      isVerified: true
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Akun Anda sudah aktif',
      data: {
        token,
        user: {
          id: user._id,
          namaToko: user.namaToko,
          email: user.email,
          role: user.role,
          fotoProfil: user.fotoProfil
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email tidak terdaftar'
      });
    }

    // Generate OTP for password reset
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    const name = user.role === 'buyer' ? user.nama : user.namaToko;
    await sendOTPEmail(email, otp, name, 'reset');

    res.json({
      success: true,
      message: 'Kode OTP telah dikirim ke email Anda'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP tidak valid atau sudah expired'
      });
    }

    // Update password
    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Akun belum diverifikasi. Silakan cek email Anda'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          ...(user.role === 'buyer' && { nama: user.nama }),
          ...(user.role === 'seller' && {
            namaToko: user.namaToko,
            fotoProfil: user.fotoProfil
          })
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerBuyer,
  registerSeller,
  forgotPassword,
  resetPassword,
  login,
  getMe,
  logout
};