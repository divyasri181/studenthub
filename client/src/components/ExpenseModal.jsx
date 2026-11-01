import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useNotification } from '../context/NotificationContext';
import { expenseService } from '../services/expenseService';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Others'];
const PAYMENT_METHODS = ['UPI', 'Cash', 'Debit Card', 'Credit Card', 'Net Banking'];

const ExpenseModal = ({ isOpen, onClose, expenseToEdit, onExpenseSaved }) => {
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || '',
        amount: expenseToEdit.amount || '',
        category: expenseToEdit.category || 'Food',
        paymentMethod: expenseToEdit.paymentMethod || 'UPI',
        date: expenseToEdit.date ? new Date(expenseToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: expenseToEdit.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        paymentMethod: 'UPI',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setErrors({});
  }, [expenseToEdit, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (expenseToEdit) {
        const id = expenseToEdit._id || expenseToEdit.id;
        const res = await expenseService.updateExpense(id, formData);
        showToast('Expense updated successfully!', 'success');
        onExpenseSaved(res.data);
      } else {
        const res = await expenseService.createExpense(formData);
        showToast('Expense added successfully!', 'success');
        onExpenseSaved(res.data);
      }
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Edit Expense' : 'Add New Student Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="form-label">Expense Title *</label>
          <input
            type="text"
            placeholder="e.g. Canteen Lunch, Bus Pass, Book"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`form-input ${errors.title ? 'border-rose-500 focus:ring-rose-500' : ''}`}
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Amount & Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Amount (₹) *</label>
            <input
              type="number"
              step="any"
              min="1"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`form-input ${errors.amount ? 'border-rose-500 focus:ring-rose-500' : ''}`}
            />
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="form-label">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="form-input"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Method & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Payment Mode</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="form-input"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`form-input ${errors.date ? 'border-rose-500 focus:ring-rose-500' : ''}`}
            />
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="form-label">Notes (Optional)</label>
          <textarea
            rows="2"
            placeholder="Add quick notes or remarks..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="form-input resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary min-w-[120px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : expenseToEdit ? (
              'Save Changes'
            ) : (
              'Add Expense'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
