const User = require('../models/User');
const Product = require('../models/Product');
const { uploadToS3, deleteFromS3 } = require('../utils/uploadToS3');

// @desc    Get seller profile
// @route   GET /api/seller/profile
// @access  Private (Seller only)
const getSellerProfile = async (req, res, next) => {
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

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private (Seller only)
const updateSellerProfile = async (req, res, next) => {
  try {
    const {
      namaToko,
      domisili,
      jenisUsaha,
      nomorIzinUsaha,
      alamatUsaha,
      whatsapp,
      facebook,
      instagram
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Update foto profil if uploaded
    if (req.file) {
      // Delete old photo if exists
      if (user.fotoProfil) {
        await deleteFromS3(user.fotoProfil);
      }
      
      const fotoProfilUrl = await uploadToS3(req.file, 'profil-toko');
      user.fotoProfil = fotoProfilUrl;
    }

    // Update other fields
    if (namaToko) user.namaToko = namaToko;
    if (domisili) user.domisili = domisili;
    if (jenisUsaha) user.jenisUsaha = jenisUsaha;
    if (nomorIzinUsaha) user.nomorIzinUsaha = nomorIzinUsaha;
    if (alamatUsaha) user.alamatUsaha = alamatUsaha;
    if (whatsapp) user.whatsapp = whatsapp;
    if (facebook !== undefined) user.facebook = facebook;
    if (instagram !== undefined) user.instagram = instagram;

    await user.save();

    res.json({
      success: true,
      message: 'Profil toko berhasil diupdate',
      data: {
        id: user._id,
        namaToko: user.namaToko,
        fotoProfil: user.fotoProfil,
        domisili: user.domisili,
        jenisUsaha: user.jenisUsaha,
        nomorIzinUsaha: user.nomorIzinUsaha,
        alamatUsaha: user.alamatUsaha,
        whatsapp: user.whatsapp,
        facebook: user.facebook,
        instagram: user.instagram
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products of logged in seller
// @route   GET /api/seller/products
// @access  Private (Seller only)
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller profile by ID (for buyers)
// @route   GET /api/sellers/:sellerId/profile
// @access  Private (Buyer only)
const getSellerById = async (req, res, next) => {
  try {
    const seller = await User.findOne({
      _id: req.params.sellerId,
      role: 'seller'
    }).select('-password -otp -otpExpiry -email');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Penjual tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: seller
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products from specific seller (for buyers)
// @route   GET /api/sellers/:sellerId/products
// @access  Private (Buyer only)
const getSellerProducts = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    
    // Check if seller exists
    const seller = await User.findOne({ _id: sellerId, role: 'seller' });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Penjual tidak ditemukan'
      });
    }

    const products = await Product.find({ sellerId })
      .sort({ createdAt: -1 })
      .populate('sellerId', 'namaToko fotoProfil domisili whatsapp');

    res.json({
      success: true,
      seller: {
        id: seller._id,
        namaToko: seller.namaToko,
        fotoProfil: seller.fotoProfil,
        domisili: seller.domisili
      },
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSellerProfile,
  updateSellerProfile,
  getMyProducts,
  getSellerById,
  getSellerProducts
};