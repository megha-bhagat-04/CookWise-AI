const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT Token for authenticated user
 * @param {string} id User ID
 * @returns {string} Signed JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = generateToken;
