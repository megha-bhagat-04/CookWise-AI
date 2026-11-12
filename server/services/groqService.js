const Groq = require('groq-sdk');

const GROQ_MODEL = 'openai/gpt-oss-20b';

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
    const error = new Error('GROQ_API_KEY is not configured on the server. Please provide a valid Groq API key in server/.env');
    error.code = 'MISSING_API_KEY';
    error.status = 503;
    throw error;
  }
  return new Groq({ apiKey });
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

const isQuotaOrRateLimit = (err) => {
  if (!err) return false;
  const status = err.status ?? err.code ?? err?.error?.code ?? err?.error?.status;
  const msg = String(err.message || err?.error?.message || '').toLowerCase();
  return status === 429 || status === '429' || msg.includes('429') || msg.includes('rate limit') || msg.includes('quota') || msg.includes('too many requests');
};

const isUnavailable = (err) => {
  if (!err) return false;
  const status = err.status ?? err.code ?? err?.error?.code ?? err?.error?.status;
  const msg = String(err.message || err?.error?.message || '').toLowerCase();
  return status === 503 || status === '503' || status === 502 || status === '502' || msg.includes('503') || msg.includes('502') || msg.includes('unavailable') || msg.includes('high demand') || msg.includes('overloaded') || msg.includes('service');
};

const sanitizeErrorMessage = (err, fallback = 'Groq request failed') => {
  let msg = err?.message ?? err?.error?.message ?? '';
  if (typeof msg !== 'string') {
    try { msg = JSON.stringify(msg); } catch { msg = String(msg); }
  }
  msg = String(msg).trim();
  if (msg.startsWith('{') || msg.startsWith('[')) {
    try {
      const parsed = JSON.parse(msg);
      msg = parsed?.error?.message || parsed?.message || fallback;
    } catch {
      msg = fallback;
    }
  }
  return msg.replace(/\s+/g, ' ').slice(0, 160) || fallback;
};

const toTextList = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map((entry) => {
    if (typeof entry === 'string') return entry;
    if (entry && typeof entry === 'object') {
      const name = entry.item || entry.name || entry.ingredient || '';
      const qty = entry.quantity || entry.amount || '';
      if (name && qty) return `${qty} ${name}`;
      return String(name || qty || '');
    }
    return String(entry ?? '');
  }).filter((s) => s && s.trim());
};

const normalizeRecipes = (recipes) => {
  if (!Array.isArray(recipes)) {
    if (recipes && Array.isArray(recipes.recipes)) recipes = recipes.recipes;
    else throw new Error('AI response did not return an array of recipes.');
  }
  const out = recipes.slice(0, 3).map((r) => ({
    name: r?.name || 'Untitled Recipe',
    description: r?.description || '',
    ingredients: toTextList(r?.ingredients),
    missingIngredients: toTextList(r?.missingIngredients),
    cookingTime: r?.cookingTime || '',
    difficulty: r?.difficulty || 'Easy',
    instructions: toTextList(r?.instructions),
    nutrition: r?.nutrition && typeof r.nutrition === 'object' ? {
      calories: String(r.nutrition.calories ?? ''),
      protein: String(r.nutrition.protein ?? ''),
      carbs: String(r.nutrition.carbs ?? ''),
      fat: String(r.nutrition.fat ?? ''),
    } : { calories: '', protein: '', carbs: '', fat: '' },
    recommendationReason: r?.recommendationReason || '',
  }));
  if (out.length !== 3) throw new Error('AI did not return exactly 3 valid recipes.');
  if (out.some((r) => r.ingredients.length === 0 || r.instructions.length === 0)) {
    throw new Error('AI returned incomplete recipe data (missing ingredients or instructions).');
  }
  return out;
};

