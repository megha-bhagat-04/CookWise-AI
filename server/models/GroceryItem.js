const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an item name'],
      trim: true,
      maxlength: [100, 'Item name cannot exceed 100 characters'],
    },
    quantity: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'Others',
      trim: true,
    },
    isPurchased: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);

module.exports = GroceryItem;

