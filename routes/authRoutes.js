const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/profile', protectAdmin, getProfile);
router.put('/profile', protectAdmin, updateProfile);
router.put('/change-password', protectAdmin, changePassword);

module.exports = router;
