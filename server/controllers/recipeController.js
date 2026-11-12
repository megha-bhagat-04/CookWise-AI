const PantryItem = require('../models/PantryItem');
const { generateRecipesWithFallback } = require('../services/recipeAIService');
const { getExpiryStatus } = require('../utils/dateUtils');

/**
 * Generate smart heuristic fallback recipes from pantry ingredients
 * Used when Gemini API is unavailable or unconfigured to prevent application breakdown
 */
const generateFallbackRecipes = (usableItems, expiringSoonItems) => {
  const itemNames = usableItems.map((i) => i.name);
  const expiringNames = expiringSoonItems.map((i) => i.name);
  const primaryItem = expiringNames[0] || itemNames[0] || 'Fresh Produce';
  const secondaryItem = itemNames[1] || 'Pantry Staple';
  const tertiaryItem = itemNames[2] || 'Kitchen Seasonings';

  return [
    {
      name: `Savory ${primaryItem} & ${secondaryItem} Sauté`,
      description: `A fast, nourishing skillet dish highlighting ${primaryItem} with caramelized flavors.`,
      ingredients: [
        `${primaryItem} (fresh from pantry)`,
        `${secondaryItem} (diced or portioned)`,
        '1 tbsp Olive Oil or Butter',
        'Salt and freshly cracked black pepper to taste',
      ],
      missingIngredients: ['Cooking Oil', 'Salt & Pepper'],
      cookingTime: '15-20 minutes',
      difficulty: 'Easy',
      instructions: [
        `Wash, trim, and prepare ${primaryItem} and ${secondaryItem} into bite-sized portions.`,
        'Heat oil or butter in a skillet over medium-high heat.',
        `Add ${primaryItem} and sauté for 4-5 minutes until tender-crisp.`,
        `Toss in ${secondaryItem}, season with salt and pepper, and cook for another 3 minutes.`,
        'Serve hot as a wholesome meal or side.',
      ],
      nutrition: {
        calories: 'approx. 320 kcal',
        protein: '10g',
        carbs: '30g',
        fat: '8g',
      },
      recommendationReason: expiringNames.length > 0
        ? `Uses ${primaryItem} which is expiring soonest to eliminate kitchen food waste.`
        : `Quick zero-waste meal making optimal use of your available pantry stock.`,
    },
    {
      name: `Hearty ${primaryItem} Kitchen Bowl`,
      description: `A wholesome, balanced bowl combining ${primaryItem} with pantry seasonings.`,
      ingredients: [
        `${primaryItem} (roasted or steamed)`,
        secondaryItem !== primaryItem ? `${secondaryItem}` : 'Seasoned grains',
        'Pinch of garlic powder or fresh garlic',
        'Fresh herbs or chili flakes',
      ],
      missingIngredients: ['Garlic', 'Seasoning Herbs'],
      cookingTime: '25 minutes',
      difficulty: 'Easy',
      instructions: [
        `Chop ${primaryItem} and toss lightly with seasonings.`,
        'Roast in an oven at 200°C (400°F) or pan-sear until golden.',
        'Layer your ingredients in a bowl.',
        'Drizzle with olive oil or your favorite dressing and enjoy.',
      ],
      nutrition: {
        calories: 'approx. 380 kcal',
        protein: '12g',
        carbs: '42g',
        fat: '11g',
      },
      recommendationReason: `Balances ${primaryItem} with pantry essentials for an effortless, nutritious lunch or dinner.`,
    },
    {
      name: `Rustic ${primaryItem} & ${tertiaryItem} Medley`,
      description: `Comforting pan-roasted skillet dinner utilizing ingredients from your pantry inventory.`,
      ingredients: [
        `${primaryItem}`,
        `${secondaryItem}`,
        `${tertiaryItem}`,
        'Splash of water or stock for deglazing',
      ],
      missingIngredients: ['Water or Vegetable Broth'],
      cookingTime: '20 minutes',
      difficulty: 'Medium',
      instructions: [
        'Heat a heavy skillet over medium heat.',
        `Add ${primaryItem} and cook until lightly browned.`,
        `Stir in ${secondaryItem} and ${tertiaryItem}, stirring frequently.`,
        'Add a splash of water or broth, cover, and let steam for 5 minutes.',
        'Season to taste and serve immediately.',
      ],
      nutrition: {
        calories: 'approx. 350 kcal',
        protein: '11g',
        carbs: '36g',
        fat: '9g',
      },
      recommendationReason: `Maximizes ingredient diversity from your pantry inventory.`,
    },
  ];
};

