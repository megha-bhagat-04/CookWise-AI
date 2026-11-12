import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ChefHat, Menu, X, LogOut, LayoutDashboard, User, ShoppingBag, UtensilsCrossed, ClipboardList } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200/60 transition-colors duration-300">
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
            <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              CookWise <span className="apple-gradient-text font-black">AI</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 -mt-1">
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
                    ? 'text-emerald-600 font-semibold bg-emerald-50/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Home
              </Link>
              <a
                href="#features"
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#benefits"
                className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                About
              </a>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  isActive('/dashboard')
                    ? 'text-emerald-600 font-semibold bg-emerald-50/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/pantry"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  isActive('/pantry')
                    ? 'text-emerald-600 font-semibold bg-emerald-50/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                <span>Pantry</span>
              </Link>
              <Link
                to="/recipes"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  isActive('/recipes')
                    ? 'text-emerald-600 font-semibold bg-emerald-50/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-sky-500" />
                <span>AI Recipes</span>
              </Link>
              <Link
                to="/grocery"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  isActive('/grocery')
                    ? 'text-emerald-600 font-semibold bg-emerald-50/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardList className="w-4 h-4 text-amber-500" />
                <span>Grocery List</span>
              </Link>
            </>
          )}
        </nav>

        {/* Action Controls & Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
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
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/50">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                  {user?.name || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-[#f9f8f4]/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Home
                </Link>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  How it Works
                </a>
                <a
                  href="#benefits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  About
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/pantry"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  <span>Pantry Management</span>
                </Link>
                <Link
                  to="/recipes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                >
                  <UtensilsCrossed className="w-5 h-5 text-sky-500" />
                  <span>AI Recipes</span>
                </Link>
                <Link
                  to="/grocery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                >
                  <ClipboardList className="w-5 h-5 text-amber-500" />
                  <span>Grocery List</span>
                </Link>
              </>
            )}
          </nav>

          <div className="pt-4 border-t border-slate-200 flex flex-col space-y-3">
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
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
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
