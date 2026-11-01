const express = require('express');
const router = express.Router();
const {
  getBudgetStatus,
  setBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getBudgetStatus)
  .post(setBudget);

module.exports = router;
