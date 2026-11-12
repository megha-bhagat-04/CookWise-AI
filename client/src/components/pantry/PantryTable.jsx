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
const getRowExpiryInfo = (expiryDateStr) => {
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
      rowBg: 'bg-rose-500/10 border-rose-500/30',
      badgeClass: 'bg-rose-500/20 text-rose-700 border-rose-500/30',
      textClass: 'text-rose-600 font-bold',
      icon: AlertCircle,
    };
  }

  if (diffDays === 0) {
    return {
      status: 'expiring_soon',
      days: 0,
      label: 'Expires Today!',
      badgeVariant: 'warning',
      rowBg: 'bg-amber-500/10 border-amber-500/30',
      badgeClass: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
      textClass: 'text-amber-600 font-bold',
      icon: AlertTriangle,
    };
  }

  if (diffDays <= 3) {
    return {
      status: 'expiring_soon',
      days: diffDays,
      label: `Expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
      badgeVariant: 'warning',
      rowBg: 'bg-amber-500/10 border-amber-500/30',
      badgeClass: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
      textClass: 'text-amber-600 font-semibold',
      icon: Clock,
    };
  }

  return {
    status: 'safe',
    days: diffDays,
    label: `${diffDays} days remaining`,
    badgeVariant: 'success',
    rowBg: 'bg-emerald-500/5 border-slate-200/60',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/20',
    textClass: 'text-emerald-600 font-medium',
    icon: CheckCircle,
  };
};

import { Clock } from 'lucide-react';

import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import SortDropdown from './SortDropdown';
import ExpiryBadge from './ExpiryBadge';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { formatDisplayDate } from '../../utils/dateUtils';

const PantryTable = ({ items = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('expiry-asc');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (selectedSort) {
      case 'expiry-desc':
        return new Date(b.expiryDate) - new Date(a.expiryDate);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'recent':
        return new Date(b.createdAt || b.purchaseDate) - new Date(a.createdAt || a.purchaseDate);
      case 'expiry-asc':
      default:
        return new Date(a.expiryDate) - new Date(b.expiryDate);
    }
  });

  const formatDate = (dateStr) => {
    return formatDisplayDate(dateStr);
  };

  const itemToDelete = deleteConfirmId ? items.find(i => i._id === deleteConfirmId) : null;

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      setIsDeleting(true);
      await onDelete(deleteConfirmId);
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar: Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-3xl z-10 relative">
        <div className="w-full md:w-auto flex-1">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          <SortDropdown selectedSort={selectedSort} onSortChange={setSelectedSort} />
        </div>
      </div>

      {/* Main Pantry Items Table / Cards */}
      {sortedItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              No Pantry Items Found
            </h3>
            <p className="text-xs text-slate-500">
              {searchTerm || selectedCategory !== 'All'
                ? 'Try adjusting your search query or category filter.'
                : 'Your pantry is currently empty. Click "Add Ingredient" to start tracking inventory!'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200/80 glass-panel shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/50 text-xs uppercase font-bold tracking-wider text-slate-500">
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
              <tbody className="divide-y divide-slate-200/50 text-sm">
                {sortedItems.map((item) => {
                  const CategoryIcon = getCategoryIcon(item.category);
                  const expiryInfo = getRowExpiryInfo(item.expiryDate);

                  return (
                    <tr
                      key={item._id}
                      className={`transition-colors hover:bg-slate-50/80 ${expiryInfo.rowBg}`}
                    >
                      {/* Ingredient Name */}
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div className="flex items-center space-x-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                              <CategoryIcon className="w-5 h-5 text-emerald-500" />
                            </div>
                          )}
                          <span>{item.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          <CategoryIcon className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{item.category}</span>
                        </span>
                      </td>

                      {/* Quantity & Unit */}
                      <td className="py-4 px-6 font-medium text-slate-800">
                        <span>{item.quantity} <span className="text-slate-500 text-xs">{item.unit}</span></span>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{formatDate(item.expiryDate)}</span>
                        </div>
                      </td>

                      {/* Status / Days Remaining */}
                      <td className="py-4 px-6">
                        <ExpiryBadge expiryDate={item.expiryDate} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Edit Item"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item._id)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
              const expiryInfo = getRowExpiryInfo(item.expiryDate);

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
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-emerald-500" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          {item.name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item._id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/50">
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Quantity</span>
                      <p className="font-bold text-slate-800 text-sm">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Expiry Date</span>
                      <p className="font-medium text-slate-700">
                        {formatDate(item.expiryDate)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <ExpiryBadge expiryDate={item.expiryDate} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal 
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name || 'this item'}
        isDeleting={isDeleting}
      />

    </div>
  );
};

export default PantryTable;
