"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Card = {
  id: number;
  value: number;
  type: "number" | "dots";
  flipped: boolean;
  matched: boolean;
};

const EMOJIS = ["⭐", "🍎", "🎈", "🎁", "🌟", "🦋", "🌸", "🍄"];

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

// 庆祝动画组件
const Celebration = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl particle"
          style={{
            left: `${50 + (Math.random() - 0.5) * 60}%`,
            top: `${50 + (Math.random() - 0.5) * 40}%`,
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {['⭐', '✨', '🎉', '🌟', '💫', '🎊', '🎈'][i % 7]}
        </div>
      ))}
    </div>
  );
};

export default function MatchingGame() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const initializeGame = () => {
    const pairs = 6;
    const values = Array.from({ length: pairs }, (_, i) => i + 1);

    const newCards: Card[] = [];
    values.forEach((value, index) => {
      // 数字卡片
      newCards.push({
        id: index * 2,
        value,
        type: "number",
        flipped: false,
        matched: false,
      });
      // 点数卡片
      newCards.push({
        id: index * 2 + 1,
        value,
        type: "dots",
        flipped: false,
        matched: false,
      });
    });

    // 洗牌
    const shuffled = newCards
      .map((card) => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ card }) => card);

    setCards(shuffled);
    setFlipped([]);
    setScore(0);
    setMoves(0);
    setMatches(0);
    setShowCelebration(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matches === 6) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [matches]);

  const handleCardClick = (id: number) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched || flipped.length >= 2) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    const newCards = cards.map((c) =>
      c.id === id ? { ...c, flipped: true } : c
    );
    setCards(newCards);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      const firstCard = newCards.find((c) => c.id === first);
      const secondCard = newCards.find((c) => c.id === second);

      if (firstCard?.value === secondCard?.value) {
        // 配对成功！
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second
                ? { ...c, matched: true }
                : c
            )
          );
          setFlipped([]);
          setScore((s) => s + 100 - moves * 2);
          setMatches((m) => m + 1);
        }, 500);
      } else {
        // 配对失败
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second
                ? { ...c, flipped: false }
                : c
            )
          );
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const renderDots = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-xl md:text-2xl">
        {EMOJIS[count % EMOJIS.length]}
      </span>
    ));
  };

  const isGameComplete = matches === 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-4 flex flex-col relative overflow-hidden">
      <FloatingDecoration />
      <Celebration show={showCelebration} />

      {/* Header */}
      <header className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={() => router.push("/")}
          className="px-5 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-bold hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <span className="text-xl">←</span>
          <span className="hidden sm:inline">返回</span>
        </button>
        
        <div className="flex items-center gap-3">
          {/* 进度显示 */}
          <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-bold">
            <span className="text-sm opacity-80">进度</span>
            <span className="ml-2 text-lg">{matches}/6</span>
          </div>
          
          {/* 得分 */}
          <div className="px-4 py-3 bg-white rounded-2xl shadow-lg">
            <span className="text-slate-600 font-bold text-sm">得分</span>
            <span className="text-purple-600 font-extrabold text-xl ml-2">{score}</span>
          </div>
          
          {/* 步数 */}
          <div className="px-4 py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-bold hidden sm:block">
            <span className="text-sm opacity-80">步数</span>
            <span className="ml-2 text-lg">{moves}</span>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto w-full">
        {!isGameComplete ? (
          <>
            {/* 标题 */}
            <h1 
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-6 text-center drop-shadow-lg"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              配对相同的数字和数量
            </h1>

            {/* 卡片网格 */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-2xl">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.flipped || card.matched}
                  className={`
                    aspect-square rounded-[1.5rem] shadow-xl transition-all duration-500
                    ${card.matched
                      ? "bg-green-400/80 scale-95 shadow-green-400/30"
                      : card.flipped
                      ? "bg-white rotate-y-180"
                      : "bg-gradient-to-br from-white/30 to-white/10 hover:from-white/40 hover:to-white/20 active:scale-95 hover:shadow-2xl"
                    }
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  {card.flipped || card.matched ? (
                    <div className="h-full flex flex-col items-center justify-center animate-scale-in">
                      {card.type === "number" ? (
                        <span 
                          className="text-4xl md:text-5xl font-extrabold text-purple-600"
                          style={{ fontFamily: 'Quicksand, sans-serif' }}
                        >
                          {card.value}
                        </span>
                      ) : (
                        <div className="flex flex-wrap justify-center gap-1 p-2">
                          {renderDots(card.value)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-4xl text-white/60">❓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 提示文字 */}
            <p className="mt-6 text-white/70 text-lg font-medium">
              点击卡片翻开，找到相同的数字和数量
            </p>
          </>
        ) : (
          /* 游戏完成画面 */
          <div className="text-center animate-scale-in">
            <div className="inline-block mb-6">
              <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl animate-bounce-subtle">
                <span className="text-7xl">🏆</span>
              </div>
            </div>
            
            <h2 
              className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              恭喜完成！
            </h2>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-[2rem] p-6 mb-8 inline-block">
              <p className="text-3xl text-white font-bold mb-2">
                得分: <span className="text-yellow-300">{score}</span>
              </p>
              <p className="text-xl text-white/90">
                步数: {moves}
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={initializeGame}
                className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-extrabold text-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                🔄 再玩一次
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-8 py-4 bg-white/20 text-white rounded-2xl font-extrabold text-xl shadow-xl hover:bg-white/30 active:scale-95 transition-all duration-300"
              >
                🏠 返回主页
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 底部装饰条 */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-teal-400 to-blue-500" />
    </div>
  );
}
