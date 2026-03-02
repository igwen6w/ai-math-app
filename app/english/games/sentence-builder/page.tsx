'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SentenceBuilderGame() {
  const [gameStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      {/* Back button */}
      <Link
        href="/english"
        className="
          inline-flex items-center gap-2 px-4 py-2 mb-6
          bg-white text-gray-700 font-semibold rounded-full
          shadow-md hover:shadow-lg
          transform hover:scale-105 active:scale-95
          transition-all duration-200
        "
      >
        <span>←</span>
        <span>Back</span>
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
          <div className="text-8xl mb-6">📝</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Sentence Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build sentences by putting words in the right order!
          </p>

          <div className="bg-green-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="font-bold text-gray-700 mb-3">Coming Soon!</h3>
            <p className="text-gray-600">
              This game will help children learn to build simple English sentences by arranging word cards in the correct order.
            </p>
            <div className="mt-4 text-left text-sm text-gray-500">
              <p>Features:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Drag and drop word cards</li>
                <li>Audio pronunciation</li>
                <li>Visual feedback</li>
                <li>Progressive difficulty</li>
              </ul>
            </div>
          </div>

          <Link
            href="/english"
            className="
              inline-block px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500
              text-white text-xl font-bold rounded-full
              shadow-lg hover:shadow-xl
              transform hover:scale-105 active:scale-95
              transition-all duration-200
            "
          >
            Back to Games 🎮
          </Link>
        </div>
      </div>
    </div>
  );
}
