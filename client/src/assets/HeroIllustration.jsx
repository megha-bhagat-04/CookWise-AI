import React from 'react';

const HeroIllustration = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center ${className}`}>
      {/* Background Decorative Glow Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl subtle-pulse" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl subtle-pulse" style={{ animationDelay: '2s' }} />

      {/* Embedded SVG Illustration */}
      <svg
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="primaryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="aiPulse" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Central Platform Plate */}
        <ellipse cx="300" cy="460" rx="220" ry="40" fill="url(#primaryGlow)" opacity="0.15" />
        <ellipse cx="300" cy="450" rx="190" ry="30" fill="#e2e8f0" opacity="0.4" />

        {/* Main Cooking Bowl / Smart Station */}
        <path
          d="M 170 300 Q 180 430 300 430 Q 420 430 430 300 Z"
          fill="url(#primaryGlow)"
          opacity="0.95"
          filter="url(#shadow)"
        />
        <ellipse cx="300" cy="300" rx="130" ry="25" fill="#0f766e" />
        <ellipse cx="300" cy="300" rx="120" ry="20" fill="#14b8a6" />

        {/* Floating Culinary Ingredients & Icons */}
        {/* Avocado / Healthy Food */}
        <g transform="translate(140, 180) rotate(-10)">
          <rect width="80" height="80" rx="24" fill="#ffffff" opacity="0.9" filter="url(#shadow)" />
          <circle cx="40" cy="40" r="22" fill="#10b981" />
          <circle cx="40" cy="45" r="10" fill="#78350f" />
        </g>

        {/* Floating AI Recipe Card */}
        <g transform="translate(360, 140) rotate(8)">
          <rect width="130" height="90" rx="20" fill="#ffffff" opacity="0.9" filter="url(#shadow)" />
          <rect x="15" y="18" width="50" height="8" rx="4" fill="#10b981" />
          <rect x="15" y="34" width="90" height="6" rx="3" fill="#cbd5e1" />
          <rect x="15" y="46" width="70" height="6" rx="3" fill="#e2e8f0" />
          <circle cx="100" cy="68" r="14" fill="#06b6d4" />
          <path d="M 96 68 L 99 71 L 105 65" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* AI Sparkles & Energy Rays */}
        <g opacity="0.9">
          {/* Sparkle 1 */}
          <path d="M 300 160 Q 300 200 340 200 Q 300 200 300 240 Q 300 200 260 200 Q 300 200 300 160 Z" fill="url(#aiPulse)" />
          {/* Sparkle 2 */}
          <path d="M 230 130 Q 230 150 250 150 Q 230 150 230 170 Q 230 150 210 150 Q 230 150 230 130 Z" fill="#38bdf8" />
          {/* Sparkle 3 */}
          <path d="M 390 260 Q 390 275 405 275 Q 390 275 390 290 Q 390 275 375 275 Q 390 275 390 260 Z" fill="#f59e0b" />
        </g>

        {/* Steam Waves */}
        <path d="M 270 270 Q 260 230 280 200 Q 290 180 275 150" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        <path d="M 310 270 Q 330 230 310 200 Q 300 180 320 150" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M 345 280 Q 355 250 340 220" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </svg>
    </div>
  );
};

export default HeroIllustration;
