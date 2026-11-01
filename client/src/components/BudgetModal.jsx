import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useNotification } from '../context/NotificationContext';
import { budgetService } from '../services/budgetService';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, currentBudget, onBudgetSaved }) => {
  const { showToast } = useNotification();
  const { updateUser } = useAuth();
  const [totalBudget, setTotalBudget] = useState('6000');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentBudget) {
      setTotalBudget(currentBudget.totalBudget?.toString() || '6000');
      setAlertThreshold(currentBudget.alertThreshold || 80);
    }
  }, [currentBudget, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(totalBudget);
    if (isNaN(num) || num <= 0) {
      showToast('Please enter a valid monthly budget amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const res = await budgetService.setBudget({
        month: monthKey,
        totalBudget: num,
        alertThreshold: Number(alertThreshold),
      });

      updateUser({ monthlyBudget: num });
      showToast('Monthly budget updated successfully!', 'success');
      onBudgetSaved(res.data);
      onClose();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Monthly Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Monthly Target Budget (₹) *</label>
          <input
            type="number"
            min="500"
            step="100"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            className="form-input"
            placeholder="e.g. 6000"
            required
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Recommended monthly student allowance or stipend budget.
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="form-label mb-0">Alert Warning Threshold</label>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {alertThreshold}%
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
            <span>80% (Default)</span>
            <span>95%</span>
          </div>
        </div>

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
                <span>Updating...</span>
              </>
            ) : (
              'Save Budget'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;
