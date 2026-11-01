import api from './api';
import { mockStorage } from './mockStorage';

export const budgetService = {
  async getBudgetStatus(month) {
    try {
      return await api.get('/budget', { params: { month } });
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.getBudgetStatus(month);
    }
  },

  async setBudget(budgetData) {
    try {
      return await api.post('/budget', budgetData);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.setBudget(budgetData);
    }
  },
};
