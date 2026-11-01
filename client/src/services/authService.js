import api from './api';

export const authService = {
  async register(data) {
    return await api.post('/auth/register', data);
  },

  async login(credentials) {
    return await api.post('/auth/login', credentials);
  },

  async demoLogin() {
    return await api.post('/auth/demo');
  },

  async getMe() {
    return await api.get('/auth/me');
  },

  async updateProfile(updates) {
    return await api.put('/auth/profile', updates);
  },
};
