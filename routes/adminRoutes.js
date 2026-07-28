const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard', protectAdmin, getDashboardStats);

module.exports = router;
