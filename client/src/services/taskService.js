import api from './api';
import { mockStorage } from './mockStorage';

export const taskService = {
  async getTasks(params = {}) {
    try {
      return await api.get('/tasks', { params });
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.getTasks(params);
    }
  },

  async getTaskById(id) {
    try {
      return await api.get(`/tasks/${id}`);
    } catch (err) {
      return mockStorage.getTasks({}).data?.find((t) => (t._id || t.id) === id);
    }
  },

  async createTask(taskData) {
    try {
      return await api.post('/tasks', taskData);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.createTask(taskData);
    }
  },

  async updateTask(id, taskData) {
    try {
      return await api.put(`/tasks/${id}`, taskData);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.updateTask(id, taskData);
    }
  },

  async toggleTask(id) {
    try {
      return await api.patch(`/tasks/${id}/toggle`);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.toggleTask(id);
    }
  },

  async deleteTask(id) {
    try {
      return await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.deleteTask(id);
    }
  },

  async getStats() {
    try {
      return await api.get('/tasks/stats/summary');
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.getTaskStats();
    }
  },
};
