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

const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getNews)
  .post(protectAdmin, upload.single('featuredImage'), createNews);

router.route('/:slug')
  .get(getNewsBySlug);

router.route('/:id')
  .put(protectAdmin, upload.single('featuredImage'), updateNews)
  .delete(protectAdmin, deleteNews);

router.patch('/:id/status', protectAdmin, toggleNewsStatus);
router.patch('/:id/featured', protectAdmin, toggleNewsFeatured);

module.exports = router;
