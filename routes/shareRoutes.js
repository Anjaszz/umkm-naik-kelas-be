const express = require('express');
const router = express.Router();
const { generateProductShareLink } = require('../controllers/shareController');

// Public route
router.get('/product/:id', generateProductShareLink);

module.exports = router;