const generateRecipesWithGroq = async ({
  ingredients = [],
  expiringSoonItems = [],
  dietaryPreferences = '',
  preferredCookingTime = '',
}) => {
  const client = getGroqClient();
  const start = Date.now();

  const ingredientDetails = ingredients.slice(0, 40).map((item) => {
    const expInfo = item.expiryDate ? ` [exp: ${new Date(item.expiryDate).toISOString().slice(0, 10)}]` : '';
    return `- ${item.name}: ${item.quantity} ${item.unit || ''}${expInfo}`.trim();
  }).join('\n');

  const expiringDetails = expiringSoonItems.length > 0
    ? expiringSoonItems.slice(0, 12).map((item) => `- ${item.name} (${item.quantity} ${item.unit || ''})`).join('\n')
    : 'None';

  const system = `You are CookWise AI. Return ONLY a valid JSON object with a single "recipes" array containing exactly 3 recipe objects. Prioritize ingredients expiring soon and use pantry items. Keep text concise but complete. Each recipe object: name, description (1 short sentence), ingredients (array with quantities), missingIngredients (array, minimal), cookingTime, difficulty, instructions (array of 4 to 6 SHORT separate steps, each step one clear action), nutrition {calories, protein, carbs, fat}, recommendationReason (1 short sentence, mention expiry priority when relevant). Output format: {"recipes": [ ... ]}. No markdown.`;

  const user = `Pantry:\n${ingredientDetails}\n\nExpiring soon (priority):\n${expiringDetails}\n${dietaryPreferences ? `Dietary preference: ${dietaryPreferences}\n` : ''}${preferredCookingTime ? `Preferred cooking time: ${preferredCookingTime}\n` : ''}\nGenerate exactly 3 practical recipes. Use available pantry ingredients, minimize missing ingredients, include quantities, step-by-step instructions, estimated cooking/prep time, and nutrition estimates. Output ONLY the JSON object {"recipes": [...]} with exactly 3 recipes.`;

  try {
    const completion = await withTimeout(
      client.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.4,
        max_tokens: 4096,
        reasoning_effort: 'low',
        response_format: { type: 'json_object' },
      }),
      25000,
      'Groq API call'
    );

    const durationMs = Date.now() - start;
    const choice = completion?.choices?.[0];
    const finishReason = choice?.finish_reason || 'unknown';
    const text = choice?.message?.content?.trim() || '';
    console.info(`[Groq Timing] finish_reason=${finishReason} content_chars=${text.length}`);

    if (!text) {
      const err = new Error(`Groq returned an empty response (finish_reason: ${finishReason}).`);
      err.status = 502;
      throw err;
    }

    if (finishReason === 'length') {
      const err = new Error('Groq response was truncated by the output token limit.');
      err.status = 502;
      err.code = 'MALFORMED_RESPONSE';
      throw err;
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const err = new Error('Groq returned malformed JSON.');
      err.status = 502;
      err.code = 'MALFORMED_RESPONSE';
      throw err;
    }

    const recipes = normalizeRecipes(parsed);
    return { recipes, durationMs, model: GROQ_MODEL, provider: 'groq', finishReason };
  } catch (err) {
    const durationMs = Date.now() - start;
    if (err.code === 'MISSING_API_KEY') {
      err.durationMs = durationMs;
      throw err;
    }
    const wrapped = new Error(sanitizeErrorMessage(err));
    wrapped.status = err.status || 500;
    wrapped.durationMs = durationMs;
    if (err.code === 'TIMEOUT' || err.status === 504) {
      wrapped.code = 'TIMEOUT';
      wrapped.reason = 'Timeout';
    } else if (isQuotaOrRateLimit(err)) {
      wrapped.code = 'RATE_LIMIT';
      wrapped.reason = 'Rate limit';
      wrapped.status = 429;
    } else if (isUnavailable(err)) {
      wrapped.code = 'UNAVAILABLE';
      wrapped.reason = 'Service unavailable';
      wrapped.status = 503;
    } else if (err.code === 'MALFORMED_RESPONSE' || finishReasonIsLength(err)) {
      wrapped.code = 'MALFORMED_RESPONSE';
      wrapped.reason = 'Malformed response';
    } else {
      wrapped.reason = 'Provider error';
    }
    throw wrapped;
  }
};

const finishReasonIsLength = (err) => /truncated|length/i.test(err?.message || '');

module.exports = {
  generateRecipesWithGroq,
  GROQ_MODEL,
};
