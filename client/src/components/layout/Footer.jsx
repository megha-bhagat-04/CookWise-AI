import React from 'react';
import { ChefHat, Heart, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#f4f2ec]/80 border-t border-slate-200/60 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl apple-gradient-bg flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                CookWise <span className="apple-gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              Elevating daily cooking with artificial intelligence. Plan meals, minimize food waste, and enjoy effortless cooking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-emerald-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-emerald-600 transition-colors">
                  Benefits
                </a>
              </li>
            </ul>
          </div>

          {/* Authentication */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/login" className="hover:text-emerald-600 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-600 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-600 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              MCA Major Project
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Built with MERN Stack (MongoDB, Express, React, Node.js) & Tailwind CSS.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Day 1 Foundation Active</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CookWise AI. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for MCA Major Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
