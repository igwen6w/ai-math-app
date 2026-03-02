'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRandomWords, getWordById } from '@/lib/english/vocabulary';
import { tts } from '@/lib/english/tts';
import { updateLevelProgress } from '@/lib/english/storage';
import AudioButton from '@/components/english/AudioButton';

interface LetterSlot {
  letter: string;
  filled: boolean;
}

interface GameState {
  word: ReturnType<typeof getWordById>;
  slots: LetterSlot[];
  availableLetters: string[];
  currentWord: string;
  score: number;
  completed: boolean;
  level: number;
  totalWords: number;
}

export default function WordSpellingGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    word: undefined,
    slots: [],
    availableLetters: [],
    currentWord: '',
    score: 0,
    completed: false,
    level: 1,
    totalWords: 5,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [stars, setStars] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  // Initialize a new word
  const initWord = useCallback(() => {
    const words = getRandomWords(1, 1); // Level 1 words
    const word = words[0];
    const wordLetters = word.word.split('');

    // Create letter slots (all empty initially)
    const slots: LetterSlot[] = wordLetters.map(() => ({
      letter: '',
      filled: false,
    }));

    // Create available letters (correct letters + some distractors)
    const distractors = ['X', 'Q', 'Z'].filter(d => !wordLetters.includes(d));
    const availableLetters = [...wordLetters, ...distractors.slice(0, 2)]
      .sort(() => Math.random() - 0.5);

    setGameState({
      word,
      slots,
      availableLetters,
      currentWord: '',
      score: gameState.score,
      completed: false,
      level: gameState.level,
      totalWords: gameState.totalWords,
    });
    setWrongAttempts(0);

    // Speak the word
    setTimeout(() => {
      tts.speak(word.word, { rate: 0.9, pitch: 1.1 });
    }, 500);
  }, [gameState.score, gameState.level, gameState.totalWords]);

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      initWord();
    }
  }, [gameStarted, gameCompleted, initWord]);

  // Handle letter click
  const handleLetterClick = useCallback((letter: string, letterIndex: number) => {
    const slots = [...gameState.slots];
    const availableLetters = [...gameState.availableLetters];

    // Find first empty slot
    const emptySlotIndex = slots.findIndex(slot => !slot.filled);

    if (emptySlotIndex === -1) {
      // All slots filled, check if correct
      checkWord();
      return;
    }

    // Fill the slot
    slots[emptySlotIndex] = {
      letter,
      filled: true,
    };

    // Remove letter from available
    availableLetters[letterIndex] = '';

    // Update current word
    const currentWord = slots.map(s => s.letter).join('');

    setGameState({
      ...gameState,
      slots,
      availableLetters,
      currentWord,
    });

    // Speak the letter
    tts.speak(letter, { rate: 0.8, pitch: 1.2 });

    // Check if all slots are filled
    if (slots.every(s => s.filled)) {
      setTimeout(() => checkWord(currentWord + letter), 300);
    }
  }, [gameState]);

  // Handle slot click (remove letter)
  const handleSlotClick = useCallback((slotIndex: number) => {
    if (!gameState.slots[slotIndex].filled) return;

    const slots = [...gameState.slots];
    const availableLetters = [...gameState.availableLetters];

    // Get letter from slot
    const letter = slots[slotIndex].letter;

    // Empty the slot
    slots[slotIndex] = {
      letter: '',
      filled: false,
    };

    // Find first empty spot in available letters
    const emptyIndex = availableLetters.findIndex(l => l === '');
    if (emptyIndex !== -1) {
      availableLetters[emptyIndex] = letter;
    }

    // Update current word
    const currentWord = slots.map(s => s.letter).join('');

    setGameState({
      ...gameState,
      slots,
      availableLetters,
      currentWord,
    });
  }, [gameState]);

  // Check if word is correct
  const checkWord = useCallback((currentWord?: string) => {
    const wordToCheck = currentWord || gameState.currentWord;
    const targetWord = gameState.word?.word.toLowerCase();

    if (wordToCheck.toLowerCase() === targetWord) {
      // Correct!
      tts.speak(`${gameState.word?.word}! Perfect!`, { rate: 1, pitch: 1.2 });

      // Update score
      const newScore = gameState.score + 10;

      // Check if game is complete
      if (gameState.level >= gameState.totalWords) {
        handleGameComplete(newScore);
      } else {
        // Move to next word
        setTimeout(() => {
          setGameState({
            ...gameState,
            score: newScore,
            level: gameState.level + 1,
          });
        }, 1500);
      }
    } else {
      // Wrong
      setWrongAttempts(wrongAttempts + 1);
      tts.speak('Try again!', { rate: 0.9, pitch: 1.1 });

      // Shake animation
      const slots = [...gameState.slots];
      slots.forEach((slot, i) => {
        if (slot.filled) {
          setTimeout(() => {
            handleSlotClick(i);
          }, i * 100);
        }
      });
    }
  }, [gameState, wrongAttempts]);

  // Handle game completion
  const handleGameComplete = useCallback((finalScore: number) => {
    setGameCompleted(true);

    // Calculate stars based on score and wrong attempts
    let earnedStars = 1;
    if (wrongAttempts === 0 && finalScore >= gameState.totalWords * 10) {
      earnedStars = 3;
    } else if (wrongAttempts <= 2 && finalScore >= gameState.totalWords * 8) {
      earnedStars = 2;
    }

    setStars(earnedStars);

    // Save progress
    updateLevelProgress('word-spelling', 'level-1', earnedStars, finalScore);

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
  }, [gameState.totalWords, wrongAttempts]);

  // Start game
  const handleStart = () => {
    setGameStarted(true);
    tts.speak('Let\'s spell some words!', { rate: 0.9, pitch: 1.1 });
  };

  // Play again
  const handlePlayAgain = () => {
    setGameState({
      word: undefined,
      slots: [],
      availableLetters: [],
      currentWord: '',
      score: 0,
      completed: false,
      level: 1,
      totalWords: 5,
    });
    setGameStarted(false);
    setGameCompleted(false);
    setStars(0);
    setWrongAttempts(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-4">
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
            <div className="text-8xl mb-6">✏️</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Word Spelling Game
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Listen to the word and spell it correctly!
            </p>
            <div className="bg-purple-50 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <h3 className="font-bold text-gray-700 mb-3">How to Play:</h3>
              <ol className="text-left text-gray-600 space-y-2">
                <li>1. 👂 Listen to the word</li>
                <li>2. 🔤 Click letters to spell it</li>
                <li>3. ✅ Get it right to earn points!</li>
              </ol>
            </div>
            <button
              onClick={handleStart}
              className="
                px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-500
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
              <div className="bg-purple-100 rounded-2xl p-4">
                <div className="text-3xl font-bold text-purple-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="bg-pink-100 rounded-2xl p-4">
                <div className="text-3xl font-bold text-pink-600">{gameState.totalWords}</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayAgain}
                className="
                  px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500
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
                    Word Spelling
                  </h1>
                  <p className="text-gray-500">
                    Word {gameState.level} of {gameState.totalWords}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    {gameState.score}
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(gameState.level / gameState.totalWords) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Game area */}
            {gameState.word && (
              <div className="bg-white rounded-3xl p-8 shadow-xl">
                {/* Emoji and audio */}
                <div className="text-center mb-8">
                  <div className="text-9xl mb-4">{gameState.word.emoji}</div>
                  <AudioButton
                    text={gameState.word.word}
                    size="lg"
                    variant="secondary"
                    className="mx-auto"
                  />
                </div>

                {/* Letter slots */}
                <div className="flex justify-center gap-3 mb-8 flex-wrap">
                  {gameState.slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotClick(index)}
                      className={`
                        w-16 h-16 rounded-2xl border-4
                        flex items-center justify-center
                        text-3xl font-bold
                        transition-all duration-200
                        ${slot.filled
                          ? 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600'
                          : 'bg-gray-100 border-gray-300 border-dashed'
                        }
                      `}
                    >
                      {slot.filled ? slot.letter : ''}
                    </button>
                  ))}
                </div>

                {/* Available letters */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-center text-gray-600 mb-4">Tap letters to spell the word:</p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {gameState.availableLetters.map((letter, index) => (
                      <button
                        key={index}
                        onClick={() => letter && handleLetterClick(letter, index)}
                        disabled={!letter}
                        className={`
                          w-14 h-14 rounded-xl
                          flex items-center justify-center
                          text-2xl font-bold
                          transition-all duration-200
                          ${letter
                            ? 'bg-white border-2 border-purple-300 text-purple-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                            : 'opacity-0 pointer-events-none'
                          }
                        `}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hint */}
                {gameState.slots.every(s => s.filled) && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-500">
                      {gameState.currentWord.toLowerCase() === gameState.word.word.toLowerCase()
                        ? '✅ Correct!'
                        : '❌ Try again!'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
