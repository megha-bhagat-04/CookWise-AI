import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Apple,
  Carrot,
  Milk,
  Wheat,
  Flame,
  Beef,
  Coffee,
  Package,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

// Helper to get category icon
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Vegetables':
      return Carrot;
    case 'Fruits':
      return Apple;
    case 'Dairy':
      return Milk;
    case 'Grains':
      return Wheat;
    case 'Spices':
      return Flame;
    case 'Meat':
      return Beef;
    case 'Drinks':
      return Coffee;
    default:
      return Package;
  }
};

// Calculate Days Remaining & Freshness Status
export const getExpiryStatus = (expiryDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(expiryDateStr);
  expDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'expired',
      days: diffDays,
      label: `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`,
      badgeVariant: 'danger',
      rowBg: 'bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/30',
      badgeClass: 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30',
      textClass: 'text-rose-600 dark:text-rose-400 font-bold',
      icon: AlertCircle,
    };
  }

  if (diffDays === 0) {
    return {
      status: 'expiring_soon',
      days: 0,
      label: 'Expires Today!',
      badgeVariant: 'warning',
      rowBg: 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30',
      badgeClass: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
      textClass: 'text-amber-600 dark:text-amber-400 font-bold',
      icon: AlertTriangle,
    };
  }

  if (diffDays <= 3) {
    return {
      status: 'expiring_soon',
      days: diffDays,
      label: `Expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
      badgeVariant: 'warning',
      rowBg: 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30',
      badgeClass: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
      textClass: 'text-amber-600 dark:text-amber-400 font-semibold',
      icon: Clock,
    };
  }

  return {
    status: 'safe',
    days: diffDays,
    label: `${diffDays} days remaining`,
    badgeVariant: 'success',
    rowBg: 'bg-emerald-500/5 dark:bg-emerald-950/10 border-slate-200/60 dark:border-slate-800',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400 font-medium',
    icon: CheckCircle,
  };
};

import { Clock } from 'lucide-react';

const PantryTable = ({ items = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Categories list
  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices', 'Meat', 'Drinks', 'Others'];

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by nearest expiry date
  const sortedItems = [...filteredItems].sort((a, b) => {
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-3xl">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 dark:bg-emerald-500'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Pantry Items Table / Cards */}
      {sortedItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No Pantry Items Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search query or category filter.'
                : 'Your pantry is currently empty. Click "Add Ingredient" to start tracking inventory!'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 glass-panel shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">Ingredient</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <span>Expiry Date</span>
                      <ArrowUpDown className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  </th>
                  <th className="py-4 px-6">Freshness Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50 text-sm">
                {sortedItems.map((item) => {
                  const CategoryIcon = getCategoryIcon(item.category);
                  const expiryInfo = getExpiryStatus(item.expiryDate);

                  return (
                    <tr
                      key={item._id}
                      className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/40 ${expiryInfo.rowBg}`}
                    >
                      {/* Ingredient Name */}
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center space-x-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                              <CategoryIcon className="w-5 h-5 text-emerald-500" />
                            </div>
                          )}
                          <span>{item.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <CategoryIcon className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{item.category}</span>
                        </span>
                      </td>

                      {/* Quantity & Unit */}
                      <td className="py-4 px-6 font-medium text-slate-800 dark:text-slate-200">
                        {item.quantity} <span className="text-slate-500 dark:text-slate-400 text-xs">{item.unit}</span>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-mono text-xs">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{formatDate(item.expiryDate)}</span>
                        </div>
                      </td>

                      {/* Status / Days Remaining */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs border ${expiryInfo.badgeClass}`}
                        >
                          <expiryInfo.icon className="w-3.5 h-3.5" />
                          <span>{expiryInfo.label}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="Edit Item"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item._id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Grid/Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {sortedItems.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              const expiryInfo = getExpiryStatus(item.expiryDate);

              return (
                <div
                  key={item._id}
                  className={`p-5 rounded-3xl border transition-all ${expiryInfo.rowBg} space-y-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-emerald-500" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {item.name}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item._id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Quantity</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Expiry Date</span>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(item.expiryDate)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span
                      className={`w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs border ${expiryInfo.badgeClass}`}
                    >
                      <expiryInfo.icon className="w-4 h-4" />
                      <span>{expiryInfo.label}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Pantry Item?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to remove this item from your pantry inventory?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PantryTable;
