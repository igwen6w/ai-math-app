'use client';

import React, { useState } from 'react';
import { tts } from '@/lib/english/tts';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  autoPlay?: boolean;
  disabled?: boolean;
  className?: string;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

export default function AudioButton({
  text,
  size = 'md',
  variant = 'primary',
  autoPlay = false,
  disabled = false,
  className = '',
  onPlayStart,
  onPlayEnd,
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  // Variant configurations
  const variantClasses = {
    primary: 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg hover:shadow-xl',
    ghost: 'bg-white border-4 border-teal-400 text-teal-600 hover:bg-teal-50',
  };

  const handleClick = () => {
    if (disabled || isPlaying) return;

    setIsPlaying(true);
    onPlayStart?.();

    // Speak the text
    tts.speak(text, { rate: 0.9, pitch: 1.1 });

    // Reset playing state after estimated duration
    // Rough estimate: ~150ms per character
    const duration = Math.max(1000, text.length * 150);
    setTimeout(() => {
      setIsPlaying(false);
      onPlayEnd?.();
    }, duration);
  };

  React.useEffect(() => {
    if (autoPlay && !disabled) {
      handleClick();
    }
  }, [autoPlay]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isPlaying}
      className={`
        relative rounded-full
        flex items-center justify-center
        transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${!disabled && !isPlaying ? 'hover:scale-105 active:scale-95' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isPlaying ? 'scale-95' : ''}
        ${className}
      `}
      aria-label={`Play audio: ${text}`}
    >
      {/* Speaker icon */}
      <svg
        className={`w-1/2 h-1/2 ${isPlaying ? 'animate-pulse' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>

      {/* Playing indicator */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-full bg-white bg-opacity-20 animate-ping" />
      )}

      {/* Ripple effect on hover */}
      {!disabled && !isPlaying && (
        <div className="absolute inset-0 rounded-full border-2 border-current opacity-0 hover:opacity-100 hover:scale-110 transition-all duration-300" />
      )}
    </button>
  );
}

// Compact button for inline use
export function CompactAudioButton({ text, className = '' }: { text: string; className?: string }) {
  return (
    <AudioButton
      text={text}
      size="sm"
      variant="ghost"
      className={className}
    />
  );
}

// Play button with text label
export function PlayButton({
  text,
  label,
  className = '',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={() => tts.speak(text, { rate: 0.9, pitch: 1.1 })}
      className={`
        flex items-center gap-2 px-6 py-3
        bg-gradient-to-r from-teal-400 to-cyan-500
        text-white font-bold rounded-full
        shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        transition-all duration-200
        ${className}
      `}
    >
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clipRule="evenodd"
        />
      </svg>
      {label || 'Play'}
    </button>
  );
}
