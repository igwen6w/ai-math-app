'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRandomWords } from '@/lib/english/vocabulary';
import { tts } from '@/lib/english/tts';
import { updateLevelProgress } from '@/lib/english/storage';
import AudioButton from '@/components/english/AudioButton';

interface Option {
  word: ReturnType<typeof getRandomWords>[0];
  isCorrect: boolean;
  selected: boolean;
  showResult: boolean;
}

interface GameState {
  options: Option[];
  score: number;
  round: number;
  totalRounds: number;
  completed: boolean;
}

export default function ListenChooseGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    options: [],
    score: 0,
    round: 1,
    totalRounds: 5,
    completed: false,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [stars, setStars] = useState(0);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize a new round
  const initRound = useCallback(() => {
    // Get 4 random words (1 correct + 3 distractors)
    const words = getRandomWords(4, 1);
    const correctWord = words[0];
    const shuffledWords = words.sort(() => Math.random() - 0.5);

    const options: Option[] = shuffledWords.map(word => ({
      word,
      isCorrect: word.id === correctWord.id,
      selected: false,
      showResult: false,
    }));

    setGameState({
      ...gameState,
      options,
      score: gameState.score,
      round: gameState.round,
      totalRounds: gameState.totalRounds,
    });

    setCurrentWord(correctWord.word);

    // Auto-play audio after a short delay
    setTimeout(() => {
      setIsPlaying(true);
      tts.speak(correctWord.word, { rate: 0.9, pitch: 1.1 });
      setTimeout(() => setIsPlaying(false), 1500);
    }, 500);
  }, [gameState]);

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      initRound();
    }
  }, [gameStarted, gameCompleted, initRound]);

  // Handle option selection
  const handleOptionClick = useCallback((index: number) => {
    if (gameState.options[index].selected || gameState.options[index].showResult) return;

    const options = [...gameState.options];
    options[index].selected = true;
    options[index].showResult = true;

    // Show all results
    options.forEach(opt => {
      opt.showResult = true;
    });

    let newScore = gameState.score;

    if (options[index].isCorrect) {
      // Correct!
      newScore += 10;
      tts.speak('Correct!', { rate: 1, pitch: 1.2 });
    } else {
      // Wrong
      tts.speak('Try again!', { rate: 0.9, pitch: 1.1 });
    }

    setGameState({
      ...gameState,
      options,
      score: newScore,
    });

    // Move to next round or end game
    setTimeout(() => {
      if (gameState.round >= gameState.totalRounds) {
        handleGameComplete(newScore);
      } else {
        setGameState({
          ...gameState,
          score: newScore,
          round: gameState.round + 1,
        });
      }
    }, 1500);
  }, [gameState]);

  // Handle game completion
  const handleGameComplete = useCallback((finalScore: number) => {
    setGameCompleted(true);

    // Calculate stars based on score
    const maxScore = gameState.totalRounds * 10;
    let earnedStars = 1;

    if (finalScore >= maxScore) {
      earnedStars = 3; // Perfect
    } else if (finalScore >= maxScore * 0.7) {
      earnedStars = 2; // Good
    }

    setStars(earnedStars);

    // Save progress
    updateLevelProgress('listen-choose', 'level-1', earnedStars, finalScore);

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
  }, [gameState.totalRounds]);

  // Replay audio
  const handleReplay = () => {
    if (currentWord) {
      setIsPlaying(true);
      tts.speak(currentWord, { rate: 0.9, pitch: 1.1 });
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  // Start game
  const handleStart = () => {
    setGameStarted(true);
    tts.speak('Listen and choose the correct picture!', { rate: 0.9, pitch: 1.1 });
  };

  // Play again
  const handlePlayAgain = () => {
    setGameState({
      options: [],
      score: 0,
      round: 1,
      totalRounds: 5,
      completed: false,
    });
    setGameStarted(false);
    setGameCompleted(false);
    setStars(0);
    setCurrentWord('');
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4">
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
        {!gameStarted ? (
          /* Welcome screen */
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center pop-in">
            <div className="text-8xl mb-6">👂</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Listen & Choose Game
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Listen to the word and choose the correct picture!
            </p>
            <div className="bg-orange-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <h3 className="font-bold text-gray-700 mb-3">How to Play:</h3>
              <ol className="text-left text-gray-600 space-y-2">
                <li>1. 👂 Listen to the English word</li>
                <li>2. 🔍 Look at the pictures</li>
                <li>3. ✅ Tap the correct picture!</li>
              </ol>
            </div>
            <button
              onClick={handleStart}
              className="
                px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500
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
              <div className="bg-orange-100 rounded-2xl p-4">
                <div className="text-3xl font-bold text-orange-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="bg-red-100 rounded-2xl p-4">
                <div className="text-3xl font-bold text-red-600">{gameState.totalRounds}</div>
                <div className="text-sm text-gray-600">Rounds</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayAgain}
                className="
                  px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500
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
                    Listen & Choose
                  </h1>
                  <p className="text-gray-500">
                    Round {gameState.round} of {gameState.totalRounds}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">
                    {gameState.score}
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(gameState.round / gameState.totalRounds) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Audio player */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                Listen to the word:
              </h2>
              <div className="flex justify-center items-center gap-4">
                <AudioButton
                  text={currentWord}
                  size="lg"
                  variant="primary"
                  autoPlay={false}
                />
                <button
                  onClick={handleReplay}
                  className="
                    px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full
                    hover:bg-gray-200
                    transition-all duration-200
                  "
                  disabled={isPlaying}
                >
                  🔁 Replay
                </button>
              </div>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-6">
              {gameState.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={option.selected || option.showResult}
                  className={`
                    relative bg-white rounded-3xl p-8 shadow-lg
                    transform transition-all duration-200
                    ${!option.selected && !option.showResult ? 'hover:scale-105 hover:shadow-xl' : ''}
                    ${option.selected
                      ? option.isCorrect
                        ? 'ring-4 ring-green-500 bg-green-50'
                        : 'ring-4 ring-red-500 bg-red-50'
                      : ''
                    }
                    ${option.showResult && option.isCorrect && !option.selected
                      ? 'ring-4 ring-green-500 bg-green-50'
                      : ''
                    }
                    ${(option.selected || option.showResult) ? 'pointer-events-none' : ''}
                  `}
                >
                  {/* Emoji */}
                  <div className="text-8xl mb-4">{option.word.emoji}</div>

                  {/* Result indicator */}
                  {option.showResult && option.isCorrect && (
                    <div className="absolute top-4 right-4 text-4xl animate-bounce">
                      ✅
                    </div>
                  )}
                  {option.selected && !option.isCorrect && (
                    <div className="absolute top-4 right-4 text-4xl animate-shake">
                      ❌
                    </div>
                  )}

                  {/* Word label (shown after selection) */}
                  {option.showResult && (
                    <div className="text-center text-gray-600 font-semibold">
                      {option.word.word}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Hint */}
            {gameState.options.some(o => o.showResult) && (
              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  {gameState.options.find(o => o.selected && o.isCorrect)
                    ? '🎉 Correct!'
                    : gameState.options.find(o => o.showResult && o.isCorrect && !o.selected)
                      ? '😅 The correct answer is shown above!'
                      : '❌ Not quite!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
