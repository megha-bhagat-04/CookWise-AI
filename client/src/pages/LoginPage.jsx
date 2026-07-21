import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, ChefHat, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateLoginForm } from '../utils/validators';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center justify-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl apple-gradient-bg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your CookWise AI dashboard
          </p>
        </div>

        {/* Form Card */}
        <Card padding="p-8" hoverEffect={false}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {sessionExpired && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Your session has expired. Please log in again.</span>
              </div>
            )}

            {serverError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Email Field */}
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            {/* Password Field */}
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          {/* Card Footer Link */}
          <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default LoginPage;
