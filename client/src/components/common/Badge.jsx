import React from 'react';

const Badge = ({
  children,
  variant = 'emerald',
  className = '',
}) => {
  const variants = {
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    sky: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    slate: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-md transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
