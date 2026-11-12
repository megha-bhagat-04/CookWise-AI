import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ClipboardList,
  Clock,
  CalendarDays,
  Activity,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PantryStats from '../components/pantry/PantryStats';
import pantryService from '../services/pantryService';
import { formatDisplayDate, getDaysRemaining } from '../utils/dateUtils';

const DashboardPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [itemsRes, statsRes, insightsRes] = await Promise.all([
        pantryService.getPantryItems(),
        pantryService.getPantryStats(),
        pantryService.getInsights(),
      ]);
      setItems(itemsRes.data || []);
      setStats(statsRes.data || null);
      setInsights(insightsRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const expiringItems = items
    .filter((item) => {
      const days = getDaysRemaining(item.expiryDate);
      return days >= 0 && days <= 3;
    })
    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    .slice(0, 5);

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt || b.purchaseDate || 0) - new Date(a.createdAt || a.purchaseDate || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in">

      {/* A. Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d5a43] tracking-tight">
          Welcome back, {user?.name || 'Chef'}
        </h1>
        <p className="text-sm text-slate-600">
          Here's what's happening in your kitchen today.
        </p>
      </div>

      {/* B. Hero Section */}
      <div className="rounded-3xl border border-[#2d5a43]/10 bg-gradient-to-r from-[#f7f5ee] via-[#eef5ef] to-[#f9f8f4] p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
        <div className="space-y-3 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d5a43] tracking-tight">
            Make the most of your pantry
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Track ingredients, reduce food waste, and discover smart AI recipes tailored to what you already have.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/pantry">
            <Button variant="primary" size="md" className="group">
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span>Manage Pantry</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Link to="/recipes">
            <Button variant="secondary" size="md" className="group">
              <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
              <span>Generate AI Recipes</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Banner with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-sm flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 transition-colors cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* C. Inventory Statistics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Inventory Statistics
          </h3>
          <button
            onClick={fetchDashboardData}
            title="Refresh Data"
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <PantryStats stats={stats} isLoading={isLoading} showCategories={false} />
      </div>

      {/* D + E: Expiry Alerts & Pantry Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* D. Expiry Alerts */}
        <Card className="p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Expiry Alerts</h3>
                <p className="text-xs text-slate-500">Ingredients approaching expiry</p>
              </div>
            </div>
            <Link to="/pantry" className="text-xs font-semibold text-emerald-700 hover:underline">
              View Pantry
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-2.5 pt-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-200/70 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : expiringItems.length > 0 ? (
            <div className="space-y-2">
              {expiringItems.map((item) => {
                const days = getDaysRemaining(item.expiryDate);
                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/15"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Expires {formatDisplayDate(item.expiryDate)}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-500/10 px-2 py-1 rounded-full whitespace-nowrap ml-3">
                      {days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'}`}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
              <p className="text-sm font-medium text-slate-700">No items expiring soon</p>
              <p className="text-xs text-slate-500">Your kitchen is in great shape.</p>
            </div>
          )}
        </Card>

        {/* E. Pantry Insights */}
        <Card className="p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pantry Insights</h3>
              <p className="text-xs text-slate-500">Based on your current inventory</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2.5 pt-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-slate-200/70 rounded animate-pulse w-full" />
              ))}
            </div>
          ) : insights.length > 0 ? (
            <ul className="space-y-2.5 text-sm text-slate-700">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center text-sm text-slate-500">
              Add ingredients to your pantry to see personalized insights.
            </div>
          )}
        </Card>
      </div>

      {/* F + G: Quick Access & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* F. Quick Access */}
        <Card className="p-6 rounded-2xl border border-slate-200/80 space-y-4 lg:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Quick Access</h3>
          </div>
          <div className="space-y-2">
            <Link
              to="/recipes"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 hover:bg-emerald-50/60 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-800">AI Recipe Recommendations</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </Link>
            <Link
              to="/grocery"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 hover:bg-emerald-50/60 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-slate-800">Grocery List</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </Link>
          </div>
        </Card>

        {/* G. Recent Pantry Activity */}
        <Card className="p-6 rounded-2xl border border-slate-200/80 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <CalendarDays className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Pantry Activity</h3>
                <p className="text-xs text-slate-500">Recently added ingredients</p>
              </div>
            </div>
            <Link to="/pantry" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-2.5 pt-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-200/70 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentItems.length > 0 ? (
            <div className="space-y-2">
              {recentItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.category} • {item.quantity} {item.unit}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap ml-3">
                    {formatDisplayDate(item.createdAt || item.purchaseDate)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-1">
              <ShoppingBag className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-sm font-medium text-slate-700">No pantry activity yet</p>
              <p className="text-xs text-slate-500">Add ingredients to start tracking your kitchen.</p>
            </div>
          )}
        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;
