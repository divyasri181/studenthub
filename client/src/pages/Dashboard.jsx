import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingDown,
  CalendarCheck,
  Clock,
  ArrowUpRight,
  Plus,
  ReceiptText,
  CheckSquare,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import '../utils/chartConfig';
import { getChartColors } from '../utils/chartConfig';
import StatCard from '../components/StatCard';
import BudgetAlert from '../components/BudgetAlert';
import { expenseService } from '../services/expenseService';
import { taskService } from '../services/taskService';
import { budgetService } from '../services/budgetService';
import { formatCurrency, formatDate, getDeadlineStatus, getPriorityBadge, getCategoryColor } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const Dashboard = ({ onOpenAddExpense, onOpenAddTask }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { showToast } = useNotification();

  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState(null);
  const [expenseStats, setExpenseStats] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [budgetRes, statsRes, taskStatsRes, expensesRes, tasksRes] = await Promise.all([
        budgetService.getBudgetStatus(),
        expenseService.getStats(),
        taskService.getStats(),
        expenseService.getExpenses({}),
        taskService.getTasks({ status: 'pending' }),
      ]);

      if (budgetRes.success) setBudgetData(budgetRes.data);
      if (statsRes.success) setExpenseStats(statsRes.data);
      if (taskStatsRes.success) setTaskStats(taskStatsRes.data);
      if (expensesRes.success) setRecentExpenses(expensesRes.data.slice(0, 5));
      if (tasksRes.success) setUpcomingTasks(tasksRes.data.slice(0, 4));
    } catch (err) {
      showToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      await taskService.toggleTask(taskId);
      showToast('Task status updated!', 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Category chart data
  const categoryLabels = ['Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Others'];
  const categorySpendValues = categoryLabels.map(
    (cat) => budgetData?.categorySpent?.[cat] || 0
  );

  const doughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categorySpendValues.some((v) => v > 0) ? categorySpendValues : [1, 1, 1, 1, 1, 1],
        backgroundColor: [
          '#f59e0b', // Food
          '#3b82f6', // Travel
          '#ec4899', // Shopping
          '#8b5cf6', // Education
          '#6366f1', // Entertainment
          '#10b981', // Others
        ],
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff',
      },
    ],
  };

  const chartColors = getChartColors(isDark);

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: chartColors.text,
          boxWidth: 12,
          padding: 12,
          font: { size: 11, family: 'Inter' },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ₹${ctx.parsed.toLocaleString()}`,
        },
      },
    },
    cutout: '72%',
  };

  // Top spending categories sorted
  const sortedCategories = Object.entries(budgetData?.categorySpent || {})
    .sort(([, a], [, b]) => b - a)
    .filter(([, amt]) => amt > 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Student expense health, budget limits & assignment deadlines
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddExpense}
            className="btn-primary !py-2 !px-3.5 text-xs sm:text-sm"
          >
            <ReceiptText className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={onOpenAddTask}
            className="btn-secondary !py-2 !px-3.5 text-xs sm:text-sm border border-slate-200 dark:border-slate-700"
          >
            <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Budget Limit Alert (if warning or exceeded) */}
      <BudgetAlert budgetData={budgetData} />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Expenses This Month */}
        <StatCard
          title="Monthly Spent"
          value={formatCurrency(budgetData?.totalSpent || 0)}
          subtitle={`${expenseStats?.countThisMonth || 0} expenses recorded`}
          icon={TrendingDown}
          iconBg="bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
          trend={`${budgetData?.percentageUsed || 0}% used`}
          trendType={
            (budgetData?.percentageUsed || 0) >= 100
              ? 'negative'
              : (budgetData?.percentageUsed || 0) >= 80
              ? 'warning'
              : 'positive'
          }
        />

        {/* Monthly Budget */}
        <StatCard
          title="Monthly Budget"
          value={formatCurrency(budgetData?.totalBudget || 6000)}
          subtitle={`Limit for ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
          icon={Wallet}
          iconBg="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          progress={budgetData?.percentageUsed || 0}
          progressColor={
            (budgetData?.percentageUsed || 0) >= 100
              ? 'bg-rose-500'
              : (budgetData?.percentageUsed || 0) >= 80
              ? 'bg-amber-500'
              : 'bg-purple-600'
          }
        />

        {/* Remaining Balance */}
        <StatCard
          title="Remaining Balance"
          value={formatCurrency(budgetData?.remaining !== undefined ? budgetData.remaining : 6000)}
          subtitle={
            budgetData?.dailyBudgetRemaining > 0
              ? `₹${budgetData.dailyBudgetRemaining}/day allowance`
              : 'Budget exceeded'
          }
          icon={Sparkles}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          trend={
            (budgetData?.remaining || 0) >= 0
              ? 'In Budget'
              : 'Over Budget'
          }
          trendType={(budgetData?.remaining || 0) >= 0 ? 'positive' : 'negative'}
        />

        {/* Tasks & Assignments */}
        <StatCard
          title="Active Tasks"
          value={`${taskStats?.pending || 0} Pending`}
          subtitle={`${taskStats?.completed || 0} Completed (${taskStats?.completionRate || 0}%)`}
          icon={CalendarCheck}
          iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          trend={taskStats?.overdue > 0 ? `${taskStats.overdue} Overdue` : 'On Track'}
          trendType={taskStats?.overdue > 0 ? 'negative' : 'positive'}
        />
      </div>

      {/* Main Grid: Charts & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Spending Doughnut Chart */}
        <div className="app-card p-5 lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Expenses by Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly distribution
              </p>
            </div>
            <Link
              to="/reports"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Reports</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative h-56 w-full flex items-center justify-center">
            {sortedCategories.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="text-center py-8">
                <ReceiptText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">No expenses recorded yet</p>
              </div>
            )}
          </div>

          {/* Mini Category Badges */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {sortedCategories.slice(0, 3).map(([cat, amt]) => {
              const catColors = getCategoryColor(cat);
              const percentage = Math.round((amt / (budgetData?.totalSpent || 1)) * 100);
              return (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: catColors.hex }}
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {cat}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">{percentage}%</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{amt.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Assignment Deadlines */}
        <div className="app-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Upcoming Deadlines & Assignments
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prioritize submissions and study schedule
              </p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const deadline = getDeadlineStatus(task.dueDate, task.completed);
                const priorityBadgeClass = getPriorityBadge(task.priority);

                return (
                  <div
                    key={task._id || task.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-800 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task._id || task.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 ${
                          task.completed
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-purple-600'
                        }`}
                        title="Mark as done"
                      >
                        {task.completed && <CheckSquare className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {task.title}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadgeClass}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {task.subject} • {task.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${deadline.color}`}>
                        {deadline.label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <CheckSquare className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  All caught up! No pending assignments.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Enjoy your free time or add a personal study task.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>💡 Pro-tip: Color tags help you spot urgent deadlines easily</span>
            <button
              onClick={onOpenAddTask}
              className="font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Assignment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Expense History Table */}
      <div className="app-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Recent Expense Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest student transactions & campus spending
            </p>
          </div>
          <Link
            to="/expenses"
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>View Full History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <tr>
                <th className="py-2.5 px-4 rounded-l-xl">Expense</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Payment</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 text-right rounded-r-xl">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((exp) => {
                  const catStyle = getCategoryColor(exp.category);
                  return (
                    <tr
                      key={exp._id || exp.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {exp.title}
                        </div>
                        {exp.notes && (
                          <div className="text-xs text-slate-400 truncate max-w-xs">
                            {exp.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${catStyle.badge}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                        {exp.paymentMethod || 'UPI'}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(exp.date)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                        ₹{Number(exp.amount).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400 text-xs">
                    No recent expenses. Click "Add Expense" to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
