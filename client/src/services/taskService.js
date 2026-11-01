import api from './api';

export const taskService = {
  async getTasks(params = {}) {
    return await api.get('/tasks', { params });
  },

  async getTaskById(id) {
    return await api.get(`/tasks/${id}`);
  },

  async createTask(taskData) {
    return await api.post('/tasks', taskData);
  },

  async updateTask(id, taskData) {
    return await api.put(`/tasks/${id}`, taskData);
  },

  async toggleTask(id) {
    return await api.patch(`/tasks/${id}/toggle`);
  },

  async deleteTask(id) {
    return await api.delete(`/tasks/${id}`);
  },

  async getStats() {
    return await api.get('/tasks/stats/summary');
  },
};
