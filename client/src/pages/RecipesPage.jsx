import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  UtensilsCrossed,
  Clock,
  ChefHat,
  AlertTriangle,
  Plus,
  Check,
  ShoppingBag,
  Flame,
  Activity,
  Heart,
  Filter,
} from 'lucide-react';
import recipeService from '../services/recipeService';
import groceryService from '../services/groceryService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Toast from '../components/common/Toast';

const DIETARY_OPTIONS = [
  'None / Any',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'High-Protein',
  'Keto / Low-Carb',
  'Dairy-Free',
];

const COOKING_TIME_OPTIONS = [
  'Any Time',
  'Quick (Under 15 mins)',
  'Under 30 mins',
  'Under 45 mins',
  'Slow Cook / Weekend',
];

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('None / Any');
  const [cookingTime, setCookingTime] = useState('Any Time');
  const [addedIngredients, setAddedIngredients] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleGenerate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const params = {};
      if (dietaryPreference && dietaryPreference !== 'None / Any') {
        params.dietaryPreferences = dietaryPreference;
      }
      if (cookingTime && cookingTime !== 'Any Time') {
        params.preferredCookingTime = cookingTime;
      }

      const res = await recipeService.getRecipeRecommendations(params);
      if (res.success) {
        setRecipes(res.data || []);
        setHasGenerated(true);
        if (res.fallbackNotice) {
          showToast(res.fallbackNotice, 'info');
        } else if (res.data?.length === 0 && res.message) {
          showToast(res.message, 'info');
        }
      } else {
        setErrorMessage(res.message || 'Failed to generate recipes');
      }
    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED' || /timeout/i.test(err.message || '');
      const msg = isTimeout
        ? 'Recipe generation is taking too long. Please try again.'
        : (err.response?.data?.message || err.message || 'Failed to connect to AI recipe service');
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGrocery = async (ingredientName, key) => {
    try {
      await groceryService.addGroceryItem({ name: ingredientName });
      setAddedIngredients((prev) => ({ ...prev, [key]: true }));
      showToast(`Added "${ingredientName}" to Grocery List!`);
    } catch (err) {
      showToast('Failed to add to grocery list', 'error');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel rounded-3xl p-8 bg-gradient-to-r from-emerald-500/10 via-sky-500/5 to-cyan-500/10 border-emerald-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini AI Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meal Suggestions 🍳
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            Get personalized recipe recommendations powered by Google Gemini AI using ingredients available in your pantry.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          isLoading={isLoading}
          disabled={isLoading}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {hasGenerated ? 'Regenerate Recipes' : 'Generate Recipes'}
        </Button>
      </div>

      {/* Preferences Bar */}
      <Card padding="p-5" hoverEffect={false} className="border-slate-200/60">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
            <Filter className="w-4 h-4 text-emerald-500" />
            <span>Recipe Preferences:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto flex-1">
            {/* Dietary Preference Dropdown */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
              <span className="text-slate-500 shrink-0 font-medium">Diet:</span>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none w-full cursor-pointer"
              >
                {DIETARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Cooking Time Dropdown */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
              <span className="text-slate-500 shrink-0 font-medium">Time:</span>
              <select
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none w-full cursor-pointer"
              >
                {COOKING_TIME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Error state */}
      {errorMessage && (
        <Card className="border-rose-500/30 bg-rose-500/5 p-6 rounded-3xl">
          <div className="flex items-start space-x-3 text-rose-600">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Recipe Notice</h4>
              <p className="text-xs text-rose-600/80 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl apple-gradient-bg mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 animate-bounce">
            <ChefHat className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Finding the best recipes for your pantry...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Prioritizing ingredients expiring soon and preparing personalized recipe suggestions.
          </p>
        </div>
      )}

      {/* Initial Empty State (before generating) */}
      {!isLoading && !hasGenerated && (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-900">
              Ready to Cook?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Click the "Generate Recipes" button above to let CookWise AI suggest meals you can make right now with your ingredients!
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="md" onClick={handleGenerate}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate My Recipes
            </Button>
          </div>
        </div>
      )}

      {/* Results State */}
      {!isLoading && hasGenerated && recipes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, idx) => (
            <Card key={idx} hoverEffect className="flex flex-col justify-between space-y-6 p-6 rounded-3xl border border-slate-200/70">
              <div className="space-y-4">
                {/* Recipe Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Recipe #{idx + 1}
                    </span>
                    {recipe.difficulty && (
                      <Badge variant={recipe.difficulty === 'Easy' ? 'emerald' : 'amber'}>
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {recipe.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                {/* Recommendation Reason Pill */}
                {recipe.recommendationReason && (
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span className="leading-snug">{recipe.recommendationReason}</span>
                  </div>
                )}

                {/* Cooking time & Difficulty */}
                <div className="flex items-center space-x-4 text-xs text-slate-600 pt-1">
                  {recipe.cookingTime && (
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">{recipe.cookingTime}</span>
                    </div>
                  )}
                  {recipe.difficulty && (
                    <div className="flex items-center space-x-1.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">{recipe.difficulty} Difficulty</span>
                    </div>
                  )}
                </div>

                {/* Nutrition Breakdown */}
                {recipe.nutrition && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/50 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <Activity className="w-3.5 h-3.5 text-sky-500" />
                      <span>Nutrition Estimates</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {recipe.nutrition.calories && (
                        <div className="p-1.5 rounded-xl bg-white shadow-xs">
                          <p className="text-[10px] text-slate-400">Cal</p>
                          <p className="font-bold text-slate-800 text-[11px] truncate">{recipe.nutrition.calories}</p>
                        </div>
                      )}
                      {recipe.nutrition.protein && (
                        <div className="p-1.5 rounded-xl bg-white shadow-xs">
                          <p className="text-[10px] text-slate-400">Protein</p>
                          <p className="font-bold text-slate-800 text-[11px] truncate">{recipe.nutrition.protein}</p>
                        </div>
                      )}
                      {recipe.nutrition.carbs && (
                        <div className="p-1.5 rounded-xl bg-white shadow-xs">
                          <p className="text-[10px] text-slate-400">Carbs</p>
                          <p className="font-bold text-slate-800 text-[11px] truncate">{recipe.nutrition.carbs}</p>
                        </div>
                      )}
                      {recipe.nutrition.fat && (
                        <div className="p-1.5 rounded-xl bg-white shadow-xs">
                          <p className="text-[10px] text-slate-400">Fat</p>
                          <p className="font-bold text-slate-800 text-[11px] truncate">{recipe.nutrition.fat}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ingredients List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Ingredients Needed
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {recipe.ingredients?.map((ing, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{typeof ing === 'string' ? ing : `${ing?.quantity || ''} ${ing?.item || ing?.name || ''}`.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Ingredients */}
                {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      Missing Ingredients (Add to Grocery)
                    </h4>
                    <div className="space-y-1.5">
                      {recipe.missingIngredients.map((missing, i) => {
                        const key = `${idx}-${i}`;
                        const isAdded = addedIngredients[key];
                        const missingText = typeof missing === 'string'
                          ? missing
                          : `${missing?.quantity || ''} ${missing?.item || missing?.name || ''}`.trim() || String(missing);
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs"
                          >
                            <span className="text-slate-700">{missingText}</span>
                            <button
                              onClick={() => handleAddToGrocery(missingText, key)}
                              disabled={isAdded}
                              className={`p-1 rounded-lg transition-colors flex items-center space-x-1 ${
                                isAdded
                                  ? 'text-emerald-600'
                                  : 'text-amber-600 hover:text-amber-700 hover:bg-amber-100 cursor-pointer'
                              }`}
                              title={isAdded ? 'Added to Grocery' : 'Add to Grocery List'}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {recipe.instructions && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Instructions
                    </h4>
                    <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                      {recipe.instructions.map((step, i) => (
                        <li key={i} className="pl-1">
                          <span>{typeof step === 'string' ? step : String(step?.step || step?.text || '')}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State after generating (no recipes returned) */}
      {!isLoading && hasGenerated && recipes.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No Recipes Available
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add more fresh ingredients to your pantry to get delicious recipe recommendations.
          </p>
          <div className="pt-2">
            <Link to="/pantry">
              <Button variant="primary" size="md">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Manage Pantry
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
