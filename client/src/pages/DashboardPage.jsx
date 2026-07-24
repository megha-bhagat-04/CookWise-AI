import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  UtensilsCrossed,
  Activity,
  AlertTriangle,
  ClipboardList,
  Clock,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import PantryStats from '../components/pantry/PantryStats';
import pantryService from '../services/pantryService';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pantryItems, setPantryItems] = useState([]);
  const [loadingPantry, setLoadingPantry] = useState(true);

  useEffect(() => {
    const loadPantry = async () => {
      try {
        const res = await pantryService.getPantryItems();
        setPantryItems(res.data || []);
      } catch (err) {
        console.error('Error fetching pantry stats for dashboard:', err);
      } finally {
        setLoadingPantry(false);
      }
    };
    loadPantry();
  }, []);

  const modules = [
    {
      id: 'pantry',
      title: 'Pantry Management',
      description: 'Track ingredient inventory, quantities, and freshness status in real-time.',
      icon: ShoppingBag,
      variant: 'emerald',
      status: 'Active',
      path: '/pantry',
      active: true,
    },
    {
      id: 'meal-suggestions',
      title: 'Meal Suggestions',
      description: 'AI-generated recipe ideas dynamically created based on available pantry items.',
      icon: UtensilsCrossed,
      variant: 'sky',
      status: 'Coming Soon',
      path: '#',
      active: false,
    },
    {
      id: 'nutrition',
      title: 'Nutrition Analyzer',
      description: 'Comprehensive breakdown of calories, macros, and dietary metrics.',
      icon: Activity,
      variant: 'amber',
      status: 'Coming Soon',
      path: '#',
      active: false,
    },
    {
      id: 'expiry-tracker',
      title: 'Expiry Tracker',
      description: 'Smart alerts and notifications for ingredients nearing expiration dates.',
      icon: AlertTriangle,
      variant: 'purple',
      status: 'Coming Soon',
      path: '#',
      active: false,
    },
    {
      id: 'grocery-list',
      title: 'Grocery List',
      description: 'Automated shopping lists generated from missing meal plan ingredients.',
      icon: ClipboardList,
      variant: 'slate',
      status: 'Coming Soon',
      path: '#',
      active: false,
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      
      {/* Welcome Banner Header */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CookWise AI Smart Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="apple-gradient-text">{user?.name || 'Chef'}</span>! 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Monitor your kitchen inventory freshness, track expiring ingredients, and stay organized.
          </p>
        </div>

        <Link
          to="/pantry"
          className="relative z-10 inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <span>Manage Pantry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Decorative background shape */}
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Pantry Overview Summary Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
            <span>Pantry Live Overview</span>
          </h2>
          <Link
            to="/pantry"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Ingredients</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingPantry ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-28 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <PantryStats items={pantryItems} />
        )}
      </div>

      {/* Kitchen Modules Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Kitchen Modules
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            System Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                hoverEffect
                onClick={() => module.active && navigate(module.path)}
                className={`flex flex-col justify-between space-y-6 relative overflow-hidden group cursor-pointer ${
                  module.active ? 'border-emerald-500/30 dark:border-emerald-500/20' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <Badge variant={module.active ? 'emerald' : module.variant}>
                      {module.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span className="flex items-center space-x-1">
                    {module.active ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Open Module
                      </span>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Module Locked</span>
                      </>
                    )}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      module.active
                        ? 'bg-emerald-500 text-white group-hover:bg-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
