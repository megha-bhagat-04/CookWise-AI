import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'expiry-asc', label: 'Expiry Date (Nearest First)' },
  { value: 'expiry-desc', label: 'Expiry Date (Latest First)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'recent', label: 'Recently Added' },
];

const SortDropdown = ({ selectedSort, onSortChange }) => {
  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 transition-colors">
        <div className="pl-3 py-2 flex items-center pointer-events-none text-slate-400">
          <ArrowUpDown className="h-4 w-4" />
        </div>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="block w-full pl-2 pr-8 py-2 bg-transparent text-slate-900 border-none focus:outline-none focus:ring-0 sm:text-sm appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* Custom arrow for select */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;
