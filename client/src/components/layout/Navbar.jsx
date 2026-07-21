import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ChefHat, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl apple-gradient-bg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              CookWise <span className="apple-gradient-text font-black">AI</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 -mt-1">
              Smart Kitchen
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/60 dark:bg-emerald-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Home
              </Link>
              <a
                href="#features"
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a
                href="#benefits"
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                About
              </a>
            </>
          ) : (
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                isActive('/dashboard')
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/60 dark:bg-emerald-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Action Controls & Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" size="md">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {user?.name || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  Home
                </Link>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  How it Works
                </a>
                <a
                  href="#benefits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  About
                </a>
              </>
            ) : (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center space-x-2"
              >
                <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth size="lg">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth size="lg">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="danger"
                  fullWidth
                  size="lg"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
