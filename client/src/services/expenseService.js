import api from './api';
import { mockStorage } from './mockStorage';

export const expenseService = {
  async getExpenses(params = {}) {
    try {
      return await api.get('/expenses', { params });
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.getExpenses(params);
    }
  },

  async getExpenseById(id) {
    try {
      return await api.get(`/expenses/${id}`);
    } catch (err) {
      return mockStorage.getExpenses({}).data?.find((e) => (e._id || e.id) === id);
    }
  },

  async createExpense(expenseData) {
    try {
      return await api.post('/expenses', expenseData);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.createExpense(expenseData);
    }
  },

  async updateExpense(id, expenseData) {
    try {
      return await api.put(`/expenses/${id}`, expenseData);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.updateExpense(id, expenseData);
    }
  },

  async deleteExpense(id) {
    try {
      return await api.delete(`/expenses/${id}`);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.deleteExpense(id);
    }
  },

  async getStats() {
    try {
      return await api.get('/expenses/stats/summary');
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.getExpenseStats();
    }
  },
};
