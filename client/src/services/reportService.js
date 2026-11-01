import api from './api';

export const reportService = {
  async getAnalytics() {
    return await api.get('/reports/analytics');
  },

  async downloadExpensesCSV() {
    const token = localStorage.getItem('smart_student_token');
    const response = await fetch('/api/reports/export/expenses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download CSV');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_expenses_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
