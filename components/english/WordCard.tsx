'use client';

import React from 'react';
import { Word } from '@/lib/english/vocabulary';
import { tts } from '@/lib/english/tts';

interface WordCardProps {
  word: Word;
  isFlipped?: boolean;
  isMatched?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  showTranslation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export default function WordCard({
  word,
  isFlipped = false,
  isMatched = false,
  isSelected = false,
  onClick,
  showTranslation = false,
  size = 'md',
  disabled = false,
  className = '',
}: WordCardProps) {
  // Size configurations
  const sizeClasses = {
    sm: 'w-24 h-32 text-2xl',
    md: 'w-32 h-40 text-4xl',
    lg: 'w-40 h-48 text-5xl',
  };

  const emojiSizeClasses = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl',
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();

      // Speak the word when card is clicked/flipped
      if (isFlipped || !onClick) {
        tts.speak(word.word, { rate: 0.9, pitch: 1.1 });
      }
    }
  }

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking audio button
    tts.speak(word.word, { rate: 0.9, pitch: 1.1 });
  }

  return (
    <div
      className={`
        relative cursor-pointer select-none
        transform transition-all duration-500
        ${sizeClasses[size]}
        ${onClick && !disabled ? 'hover:scale-105' : ''}
        ${isMatched ? 'opacity-50 scale-95' : ''}
        ${isSelected ? 'ring-4 ring-yellow-400' : ''}
        ${disabled ? 'cursor-not-allowed opacity-60' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Card flip container */}
      <div
        className={`
          relative w-full h-full
          transform-style-3d
          transition-transform duration-500
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Card Back */}
        <div
          className={`
            absolute w-full h-full backface-hidden
            rounded-3xl shadow-lg
            bg-gradient-to-br from-teal-400 to-cyan-500
            flex items-center justify-center
            ${!isFlipped ? 'z-10' : ''}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Decorative pattern on back */}
          <div className="text-white text-6xl opacity-30">
            ?
          </div>
        </div>

        {/* Card Front */}
        <div
          className={`
            absolute w-full h-full backface-hidden
            rounded-3xl shadow-lg
            bg-white border-4 border-teal-400
            flex flex-col items-center justify-center
            p-4
            ${isFlipped ? 'z-10' : ''}
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Emoji */}
          <div className={`${emojiSizeClasses[size]} mb-2`}>
            {word.emoji}
          </div>

          {/* English Word */}
          <div className="text-gray-800 font-bold text-center text-sm sm:text-base">
            {word.word}
          </div>

          {/* Translation (optional) */}
          {showTranslation && (
            <div className="text-gray-500 text-xs mt-1">
              {word.translations.zh}
            </div>
          )}

          {/* Audio Button */}
          <button
            onClick={handleAudioClick}
            className="absolute top-2 right-2 w-8 h-8 rounded-full
              bg-teal-500 hover:bg-teal-600 text-white
              flex items-center justify-center
              transition-colors duration-200
              active:scale-95"
            aria-label={`Play pronunciation of ${word.word}`}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Matched indicator */}
          {isMatched && (
            <div className="absolute inset-0 rounded-3xl bg-green-500 bg-opacity-20 flex items-center justify-center">
              <div className="text-green-600 text-4xl">✓</div>
            </div>
          )}
        </div>
      </div>

      {/* Shine effect overlay */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="shine-effect absolute inset-0 rounded-3xl" />
      </div>
    </div>
  );
}

// Small variant for compact displays
export function SmallWordCard(props: WordCardProps) {
  return <WordCard {...props} size="sm" />;
}

// Large variant for emphasis
export function LargeWordCard(props: WordCardProps) {
  return <WordCard {...props} size="lg" />;
}
