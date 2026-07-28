const express = require('express');
const router = express.Router();
const {
  getFacts,
  createFact,
  updateFact,
  deleteFact,
} = require('../controllers/factController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFacts)
  .post(protectAdmin, createFact);

router.route('/:id')
  .put(protectAdmin, updateFact)
  .delete(protectAdmin, deleteFact);

module.exports = router;
