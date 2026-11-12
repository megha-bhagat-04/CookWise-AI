const { generateRecipesWithGroq } = require('./groqService');
const { generateRecipes } = require('./geminiService');

const isValidationError = (err) => err?.code === 'VALIDATION_ERROR';

const reasonForLog = (err) => {
  if (!err) return 'Unknown error';
  if (err.code === 'MISSING_API_KEY') return 'Missing API key';
  if (err.status === 401 || err.status === 403) return 'Invalid API key';
  if (err.code === 'TIMEOUT' || err.reason === 'Timeout') return 'Timeout';
  if (err.code === 'RATE_LIMIT' || err.reason === 'Rate limit' || err.status === 429) return 'Rate limit';
  if (err.code === 'UNAVAILABLE' || err.code === 'MODEL_UNAVAILABLE' || err.reason === 'Service unavailable' || err.status === 503) return 'Service unavailable';
  if (err.code === 'MALFORMED_RESPONSE' || err.reason === 'Malformed response') return 'Malformed response';
  return err.reason || 'Provider error';
};

const generateRecipesWithFallback = async (params) => {
  // 1) Try Groq (primary)
  try {
    const groqResult = await generateRecipesWithGroq(params);
    console.info(`[Recipe AI] Provider: Groq | Duration: ${groqResult.durationMs}ms`);
    return { ...groqResult, isFallbackProvider: false };
  } catch (groqErr) {
    if (isValidationError(groqErr)) throw groqErr;
    const groqDuration = groqErr.durationMs != null ? ` ${groqErr.durationMs}ms` : '';
    console.warn(`[Recipe AI] Groq failed${groqDuration} | Reason: ${reasonForLog(groqErr)}`);
    console.info('[Recipe AI] Switching to Gemini');

    // 2) Fallback to Gemini
    try {
      const geminiResult = await generateRecipes(params);
      const geminiDuration = geminiResult.durationMs != null ? geminiResult.durationMs : 0;
      console.info(`[Recipe AI] Provider: Gemini | Duration: ${geminiDuration}ms`);
      return { ...geminiResult, isFallbackProvider: true };
    } catch (geminiErr) {
      if (isValidationError(geminiErr)) throw geminiErr;
      const geminiDuration = geminiErr.durationMs != null ? ` ${geminiErr.durationMs}ms` : '';
      console.warn(`[Recipe AI] Gemini failed${geminiDuration} | Reason: ${reasonForLog(geminiErr)}`);
      const error = new Error('Recipe generation is currently unavailable. Both AI providers failed. Please try again later.');
      error.code = 'AI_PROVIDERS_FAILED';
      error.status = 503;
      error.details = {
        groq: reasonForLog(groqErr),
        gemini: reasonForLog(geminiErr),
      };
      throw error;
    }
  }
};

module.exports = {
  generateRecipesWithFallback,
};
