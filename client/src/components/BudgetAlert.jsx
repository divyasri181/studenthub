import React from 'react';
import { AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BudgetAlert = ({ budgetData }) => {
  if (!budgetData || !budgetData.alertMessage) return null;

  const isExceeded = budgetData.status === 'exceeded';

  return (
    <div
      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
        isExceeded
          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300'
          : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isExceeded
              ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
              : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
          }`}
        >
          {isExceeded ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-sm font-bold">
            {isExceeded ? 'Budget Limit Exceeded' : 'Budget Limit Warning'}
          </h4>
          <p className="text-xs mt-0.5 opacity-90">{budgetData.alertMessage}</p>
        </div>
      </div>

      <Link
        to="/budget"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold self-end sm:self-center transition-colors flex-shrink-0 ${
          isExceeded
            ? 'bg-rose-600 hover:bg-rose-700 text-white'
            : 'bg-amber-600 hover:bg-amber-700 text-white'
        }`}
      >
        <span>Manage Budget</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default BudgetAlert;
