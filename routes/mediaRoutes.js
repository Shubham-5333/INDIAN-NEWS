const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  getMedia,
  deleteMedia,
} = require('../controllers/mediaController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protectAdmin, getMedia);

router.post('/upload', protectAdmin, upload.single('file'), uploadMedia);

router.route('/:id')
  .delete(protectAdmin, deleteMedia);

module.exports = router;
