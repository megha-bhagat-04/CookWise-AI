const PantryItem = require('../models/PantryItem');
const { parseDateOnly } = require('../utils/dateUtils');

/**
 * @desc    Get all pantry items for logged-in user
 * @route   GET /api/pantry
 * @access  Private
 */
const getPantryItems = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;

    let query = { userId: req.user._id };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let sortObj = { expiryDate: 1 };
    if (sort === 'expiry-desc') sortObj = { expiryDate: -1 };
    if (sort === 'name-asc') sortObj = { name: 1 };
    if (sort === 'name-desc') sortObj = { name: -1 };
    if (sort === 'recent') sortObj = { createdAt: -1 };

    const items = await PantryItem.find(query).sort(sortObj);

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

    const parsedExpiry = parseDateOnly(expiryDate);
    if (!parsedExpiry) {
      res.status(400);
      throw new Error('Invalid expiry date');
    }

    const itemData = {
      userId: req.user._id,
      name,
      category,
      quantity: Number(quantity),
      unit,
      expiryDate: parsedExpiry,
      image: image || '',
    };

    if (purchaseDate) {
      const parsedPurchase = parseDateOnly(purchaseDate);
      if (parsedPurchase) itemData.purchaseDate = parsedPurchase;
    }

    const item = await PantryItem.create(itemData);

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

    const updates = { ...req.body };
    if (updates.userId) delete updates.userId;

    if (Object.prototype.hasOwnProperty.call(updates, 'expiryDate')) {
      if (!updates.expiryDate) {
        res.status(400);
        throw new Error('Expiry date is required');
      }
      const parsedExpiry = parseDateOnly(updates.expiryDate);
      if (!parsedExpiry) {
        res.status(400);
        throw new Error('Invalid expiry date');
      }
      updates.expiryDate = parsedExpiry;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'purchaseDate') && updates.purchaseDate) {
      const parsedPurchase = parseDateOnly(updates.purchaseDate);
      if (parsedPurchase) updates.purchaseDate = parsedPurchase;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'quantity')) {
      updates.quantity = Number(updates.quantity);
    }

    const updatedItem = await PantryItem.findByIdAndUpdate(
      req.params.id,
      updates,
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

/**
 * @desc    Get pantry statistics
 * @route   GET /api/pantry/stats
 * @access  Private
 */
const getStatistics = async (req, res, next) => {
  try {
    const { getPantryStats } = require('../services/pantryService');
    const stats = await getPantryStats(req.user._id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get expiry reminder items (expiring in 1 day or less)
 * @route   GET /api/pantry/expiry-reminders
 * @access  Private
 */
const getExpiryReminders = async (req, res, next) => {
  try {
    const { getExpiryReminderItems } = require('../services/pantryService');
    const reminderItems = await getExpiryReminderItems(req.user._id);

    res.status(200).json({
      success: true,
      count: reminderItems.length,
      data: reminderItems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pantry insights
 * @route   GET /api/pantry/insights
 * @access  Private
 */
const getInsightsData = async (req, res, next) => {
  try {
    const { getInsights } = require('../services/pantryService');
    const insights = await getInsights(req.user._id);

    res.status(200).json({
      success: true,
      data: insights,
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
  getStatistics,
  getExpiryReminders,
  getInsights: getInsightsData,
};
