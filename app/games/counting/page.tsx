"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ITEMS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍒", "🥝", "🍑", "🍐", "⭐"];

export default function CountingGame() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(0);

  const generateQuestion = () => {
    const newCount = Math.floor(Math.random() * 10) + 1;
    setCount(newCount);

    // Generate options
    const correct = newCount;
    let wrong1 = Math.max(1, correct - Math.floor(Math.random() * 3) - 1);
    let wrong2 = Math.min(10, correct + Math.floor(Math.random() * 3) + 1);

    const opts = [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);
    setOptions(opts);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (answer: number) => {
    if (answer === count) {
      setFeedback("correct");
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);

      // Play success sound (visual feedback for now)
      setTimeout(() => {
        generateQuestion();
      }, 1500);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/30"
        >
          ← 返回
        </button>
        <div className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold">
          得分: {score}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
          数一数，有几个？
        </h1>

        {/* Items Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 min-w-[300px] min-h-[200px] flex flex-wrap justify-center items-center gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className="text-6xl md:text-8xl animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1s",
              }}
            >
              {ITEMS[count % ITEMS.length]}
            </span>
          ))}
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              className={`aspect-square rounded-2xl text-5xl md:text-6xl font-bold text-white shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:active:scale-100
                ${
                  feedback === "correct" && option === count
                    ? "bg-green-500 scale-110"
                    : feedback === "wrong" && option === count
                    ? "bg-green-500"
                    : feedback === "wrong"
                    ? "bg-red-500/50"
                    : "bg-white/20 hover:bg-white/30"
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="mt-8 text-6xl animate-bounce">
            {feedback === "correct" ? "🎉" : "😅"}
          </div>
        )}

        {/* Streak Display */}
        {streak > 1 && (
          <div className="mt-4 px-6 py-2 bg-yellow-400 text-yellow-900 rounded-full font-bold text-xl">
            🔥 连对 {streak} 题！
          </div>
        )}
      </div>
    </div>
  );
}
