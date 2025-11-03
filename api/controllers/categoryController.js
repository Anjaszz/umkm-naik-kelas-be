const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public/Private (Buyer & Seller)
const getAllCategories = async (req, res, next) => {
  try {
    // Urutan berdasarkan createdAt (sesuai urutan insert di seeder)
    const categories = await Category.find().sort({ createdAt: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories
};