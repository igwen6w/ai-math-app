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
  textColor: string;
};

const games: Game[] = [
  {
    id: "counting",
    title: "数数游戏",
    icon: "🔢",
    bgFrom: "#FF6B6B",
    bgTo: "#FF8E8E",
    description: "认识数字1-10",
    textColor: "text-white",
  },
  {
    id: "arithmetic",
    title: "加减法",
    icon: "➕",
    bgFrom: "#4ECDC4",
    bgTo: "#7EDCD6",
    description: "学习加减运算",
    textColor: "text-white",
  },
  {
    id: "matching",
    title: "数字配对",
    icon: "🎯",
    bgFrom: "#FFE66D",
    bgTo: "#FFF0A0",
    description: "配对找朋友",
    textColor: "text-gray-800",
  },
  {
    id: "comparison",
    title: "大小比较",
    icon: "⚖️",
    bgFrom: "#95E1D3",
    bgTo: "#B8F0E6",
    description: "比大小学符号",
    textColor: "text-gray-800",
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-teal-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <div className="w-28 h-28 mx-auto bg-gradient-to-br from-orange-400 to-pink-500 rounded-[2rem] shadow-2xl flex items-center justify-center mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-6xl">🎮</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <span className="text-orange-500">快乐</span>
            <span className="text-pink-500">数学</span>
          </h1>

          <p className="text-2xl text-gray-600 font-medium mb-8">
            在游戏中学习，在快乐中成长
          </p>

          {showInstall && (
            <button
              onClick={handleInstall}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200"
            >
              📱 安装应用
            </button>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => router.push(`/games/${game.id}`)}
              className="group relative overflow-hidden rounded-3xl p-1 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                background: `linear-gradient(135deg, ${game.bgFrom} 0%, ${game.bgTo} 100%)`,
              }}
            >
              <div className="bg-white rounded-[1.7rem] p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-md text-6xl"
                    style={{
                      background: `linear-gradient(135deg, ${game.bgFrom} 0%, ${game.bgTo} 100%)`,
                    }}
                  >
                    {game.icon}
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full opacity-40"
                        style={{
                          background: `linear-gradient(135deg, ${game.bgFrom} 0%, ${game.bgTo} 100%)`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <h2 className="text-3xl font-black text-gray-800 mb-3 text-left">
                  {game.title}
                </h2>

                <p className="text-lg text-gray-500 mb-6 text-left font-medium">
                  {game.description}
                </p>

                <div className={`flex items-center gap-2 font-bold ${game.textColor === 'text-white' ? 'text-gray-700' : 'text-gray-600'}`}>
                  <span className="text-lg">开始游戏</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-full shadow-md">
            <span className="text-2xl">🎨</span>
            <p className="text-gray-600 font-semibold text-lg">
              专为3-6岁儿童设计
            </p>
            <span className="text-2xl">💫</span>
          </div>
        </div>
      </div>
    </div>
  );
}
