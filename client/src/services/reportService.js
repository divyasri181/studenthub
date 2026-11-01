import api from './api';
import { mockStorage } from './mockStorage';

export const reportService = {
  async getAnalytics() {
    try {
      return await api.get('/reports/analytics');
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.getAnalytics();
    }
  },

  async downloadExpensesCSV() {
    try {
      const res = mockStorage.getExpenses({});
      const expenses = res.data || [];

      let csv = 'ID,Date,Title,Category,PaymentMethod,Amount,Notes\n';
      expenses.forEach((e) => {
        const safeTitle = (e.title || '').replace(/"/g, '""');
        const safeNotes = (e.notes || '').replace(/"/g, '""');
        const dateStr = new Date(e.date).toISOString().split('T')[0];
        csv += `"${e._id || e.id}","${dateStr}","${safeTitle}","${e.category}","${e.paymentMethod}","${e.amount}","${safeNotes}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_expenses_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV Export failed:', err);
    }
  },
};
