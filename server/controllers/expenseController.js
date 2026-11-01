const dbStore = require('../config/store');

// @desc    Get all expenses for logged in user (with filters)
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { category, search, startDate, endDate, month } = req.query;

    const expenses = await dbStore.getExpenses(userId, {
      category,
      search,
      startDate,
      endDate,
      month,
    });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const expense = await dbStore.getExpenseById(req.params.id, userId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    if (!title || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and amount for the expense',
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    const expense = await dbStore.createExpense({
      user: userId,
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Others',
      paymentMethod: paymentMethod || 'UPI',
      date: date || new Date().toISOString(),
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    const existing = await dbStore.getExpenseById(req.params.id, userId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    const updates = {};
    if (title) updates.title = title.trim();
    if (amount !== undefined) {
      if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number',
        });
      }
      updates.amount = Number(amount);
    }
    if (category) updates.category = category;
    if (paymentMethod) updates.paymentMethod = paymentMethod;
    if (date) updates.date = date;
    if (notes !== undefined) updates.notes = notes.trim();

    const updated = await dbStore.updateExpense(req.params.id, userId, updates);

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const deleted = await dbStore.deleteExpense(req.params.id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense summary statistics for current month and all-time
// @route   GET /api/expenses/stats/summary
// @access  Private
const getExpenseStats = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const allExpenses = await dbStore.getExpenses(userId);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    let totalAllTime = 0;
    let totalThisMonth = 0;
    let categoryMap = {
      Food: 0,
      Travel: 0,
      Shopping: 0,
      Education: 0,
      Entertainment: 0,
      Others: 0,
    };

    allExpenses.forEach((exp) => {
      const amt = Number(exp.amount) || 0;
      totalAllTime += amt;

      const d = new Date(exp.date);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        totalThisMonth += amt;
        const cat = exp.category || 'Others';
        categoryMap[cat] = (categoryMap[cat] || 0) + amt;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalAllTime,
        totalThisMonth,
        countThisMonth: allExpenses.filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
        }).length,
        categoryBreakdown: categoryMap,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
};
