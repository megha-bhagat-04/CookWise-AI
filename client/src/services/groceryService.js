import api from './api';

export const getGroceryItems = async () => {
  const response = await api.get('/grocery');
  return response.data;
};

export const addGroceryItem = async (itemData) => {
  const response = await api.post('/grocery', itemData);
  return response.data;
};

export const toggleGroceryItem = async (id) => {
  const response = await api.put(`/grocery/${id}/toggle`);
  return response.data;
};

export const deleteGroceryItem = async (id) => {
  const response = await api.delete(`/grocery/${id}`);
  return response.data;
};

const groceryService = {
  getGroceryItems,
  addGroceryItem,
  toggleGroceryItem,
  deleteGroceryItem,
};

export default groceryService;

