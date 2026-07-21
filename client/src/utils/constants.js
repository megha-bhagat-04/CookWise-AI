export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  TOKEN: 'cookwise_jwt_token',
  USER: 'cookwise_user_data',
  THEME: 'cookwise_theme_preference',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  NOT_FOUND: '*',
};
