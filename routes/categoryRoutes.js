const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/categoryController');

// Public route - accessible without auth (untuk form register seller dan create product)
router.get('/', getAllCategories);

module.exports = router;