import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  Clock,
  ChevronRight,
  ChefHat,
  Utensils,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import HeroIllustration from '../assets/HeroIllustration';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500/20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Soft Background Radial Blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text Content */}
            <div className="space-y-8 text-center lg:text-left z-10">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>AI-Powered Culinary Revolution</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  CookWise <span className="apple-gradient-text">AI</span>
                </h1>
                <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-medium">
                  Smart meal planning powered by AI.
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Transform your kitchen experience with intelligent inventory tracking, zero-waste recipe recommendations, and automated nutritional analysis tailored to your lifestyle.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" fullWidth className="group">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" fullWidth>
                    Login
                  </Button>
                </Link>
              </div>

              {/* Feature Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Smart Meal Planning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Food Waste</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant Recipe Engine</span>
                </div>
              </div>
            </div>

            {/* Custom SVG Hero Illustration */}
            <div className="relative flex items-center justify-center">
              <HeroIllustration />
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge variant="sky">Core Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed for modern kitchens
            </h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400">
              CookWise AI integrates cutting-edge machine learning to streamline every aspect of your culinary routine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Pantry Intelligence
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Log ingredients instantly and monitor real-time freshness levels to cook what you already have.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Recipe Suggestions
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Receive personalized step-by-step recipes dynamically tailored to your taste and available ingredients.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Smart Expiry Tracker
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Automated reminders alert you before ingredients expire, saving money and reducing waste.
              </p>
            </Card>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <Badge variant="amber">Simple Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How CookWise AI Works
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Three effortless steps to transform your cooking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="glass-panel rounded-3xl p-8 space-y-4 relative">
              <div className="w-10 h-10 rounded-full apple-gradient-bg text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Add Your Ingredients
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Input items into your virtual pantry or sync your grocery receipts automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel rounded-3xl p-8 space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-cyan-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Get AI Suggestions
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Our AI analyzes ingredient combinations to curate optimal, healthy meal ideas instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel rounded-3xl p-8 space-y-4 relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cook & Enjoy
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Follow simple, guided instructions with full nutritional and calorie breakdowns.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <Badge variant="purple">Value Proposition</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Save time, reduce waste, eat healthier.
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                CookWise AI is engineered to bring clarity to daily decision-making in the kitchen, helping households cut down on food waste while maintaining a balanced diet.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-1">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Sustainable Living</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Dramatically decrease wasted produce and unused groceries.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mt-1">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Effortless Prep</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Stop asking "what's for dinner?" with instant tailored suggestions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-1">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Nutritional Balance</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Monitor macronutrients and health metrics with intelligent analytics.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner CTA Box */}
            <div className="glass-panel rounded-3xl p-10 space-y-6 text-center lg:text-left border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Ready to upgrade your kitchen?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Join CookWise AI today and start organizing your pantry with smart intelligence.
              </p>
              <div className="pt-2">
                <Link to="/register">
                  <Button variant="primary" size="lg" fullWidth>
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
