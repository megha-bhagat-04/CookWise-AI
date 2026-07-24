import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import pantryService from '../services/pantryService';
import PantryStats from '../components/pantry/PantryStats';
import PantryTable from '../components/pantry/PantryTable';
import PantryFormModal from '../components/pantry/PantryFormModal';
import Button from '../components/common/Button';

const PantryPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch pantry items
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await pantryService.getPantryItems();
      setItems(res.data || []);
    } catch (err) {
      console.error('[Pantry Fetch Error]:', err);
      setError(
        err.response?.data?.message || 'Failed to load pantry items. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Add / Edit submit
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingItem) {
        // Update
        const res = await pantryService.updatePantryItem(editingItem._id, formData);
        setItems((prev) =>
          prev.map((item) => (item._id === editingItem._id ? res.data : item))
        );
      } else {
        // Add
        const res = await pantryService.addPantryItem(formData);
        setItems((prev) => [...prev, res.data]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('[Pantry Submit Error]:', err);
      setError(
        err.response?.data?.message || 'Failed to save pantry item. Please check inputs.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await pantryService.deletePantryItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('[Pantry Delete Error]:', err);
      setError(err.response?.data?.message || 'Failed to delete pantry item.');
    }
  };

  // Open modal for editing
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel rounded-3xl p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pantry Inventory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pantry Management 🥬
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Track ingredient stock levels, expiration dates, and freshness indicators in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={fetchItems}
            className="p-3 text-slate-600 dark:text-slate-300"
            title="Refresh Pantry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="primary" size="lg" onClick={handleOpenAddModal}>
            <Plus className="w-5 h-5 mr-2" />
            Add Ingredient
          </Button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs underline font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Stats Cards */}
      <PantryStats items={items} />

      {/* Main Content Area: Table / Grid */}
      {isLoading ? (
        <div className="glass-panel p-12 rounded-3xl space-y-4">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-1/3" />
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
          </div>
        </div>
      ) : (
        <PantryTable
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add / Edit Modal */}
      <PantryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        isLoading={isSubmitting}
      />

    </div>
  );
};

export default PantryPage;
