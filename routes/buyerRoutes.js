const express = require('express');
const router = express.Router();
const {
  getBuyerProfile,
  updateBuyerProfile
} = require('../controllers/buyerController');
const protect = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const { validateBuyerProfile } = require('../validators/profileValidator');

// All routes are protected and buyer only
router.use(protect);
router.use(checkRole('buyer'));

router.route('/profile')
  .get(getBuyerProfile)
  .put(validateBuyerProfile, updateBuyerProfile);

module.exports = router;