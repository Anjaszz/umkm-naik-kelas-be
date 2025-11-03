const express = require('express');
const router = express.Router();
const {
  getSellerProfile,
  updateSellerProfile,
  getMyProducts,
  getSellerById,
  getSellerProducts
} = require('../controllers/sellerController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const { uploadSingle } = require('../middleware/upload');
const { validateSellerProfile } = require('../validators/profileValidator');

// Public routes - accessible without login
router.get('/:sellerId/profile', getSellerById);
router.get('/:sellerId/products', getSellerProducts);

// Protected routes - seller only
router.route('/profile')
  .get(protect, checkRole('seller'), getSellerProfile)
  .put(protect, checkRole('seller'), uploadSingle, validateSellerProfile, updateSellerProfile);

router.get('/products', protect, checkRole('seller'), getMyProducts);

module.exports = router;