import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Wallet,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { budgetService } from '../services/budgetService';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import BudgetAlert from '../components/BudgetAlert';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Others'];

const Budget = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [budgetData, setBudgetData] = useState(null);

  // Form states
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchBudget = async () => {
    try {
      setLoading(true);
      const res = await budgetService.getBudgetStatus(selectedMonth);
      if (res.success && res.data) {
        setBudgetData(res.data);
        setMonthlyBudgetInput(res.data.totalBudget?.toString() || '6000');
        setAlertThreshold(res.data.alertThreshold || 80);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const num = Number(monthlyBudgetInput);
    if (isNaN(num) || num <= 0) {
      showToast('Please enter a valid monthly budget greater than 0', 'error');
      return;
    }

    setSaving(true);
    try {
      await budgetService.setBudget({
        month: selectedMonth,
        totalBudget: num,
        alertThreshold: Number(alertThreshold),
      });

      updateUser({ monthlyBudget: num });
      showToast('Budget preferences saved successfully!', 'success');
      fetchBudget();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const percentageUsed = budgetData?.percentageUsed || 0;
  const isOverBudget = percentageUsed >= 100;
  const isWarning = percentageUsed >= alertThreshold && !isOverBudget;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Budget Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set your student spending ceiling, monitor alerts & stay debt-free
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-input !py-1.5 text-xs sm:text-sm font-semibold !w-auto"
          />
        </div>
      </div>

      {/* Alert Banner if close or exceeded */}
      <BudgetAlert budgetData={budgetData} />

      {/* Main Budget Visual Meter Card */}
      <div className="app-card p-6 sm:p-8 bg-gradient-to-br from-white via-purple-50/20 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border-purple-100 dark:border-purple-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
              Monthly Budget Progress
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
              {formatCurrency(budgetData?.totalSpent || 0)}
              <span className="text-lg font-normal text-slate-500 dark:text-slate-400">
                {' '}
                of {formatCurrency(budgetData?.totalBudget || 6000)}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isOverBudget
                ? `You have exceeded your target by ${formatCurrency(Math.abs(budgetData?.remaining || 0))}`
                : `You have ${formatCurrency(budgetData?.remaining || 0)} left for the rest of this month.`}
            </p>
          </div>

          <div className="text-left md:text-right">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                isOverBudget
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                  : isWarning
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              }`}
            >
              {isOverBudget ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{percentageUsed}% of budget used</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Alert threshold set at {alertThreshold}%
            </p>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isOverBudget
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                  : isWarning
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600'
              }`}
              style={{ width: `${Math.min(100, percentageUsed)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
            <span>₹0</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Safe Zone: &lt; {alertThreshold}%
            </span>
            <span>{formatCurrency(budgetData?.totalBudget || 6000)}</span>
          </div>
        </div>

        {/* Daily Allowance Insights Box */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Recommended Daily Spend
            </p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-1">
              ₹{budgetData?.dailyBudgetRemaining || 0} / day
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Based on {budgetData?.daysRemaining || 1} days remaining
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Remaining Days
            </p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              {budgetData?.daysRemaining || 0} Days
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              In current billing month
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Monthly Savings Potential
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(Math.max(0, budgetData?.remaining || 0))}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              If daily pace is maintained
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Edit Budget Settings & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form: Set Monthly Budget */}
        <div className="app-card p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Adjust Budget Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Change your monthly ceiling and warning percentage
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveBudget} className="space-y-4">
            <div>
              <label className="form-label">Total Monthly Budget (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={monthlyBudgetInput}
                  onChange={(e) => setMonthlyBudgetInput(e.target.value)}
                  className="form-input !pl-8"
                  placeholder="e.g. 6000"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0">Alert Warning Trigger</label>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {alertThreshold}% of budget
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>50%</span>
                <span>80% (Recommended)</span>
                <span>95%</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Budget</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Category Breakdown Progress */}
        <div className="app-card p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Category Spending Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Where your student allowance was spent this month
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {CATEGORIES.map((cat) => {
              const spent = budgetData?.categorySpent?.[cat] || 0;
              const total = budgetData?.totalSpent || 1;
              const pct = total > 0 ? Math.round((spent / total) * 100) : 0;
              const catColors = getCategoryColor(cat);

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {cat}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{spent.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: catColors.hex,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
