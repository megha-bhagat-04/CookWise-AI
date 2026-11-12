const PantryItem = require('../models/PantryItem');
const { getExpiryStatus, getDaysRemaining } = require('../utils/dateUtils');

const getPantryStats = async (userId) => {
  const items = await PantryItem.find({ userId });

  let total = items.length;
  let fresh = 0;
  let expiringSoon = 0;
  let expired = 0;
  const categories = new Set();

  items.forEach(item => {
    categories.add(item.category);

    const status = getExpiryStatus(item.expiryDate);
    if (status === 'Expired') {
      expired++;
    } else if (status === 'Expiring Soon' || status === 'Expires Today') {
      expiringSoon++;
    } else if (status === 'Fresh') {
      fresh++;
    }
  });

  return {
    totalItems: total,
    freshItems: fresh,
    expiringSoon,
    expiredItems: expired,
    categoriesUsed: categories.size,
  };
};

const getExpiryReminderItems = async (userId) => {
  const items = await PantryItem.find({ userId }).sort({ expiryDate: 1 });
  return items.filter(item => {
    const days = getDaysRemaining(item.expiryDate);
    return days <= 1 && days >= 0;
  });
};

const getInsights = async (userId) => {
  const items = await PantryItem.find({ userId });

  const insights = [];

  if (items.length === 0) {
    insights.push("Your pantry is currently empty. Start adding some items!");
    return insights;
  }

  // Insight 1: Category counts
  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const vegCount = categoryCounts['Vegetables'] || 0;
  if (vegCount > 0) {
    insights.push(`You have ${vegCount} vegetable${vegCount !== 1 ? 's' : ''}.`);
  }

  if (!categoryCounts['Dairy'] || categoryCounts['Dairy'] === 0) {
    insights.push("You have no dairy products.");
  }

  // Insight 2: Expiring soon (<= 3 days including today)
  let expiringSoon = 0;
  items.forEach(item => {
    const status = getExpiryStatus(item.expiryDate);
    if (status === 'Expiring Soon' || status === 'Expires Today') {
      expiringSoon++;
    }
  });

  if (expiringSoon > 0) {
    insights.push(`${expiringSoon} item${expiringSoon !== 1 ? 's' : ''} expire${expiringSoon === 1 ? 's' : ''} soon.`);
  }

  // Insight 3: Freshness percentage
  let freshCount = 0;
  items.forEach(item => {
    if (getExpiryStatus(item.expiryDate) === 'Fresh') {
      freshCount++;
    }
  });

  const freshnessPercentage = Math.round((freshCount / items.length) * 100);
  insights.push(`Your pantry is ${freshnessPercentage}% fresh.`);

  return insights;
};

module.exports = {
  getPantryStats,
  getExpiryReminderItems,
  getInsights,
};
