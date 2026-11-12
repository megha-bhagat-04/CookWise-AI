const express = require('express');
const router = express.Router();
const { getRecipeRecommendations } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', getRecipeRecommendations);

module.exports = router;

