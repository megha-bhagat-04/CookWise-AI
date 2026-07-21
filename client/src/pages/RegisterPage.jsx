import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ChefHat, AlertCircle, Check } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateRegisterForm } from '../utils/validators';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
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
            Create Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Start your AI smart kitchen journey today
          </p>
        </div>

        {/* Form Card */}
        <Card padding="p-8" hoverEffect={false}>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {serverError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Name Field */}
            <Input
              id="name"
              type="text"
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

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
              placeholder="Min. 8 characters"
              helperText="Must be at least 8 characters long"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            {/* Confirm Password Field */}
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </form>

          {/* Card Footer Link */}
          <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default RegisterPage;
