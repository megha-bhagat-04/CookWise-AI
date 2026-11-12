/**
 * Default low stock thresholds for different units.
 * Can be expanded or configured per user in the future.
 */
export const LOW_STOCK_THRESHOLDS = {
  // Weight
  g: 500,
  kg: 1,
  mg: 1000,
  oz: 16,
  lb: 2,
  // Volume
  ml: 500,
  l: 0.5,
  cup: 2,
  tbsp: 5,
  tsp: 10,
  // Count
  pcs: 4,
  dozen: 1,
  pack: 2,
  packet: 2,
  items: 4,
  pieces: 4,
  // Packaging
  bottle: 1,
  jar: 1,
  can: 2,
  box: 2,
  bunch: 1,
};

/**
 * Determine if an item is running low
 * @param {number} quantity 
 * @param {string} unit 
 * @returns {boolean}
 */
export const isLowStock = (quantity, unit) => {
  const normUnit = unit ? unit.toLowerCase() : 'items';
  
  // Use specific threshold or fallback to 5 as a generic threshold
  const threshold = LOW_STOCK_THRESHOLDS[normUnit] || 5;
  
  return quantity < threshold;
};
