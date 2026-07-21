import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card padding="p-10" hoverEffect={false} className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl apple-gradient-bg mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
          <ChefHat className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-5xl font-extrabold text-slate-300 dark:text-slate-700 tracking-widest">
            404
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full">
            <Button variant="primary" fullWidth size="md">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
