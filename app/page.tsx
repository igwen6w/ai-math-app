"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Game = {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  description: string;
  color: string;
};

const games: Game[] = [
  {
    id: "counting",
    title: "数数游戏",
    icon: "🔢",
    gradient: "from-violet-500 to-purple-600",
    description: "学习1到10的数字",
    color: "text-purple-600",
  },
  {
    id: "arithmetic",
    title: "加减法",
    icon: "➕",
    gradient: "from-pink-500 to-rose-500",
    description: "简单的加减运算",
    color: "text-pink-600",
  },
  {
    id: "matching",
    title: "数字配对",
    icon: "🎯",
    gradient: "from-cyan-500 to-blue-500",
    description: "数字与数量配对",
    color: "text-cyan-600",
  },
  {
    id: "comparison",
    title: "大小比较",
    icon: "⚖️",
    gradient: "from-emerald-500 to-teal-500",
    description: "学习大于小于",
    color: "text-emerald-600",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-2xl mb-6 gentle-pulse">
            <span className="text-5xl">🧮</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-blue-600 mb-4 modern-cute-font">
            数学启蒙
          </h1>
          <p className="text-2xl md:text-3xl text-slate-600 font-semibold mb-8">
            快乐学习，轻松掌握
          </p>
          {showInstall && (
            <button
              onClick={handleInstall}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 active:scale-95 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              📱 安装应用
            </button>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => router.push(`/games/${game.id}`)}
              className={`group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-3xl transition-all duration-500 modern-card shine-effect border-2 border-slate-100 hover:border-${game.color.split('-')[1]}-200`}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Gradient Background Circle */}
              <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${game.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${game.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-4xl">{game.icon}</span>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full bg-gradient-to-br ${game.gradient} opacity-60`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-3 text-left modern-cute-font">
                  {game.title}
                </h2>

                <p className="text-lg text-slate-500 mb-6 text-left font-medium">
                  {game.description}
                </p>

                <div className="flex items-center gap-3 text-slate-600 font-semibold">
                  <span>开始游戏</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <span className="text-2xl">🎨</span>
            <p className="text-slate-600 font-semibold">
              专为儿童设计 · 支持离线使用
            </p>
            <span className="text-2xl">✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
