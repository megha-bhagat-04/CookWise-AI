import api from './api';

export const getRecipeRecommendations = async (params = {}) => {
  const response = await api.post('/recipes/generate', params, { timeout: 45000 });
  return response.data;
};

const recipeService = {
  getRecipeRecommendations,
};

export default recipeService;

