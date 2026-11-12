import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import groceryService from '../services/groceryService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Toast from '../components/common/Toast';

const GroceryPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await groceryService.getGroceryItems();
      setItems(res.data || []);
    } catch (err) {
      showToast('Failed to load grocery items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await groceryService.addGroceryItem({
        name: newItemName.trim(),
        quantity: newItemQuantity.trim(),
      });
      setItems((prev) => [res.data, ...prev]);
      setNewItemName('');
      setNewItemQuantity('');
      showToast('Item added to grocery list!');
    } catch (err) {
      showToast('Failed to add item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await groceryService.toggleGroceryItem(id);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
    } catch (err) {
      showToast('Failed to update item status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await groceryService.deleteGroceryItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      showToast('Item removed from grocery list');
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  const pendingItems = items.filter((i) => !i.isPurchased);
  const completedItems = items.filter((i) => i.isPurchased);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-3xl p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Smart Shopping</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Grocery List 🛒
          </h1>
          <p className="text-sm text-slate-600">
            Keep track of needed ingredients and items to buy.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            {pendingItems.length} to buy
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
            {completedItems.length} purchased
          </span>
        </div>
      </div>

      {/* Add Item Form */}
      <Card padding="p-6" hoverEffect={false}>
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Input
              id="grocery-name"
              placeholder="e.g. Olive Oil, Garlic, Eggs..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-36">
            <Input
              id="grocery-quantity"
              placeholder="Qty (e.g. 2 pcs)"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Item
          </Button>
        </form>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-200/60 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Your Grocery List is Empty
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add items manually using the form above, or add missing ingredients from the AI Recipe Suggestions!
          </p>
        </div>
      )}

      {/* Items List */}
      {!isLoading && items.length > 0 && (
        <div className="space-y-6">
          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                To Buy ({pendingItems.length})
              </h3>
              <div className="space-y-2">
                {pendingItems.map((item) => (
                  <div
                    key={item._id}
                    className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-200/60 transition-all hover:bg-slate-50/50"
                  >
                    <button
                      onClick={() => handleToggle(item._id)}
                      className="flex items-center space-x-3 text-left flex-1 cursor-pointer"
                    >
                      <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {item.name}
                        </p>
                        {item.quantity && (
                          <p className="text-xs text-slate-500">
                            {item.quantity}
                          </p>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <div className="space-y-2 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Purchased ({completedItems.length})
              </h3>
              <div className="space-y-2">
                {completedItems.map((item) => (
                  <div
                    key={item._id}
                    className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-200/40 opacity-60 transition-all hover:opacity-100"
                  >
                    <button
                      onClick={() => handleToggle(item._id)}
                      className="flex items-center space-x-3 text-left flex-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-500 text-sm line-through">
                          {item.name}
                        </p>
                        {item.quantity && (
                          <p className="text-xs text-slate-400 line-through">
                            {item.quantity}
                          </p>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroceryPage;

