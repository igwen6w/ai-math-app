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
  shadowColor: string;
};

const games: Game[] = [
  {
    id: "counting",
    title: "数数游戏",
    icon: "🔢",
    bgFrom: "#FF9F1C",
    bgTo: "#FFBF69",
    description: "认识数字1-10，和可爱的小动物一起数",
    badgeColor: "bg-orange-100 text-orange-600",
    shadowColor: "rgba(255, 159, 28, 0.3)",
  },
  {
    id: "arithmetic",
    title: "加减法",
    icon: "✏️",
    bgFrom: "#2EC4B6",
    bgTo: "#CBF3F0",
    description: "学习加减运算，水果帮你算",
    badgeColor: "bg-teal-100 text-teal-600",
    shadowColor: "rgba(46, 196, 182, 0.3)",
  },
  {
    id: "matching",
    title: "数字配对",
    icon: "🎯",
    bgFrom: "#E71D36",
    bgTo: "#FF6B6B",
    description: "配对找朋友，考验记忆力",
    badgeColor: "bg-red-100 text-red-600",
    shadowColor: "rgba(231, 29, 54, 0.3)",
  },
  {
    id: "comparison",
    title: "大小比较",
    icon: "⚖️",
    bgFrom: "#667eea",
    bgTo: "#764ba2",
    description: "比大小学符号，谁多谁少",
    badgeColor: "bg-purple-100 text-purple-600",
    shadowColor: "rgba(102, 126, 234, 0.3)",
  },
];

// 浮动装饰圆圈组件
const FloatingCircles = () => (
  <>
    {/* 大圆圈 - 左上 */}
    <div className="absolute top-8 left-[5%] w-24 h-24 bg-white/10 rounded-full animate-float-slow" />
    <div className="absolute top-12 left-[8%] w-16 h-16 bg-white/5 rounded-full animate-float-medium" />
    
    {/* 中等圆圈 - 右上 */}
    <div className="absolute top-16 right-[10%] w-20 h-20 bg-white/15 rounded-full animate-float-medium" />
    <div className="absolute top-24 right-[5%] w-12 h-12 bg-white/10 rounded-full animate-float-slow" />
    
    {/* 底部装饰 */}
    <div className="absolute bottom-20 left-[15%] w-32 h-32 bg-white/5 rounded-full animate-float-slow" />
    <div className="absolute bottom-16 right-[20%] w-20 h-20 bg-white/8 rounded-full animate-float-medium" />
    <div className="absolute bottom-32 left-[40%] w-16 h-16 bg-white/10 rounded-full animate-float-fast" />
    
    {/* 小装饰点 */}
    <div className="absolute top-1/3 left-[3%] w-4 h-4 bg-white/20 rounded-full animate-pulse" />
    <div className="absolute top-1/2 right-[8%] w-6 h-6 bg-white/15 rounded-full animate-pulse delay-300" />
    <div className="absolute top-2/3 left-[25%] w-3 h-3 bg-white/25 rounded-full animate-pulse delay-700" />
    
    {/* 星星装饰 */}
    <div className="absolute top-20 left-[30%] text-white/20 text-2xl animate-twinkle">✦</div>
    <div className="absolute top-32 right-[25%] text-white/15 text-xl animate-twinkle delay-500">✦</div>
    <div className="absolute bottom-40 right-[40%] text-white/20 text-lg animate-twinkle delay-1000">✦</div>
  </>
);

