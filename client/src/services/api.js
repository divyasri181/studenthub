import axios from 'axios';

// Use /api for relative calls (proxied by Vite) or fallback to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Attach JWT token to requests if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_student_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // If 401 Unauthorized, clear stale token
    if (error.response?.status === 401) {
      // If unauthorized on protected routes, redirect to login unless already on auth page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('smart_student_token');
        localStorage.removeItem('smart_student_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
