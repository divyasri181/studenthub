const dbStore = require('../config/store');

// Helper to get current YYYY-MM
const getCurrentMonthKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// @desc    Get current month budget & status (with expense calculations)
// @route   GET /api/budget
// @access  Private
const getBudgetStatus = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const requestedMonth = req.query.month || getCurrentMonthKey();

    let budget = await dbStore.getBudget(userId, requestedMonth);

    // If no specific monthly budget doc exists, use user's default monthlyBudget
    const totalBudget = budget ? budget.totalBudget : (req.user.monthlyBudget || 6000);
    const alertThreshold = budget ? budget.alertThreshold : 80;
    const categoryBudgets = budget ? budget.categoryBudgets : {
      Food: 0,
      Travel: 0,
      Shopping: 0,
      Education: 0,
      Entertainment: 0,
      Others: 0,
    };

    // Calculate actual expenses for this month
    const expenses = await dbStore.getExpenses(userId, { month: requestedMonth });
    const totalSpent = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    // Days remaining in month
    const [year, monthNum] = requestedMonth.split('-').map(Number);
    const now = new Date();
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    let daysRemaining = 1;

    if (now.getFullYear() === year && now.getMonth() + 1 === monthNum) {
      daysRemaining = Math.max(1, daysInMonth - now.getDate() + 1);
    } else if (new Date(year, monthNum - 1, 1) > now) {
      daysRemaining = daysInMonth;
    } else {
      daysRemaining = 0; // Past month
    }

    const dailyBudgetRemaining = daysRemaining > 0 && remaining > 0 ? Math.round(remaining / daysRemaining) : 0;

    // Check alert status
    let status = 'normal';
    let alertMessage = null;

    if (percentageUsed >= 100) {
      status = 'exceeded';
      alertMessage = `You have exceeded your monthly budget by ₹${Math.abs(remaining).toLocaleString()}! Please review your non-essential expenses.`;
    } else if (percentageUsed >= alertThreshold) {
      status = 'warning';
      alertMessage = `Warning: You have used ${percentageUsed}% of your monthly budget (₹${totalSpent.toLocaleString()} of ₹${totalBudget.toLocaleString()}).`;
    }

    // Category-wise spend
    const categorySpent = {
      Food: 0,
      Travel: 0,
      Shopping: 0,
      Education: 0,
      Entertainment: 0,
      Others: 0,
    };
    expenses.forEach((e) => {
      const cat = e.category || 'Others';
      categorySpent[cat] = (categorySpent[cat] || 0) + (Number(e.amount) || 0);
    });

    res.status(200).json({
      success: true,
      data: {
        month: requestedMonth,
        totalBudget,
        totalSpent,
        remaining,
        percentageUsed,
        daysRemaining,
        dailyBudgetRemaining,
        alertThreshold,
        status,
        alertMessage,
        categoryBudgets,
        categorySpent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update monthly budget
// @route   POST /api/budget
// @access  Private
const setBudget = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { month, totalBudget, categoryBudgets, alertThreshold } = req.body;

    if (!totalBudget || isNaN(totalBudget) || Number(totalBudget) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid budget amount greater than 0',
      });
    }

    const monthKey = month || getCurrentMonthKey();

    const budget = await dbStore.setBudget(userId, {
      month: monthKey,
      totalBudget: Number(totalBudget),
      categoryBudgets: categoryBudgets || {},
      alertThreshold: alertThreshold ? Number(alertThreshold) : 80,
    });

    // Also update default monthly budget in user profile
    await dbStore.updateUser(userId, { monthlyBudget: Number(totalBudget) });

    res.status(200).json({
      success: true,
      message: 'Budget saved successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgetStatus,
  setBudget,
};
