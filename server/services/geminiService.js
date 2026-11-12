const { GoogleGenAI } = require('@google/genai');

/**
 * Initialize Gemini AI client using server environment variable
 */
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    const error = new Error('GEMINI_API_KEY is not configured on the server. Please provide a valid Gemini API key in server/.env');
    error.code = 'MISSING_API_KEY';
    error.status = 503;
    throw error;
  }

  return new GoogleGenAI({ apiKey });
};

const withTimeout = (promise, ms, label = 'Operation') =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      const err = new Error(`${label} timed out after ${ms}ms`);
      err.code = 'TIMEOUT';
      err.status = 504;
      setTimeout(() => reject(err), ms);
    }),
  ]);

/**
 * Generate 3 recipe recommendations using Google Gemini API
 */
const generateRecipes = async ({
  ingredients = [],
  expiringSoonItems = [],
  dietaryPreferences = '',
  preferredCookingTime = '',
}) => {
  const ai = getGeminiClient();
  const totalStart = Date.now();

  // Compact ingredient context (cap list to avoid oversized prompt latency)
  const ingredientDetails = ingredients.slice(0, 40).map((item) => {
    const expInfo = item.expiryDate ? ` [exp: ${new Date(item.expiryDate).toISOString().slice(0, 10)}]` : '';
    return `- ${item.name}: ${item.quantity} ${item.unit || ''}${expInfo}`.trim();
  }).join('\n');

  const expiringDetails = expiringSoonItems.length > 0
    ? expiringSoonItems.slice(0, 12).map((item) => `- ${item.name} (${item.quantity} ${item.unit || ''})`).join('\n')
    : 'None';

  const systemInstruction = `You are CookWise AI. Return ONLY a valid JSON array of exactly 3 recipe objects (no markdown/text). Keep descriptions and steps concise but clear. Prioritize ingredients expiring soon. Each object must include: name, description (1 short sentence), ingredients (array of strings with quantities), missingIngredients (array, minimal), cookingTime, difficulty, instructions (array of short numbered-step strings), nutrition {calories, protein, carbs, fat}, recommendationReason (1 short sentence mentioning expiry priority when relevant).`;

  const prompt = `Pantry:
${ingredientDetails}

Expiring soon (priority):
${expiringDetails}
${dietaryPreferences ? `Diet: ${dietaryPreferences}\n` : ''}${preferredCookingTime ? `Time: ${preferredCookingTime}\n` : ''}
Generate exactly 3 practical recipes using available pantry items. Keep missingIngredients minimal. Output JSON array only.`;

  const isQuotaOrRateLimit = (err) => {
    if (!err) return false;
    const status = err.status ?? err.code ?? err?.error?.code ?? err?.error?.status;
    const msg = String(err.message || err?.error?.message || '').toLowerCase();
    return (
      status === 429 ||
      status === '429' ||
      status === 'RESOURCE_EXHAUSTED' ||
      msg.includes('429') ||
      msg.includes('resource_exhausted') ||
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('too many requests')
    );
  };

  const isModelUnavailable = (err) => {
    if (!err) return false;
    const status = err.status ?? err.code ?? err?.error?.code ?? err?.error?.status;
    const msg = String(err.message || err?.error?.message || '').toLowerCase();
    return (
      status === 503 ||
      status === '503' ||
      status === 'UNAVAILABLE' ||
      msg.includes('503') ||
      msg.includes('unavailable') ||
      msg.includes('high demand') ||
      msg.includes('overloaded')
    );
  };

  const sanitizeErrorMessage = (err, fallback = 'Unable to generate recipes using AI at this time. Please try again.') => {
    let msg = err?.message ?? err?.error?.message ?? '';
    if (typeof msg !== 'string') {
      try { msg = JSON.stringify(msg); } catch { msg = String(msg); }
    }
    msg = msg.trim();
    if (msg.startsWith('{') || msg.startsWith('[')) {
      try {
        const parsed = JSON.parse(msg);
        msg = parsed?.error?.message || parsed?.message || fallback;
      } catch {
        msg = fallback;
      }
    }
    return String(msg).replace(/\s+/g, ' ').slice(0, 180) || fallback;
  };

  const callGenerate = async (modelName, attempt = 1) => {
    const apiStart = Date.now();
    const response = await withTimeout(
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.4,
          maxOutputTokens: 2048,
        },
      }),
      30000,
      'Gemini API call'
    );
    const apiMs = Date.now() - apiStart;
    console.info(`[Gemini Timing] generateContent model=${modelName} attempt=${attempt} api_ms=${apiMs} ingredients=${ingredients.length} expiring=${expiringSoonItems.length}`);
    return response;
  };

  try {
    // Currently supported text-generation model (kept unchanged)
    const modelName = 'gemini-3.8-flash';
    let response;
    try {
      response = await callGenerate(modelName, 1);
    } catch (firstErr) {
      if (isQuotaOrRateLimit(firstErr) || isModelUnavailable(firstErr)) {
        console.warn('[Gemini Service] Transient AI error on first attempt; retrying once after 2s (not repeated).');
        await new Promise((r) => setTimeout(r, 2000));
        response = await callGenerate(modelName, 2);
      } else {
        throw firstErr;
      }
    }

    const responseText = response.text ? response.text.trim() : '';

    if (!responseText) {
      throw new Error('Gemini API returned an empty response.');
    }

    // Sanitize and parse JSON response
    const cleanJsonText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```\s*$/g, '')
      .trim();

    let recipes;
    try {
      recipes = JSON.parse(cleanJsonText);
    } catch (parseErr) {
      console.error('[Gemini Service] JSON Parse error on response:', parseErr.message);
      const parseError = new Error('Failed to parse AI recipe suggestions. The AI returned an invalid response format.');
      parseError.code = 'MALFORMED_RESPONSE';
      throw parseError;
    }

    if (!Array.isArray(recipes)) {
      if (recipes && Array.isArray(recipes.recipes)) {
        recipes = recipes.recipes;
      } else {
        const formatError = new Error('AI response did not return an array of recipes.');
        formatError.code = 'MALFORMED_RESPONSE';
        throw formatError;
      }
    }

    // Normalize to exactly 3 recipes to preserve frontend expectations
    recipes = recipes.slice(0, 3);
    if (recipes.length !== 3) {
      const countError = new Error('Gemini did not return exactly 3 valid recipes.');
      countError.code = 'MALFORMED_RESPONSE';
      throw countError;
    }

    const durationMs = Date.now() - totalStart;
    console.info(`[Gemini Timing] total_service_ms=${durationMs} recipes=${recipes.length}`);
    return { recipes, durationMs, model: modelName, provider: 'gemini' };
  } catch (err) {
    console.error('[Gemini Service Error]:', err.message || err);
    console.info(`[Gemini Timing] failed_total_ms=${Date.now() - totalStart}`);

    // Handle known Gemini / API error scenarios gracefully without leaking keys
    if (err.code === 'MISSING_API_KEY') {
      err.durationMs = Date.now() - totalStart;
      throw err;
    }

    const durationMs = Date.now() - totalStart;

    if (err.code === 'TIMEOUT' || err.status === 504) {
      const timeoutError = new Error('Recipe generation timed out. Please try again.');
      timeoutError.status = 504;
      timeoutError.code = 'TIMEOUT';
      timeoutError.reason = 'Timeout';
      timeoutError.durationMs = durationMs;
      throw timeoutError;
    }

    // Rate limit / Quota exceeded error
    if (isQuotaOrRateLimit(err)) {
      const quotaError = new Error('Gemini API quota or rate limit reached. Please wait a moment and try again, or check your API plan/quota.');
      quotaError.status = 429;
      quotaError.code = 'QUOTA_EXCEEDED';
      quotaError.reason = 'Rate limit';
      quotaError.durationMs = durationMs;
      throw quotaError;
    }

    // Temporary model unavailability / high demand
    if (isModelUnavailable(err)) {
      const unavailableError = new Error('The AI model is temporarily busy due to high demand. Please try again shortly.');
      unavailableError.status = 503;
      unavailableError.code = 'MODEL_UNAVAILABLE';
      unavailableError.reason = 'Service unavailable';
      unavailableError.durationMs = durationMs;
      throw unavailableError;
    }

    // Invalid API Key error
    if (
      err.status === 400 ||
      err.status === 403 ||
      (err.message && (err.message.includes('API_KEY_INVALID') || err.message.includes('unregistered') || err.message.includes('Forbidden') || err.message.includes('API key not valid')))
    ) {
      const authError = new Error('Invalid or unauthorized Gemini API key. Please check your server environment configuration.');
      authError.status = 401;
      authError.durationMs = durationMs;
      throw authError;
    }

    if (err.code === 'MALFORMED_RESPONSE') {
      err.durationMs = durationMs;
      err.reason = 'Malformed response';
      throw err;
    }

    // Generic API failure with sanitized message
    const apiError = new Error(sanitizeErrorMessage(err));
    apiError.status = err.status || 500;
    apiError.code = err.code === 'MALFORMED_RESPONSE' ? 'MALFORMED_RESPONSE' : (apiError.code || 'PROVIDER_ERROR');
    apiError.durationMs = Date.now() - totalStart;
    if (apiError.code === 'MALFORMED_RESPONSE') apiError.reason = 'Malformed response';
    throw apiError;
  }
};

module.exports = {
  generateRecipes,
  getGeminiClient,
};
