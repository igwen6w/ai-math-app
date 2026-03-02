'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/english/storage';

interface Game {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  icon: string;
  ageRange: string;
  difficulty: 1 | 2 | 3;
  route: string;
  color: string;
}

const games: Game[] = [
  {
    id: 'card-matching',
    title: 'Card Matching',
    titleZh: '卡片配对',
    description: 'Match English words with pictures',
    icon: '🎴',
    ageRange: '2-5岁',
    difficulty: 1,
    route: '/english/games/card-matching',
    color: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'word-spelling',
    title: 'Word Spelling',
    titleZh: '单词拼写',
    description: 'Learn to spell English words',
    icon: '✏️',
    ageRange: '3-6岁',
    difficulty: 2,
    route: '/english/games/word-spelling',
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'listen-choose',
    title: 'Listen & Choose',
    titleZh: '听音选图',
    description: 'Listen and choose the right picture',
    icon: '👂',
    ageRange: '3-6岁',
    difficulty: 1,
    route: '/english/games/listen-choose',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    titleZh: '句子构建',
    description: 'Build sentences with words',
    icon: '📝',
    ageRange: '4-6岁',
    difficulty: 3,
    route: '/english/games/sentence-builder',
    color: 'from-green-400 to-emerald-500',
  },
];

const difficultyColors = {
  1: 'bg-green-500',
  2: 'bg-blue-500',
  3: 'bg-purple-500',
};

export default function EnglishHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStars: 0,
    totalPoints: 0,
    gamesPlayed: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load statistics
    const statistics = storage.getStatistics();
    setStats({
      totalStars: statistics.totalStars,
      totalPoints: statistics.totalPoints,
      gamesPlayed: statistics.gamesPlayed,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl animate-float-slow opacity-20">
          🎨
        </div>
        <div className="absolute top-40 right-20 text-5xl animate-float-medium opacity-20 delay-300">
          📚
        </div>
        <div className="absolute bottom-40 left-20 text-6xl animate-float-fast opacity-20 delay-500">
          ✏️
        </div>
        <div className="absolute bottom-20 right-10 text-5xl animate-float-slow opacity-20 delay-700">
          🎯
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 pop-in">
            🌟 English Learning Games
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Fun English games for kids!
          </p>
        </header>

        {/* Stats Cards */}
        {mounted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Stars */}
            <div className="bg-white rounded-3xl p-6 shadow-lg modern-card pop-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Stars</p>
                  <p className="text-4xl font-bold text-yellow-500">{stats.totalStars}</p>
                </div>
                <div className="text-5xl">⭐</div>
              </div>
            </div>

            {/* Total Points */}
            <div className="bg-white rounded-3xl p-6 shadow-lg modern-card pop-in delay-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Points</p>
                  <p className="text-4xl font-bold text-teal-500">{stats.totalPoints}</p>
                </div>
                <div className="text-5xl">🏆</div>
              </div>
            </div>

            {/* Games Played */}
            <div className="bg-white rounded-3xl p-6 shadow-lg modern-card pop-in delay-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Games Played</p>
                  <p className="text-4xl font-bold text-purple-500">{stats.gamesPlayed}</p>
                </div>
                <div className="text-5xl">🎮</div>
              </div>
            </div>
          </div>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {games.map((game, index) => (
            <Link
              key={game.id}
              href={game.route}
              className={`
                group relative bg-white rounded-3xl p-8 shadow-lg
                transform transition-all duration-300
                hover:scale-105 hover:shadow-2xl
                modern-card pop-in
              `}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient accent */}
              <div className={`
                absolute top-0 left-0 right-0 h-2 rounded-t-3xl
                bg-gradient-to-r ${game.color}
              `} />

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="text-6xl mb-4 animate-bounce-subtle">
                  {game.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {game.title}
                  <span className="block text-lg text-gray-500 mt-1">
                    {game.titleZh}
                  </span>
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4">
                  {game.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm">
                  {/* Age range */}
                  <div className="flex items-center gap-1 text-gray-500">
                    <span>👶</span>
                    <span>{game.ageRange}</span>
                  </div>

                  {/* Difficulty */}
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Difficulty:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`
                            w-4 h-4 rounded-full
                            ${level <= game.difficulty
                              ? difficultyColors[game.difficulty as keyof typeof difficultyColors]
                              : 'bg-gray-300'
                            }
                          `}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Play button */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-teal-600 font-bold group-hover:translate-x-2 transition-transform">
                    Play Now →
                  </span>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div className="shine-effect" />
              </div>
            </Link>
          ))}
        </div>

        {/* Back to home */}
        <div className="text-center">
          <Link
            href="/"
            className="
              inline-flex items-center gap-2 px-8 py-4
              bg-white text-gray-700 font-bold rounded-full
              shadow-lg hover:shadow-xl
              transform hover:scale-105 active:scale-95
              transition-all duration-200
            "
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Made with ❤️ for young learners</p>
        </footer>
      </div>
    </div>
  );
}
