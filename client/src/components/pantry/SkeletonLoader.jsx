import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-200 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-3 w-16 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full bg-slate-200 rounded"></div>
        <div className="h-3 w-4/5 bg-slate-200 rounded"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
        <div className="h-8 w-8 bg-slate-200 rounded"></div>
        <div className="h-8 w-8 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
