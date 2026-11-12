const express = require('express');
const router = express.Router();
const {
  getGroceryItems,
  addGroceryItem,
  toggleGroceryItem,
  deleteGroceryItem,
} = require('../controllers/groceryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getGroceryItems).post(addGroceryItem);
router.put('/:id/toggle', toggleGroceryItem);
router.delete('/:id', deleteGroceryItem);

module.exports = router;

