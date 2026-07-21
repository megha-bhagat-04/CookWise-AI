import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            setToken(storedToken);
          } else {
            handleLogoutState();
          }
        } catch (err) {
          console.warn('[Auth Restoration Warning]: Token invalid or backend unreachable.', err);
          handleLogoutState();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogoutState = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setToken(null);
  };

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem(STORAGE_KEYS.TOKEN, jwtToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await authService.register(name, email, password, confirmPassword);
    if (res.success && res.data) {
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem(STORAGE_KEYS.TOKEN, jwtToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      handleLogoutState();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
