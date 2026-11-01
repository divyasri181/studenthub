import api from './api';

export const budgetService = {
  async getBudgetStatus(month) {
    return await api.get('/budget', { params: { month } });
  },

  async setBudget(budgetData) {
    return await api.post('/budget', budgetData);
  },
};
