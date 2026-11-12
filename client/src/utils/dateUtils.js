import { differenceInDays, startOfDay } from 'date-fns';

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
  // Interpret existing Date/timestamp values in local calendar terms
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/**
 * Calculate days remaining until expiry date (calendar-day accurate)
 * @param {Date|string} expiryDate 
 * @returns {number} days remaining
 */
export const getDaysRemaining = (expiryDate) => {
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
export const getExpiryStatus = (expiryDate) => {
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

/**
 * Format a date value to YYYY-MM-DD for native HTML date input (<input type="date">)
 * Preserves calendar date and avoids UTC timezone shifts
 * @param {Date|string} dateVal
 * @returns {string} YYYY-MM-DD
 */
export const formatDateForInput = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateVal)) {
    return dateVal.slice(0, 10);
  }
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Consistently format date for human readable display (e.g. '20 November 2026')
 * Avoids timezone-related date shifts
 * @param {Date|string} dateVal
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (dateVal) => {
  const local = toLocalDate(dateVal);
  if (!local) return 'N/A';
  return local.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Get color code for status
 * @param {string} status 
 * @returns {string} Tailwind text/border color classes
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'Expired':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Expires Today':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Expiring Soon':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Fresh':
    default:
      return 'bg-green-100 text-green-800 border-green-200';
  }
};
