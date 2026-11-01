import api from './api';
import { mockStorage } from './mockStorage';

export const authService = {
  async register(data) {
    try {
      return await api.post('/auth/register', data);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.register(data);
    }
  },

  async login(credentials) {
    try {
      return await api.post('/auth/login', credentials);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.login(credentials);
    }
  },

  async demoLogin() {
    try {
      return await api.post('/auth/demo');
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.demoLogin();
    }
  },

  async getMe() {
    try {
      return await api.get('/auth/me');
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.getMe();
    }
  },

  async updateProfile(updates) {
    try {
      return await api.put('/auth/profile', updates);
    } catch (err) {
      console.warn('Backend unavailable, using fallback storage:', err.message);
      return mockStorage.updateProfile(updates);
    }
  },
};
