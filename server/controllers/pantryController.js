const PantryItem = require('../models/PantryItem');

/**
 * @desc    Get all pantry items for logged-in user
 * @route   GET /api/pantry
 * @access  Private
 */
const getPantryItems = async (req, res, next) => {
  try {
    const items = await PantryItem.find({ userId: req.user._id }).sort({
      expiryDate: 1,
    });

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
 * @desc    Add a new pantry item
 * @route   POST /api/pantry
 * @access  Private
 */
const createPantryItem = async (req, res, next) => {
  try {
    const { name, category, quantity, unit, expiryDate, purchaseDate, image } =
      req.body;

    if (!name || !category || quantity === undefined || !unit || !expiryDate) {
      res.status(400);
      throw new Error(
        'Please include all required fields: name, category, quantity, unit, and expiryDate'
      );
    }

    const item = await PantryItem.create({
      userId: req.user._id,
      name,
      category,
      quantity: Number(quantity),
      unit,
      expiryDate,
      purchaseDate: purchaseDate || new Date(),
      image: image || '',
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
 * @desc    Update a pantry item
 * @route   PUT /api/pantry/:id
 * @access  Private
 */
const updatePantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Pantry item not found');
    }

    // Ensure item belongs to user
    if (item.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this pantry item');
    }

    const updatedItem = await PantryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a pantry item
 * @route   DELETE /api/pantry/:id
 * @access  Private
 */
const deletePantryItem = async (req, res, next) => {
  try {
    const item = await PantryItem.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Pantry item not found');
    }

    // Ensure item belongs to user
    if (item.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this pantry item');
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Pantry item removed',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPantryItems,
  createPantryItem,
  updatePantryItem,
  deletePantryItem,
};
