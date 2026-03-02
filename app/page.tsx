"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Game = {
  id: string;
  title: string;
  icon: string;
  bgFrom: string;
  bgTo: string;
  description: string;
  badgeColor: string;
};

const games: Game[] = [
  {
    id: "counting",
    title: "数数游戏",
    icon: "🔢",
    bgFrom: "#FF9F1C",
    bgTo: "#FFBF69",
    description: "认识数字1-10",
    badgeColor: "bg-orange-100 text-orange-600",
  },
  {
    id: "arithmetic",
    title: "加减法",
    icon: "✏️",
    bgFrom: "#2EC4B6",
    bgTo: "#CBF3F0",
    description: "学习加减运算",
    badgeColor: "bg-teal-100 text-teal-600",
  },
  {
    id: "matching",
    title: "数字配对",
    icon: "🎯",
    bgFrom: "#E71D36",
    bgTo: "#FF6B6B",
    description: "配对找朋友",
    badgeColor: "bg-red-100 text-red-600",
  },
  {
    id: "comparison",
    title: "大小比较",
    icon: "⚖️",
    bgFrom: "#011627",
    bgTo: "#FDFFFC",
    description: "比大小学符号",
    badgeColor: "bg-blue-100 text-blue-600",
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 pt-16 pb-24 px-6 relative overflow-hidden">
        {/* Floating shapes decoration */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/10 rounded-full"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-4 transform -rotate-6">
              <span className="text-5xl">🎮</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            快乐学数学
          </h1>

          <p className="text-xl md:text-2xl text-white/90 font-medium mb-8" style={{ fontFamily: 'Nunito, sans-serif' }}>
            有趣的游戏，轻松的学习
          </p>

          {showInstall && (
            <button
              onClick={handleInstall}
              className="px-6 py-3 bg-white text-teal-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              📱 安装应用
            </button>
          )}
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => router.push(`/games/${game.id}`)}
              className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border-4 border-white"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${game.bgFrom} 0%, ${game.bgTo} 100%)`,
                  }}
                >
                  {game.icon}
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${game.badgeColor}`}>
                  3-6岁
                </div>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-800 mb-3 text-left" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                {game.title}
              </h2>

              <p className="text-lg text-slate-500 mb-6 text-left font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {game.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <span>开始</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-slate-200"
                      style={{
                        background: `linear-gradient(135deg, ${game.bgFrom} 0%, ${game.bgTo} 100%)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-20 pb-16 px-6">
        <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-full shadow-md">
          <span className="text-3xl">⭐</span>
          <p className="text-slate-600 font-bold text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
            专为小朋友设计的数学游戏
          </p>
          <span className="text-3xl">🌈</span>
        </div>
      </div>

      {/* Bottom decoration wave */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
    </div>
  );
}
