const GroceryItem = require('../models/GroceryItem');

/**
 * @desc    Get all grocery items for logged-in user
 * @route   GET /api/grocery
 * @access  Private
 */
const getGroceryItems = async (req, res, next) => {
  try {
    const items = await GroceryItem.find({ userId: req.user._id }).sort({ isPurchased: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a grocery item
 * @route   POST /api/grocery
 * @access  Private
 */
const addGroceryItem = async (req, res, next) => {
  try {
    const { name, quantity, category } = req.body;

    if (!name || !name.trim()) {
      res.status(400);
      throw new Error('Please provide an item name');
    }

    const item = await GroceryItem.create({
      userId: req.user._id,
      name: name.trim(),
      quantity: quantity || '',
      category: category || 'Others',
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle purchased status of a grocery item
 * @route   PUT /api/grocery/:id/toggle
 * @access  Private
 */
const toggleGroceryItem = async (req, res, next) => {
  try {
    const item = await GroceryItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Grocery item not found');
    }

    if (item.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    item.isPurchased = !item.isPurchased;
    await item.save();

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a grocery item
 * @route   DELETE /api/grocery/:id
 * @access  Private
 */
const deleteGroceryItem = async (req, res, next) => {
  try {
    const item = await GroceryItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Grocery item not found');
    }

    if (item.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Grocery item removed',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGroceryItems,
  addGroceryItem,
  toggleGroceryItem,
  deleteGroceryItem,
};

