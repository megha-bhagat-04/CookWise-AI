import api from './api';

export const authService = {
  /**
   * Register new user account
   */
  register: async (name, email, password, confirmPassword) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Authenticate user with credentials
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Get current authenticated user details
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user API call
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore API logout error if already disconnected
    }
  },
};
