import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_student_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smart_student_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token and verify user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('smart_student_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('smart_student_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Auth token expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (data) => {
    const authToken = data.token;
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      college: data.college,
      currency: data.currency || '₹',
      monthlyBudget: data.monthlyBudget || 6000,
    };

    setToken(authToken);
    setUser(userData);
    localStorage.setItem('smart_student_token', authToken);
    localStorage.setItem('smart_student_user', JSON.stringify(userData));
  };

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      handleAuthSuccess(res.data);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      handleAuthSuccess(res.data);
    }
    return res;
  };

  const demoLogin = async () => {
    const res = await authService.demoLogin();
    if (res.success && res.data) {
      handleAuthSuccess(res.data);
    }
    return res;
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('smart_student_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smart_student_token');
    localStorage.removeItem('smart_student_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
