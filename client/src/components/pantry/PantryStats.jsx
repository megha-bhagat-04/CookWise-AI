import React from 'react';
import { Package, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';

const PantryStats = ({ items = [] }) => {
  // Calculate summary numbers
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let totalItems = items.length;
  let expiredCount = 0;
  let expiringSoonCount = 0;
  let freshCount = 0;

  items.forEach((item) => {
    const expDate = new Date(item.expiryDate);
    expDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      expiredCount++;
    } else if (diffDays <= 3) {
      expiringSoonCount++;
    } else {
      freshCount++;
    }
  });

  const stats = [
    {
      title: 'Total Items',
      value: totalItems,
      icon: Package,
      gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
      iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      textColor: 'text-slate-900 dark:text-white',
    },
    {
      title: 'Expired Items',
      value: expiredCount,
      icon: AlertCircle,
      gradient: 'from-rose-500/10 to-red-500/10 border-rose-500/20',
      iconBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-400',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Expiring Soon',
      value: expiringSoonCount,
      icon: Clock,
      gradient: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
      iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Fresh Items',
      value: freshCount,
      icon: CheckCircle2,
      gradient: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20',
      iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={idx}
            hoverEffect
            className={`bg-gradient-to-br ${stat.gradient} flex items-center justify-between p-5 rounded-3xl border`}
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>
              <h3 className={`text-3xl font-extrabold ${stat.textColor}`}>
                {stat.value}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.iconBg}`}>
              <IconComponent className="w-6 h-6" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PantryStats;
