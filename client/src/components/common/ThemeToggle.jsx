import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${className}`}
      aria-label="Toggle Dark Mode"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-500 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 transition-transform duration-500 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
