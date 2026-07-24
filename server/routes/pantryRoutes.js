const express = require('express');
const router = express.Router();
const {
  getPantryItems,
  createPantryItem,
  updatePantryItem,
  deletePantryItem,
} = require('../controllers/pantryController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this router
router.use(protect);

router.route('/').get(getPantryItems).post(createPantryItem);
router.route('/:id').put(updatePantryItem).delete(deletePantryItem);

module.exports = router;
