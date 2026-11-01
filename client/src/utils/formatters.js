export const formatCurrency = (amount, currency = '₹') => {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getDeadlineStatus = (dueDate, completed) => {
  if (completed) {
    return {
      label: 'Completed',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      isOverdue: false,
    };
  }

  const now = new Date();
  const due = new Date(dueDate);
  // Reset time portions for day comparison
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffTime = dueDay - nowDay;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Overdue by ${Math.abs(diffDays)}d`,
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      isOverdue: true,
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due Today',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      isOverdue: false,
    };
  } else if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      isOverdue: false,
    };
  } else if (diffDays <= 3) {
    return {
      label: `Due in ${diffDays}d`,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      isOverdue: false,
    };
  } else {
    return {
      label: `Due ${formatShortDate(dueDate)}`,
      color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      isOverdue: false,
    };
  }
};

export const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    case 'High':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'Medium':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    case 'Low':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }
};

export const getCategoryColor = (category) => {
  switch (category) {
    case 'Food':
      return {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        hex: '#f59e0b',
      };
    case 'Travel':
      return {
        bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
        hex: '#3b82f6',
      };
    case 'Shopping':
      return {
        bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
        badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
        hex: '#ec4899',
      };
    case 'Education':
      return {
        bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
        hex: '#8b5cf6',
      };
    case 'Entertainment':
      return {
        bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
        badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
        hex: '#6366f1',
      };
    default:
      return {
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        hex: '#10b981',
      };
  }
};
