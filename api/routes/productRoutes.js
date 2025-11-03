const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById
} = require('../controllers/productController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const { uploadMultiple } = require('../middleware/upload');
const { validateProduct } = require('../validators/productValidator');

// Public routes - accessible without login
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Seller routes - CRUD (protected)
router.post('/', protect, checkRole('seller'), uploadMultiple, validateProduct, createProduct);
router.put('/:id', protect, checkRole('seller'), uploadMultiple, validateProduct, updateProduct);
router.delete('/:id', protect, checkRole('seller'), deleteProduct);

module.exports = router;