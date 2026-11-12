import React from 'react';
import { Package, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';

const PantryStats = ({ stats, isLoading, showCategories = false }) => {
  if (isLoading || !stats) {
    return (
      <div className={`grid grid-cols-2 ${showCategories ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
        {[1, 2, 3, 4, ...(showCategories ? [5] : [])].map((i) => (
          <div key={i} className="h-24 bg-slate-200/70 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Items',
      value: stats.totalItems || 0,
      icon: Package,
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-100',
      valueColor: 'text-slate-900',
    },
    {
      title: 'Fresh Items',
      value: stats.freshItems || 0,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      valueColor: 'text-emerald-600',
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon || 0,
      icon: Clock,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      valueColor: 'text-amber-600',
    },
    {
      title: 'Expired Items',
      value: stats.expiredItems || 0,
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
      valueColor: 'text-rose-600',
    },
  ];

  if (showCategories && stats.categoriesUsed !== undefined) {
    cards.push({
      title: 'Categories',
      value: stats.categoriesUsed || 0,
      icon: Package,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-50',
      valueColor: 'text-sky-600',
    });
  }

  return (
    <div className={`grid grid-cols-2 ${showCategories ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4`}>
      {cards.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={idx}
            hoverEffect
            className="p-5 rounded-2xl border border-slate-200/80 flex items-center justify-between transition-all"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.title}
              </p>
              <h3 className={`text-2xl sm:text-3xl font-extrabold ${stat.valueColor}`}>
                {stat.value}
              </h3>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}>
              <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PantryStats;
