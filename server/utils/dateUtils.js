const { differenceInDays, startOfDay } = require('date-fns');

const toLocalDate = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
  }
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/**
 * Parse a date-only string (YYYY-MM-DD) or date value to a stable local-noon Date.
 * This avoids UTC midnight conversions shifting the calendar day across timezones.
 * @param {Date|string} value
 * @returns {Date|null}
 */
const parseDateOnly = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      return new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0, 0);
    }
  }
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
};

/**
 * Calculate days remaining until expiry date (calendar-day accurate)
 * @param {Date|string} expiryDate 
 * @returns {number} days remaining
 */
const getDaysRemaining = (expiryDate) => {
  const expiry = toLocalDate(expiryDate);
  if (!expiry) return 0;
  const today = startOfDay(new Date());
  return differenceInDays(startOfDay(expiry), today);
};

/**
 * Determine the expiry status of an item
 * @param {Date|string} expiryDate 
 * @returns {string} Status string: 'Expired', 'Expires Today', 'Expiring Soon', 'Fresh'
 */
const getExpiryStatus = (expiryDate) => {
  const daysRemaining = getDaysRemaining(expiryDate);
  
  if (daysRemaining < 0) {
    return 'Expired';
  }
  if (daysRemaining === 0) {
    return 'Expires Today';
  }
  if (daysRemaining <= 3) {
    return 'Expiring Soon';
  }
  return 'Fresh';
};

module.exports = {
  getDaysRemaining,
  getExpiryStatus,
  parseDateOnly,
  toLocalDate,
};
