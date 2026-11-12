import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import Card from '../common/Card';
import { formatDisplayDate, getDaysRemaining } from '../../utils/dateUtils';

const LowStockSection = ({ reminderItems = [], isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6 rounded-3xl border border-slate-200 animate-pulse">
        <div className="h-6 w-52 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (reminderItems.length === 0) return null;

  return (
    <Card className="bg-amber-50/70 border-amber-200 p-6 rounded-3xl">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <div>
          <h3 className="text-lg font-bold text-amber-900">Expiry Reminders</h3>
          <p className="text-xs text-amber-700/80">Items expiring in 1 day or less</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {reminderItems.map((item) => {
          const days = getDaysRemaining(item.expiryDate);
          const urgent = days === 0;
          return (
            <div
              key={item._id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex items-center justify-between transition-transform hover:-translate-y-1"
            >
              <div className="min-w-0 pr-3">
                <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                <p className="text-xs text-slate-500">{item.category}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {formatDisplayDate(item.expiryDate)}
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className={`inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
                  urgent
                    ? 'text-rose-700 bg-rose-100'
                    : 'text-amber-700 bg-amber-100'
                }`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {urgent ? 'Today' : '1 day'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default LowStockSection;
