import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 ml-0.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-2xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-slate-50/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border text-sm rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 ${
            Icon ? 'pl-10' : 'px-4'
          } py-3 ${
            error
              ? 'border-rose-500 focus:ring-rose-500/30 dark:border-rose-500'
              : 'border-slate-200/80 dark:border-slate-800'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 dark:text-rose-400 font-medium ml-1">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
