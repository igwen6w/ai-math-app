'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showStars?: boolean;
  stars?: number;
  maxStars?: number;
  color?: 'teal' | 'purple' | 'orange' | 'green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  total,
  showStars = false,
  stars = 0,
  maxStars = 3,
  color = 'teal',
  size = 'md',
  className = '',
  showLabel = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  // Color configurations
  const colorClasses = {
    teal: {
      bg: 'bg-teal-100',
      fill: 'bg-gradient-to-r from-teal-400 to-cyan-500',
      star: 'text-yellow-400',
    },
    purple: {
      bg: 'bg-purple-100',
      fill: 'bg-gradient-to-r from-purple-400 to-pink-500',
      star: 'text-yellow-400',
    },
    orange: {
      bg: 'bg-orange-100',
      fill: 'bg-gradient-to-r from-orange-400 to-red-500',
      star: 'text-yellow-400',
    },
    green: {
      bg: 'bg-green-100',
      fill: 'bg-gradient-to-r from-green-400 to-emerald-500',
      star: 'text-yellow-400',
    },
  };

  const colors = colorClasses[color];

  // Size configurations
  const sizeClasses = {
    sm: 'h-2 text-xs',
    md: 'h-4 text-sm',
    lg: 'h-6 text-base',
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar container */}
      <div className={`
        relative w-full rounded-full overflow-hidden
        ${colors.bg} ${sizeClasses[size]}
      `}>
        {/* Animated fill */}
        <div
          className={`
            absolute top-0 left-0 h-full
            transition-all duration-500 ease-out
            ${colors.fill}
            progress-animated
          `}
          style={{ width: `${percentage}%` }}
        />

        {/* Optional label overlay */}
        {showLabel && (
          <div className="
            absolute inset-0 flex items-center justify-center
            font-bold text-white mix-blend-multiply
            text-shadow-sm
          ">
            {current} / {total}
          </div>
        )}
      </div>

      {/* Stars display */}
      {showStars && (
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: maxStars }).map((_, index) => (
            <Star
              key={index}
              filled={index < stars}
              size={size}
              className={colors.star}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Star component
interface StarProps {
  filled: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Star({ filled, size = 'md', className = '' }: StarProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className} transition-all duration-200 ${
        filled ? 'opacity-100 scale-100' : 'opacity-30 scale-90'
      }`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

// Level indicator component
interface LevelIndicatorProps {
  level: number;
  total: number;
  className?: string;
}

export function LevelIndicator({ level, total, className = '' }: LevelIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-bold text-gray-700">Level {level}</span>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full transition-all duration-200
              ${index < level ? 'bg-teal-500 scale-110' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  );
}

// Score display component
interface ScoreDisplayProps {
  score: number;
  label?: string;
  icon?: string;
  className?: string;
}

export function ScoreDisplay({
  score,
  label = 'Score',
  icon = '⭐',
  className = '',
}: ScoreDisplayProps) {
  return (
    <div className={`
      flex items-center gap-2 px-4 py-2
      bg-gradient-to-r from-yellow-400 to-orange-500
      text-white font-bold rounded-full shadow-lg
      ${className}
    `}>
      <span className="text-2xl">{icon}</span>
      <span className="text-sm">{label}:</span>
      <span className="text-xl pop-in">{score}</span>
    </div>
  );
}
