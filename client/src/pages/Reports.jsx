import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  PieChart,
  CheckCircle,
  Clock,
  Printer,
  Sparkles,
  Loader2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../utils/chartConfig';
import { getChartColors } from '../utils/chartConfig';
import { reportService } from '../services/reportService';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const Reports = () => {
  const { showToast } = useNotification();
  const { isDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await reportService.getAnalytics();
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportCSV = async () => {
    try {
      await reportService.downloadExpensesCSV();
      showToast('Expenses CSV exported successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const chartColors = getChartColors(isDark);

  // 1. Weekly Spending Bar Chart Data
  const weeklyLabels = analytics?.weeklyExpenses?.map((w) => w.day) || [];
  const weeklyValues = analytics?.weeklyExpenses?.map((w) => w.amount) || [];

  const weeklyBarData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Daily Spend (₹)',
        data: weeklyValues,
        backgroundColor: '#8b5cf6',
        borderRadius: 8,
        hoverBackgroundColor: '#7c3aed',
      },
    ],
  };

  const weeklyBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Spent: ₹${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: chartColors.text, font: { family: 'Inter' } },
      },
      y: {
        grid: { color: chartColors.grid },
        ticks: {
          color: chartColors.text,
          callback: (v) => `₹${v}`,
          font: { family: 'Inter' },
        },
      },
    },
  };

  // 2. 6-Month Trend Line Chart
  const monthlyTrendLabels = analytics?.monthlyTrend?.map((m) => m.label) || [];
  const monthlyTrendValues = analytics?.monthlyTrend?.map((m) => m.total) || [];

  const monthlyLineData = {
    labels: monthlyTrendLabels,
    datasets: [
      {
        label: 'Monthly Total (₹)',
        data: monthlyTrendValues,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#7c3aed',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const monthlyLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Total: ₹${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: chartColors.text, font: { family: 'Inter' } },
      },
      y: {
        grid: { color: chartColors.grid },
        ticks: {
          color: chartColors.text,
          callback: (v) => `₹${v}`,
          font: { family: 'Inter' },
        },
      },
    },
  };

  // 3. Category Breakdown Doughnut Chart
  const categoryLabels = Object.keys(analytics?.categoryBreakdown || {});
  const categoryValues = Object.values(analytics?.categoryBreakdown || {});

  const categoryDoughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues.some((v) => v > 0) ? categoryValues : [1, 1, 1, 1, 1, 1],
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

  const categoryDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: chartColors.text,
          boxWidth: 12,
          padding: 10,
          font: { size: 11, family: 'Inter' },
        },
      },
    },
    cutout: '65%',
  };

  // 4. Task Completion Rate Doughnut Chart
  const taskStats = analytics?.taskStats || {};
  const taskDoughnutData = {
    labels: ['Completed Tasks', 'Pending Tasks'],
    datasets: [
      {
        data: [taskStats.completedTasks || 0, taskStats.pendingTasks || 0],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff',
      },
    ],
  };

  const taskDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: chartColors.text,
          boxWidth: 12,
          font: { size: 11, family: 'Inter' },
        },
      },
    },
    cutout: '70%',
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Generating Analytics & Student Reports...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly trends, monthly expenses velocity and assignment completion stats
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="btn-secondary !py-2 !px-3.5 text-xs sm:text-sm border border-slate-200 dark:border-slate-700"
            title="Print or Save PDF report"
          >
            <Printer className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-primary !py-2 !px-3.5 text-xs sm:text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="app-card p-5 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-200/80 dark:border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-purple-700 dark:text-purple-300">
                Top Spending Category
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {analytics?.topCategory} (₹{analytics?.topCategoryAmount?.toLocaleString()})
              </h3>
            </div>
          </div>
        </div>

        <div className="app-card p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-200/80 dark:border-emerald-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">
                Task Completion Rate
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {taskStats.completionRate}% Done ({taskStats.completedTasks}/{taskStats.totalTasks})
              </h3>
            </div>
          </div>
        </div>

        <div className="app-card p-5 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-200/80 dark:border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-indigo-700 dark:text-indigo-300">
                7-Day Weekly Spending
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                ₹{weeklyValues.reduce((a, b) => a + b, 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Weekly Spending Bar & 6-Month Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Daily Spend */}
        <div className="app-card p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Weekly Daily Spending (Last 7 Days)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily day-by-day cash flow & digital expense breakdown
            </p>
          </div>
          <div className="h-64 w-full">
            <Bar data={weeklyBarData} options={weeklyBarOptions} />
          </div>
        </div>

        {/* 6-Month Trend Line Chart */}
        <div className="app-card p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              6-Month Expense History Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Long-term spending patterns across academic semesters
            </p>
          </div>
          <div className="h-64 w-full">
            <Line data={monthlyLineData} options={monthlyLineOptions} />
          </div>
        </div>
      </div>

      {/* Row 2: Category Breakdown & Task Completion Doughnuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share */}
        <div className="app-card p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Current Month Category Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Food, Education, Travel, Shopping & Miscellaneous
            </p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <Doughnut data={categoryDoughnutData} options={categoryDoughnutOptions} />
          </div>
        </div>

        {/* Task Completion Statistics */}
        <div className="app-card p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Academic Task & Assignment Completion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Productivity breakdown of completed vs pending coursework
            </p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {taskStats.totalTasks > 0 ? (
              <Doughnut data={taskDoughnutData} options={taskDoughnutOptions} />
            ) : (
              <div className="text-center text-slate-400">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No task data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
