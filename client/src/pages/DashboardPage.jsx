import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  UtensilsCrossed,
  Activity,
  AlertTriangle,
  ClipboardList,
  Clock,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const DashboardPage = () => {
  const { user } = useAuth();

  const placeholderModules = [
    {
      id: 'pantry',
      title: 'Pantry Management',
      description: 'Track ingredient inventory, quantities, and freshness status in real-time.',
      icon: ShoppingBag,
      variant: 'emerald',
    },
    {
      id: 'meal-suggestions',
      title: 'Meal Suggestions',
      description: 'AI-generated recipe ideas dynamically created based on available pantry items.',
      icon: UtensilsCrossed,
      variant: 'sky',
    },
    {
      id: 'nutrition',
      title: 'Nutrition Analyzer',
      description: 'Comprehensive breakdown of calories, macros, and dietary metrics.',
      icon: Activity,
      variant: 'amber',
    },
    {
      id: 'expiry-tracker',
      title: 'Expiry Tracker',
      description: 'Smart alerts and notifications for ingredients nearing expiration dates.',
      icon: AlertTriangle,
      variant: 'purple',
    },
    {
      id: 'grocery-list',
      title: 'Grocery List',
      description: 'Automated shopping lists generated from missing meal plan ingredients.',
      icon: ClipboardList,
      variant: 'slate',
    },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Welcome Banner Header */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CookWise AI Smart Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="apple-gradient-text">{user?.name || 'Chef'}</span>! 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            Your AI Smart Kitchen foundation is ready. Modules are scheduled for subsequent building phases.
          </p>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Overview Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Kitchen Modules
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Day 1 Architecture Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.id}
                hoverEffect
                className="flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    {/* Strictly says "Coming Soon" per requirement */}
                    <Badge variant={module.variant}>
                      Coming Soon
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
                    <Clock className="w-3.5 h-3.5" />
                    <span>Module Locked</span>
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
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
