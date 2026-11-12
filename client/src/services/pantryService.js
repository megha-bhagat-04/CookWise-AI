import api from './api';

export const getPantryItems = async () => {
  const response = await api.get('/pantry');
  return response.data;
};

export const addPantryItem = async (itemData) => {
  const response = await api.post('/pantry', itemData);
  return response.data;
};

export const updatePantryItem = async (id, itemData) => {
  const response = await api.put(`/pantry/${id}`, itemData);
  return response.data;
};

export const deletePantryItem = async (id) => {
  const response = await api.delete(`/pantry/${id}`);
  return response.data;
};

export const getPantryStats = async () => {
  const response = await api.get('/pantry/stats');
  return response.data;
};

export const getExpiryReminders = async () => {
  const response = await api.get('/pantry/expiry-reminders');
  return response.data;
};

export const getInsights = async () => {
  const response = await api.get('/pantry/insights');
  return response.data;
};

const pantryService = {
  getPantryItems,
  addPantryItem,
  updatePantryItem,
  deletePantryItem,
  getPantryStats,
  getExpiryReminders,
  getInsights,
};

export default pantryService;