export default function Home() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* 全局背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.05)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 pt-16 pb-28 px-6 overflow-hidden">
        <FloatingCircles />
        
        {/* 额外的波浪装饰 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80V40C240 70 480 10 720 40C960 70 1200 10 1440 40V80H0Z" fill="#f8fafc"/>
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* 应用图标 */}
          <div className="inline-block mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-[1.75rem] shadow-2xl flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="text-6xl">🎮</span>
              </div>
              {/* 图标光晕效果 */}
              <div className="absolute inset-0 w-24 h-24 bg-white/30 rounded-[1.75rem] blur-xl -z-10 animate-pulse" />
            </div>
          </div>

          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 drop-shadow-lg"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            快乐学数学
          </h1>

          <p 
            className="text-xl md:text-2xl text-white/95 font-semibold mb-8"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            有趣的游戏，轻松的学习
          </p>

          {/* 安装按钮 */}
          {showInstall && (
            <button
              onClick={handleInstall}
              className="px-8 py-4 bg-white text-teal-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <span>📱</span>
              <span>安装应用到主屏幕</span>
            </button>
          )}
        </div>
      </header>

      {/* Games Grid */}
      <main className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => router.push(`/games/${game.id}`)}
              onMouseEnter={() => setHoveredCard(game.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-white rounded-[2rem] p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-white hover:border-slate-100 text-left overflow-hidden"
              style={{
                boxShadow: hoveredCard === game.id 
                  ? `0 25px 50px -12px ${game.shadowColor}` 
                  : '0 10px 40px -10px rgba(0,0,0,0.1)',
                transform: hoveredCard === game.id ? 'translateY(-8px)' : 'translateY(0)',
              }}
            >
              {/* 卡片悬停时的渐变背景 */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${game.bgFrom}08 0%, ${game.bgTo}08 100%)`,
                }}
              />

              <div className="relative z-10">
                {/* 顶部区域：图标 + 年龄徽章 */}
                <div className="flex items-start justify-between mb-6">
                  {/* 游戏图标 */}
                  <div
                    className="w-24 h-24 lg:w-28 lg:h-28 rounded-[1.5rem] flex items-center justify-center text-5xl lg:text-6xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${game.bgFrom} 0%, ${game.bgTo} 100%)`,
                    }}
                  >
                    {game.icon}
                  </div>
                  
                  {/* 年龄徽章 */}
                  <div className={`px-4 py-2 rounded-full text-sm font-extrabold ${game.badgeColor} shadow-sm`}>
                    3-6岁
                  </div>
                </div>

                {/* 游戏标题 */}
                <h2 
                  className="text-2xl lg:text-3xl font-extrabold text-slate-800 mb-3 group-hover:text-slate-700 transition-colors"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {game.title}
                </h2>

                {/* 游戏描述 */}
                <p 
                  className="text-base lg:text-lg text-slate-500 mb-6 font-medium"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {game.description}
                </p>

                {/* 底部：开始按钮 + 进度指示器 */}
                <div className="flex items-center justify-between">
                  {/* 开始游戏 */}
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-lg group-hover:text-teal-600 transition-colors">
                    <span>开始游戏</span>
                    <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>

                  {/* 进度点指示器 */}
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          background: i === 0 
                            ? `linear-gradient(135deg, ${game.bgFrom} 0%, ${game.bgTo} 100%)`
                            : '#e2e8f0',
                          transform: hoveredCard === game.id && i === 0 ? 'scale(1.2)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 卡片右下角装饰 */}
              <div 
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${game.bgFrom} 0%, ${game.bgTo} 100%)`,
                }}
              />
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center mt-20 pb-24 px-6 relative">
        {/* 装饰云朵 */}
        <div className="absolute top-0 left-[10%] text-4xl opacity-20 animate-float-slow">☁️</div>
        <div className="absolute top-4 right-[15%] text-3xl opacity-20 animate-float-medium">☁️</div>
        
        {/* 主要页脚内容 */}
        <div className="relative inline-flex flex-col items-center gap-6">
          {/* 星星装饰 */}
          <div className="absolute -top-8 -left-12 text-2xl animate-twinkle">⭐</div>
          <div className="absolute -top-6 -right-10 text-xl animate-twinkle delay-300">⭐</div>
          <div className="absolute top-1/2 -left-16 text-lg animate-twinkle delay-500">✨</div>
          <div className="absolute top-1/2 -right-14 text-xl animate-twinkle delay-700">✨</div>
          
          {/* 彩虹 */}
          <div className="text-5xl animate-bounce-subtle">🌈</div>
          
          {/* 主标语卡片 */}
          <div className="px-8 py-5 bg-white rounded-2xl shadow-lg border border-slate-100">
            <p 
              className="text-slate-600 font-bold text-lg"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              专为小朋友设计的数学游戏
            </p>
          </div>
          
          {/* 底部小字 */}
          <p className="text-slate-400 text-sm font-medium">
            安全 • 有趣 • 寓教于乐
          </p>
        </div>
      </footer>

      {/* 底部彩色装饰条 */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-teal-400 via-purple-400 to-blue-500" />
    </div>
  );
}
