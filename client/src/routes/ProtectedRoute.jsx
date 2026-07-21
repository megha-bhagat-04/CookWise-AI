import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl apple-gradient-bg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 animate-bounce">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Verifying Authentication...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
