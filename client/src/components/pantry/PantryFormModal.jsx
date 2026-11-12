import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Edit3, Calendar, Tag, Weight, Sparkles } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { formatDateForInput } from '../../utils/dateUtils';

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Grains',
  'Spices',
  'Meat',
  'Drinks',
  'Others',
];

const UNIT_GROUPS = {
  'Weight': ['g', 'kg', 'mg'],
  'Volume': ['ml', 'L', 'cup', 'tbsp', 'tsp'],
  'Count': ['pcs', 'dozen', 'pack', 'packet'],
  'Packaging': ['bottle', 'jar', 'can', 'box', 'bunch'],
};

const ALL_STANDARD_UNITS = Object.values(UNIT_GROUPS).flat();

const PantryFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    quantity: '',
    unit: 'pcs',
    purchaseDate: formatDateForInput(new Date()),
    expiryDate: '',
    image: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Vegetables',
        quantity: initialData.quantity !== undefined ? initialData.quantity : '',
        unit: initialData.unit || 'pcs',
        purchaseDate: initialData.purchaseDate
          ? formatDateForInput(initialData.purchaseDate)
          : formatDateForInput(new Date()),
        expiryDate: initialData.expiryDate
          ? formatDateForInput(initialData.expiryDate)
          : '',
        image: initialData.image || '',
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        category: 'Vegetables',
        quantity: '',
        unit: 'pcs',
        purchaseDate: formatDateForInput(new Date()),
        expiryDate: '',
        image: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ingredient name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Please enter a valid positive quantity';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (formData.purchaseDate && new Date(formData.expiryDate) < new Date(formData.purchaseDate)) {
      newErrors.expiryDate = 'Expiry date cannot be earlier than purchase date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
    };

    // Preserve exact saved dates when editing unless the user changed them
    if (initialData) {
      const initialExpiry = formatDateForInput(initialData.expiryDate);
      const initialPurchase = formatDateForInput(initialData.purchaseDate);
      if (initialExpiry && payload.expiryDate === initialExpiry) {
        payload.expiryDate = initialExpiry; // keep as YYYY-MM-DD calendar date
      }
      if (initialPurchase && payload.purchaseDate === initialPurchase) {
        payload.purchaseDate = initialPurchase;
      }
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              {initialData ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {initialData ? 'Edit Pantry Item' : 'Add New Ingredient'}
              </h2>
              <p className="text-xs text-slate-500">
                {initialData ? 'Update item quantity or dates' : 'Track your kitchen stock & expiration'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Ingredient Name */}
          <Input
            label="Ingredient Name"
            id="name"
            name="name"
            placeholder="e.g. Fresh Tomatoes, Whole Milk"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          {/* Category Dropdown */}
          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 ml-0.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50/80 text-slate-900 border text-sm rounded-2xl px-4 py-3 border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-xs text-rose-500 font-medium ml-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* Quantity and Unit Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              id="quantity"
              name="quantity"
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 2, 500"
              value={formData.quantity}
              onChange={handleChange}
              error={errors.quantity}
              required
            />

            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 ml-0.5">
                Unit <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`w-full bg-slate-50/80 text-slate-900 border text-sm rounded-2xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 cursor-pointer ${
                    errors.unit
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-200/80'
                  }`}
                >
                  {Object.entries(UNIT_GROUPS).map(([groupName, units]) => (
                    <optgroup key={groupName} label={groupName} className="font-bold text-slate-500">
                      {units.map((u) => (
                        <option key={u} value={u} className="text-slate-900">
                          {u}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  {/* Keep compatibility with existing items using non-standard units */}
                  {formData.unit && !ALL_STANDARD_UNITS.includes(formData.unit) && (
                    <optgroup label="Other" className="font-bold text-slate-500">
                      <option value={formData.unit} className="text-slate-900">
                        {formData.unit}
                      </option>
                    </optgroup>
                  )}
                </select>
              </div>
              {errors.unit && (
                <p className="text-xs text-rose-500 font-medium ml-1">
                  {errors.unit}
                </p>
              )}
            </div>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Purchase Date"
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange}
              error={errors.purchaseDate}
              icon={Calendar}
            />

            <Input
              label="Expiry Date"
              id="expiryDate"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              error={errors.expiryDate}
              icon={Calendar}
              required
            />
          </div>

          {/* Optional Image URL */}
          <Input
            label="Image URL (Optional)"
            id="image"
            name="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={handleChange}
            helperText="Provide an image URL or leave empty for a category badge icon"
          />

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              {initialData ? 'Update Item' : 'Save to Pantry'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PantryFormModal;
