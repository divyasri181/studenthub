const express = require('express');
const router = express.Router();
const {
  getAnalyticsReport,
  exportExpensesCSV,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/analytics', getAnalyticsReport);
router.get('/export/expenses', exportExpensesCSV);

module.exports = router;
