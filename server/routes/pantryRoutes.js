const express = require('express');
const router = express.Router();
const {
  getPantryItems,
  createPantryItem,
  updatePantryItem,
  deletePantryItem,
  getStatistics,
  getExpiryReminders,
  getInsights
} = require('../controllers/pantryController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this router
router.use(protect);

// Analytics routes (must come BEFORE /:id to avoid matching 'stats' as an id)
router.get('/stats', getStatistics);
router.get('/expiry-reminders', getExpiryReminders);
router.get('/insights', getInsights);

router.route('/').get(getPantryItems).post(createPantryItem);
router.route('/:id').put(updatePantryItem).delete(deletePantryItem);

module.exports = router;
