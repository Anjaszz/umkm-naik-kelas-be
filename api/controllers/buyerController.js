const User = require('../models/User');

// @desc    Get buyer profile
// @route   GET /api/buyer/profile
// @access  Private (Buyer only)
const getBuyerProfile = async (req, res, next) => {
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

// @desc    Update buyer profile
// @route   PUT /api/buyer/profile
// @access  Private (Buyer only)
const updateBuyerProfile = async (req, res, next) => {
  try {
    const { nama } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Update fields
    if (nama) user.nama = nama;

    await user.save();

    res.json({
      success: true,
      message: 'Profil berhasil diupdate',
      data: {
        id: user._id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBuyerProfile,
  updateBuyerProfile
};