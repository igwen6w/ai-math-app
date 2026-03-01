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

const EMOJIS = ["⭐", "🍎", "🎈", "🎁", "🌟", "🦋"];

export default function MatchingGame() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const initializeGame = () => {
    const pairs = 6; // 6 pairs = 12 cards
    const values = Array.from({ length: pairs }, (_, i) => i + 1);

    const newCards: Card[] = [];
    values.forEach((value, index) => {
      // Number card
      newCards.push({
        id: index * 2,
        value,
        type: "number",
        flipped: false,
        matched: false,
      });
      // Dots card
      newCards.push({
        id: index * 2 + 1,
        value,
        type: "dots",
        flipped: false,
        matched: false,
      });
    });

    // Shuffle
    const shuffled = newCards
      .map((card) => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ card }) => card);

    setCards(shuffled);
    setFlipped([]);
    setScore(0);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

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
        // Match!
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
        // No match
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
      <span key={i} className="text-2xl md:text-3xl">
        {EMOJIS[count % EMOJIS.length]}
      </span>
    ));
  };

  const isGameComplete = matches === 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/30"
        >
          ← 返回
        </button>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold">
            得分: {score}
          </div>
          <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold">
            步数: {moves}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {!isGameComplete ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              配对相同的数字和数量
            </h1>

            {/* Cards Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-2xl">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.flipped || card.matched}
                  className={`aspect-square rounded-2xl shadow-xl transition-all duration-300
                    ${
                      card.matched
                        ? "bg-green-500/50 scale-95"
                        : card.flipped
                        ? "bg-white"
                        : "bg-white/20 hover:bg-white/30 active:scale-95"
                    }`}
                >
                  {card.flipped || card.matched ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      {card.type === "number" ? (
                        <span className="text-5xl md:text-6xl font-bold text-purple-600">
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
                      <span className="text-4xl text-white/50">❓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              恭喜完成！
            </h2>
            <p className="text-2xl text-white/90 mb-2">得分: {score}</p>
            <p className="text-xl text-white/90 mb-8">步数: {moves}</p>
            <button
              onClick={initializeGame}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-xl hover:bg-white/90 active:scale-95"
            >
              再玩一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