/**
 * @desc    Generate AI recipe recommendations based on logged-in user's pantry
 * @route   POST /api/recipes/generate
 * @access  Private (JWT Protected)
 */
const getRecipeRecommendations = async (req, res, next) => {
  const requestStart = Date.now();
  try {
    const { dietaryPreferences, preferredCookingTime } = req.body || {};

    // Validate optional inputs
    if (dietaryPreferences && typeof dietaryPreferences !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Dietary preferences must be a string.',
      });
    }

    if (preferredCookingTime && typeof preferredCookingTime !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Preferred cooking time must be a string.',
      });
    }

    // Sanitize string lengths to prevent payload abuse
    const sanitizedDiet = dietaryPreferences ? dietaryPreferences.slice(0, 100).trim() : '';
    const sanitizedTime = preferredCookingTime ? preferredCookingTime.slice(0, 50).trim() : '';

    // Retrieve the authenticated user's pantry items (minimal fields for recipe generation)
    const dbStart = Date.now();
    const items = await PantryItem.find({ userId: req.user._id })
      .select('name quantity unit expiryDate')
      .sort({ expiryDate: 1 })
      .lean();
    console.info(`[Recipe Timing] db_fetch_ms=${Date.now() - dbStart} items=${items.length}`);

    if (!items || items.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'Your pantry is currently empty. Please add ingredients to your pantry first to generate personalized AI recipes.',
        data: [],
      });
    }

    // Segregate usable items from expired ones
    const usableItems = [];
    const expiringSoonItems = [];

    items.forEach((item) => {
      const status = getExpiryStatus(item.expiryDate);
      if (status !== 'Expired') {
        usableItems.push(item);
        if (status === 'Expiring Soon' || status === 'Expires Today') {
          expiringSoonItems.push(item);
        }
      }
    });

    if (usableItems.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'All items in your pantry have expired. Please restock your pantry with fresh ingredients before generating recipes.',
        data: [],
      });
    }

    // Attempt AI recipe generation (Groq primary, Gemini fallback)
    try {
      const aiStart = Date.now();
      const aiResult = await generateRecipesWithFallback({
        ingredients: usableItems,
        expiringSoonItems,
        dietaryPreferences: sanitizedDiet,
        preferredCookingTime: sanitizedTime,
      });
      console.info(`[Recipe Timing] ai_total_ms=${Date.now() - aiStart} provider=${aiResult.provider} fallback=${!!aiResult.isFallbackProvider}`);

      const response = res.status(200).json({
        success: true,
        count: aiResult.recipes.length,
        isFallback: !!aiResult.isFallbackProvider,
        provider: aiResult.provider,
        model: aiResult.model,
        data: aiResult.recipes,
      });
      console.info(`[Recipe Timing] request_total_ms=${Date.now() - requestStart} status=200`);
      return response;
    } catch (aiError) {
      console.warn('[Recipe AI] Both providers failed:', aiError.message);
      console.info(`[Recipe Timing] ai_failed_ms=${Date.now() - requestStart} fallback=true`);
      console.info('[Recipe Controller] Providing smart pantry fallback recipes instead.');

      // Final safety net: return smart pantry fallback recipes so the application never breaks
      const fallbackRecipes = generateFallbackRecipes(usableItems, expiringSoonItems);

      const groqReason = aiError.details?.groq || 'unknown error';
      const geminiReason = aiError.details?.gemini || 'unknown error';
      const fallbackNotice = (groqReason === 'Missing API key' && geminiReason === 'Missing API key')
        ? 'Showing smart pantry recipes. Add GROQ_API_KEY or GEMINI_API_KEY in server/.env for AI-generated recipes.'
        : `AI recipe generation failed (Groq: ${groqReason}; Gemini: ${geminiReason}). Showing smart pantry recipes instead. Please try again shortly.`;

      const response = res.status(200).json({
        success: true,
        count: fallbackRecipes.length,
        isFallback: true,
        fallbackNotice,
        data: fallbackRecipes,
      });
      console.info(`[Recipe Timing] request_total_ms=${Date.now() - requestStart} status=200_fallback`);
      return response;
    }
  } catch (error) {
    console.error('[Recipe Controller General Error]:', error.message);
    console.info(`[Recipe Timing] request_total_ms=${Date.now() - requestStart} status=500`);
    return res.status(500).json({
      success: false,
      message: 'Failed to process recipe request. Please try again.',
    });
  }
};

module.exports = {
  getRecipeRecommendations,
  generateFallbackRecipes,
};
