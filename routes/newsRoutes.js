const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
  toggleNewsFeatured,
} = require('../controllers/newsController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getNews)
  .post(protectAdmin, createNews);

router.route('/:slug')
  .get(getNewsBySlug);

router.route('/:id')
  .put(protectAdmin, updateNews)
  .delete(protectAdmin, deleteNews);

router.patch('/:id/status', protectAdmin, toggleNewsStatus);
router.patch('/:id/featured', protectAdmin, toggleNewsFeatured);

module.exports = router;
