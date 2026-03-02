"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Game = {
  id: string;
  title: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  description: string;
  emoji: string;
};

const games: Game[] = [
  {
    id: "counting",
    title: "数数游戏",
    icon: "🐻",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-400",
    description: "和小熊一起数数！",
    emoji: "🍯🍎🍌",
  },
  {
    id: "arithmetic",
    title: "加减法",
    icon: "🐰",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-400",
    description: "帮小兔子算算术！",
    emoji: "🥕🥕🥕",
  },
  {
    id: "matching",
    title: "数字配对",
    icon: "🐱",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-400",
    description: "和小猫咪找朋友！",
    emoji: "🐟🐟🐟",
  },
  {
    id: "comparison",
    title: "大小比较",
    icon: "🐶",
    bgColor: "bg-green-100",
    borderColor: "border-green-400",
    description: "和小狗比比大小！",
    emoji: "🦴🦴🦴",
  },
];

export default function Home() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-orange-100 p-4 md:p-8">
      {/* Floating decorations */}
      <div className="fixed top-10 left-10 text-6xl animate-bounce opacity-50">☁️</div>
      <div className="fixed top-20 right-20 text-5xl animate-bounce opacity-50" style={{animationDelay: "0.5s"}}>☁️</div>
      <div className="fixed bottom-20 left-20 text-4xl animate-bounce opacity-50" style={{animationDelay: "1s"}}>🌸</div>
      <div className="fixed bottom-10 right-10 text-5xl animate-bounce opacity-50" style={{animationDelay: "1.5s"}}>🌼</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-full px-8 py-6 shadow-xl border-4 border-yellow-300 mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              数学游乐园 🎪
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-purple-700 font-bold drop-shadow-md mb-4">
            ✨ 和小动物们一起学数学！✨
          </p>
          {showInstall && (
            <button
              onClick={handleInstall}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full text-white font-bold text-lg hover:from-pink-500 hover:to-purple-500 active:scale-95 shadow-lg border-4 border-white"
            >
              📱 安装到主屏幕
            </button>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => router.push(`/games/${game.id}`)}
              className={`${game.bgColor} rounded-[2rem] p-8 shadow-2xl hover:shadow-3xl active:scale-95 text-left border-8 ${game.borderColor} transition-all duration-300 hover:-translate-y-2`}
              style={{
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-7xl md:text-8xl animate-pulse">{game.icon}</div>
                <div className="text-4xl">{game.emoji}</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {game.title}
                </h2>
                <p className="text-xl text-gray-600 font-semibold">{game.description}</p>
              </div>
              <div className="text-center">
                <span className="inline-block px-6 py-2 bg-white rounded-full text-lg font-bold text-purple-600 shadow-md">
                  开始游戏 ▶️
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border-4 border-pink-200">
            <p className="text-lg text-purple-700 font-semibold">
              🎨 专为小朋友设计 · 📱 支持离线玩耍 · 🌟 快乐学习
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
