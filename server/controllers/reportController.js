const dbStore = require('../config/store');

// @desc    Get comprehensive reports (Weekly, Monthly, Category breakdown, Task analytics)
// @route   GET /api/reports/analytics
// @access  Private
const getAnalyticsReport = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const expenses = await dbStore.getExpenses(userId);
    const tasks = await dbStore.getTasks(userId);

    const now = new Date();

    // 1. Last 7 Days Daily Spending (Weekly Report)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayTotal = expenses
        .filter((e) => e.date && e.date.startsWith(dateStr))
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      last7Days.push({
        date: dateStr,
        day: dayName,
        amount: dayTotal,
      });
    }

    // 2. Last 6 Months Monthly Expenses Trend
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      const monthExpenses = expenses.filter((e) => {
        const expD = new Date(e.date);
        return (
          expD.getFullYear() === d.getFullYear() &&
          expD.getMonth() === d.getMonth()
        );
      });

      const total = monthExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      monthlyTrend.push({
        month: monthKey,
        label: monthLabel,
        total,
        count: monthExpenses.length,
      });
    }

    // 3. Category-wise Spending (All-time and This Month)
    const currentMonthExpenses = expenses.filter((e) => {
      const expD = new Date(e.date);
      return (
        expD.getFullYear() === now.getFullYear() &&
        expD.getMonth() === now.getMonth()
      );
    });

    const categoryMap = {
      Food: 0,
      Travel: 0,
      Shopping: 0,
      Education: 0,
      Entertainment: 0,
      Others: 0,
    };

    currentMonthExpenses.forEach((e) => {
      const cat = e.category || 'Others';
      categoryMap[cat] = (categoryMap[cat] || 0) + (Number(e.amount) || 0);
    });

    // 4. Task Analytics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Task breakdown by priority
    const priorityStats = {
      Urgent: tasks.filter((t) => t.priority === 'Urgent').length,
      High: tasks.filter((t) => t.priority === 'High').length,
      Medium: tasks.filter((t) => t.priority === 'Medium').length,
      Low: tasks.filter((t) => t.priority === 'Low').length,
    };

    // Task breakdown by type
    const typeStats = {
      Assignment: tasks.filter((t) => t.type === 'Assignment').length,
      Project: tasks.filter((t) => t.type === 'Project').length,
      ExamPrep: tasks.filter((t) => t.type === 'Exam Prep').length,
      Personal: tasks.filter((t) => t.type === 'Personal Task' || t.type === 'Personal').length,
      Study: tasks.filter((t) => t.type === 'Study Session' || t.type === 'Study').length,
    };

    // Find top expense category
    let topCategory = 'None';
    let topCategoryAmount = 0;
    Object.entries(categoryMap).forEach(([cat, amt]) => {
      if (amt > topCategoryAmount) {
        topCategoryAmount = amt;
        topCategory = cat;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        weeklyExpenses: last7Days,
        monthlyTrend,
        categoryBreakdown: categoryMap,
        topCategory,
        topCategoryAmount,
        taskStats: {
          totalTasks,
          completedTasks,
          pendingTasks,
          completionRate,
          priorityStats,
          typeStats,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export student data in CSV format
// @route   GET /api/reports/export/expenses
// @access  Private
const exportExpensesCSV = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const expenses = await dbStore.getExpenses(userId);

    let csv = 'ID,Date,Title,Category,PaymentMethod,Amount,Notes\n';
    expenses.forEach((e) => {
      const safeTitle = (e.title || '').replace(/"/g, '""');
      const safeNotes = (e.notes || '').replace(/"/g, '""');
      const dateStr = new Date(e.date).toISOString().split('T')[0];
      csv += `"${e._id || e.id}","${dateStr}","${safeTitle}","${e.category}","${e.paymentMethod}","${e.amount}","${safeNotes}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`expenses_report_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsReport,
  exportExpensesCSV,
};
