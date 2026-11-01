import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Calendar,
  Edit2,
  Trash2,
  ReceiptText,
  DollarSign,
  TrendingUp,
  Tag,
  Loader2,
  ArrowUpDown,
} from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { reportService } from '../services/reportService';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import { useNotification } from '../context/NotificationContext';
import ConfirmModal from '../components/ConfirmModal';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Others'];

const Expenses = ({ onOpenAddExpense, onEditExpense }) => {
  const { showToast } = useNotification();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Delete modal state
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (search) params.search = search;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await expenseService.getExpenses(params);
      if (res.success) {
        setExpenses(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setStartDate('');
    setEndDate('');
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setDeleting(true);
    try {
      const id = expenseToDelete._id || expenseToDelete.id;
      await expenseService.deleteExpense(id);
      showToast('Expense removed successfully', 'success');
      setExpenses((prev) => prev.filter((e) => (e._id || e.id) !== id));
      setExpenseToDelete(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      await reportService.downloadExpensesCSV();
      showToast('Expenses CSV exported successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Metrics
  const totalAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const averageAmount = expenses.length > 0 ? Math.round(totalAmount / expenses.length) : 0;
  const maxExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => Number(e.amount) || 0)) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Expense Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log, categorize, and control your daily academic and personal spending
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="btn-secondary !py-2 !px-3.5 text-xs sm:text-sm border border-slate-200 dark:border-slate-700"
            title="Download CSV spreadsheet"
          >
            <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="btn-primary !py-2 !px-3.5 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="app-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Filtered Total
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(totalAmount)}
            </h3>
          </div>
        </div>

        <div className="app-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Average Expense
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(averageAmount)}
            </h3>
          </div>
        </div>

        <div className="app-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center flex-shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Highest Expense
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(maxExpense)}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="app-card p-4 sm:p-5 space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-stretch">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses by title or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input !pl-10 !py-2 text-sm"
            />
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input !py-2 text-xs sm:text-sm !w-auto"
              title="Start Date"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input !py-2 text-xs sm:text-sm !w-auto"
              title="End Date"
            />
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" className="btn-primary !py-2 !px-4 text-xs sm:text-sm">
              Filter
            </button>
            {(search || selectedCategory !== 'All' || startDate || endDate) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-secondary !py-2 !px-3 text-xs sm:text-sm"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Title / Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-600" />
                    <span className="text-xs">Loading expenses...</span>
                  </td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((expense) => {
                  const catStyle = getCategoryColor(expense.category);
                  return (
                    <tr
                      key={expense._id || expense.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {expense.title}
                        </div>
                        {expense.notes && (
                          <div className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                            {expense.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`badge ${catStyle.badge}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {expense.paymentMethod || 'UPI'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        ₹{Number(expense.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEditExpense(expense)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpenseToDelete(expense)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <ReceiptText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No expenses match your filters
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try clearing filters or add a new expense.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        message={`Are you sure you want to delete "${expenseToDelete?.title}" (₹${expenseToDelete?.amount})? This will permanently remove the record.`}
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default Expenses;
