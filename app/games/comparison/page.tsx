"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ITEMS = ["🍎", "🍊", "🍋", "🍇", "🍓", "⭐"];

export default function ComparisonGame() {
  const router = useRouter();
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(0);

  const generateQuestion = () => {
    const left = Math.floor(Math.random() * 10) + 1;
    let right = Math.floor(Math.random() * 10) + 1;

    // Ensure we get different numbers sometimes
    if (Math.random() > 0.7) {
      right = left;
    }

    setLeftCount(left);
    setRightCount(right);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (answer: ">" | "<" | "=") => {
    let correct: ">" | "<" | "=";
    if (leftCount > rightCount) {
      correct = ">";
    } else if (leftCount < rightCount) {
      correct = "<";
    } else {
      correct = "=";
    }

    if (answer === correct) {
      setFeedback("correct");
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);

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

  const renderItems = (count: number) => {
    const emoji = ITEMS[count % ITEMS.length];
    return Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-3xl md:text-4xl">
        {emoji}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 p-4 flex flex-col">
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
          哪边更多？选择正确的符号
        </h1>

        {/* Comparison Display */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 w-full max-w-3xl">
          {/* Left Side */}
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4 min-h-[150px] flex flex-wrap justify-center items-center gap-1">
            {renderItems(leftCount)}
          </div>

          {/* Question Mark */}
          <div className="text-5xl md:text-6xl font-bold text-white px-4">
            ?
          </div>

          {/* Right Side */}
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4 min-h-[150px] flex flex-wrap justify-center items-center gap-1">
            {renderItems(rightCount)}
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {[
            { symbol: ">", label: "大于", desc: "左边更多" },
            { symbol: "<", label: "小于", desc: "右边更多" },
            { symbol: "=", label: "等于", desc: "一样多" },
          ].map((option) => {
            const isCorrect =
              (option.symbol === ">" && leftCount > rightCount) ||
              (option.symbol === "<" && leftCount < rightCount) ||
              (option.symbol === "=" && leftCount === rightCount);

            return (
              <button
                key={option.symbol}
                onClick={() => handleAnswer(option.symbol as ">" | "<" | "=")}
                disabled={feedback !== null}
                className={`rounded-2xl p-6 shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:active:scale-100
                  ${
                    feedback === "correct" && isCorrect
                      ? "bg-green-500 scale-110"
                      : feedback === "wrong" && isCorrect
                      ? "bg-green-500"
                      : feedback === "wrong"
                      ? "bg-red-500/50"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
              >
                <div className="text-6xl md:text-7xl font-bold text-white mb-2">
                  {option.symbol}
                </div>
                <div className="text-lg text-white/90">{option.label}</div>
                <div className="text-sm text-white/70">{option.desc}</div>
              </button>
            );
          })}
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
