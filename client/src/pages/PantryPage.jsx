import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, RefreshCw } from 'lucide-react';
import pantryService from '../services/pantryService';
import PantryStats from '../components/pantry/PantryStats';
import InsightsCard from '../components/pantry/InsightsCard';
import LowStockSection from '../components/pantry/LowStockSection';
import PantryTable from '../components/pantry/PantryTable';
import PantryFormModal from '../components/pantry/PantryFormModal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';

const PantryPage = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [expiryReminders, setExpiryReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  // Fetch all pantry data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, statsRes, insightsRes, remindersRes] = await Promise.all([
        pantryService.getPantryItems(),
        pantryService.getPantryStats(),
        pantryService.getInsights(),
        pantryService.getExpiryReminders()
      ]);
      setItems(itemsRes.data || []);
      setStats(statsRes.data || null);
      setInsights(insightsRes.data || []);
      setExpiryReminders(remindersRes.data || []);
    } catch (err) {
      console.error('[Pantry Fetch Error]:', err);
      showToast(
        err.response?.data?.message || 'Failed to load pantry data. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle Add / Edit submit
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
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
      fetchAllData(); // Refresh analytics
      setIsModalOpen(false);
      setEditingItem(null);
      showToast(editingItem ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (err) {
      console.error('[Pantry Submit Error]:', err);
      showToast(
        err.response?.data?.message || 'Failed to save pantry item. Please check inputs.',
        'error'
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
      fetchAllData(); // Refresh analytics
      showToast('Item deleted successfully!');
    } catch (err) {
      console.error('[Pantry Delete Error]:', err);
      showToast(err.response?.data?.message || 'Failed to delete pantry item.', 'error');
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pantry Inventory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pantry Management 🥬
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            Track ingredient stock levels, expiration dates, and freshness indicators in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            onClick={fetchAllData}
            className="p-3 text-slate-600"
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

      {/* Toast Notification */}
      <Toast 
        message={toastMessage} 
        type={toastType} 
        onClose={() => setToastMessage(null)} 
      />

      {/* Summary Stats Cards and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PantryStats stats={stats} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <InsightsCard insights={insights} isLoading={isLoading} />
        </div>
      </div>

      <LowStockSection reminderItems={expiryReminders} isLoading={isLoading} />

      {/* Main Content Area: Table / Grid */}
      {isLoading ? (
        <div className="glass-panel p-12 rounded-3xl space-y-4">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-slate-200 rounded-2xl w-1/3" />
            <div className="h-64 bg-slate-200 rounded-3xl w-full" />
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
