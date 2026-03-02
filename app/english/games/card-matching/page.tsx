'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WordCard from '@/components/english/WordCard';
import { storage, updateLevelProgress } from '@/lib/english/storage';
import { getWordsForGame, WordCategory } from '@/lib/english/vocabulary';
import { tts } from '@/lib/english/tts';

interface Card {
  id: string;
  wordId: string;
  type: 'emoji' | 'word';
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameConfig {
  pairs: number;
  categories?: WordCategory[];
}

export default function CardMatchingGame() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [stars, setStars] = useState(0);

  // Game configuration
  const config: GameConfig = {
    pairs: 6, // 6 pairs = 12 cards
    categories: undefined, // Random from all categories
  };

  // Initialize game
  const initGame = useCallback(() => {
    // Get random words
    const words = getWordsForGame(config.pairs, config.categories);

    // Create card pairs (emoji + word for each word)
    const cardPairs: Card[] = [];
    words.forEach((word, index) => {
      // Emoji card
      cardPairs.push({
        id: `${word.id}-emoji`,
        wordId: word.id,
        type: 'emoji',
        content: word.emoji,
        isFlipped: false,
        isMatched: false,
      });
      // Word card
      cardPairs.push({
        id: `${word.id}-word`,
        wordId: word.id,
        type: 'word',
        content: word.word,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffled = cardPairs
      .map((card) => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ card }) => card);

    setCards(shuffled);
    setMoves(0);
    setMatches(0);
    setFlippedCards([]);
    setIsProcessing(false);
    setGameCompleted(false);
    setStars(0);
  }, [config]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Handle card click
  const handleCardClick = useCallback((index: number) => {
    if (isProcessing) return;
    if (flippedCards.length >= 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    // Flip the card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    // Speak the word
    if (newCards[index].type === 'word') {
      tts.speak(newCards[index].content, { rate: 0.9, pitch: 1.1 });
    }

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);

      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.wordId === secondCard.wordId) {
        // Match found!
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setIsProcessing(false);
          setMatches(matches + 1);

          // Play success sound effect (speak "good job!")
          tts.speak('Good job!', { rate: 1, pitch: 1.2 });

          // Check if game is complete
          if (matches + 1 === config.pairs) {
            handleGameComplete(moves + 1);
          }
        }, 500);
      } else {
        // No match - flip back
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setIsProcessing(false);

          // Play try again sound
          tts.speak('Try again!', { rate: 0.9, pitch: 1.1 });
        }, 1000);
      }
    }
  }, [cards, flippedCards, isProcessing, moves, matches, config.pairs]);

  // Handle game completion
  const handleGameComplete = useCallback((finalMoves: number) => {
    setGameCompleted(true);

    // Calculate stars based on moves
    // Perfect: pairs * 1 move, Good: pairs * 1.5, OK: pairs * 2
    const perfectMoves = config.pairs;
    let earnedStars = 1;

    if (finalMoves <= perfectMoves) {
      earnedStars = 3; // Perfect
    } else if (finalMoves <= perfectMoves * 1.5) {
      earnedStars = 2; // Good
    }

    setStars(earnedStars);

    // Save progress
    updateLevelProgress('card-matching', 'level-1', earnedStars, config.pairs * 10 - finalMoves);

    // Speak celebration
    setTimeout(() => {
      if (earnedStars === 3) {
        tts.speak('Amazing! Three stars!', { rate: 1, pitch: 1.3 });
      } else if (earnedStars === 2) {
        tts.speak('Great job! Two stars!', { rate: 1, pitch: 1.2 });
      } else {
        tts.speak('Good job! One star!', { rate: 1, pitch: 1.1 });
      }
    }, 500);
  }, [config.pairs]);

  // Start game
  const handleStart = () => {
    setGameStarted(true);
    tts.speak('Let\'s play! Match the words with pictures.', { rate: 0.9, pitch: 1.1 });
  };

  // Play again
  const handlePlayAgain = () => {
    initGame();
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
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

      {/* Game container */}
      <div className="max-w-4xl mx-auto">
        {!gameStarted ? (
          /* Welcome screen */
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center pop-in">
            <div className="text-8xl mb-6">🎴</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Card Matching Game
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Match English words with their pictures!
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              <div className="bg-green-100 rounded-2xl p-4">
                <div className="text-3xl mb-2">⭐⭐⭐</div>
                <div className="text-sm text-gray-600">Perfect</div>
              </div>
              <div className="bg-blue-100 rounded-2xl p-4">
                <div className="text-3xl mb-2">⭐⭐</div>
                <div className="text-sm text-gray-600">Good</div>
              </div>
              <div className="bg-yellow-100 rounded-2xl p-4">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-sm text-gray-600">OK</div>
              </div>
            </div>
            <button
              onClick={handleStart}
              className="
                px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-500
                text-white text-xl font-bold rounded-full
                shadow-lg hover:shadow-xl
                transform hover:scale-105 active:scale-95
                transition-all duration-200
              "
            >
              Start Game 🎮
            </button>
          </div>
        ) : gameCompleted ? (
          /* Completion screen */
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center pop-in">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h1>

            {/* Stars */}
            <div className="flex justify-center gap-4 mb-6">
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  className={`
                    text-6xl transition-all duration-300
                    ${star <= stars ? 'opacity-100 scale-110' : 'opacity-30 scale-90'}
                  `}
                >
                  ⭐
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
              <div className="bg-teal-100 rounded-2xl p-4">
                <div className="text-3xl font-bold text-teal-600">{moves}</div>
                <div className="text-sm text-gray-600">Moves</div>
              </div>
              <div className="bg-purple-100 rounded-2xl p-4">
                <div className="text-3xl font-bold text-purple-600">{config.pairs}</div>
                <div className="text-sm text-gray-600">Pairs</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayAgain}
                className="
                  px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-500
                  text-white font-bold rounded-full
                  shadow-lg hover:shadow-xl
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200
                "
              >
                Play Again 🔄
              </button>
              <Link
                href="/english"
                className="
                  px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-full
                  shadow-md hover:shadow-lg
                  transform hover:scale-105 active:scale-95
                  transition-all duration-200
                "
              >
                More Games 🎮
              </Link>
            </div>
          </div>
        ) : (
          /* Game board */
          <div>
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Card Matching
                  </h1>
                  <p className="text-gray-500">
                    Matches: {matches} / {config.pairs}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-teal-600">
                    {moves}
                  </div>
                  <div className="text-sm text-gray-500">Moves</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-cyan-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(matches / config.pairs) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`
                    aspect-square cursor-pointer
                    ${card.isMatched ? 'opacity-50 pointer-events-none' : ''}
                  `}
                >
                  <div className="w-full h-full">
                    {card.type === 'emoji' ? (
                      /* Emoji card */
                      <div
                        className={`
                          w-full h-full rounded-3xl shadow-lg
                          flex items-center justify-center
                          transition-all duration-500
                          ${card.isFlipped || card.isMatched
                            ? 'bg-white border-4 border-teal-400'
                            : 'bg-gradient-to-br from-teal-400 to-cyan-500'
                          }
                        `}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                        }}
                      >
                        <div className="text-5xl">{card.content}</div>
                      </div>
                    ) : (
                      /* Word card */
                      <div
                        className={`
                          w-full h-full rounded-3xl shadow-lg
                          flex items-center justify-center
                          transition-all duration-500
                          ${card.isFlipped || card.isMatched
                            ? 'bg-white border-4 border-teal-400'
                            : 'bg-gradient-to-br from-purple-400 to-pink-500'
                          }
                        `}
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                        }}
                      >
                        <div className="text-xl font-bold text-gray-800 px-2 text-center">
                          {card.content}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
