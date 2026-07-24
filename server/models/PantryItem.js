const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an ingredient name'],
      trim: true,
      maxlength: [100, 'Ingredient name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'Vegetables',
          'Fruits',
          'Dairy',
          'Grains',
          'Spices',
          'Meat',
          'Drinks',
          'Others',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide a quantity'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Please specify a unit of measurement'],
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please provide an expiry date'],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);

module.exports = PantryItem;
