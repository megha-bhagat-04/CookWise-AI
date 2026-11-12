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
  onClick,
  ...props
}) => {
  const handleClick = (e) => {
    if (type === 'date') {
      try {
        e.currentTarget.showPicker?.();
      } catch {
        // Fallback: native date input still works where showPicker is unavailable
      }
    }
    onClick?.(e);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600 ml-0.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-2xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          onClick={handleClick}
          className={`w-full bg-slate-50/80 text-slate-900 placeholder-slate-400 border text-sm rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 ${
            Icon ? 'pl-10' : 'px-4'
          } py-3 ${
            type === 'date' ? 'cursor-pointer [color-scheme:light]' : ''
          } ${
            error
              ? 'border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-200/80'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 font-medium ml-1">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 ml-1">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
