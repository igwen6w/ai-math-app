"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Game = {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  color: string;
  description: string;
};

const games: Game[] = [
  {
    id: "counting",
    title: "数数游戏",
    titleEn: "Counting",
    icon: "🔢",
    color: "from-blue-400 to-blue-600",
    description: "学习从1数到10",
  },
  {
    id: "arithmetic",
    title: "加减法",
    titleEn: "Math",
    icon: "➕",
    color: "from-green-400 to-green-600",
    description: "简单的加减运算",
  },
  {
    id: "matching",
    title: "数字配对",
    titleEn: "Matching",
    icon: "🎴",
    color: "from-purple-400 to-purple-600",
    description: "数字与数量配对",
  },
  {
    id: "comparison",
    title: "大小比较",
    titleEn: "Compare",
    icon: "⚖️",
    color: "from-orange-400 to-orange-600",
    description: "学习大于小于",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            🧮 数学乐园
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow">
            快乐学数学，轻松又有趣！
          </p>
          {showInstall && (
            <button
              onClick={handleInstall}
              className="mt-4 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/30 active:scale-95"
            >
              📱 安装应用
            </button>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => router.push(`/games/${game.id}`)}
              className={`bg-gradient-to-br ${game.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl active:scale-95 text-left`}
            >
              <div className="text-6xl md:text-7xl mb-4">{game.icon}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {game.title}
              </h2>
              <p className="text-lg text-white/90">{game.description}</p>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/80">
          <p className="text-sm">专为 iPad 设计 · 支持 PWA · 离线可用</p>
        </div>
      </div>
    </div>
  );
}
