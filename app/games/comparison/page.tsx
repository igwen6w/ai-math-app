"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ITEMS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🍒", "🥝", "🍑", "🍐", "⭐", "🐶", "🐱"];

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

export default function ComparisonGame() {
  const router = useRouter();
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [leftItem, setLeftItem] = useState("🍎");
  const [rightItem, setRightItem] = useState("🍊");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  const generateQuestion = () => {
    const left = Math.floor(Math.random() * 10) + 1;
    let right = Math.floor(Math.random() * 10) + 1;

    // 确保有时得到相同数字
    if (Math.random() > 0.7) {
      right = left;
    }

    setLeftCount(left);
    setRightCount(right);
    setLeftItem(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
    setRightItem(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
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

  const getCorrectAnswer = () => {
    if (leftCount > rightCount) return ">";
    if (leftCount < rightCount) return "<";
    return "=";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 p-4 flex flex-col relative overflow-hidden">
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
            <span className="text-orange-600 font-extrabold text-xl ml-2">{score}</span>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto w-full">
        {/* 标题 */}
        <h1 
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-lg"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          哪边更多？选择正确的符号
        </h1>

        {/* 比较展示区 */}
        <div className="flex items-center justify-center gap-2 md:gap-6 mb-10 w-full max-w-3xl">
          {/* 左边 */}
          <div 
            className={`flex-1 bg-white/95 backdrop-blur-sm rounded-[2rem] p-6 min-h-[180px] flex flex-wrap justify-center items-center gap-2 shadow-2xl transition-all duration-300 ${
              feedback === 'correct' && leftCount > rightCount ? 'ring-4 ring-green-400 scale-105' : ''
            }`}
          >
            {renderItems(leftCount, leftItem)}
          </div>

          {/* 问号 */}
          <div 
            className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg animate-pulse"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            ?
          </div>

          {/* 右边 */}
          <div 
            className={`flex-1 bg-white/95 backdrop-blur-sm rounded-[2rem] p-6 min-h-[180px] flex flex-wrap justify-center items-center gap-2 shadow-2xl transition-all duration-300 ${
              feedback === 'correct' && rightCount > leftCount ? 'ring-4 ring-green-400 scale-105' : ''
            }`}
          >
            {renderItems(rightCount, rightItem)}
          </div>
        </div>

        {/* 答案选项 */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
          {[
            { symbol: ">", label: "大于", desc: "左边多", color: "from-pink-400 to-rose-500" },
            { symbol: "<", label: "小于", desc: "右边多", color: "from-blue-400 to-indigo-500" },
            { symbol: "=", label: "等于", desc: "一样多", color: "from-green-400 to-emerald-500" },
          ].map((option) => {
            const correct = getCorrectAnswer();
            const isCorrect = option.symbol === correct;

            return (
              <button
                key={option.symbol}
                onClick={() => handleAnswer(option.symbol as ">" | "<" | "=")}
                disabled={feedback !== null}
                className={`
                  rounded-[1.5rem] p-6 shadow-xl transition-all duration-300
                  hover:shadow-2xl hover:scale-105 active:scale-95
                  disabled:active:scale-100 disabled:cursor-not-allowed
                  ${
                    feedback === "correct" && isCorrect
                      ? `bg-gradient-to-br ${option.color} scale-110 shadow-2xl`
                      : feedback === "wrong" && isCorrect
                      ? `bg-gradient-to-br ${option.color}`
                      : feedback === "wrong" && !isCorrect
                      ? "bg-slate-300 text-slate-500"
                      : "bg-white hover:bg-slate-50"
                  }
                `}
              >
                <div 
                  className={`text-5xl md:text-6xl font-extrabold mb-2 ${
                    feedback === 'wrong' && !isCorrect ? 'text-slate-500' : 'text-slate-700'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {option.symbol}
                </div>
                <div className={`text-base font-bold mb-1 ${
                  feedback === 'wrong' && !isCorrect ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {option.label}
                </div>
                <div className={`text-sm ${
                  feedback === 'wrong' && !isCorrect ? 'text-slate-300' : 'text-slate-400'
                }`}>
                  {option.desc}
                </div>
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
              feedback === "correct" ? "text-green-100" : "text-white"
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
