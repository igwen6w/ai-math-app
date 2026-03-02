"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ITEMS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍒", "🥝", "🍑"];

// 浮动装饰组件
const FloatingDecoration = () => (
  <>
    <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-float-slow" />
    <div className="absolute top-40 right-10 w-12 h-12 bg-white/10 rounded-full animate-float-medium" />
    <div className="absolute bottom-40 left-20 w-20 h-20 bg-white/5 rounded-full animate-float-slow" />
    <div className="absolute bottom-60 right-20 w-14 h-14 bg-white/5 rounded-full animate-float-fast" />
    <div className="absolute top-1/3 left-5 text-white/20 text-2xl animate-twinkle">✦</div>
    <div className="absolute top-1/2 right-8 text-white/15 text-xl animate-twinkle delay-500">✦</div>
  </>
);

// 粒子效果组件
const Particles = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl particle"
          style={{
            left: `${50 + (Math.random() - 0.5) * 40}%`,
            top: '50%',
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {['⭐', '✨', '🎉', '🌟', '💫'][i % 5]}
        </div>
      ))}
    </div>
  );
};

export default function ArithmeticGame() {
  const router = useRouter();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<"+" | "-">("+");
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [item1, setItem1] = useState("🍎");
  const [item2, setItem2] = useState("🍊");

  const generateQuestion = () => {
    const isAddition = Math.random() > 0.5;
    const op = isAddition ? "+" : "-";
    let n1 = Math.floor(Math.random() * 5) + 1;
    let n2 = Math.floor(Math.random() * 5) + 1;

    // 减法时确保结果非负
    if (!isAddition && n2 > n1) {
      [n1, n2] = [n2, n1];
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(op);
    setItem1(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
    setItem2(ITEMS[Math.floor(Math.random() * ITEMS.length)]);

    // 计算正确答案
    const correct = isAddition ? n1 + n2 : n1 - n2;

    // 生成选项
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
      setShowParticles(true);
      
      setTimeout(() => {
        setShowParticles(false);
      }, 1500);

      setTimeout(() => {
        generateQuestion();
      }, 1800);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => {
        setFeedback(null);
      }, 1200);
    }
  };

  const renderItems = (count: number, emoji: string) => {
    return Array.from({ length: count }).map((_, i) => (
      <span 
        key={i} 
        className="text-3xl md:text-4xl pop-in"
        style={{ animationDelay: `${i * 0.05}s` }}
      >
        {emoji}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-4 flex flex-col relative overflow-hidden">
      <FloatingDecoration />
      <Particles show={showParticles} />

      {/* Header */}
      <header className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={() => router.push("/")}
          className="px-5 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-bold hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <span className="text-xl">←</span>
          <span className="hidden sm:inline">返回</span>
        </button>
        
        <div className="flex items-center gap-4">
          {/* 进度点 */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === 0 ? 'bg-white scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          
          {/* 得分 */}
          <div className="px-5 py-3 bg-white rounded-2xl shadow-lg">
            <span className="text-slate-600 font-bold text-sm">得分</span>
            <span className="text-emerald-600 font-extrabold text-xl ml-2">{score}</span>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto w-full">
        {/* 标题 */}
        <h1 
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 text-center drop-shadow-lg"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          算一算，等于多少？
        </h1>

        {/* 视觉化表示 */}
        <div 
          className={`bg-white/95 backdrop-blur-sm rounded-[2rem] p-6 mb-6 w-full max-w-2xl shadow-2xl transition-all duration-300 ${
            feedback === 'correct' ? 'ring-4 ring-green-400' : feedback === 'wrong' ? 'ring-4 ring-red-400' : ''
          }`}
        >
          <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
            {/* 第一个数字 */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[180px] min-h-[80px] items-center">
              {renderItems(num1, item1)}
            </div>

            {/* 运算符 */}
            <div 
              className="text-5xl md:text-6xl font-extrabold text-teal-500"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {operator}
            </div>

            {/* 第二个数字 */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[180px] min-h-[80px] items-center">
              {renderItems(num2, item2)}
            </div>

            {/* 等于号 */}
            <div 
              className="text-4xl md:text-5xl font-bold text-slate-400"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              =
            </div>

            {/* 问号 */}
            <div 
              className="text-5xl md:text-6xl font-extrabold text-teal-500 animate-pulse"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              ?
            </div>
          </div>
        </div>

        {/* 数字等式 */}
        <div 
          className="text-3xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          {num1} {operator} {num2} = ?
        </div>

        {/* 答案选项 */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
          {options.map((option, index) => {
            const correct = operator === "+" ? num1 + num2 : num1 - num2;
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={feedback !== null}
                className={`
                  aspect-square rounded-[1.5rem] text-4xl md:text-5xl font-extrabold shadow-xl 
                  transition-all duration-300 hover:scale-105 active:scale-95
                  disabled:active:scale-100 disabled:cursor-not-allowed
                  ${
                    feedback === "correct" && option === correct
                      ? "bg-gradient-to-br from-green-400 to-green-500 text-white scale-110 shadow-green-400/50"
                      : feedback === "wrong" && option === correct
                      ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
                      : feedback === "wrong" && option !== correct
                      ? "bg-slate-200 text-slate-400"
                      : "bg-white text-slate-700 hover:shadow-2xl hover:text-emerald-600"
                  }
                `}
                style={{ 
                  fontFamily: 'Quicksand, sans-serif',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* 反馈区域 */}
        {feedback && (
          <div className="mt-8 text-center animate-scale-in">
            <div className="text-7xl mb-2">
              {feedback === "correct" ? "🎉" : "😅"}
            </div>
            <p className={`text-2xl font-bold ${
              feedback === "correct" ? "text-green-300" : "text-white"
            }`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
              {feedback === "correct" ? "太棒了！" : "再试一次！"}
            </p>
          </div>
        )}

        {/* 连击显示 */}
        {streak > 1 && (
          <div className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg animate-bounce-subtle">
            <span className="mr-2">🔥</span>
            <span>连对 {streak} 题！</span>
          </div>
        )}
      </main>

      {/* 底部装饰条 */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-teal-400 to-blue-500" />
    </div>
  );
}
