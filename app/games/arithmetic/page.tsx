"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ITEMS = ["🍎", "🍊", "🍋", "🍇", "🍓"];

export default function ArithmeticGame() {
  const router = useRouter();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<"+" | "-">("+");
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(0);

  const generateQuestion = () => {
    const isAddition = Math.random() > 0.5;
    const op = isAddition ? "+" : "-";
    let n1 = Math.floor(Math.random() * 5) + 1;
    let n2 = Math.floor(Math.random() * 5) + 1;

    // For subtraction, ensure result is non-negative
    if (!isAddition && n2 > n1) {
      [n1, n2] = [n2, n1];
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(op);

    // Calculate correct answer
    const correct = isAddition ? n1 + n2 : n1 - n2;

    // Generate options
    let wrong1 = Math.max(0, correct - Math.floor(Math.random() * 3) - 1);
    let wrong2 = correct + Math.floor(Math.random() * 3) + 1;
    if (wrong1 === correct) wrong1 = correct + 1;
    if (wrong2 === correct) wrong2 = Math.max(0, correct - 1);

    const opts = [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);
    setOptions(opts);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (answer: number) => {
    const correct = operator === "+" ? num1 + num2 : num1 - num2;

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

  const renderItems = (count: number, emoji: string) => {
    return Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-4xl md:text-5xl">
        {emoji}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 p-4 flex flex-col">
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
          算一算，等于多少？
        </h1>

        {/* Visual Representation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 w-full max-w-2xl">
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            {/* First Number */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[150px]">
              {renderItems(num1, ITEMS[0])}
            </div>

            {/* Operator */}
            <div className="text-5xl md:text-6xl font-bold text-white">
              {operator}
            </div>

            {/* Second Number */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[150px]">
              {renderItems(num2, ITEMS[1])}
            </div>

            {/* Equals */}
            <div className="text-5xl md:text-6xl font-bold text-white">
              =
            </div>

            {/* Question Mark */}
            <div className="text-5xl md:text-6xl font-bold text-white">
              ?
            </div>
          </div>
        </div>

        {/* Number Equation */}
        <div className="text-4xl md:text-6xl font-bold text-white mb-8">
          {num1} {operator} {num2} = ?
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          {options.map((option) => {
            const correct = operator === "+" ? num1 + num2 : num1 - num2;
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={feedback !== null}
                className={`aspect-square rounded-2xl text-5xl md:text-6xl font-bold text-white shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:active:scale-100
                  ${
                    feedback === "correct" && option === correct
                      ? "bg-green-500 scale-110"
                      : feedback === "wrong" && option === correct
                      ? "bg-green-500"
                      : feedback === "wrong"
                      ? "bg-red-500/50"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
              >
                {option}
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
