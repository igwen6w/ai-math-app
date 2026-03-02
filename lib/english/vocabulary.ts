// English vocabulary database for children's learning games
// Target age: 3-6 years old
// 60 words across 8 categories, 3 difficulty levels

export enum WordCategory {
  ANIMALS = 'animals',
  FRUITS = 'fruits',
  COLORS = 'colors',
  NUMBERS = 'numbers',
  FAMILY = 'family',
  BODY = 'body',
  CLOTHES = 'clothes',
  FOOD = 'food',
}

export interface Word {
  id: string;
  word: string;
  category: WordCategory;
  level: number; // 1=入门(2-4岁), 2=初级(3-5岁), 3=中级(4-6岁)
  emoji: string;
  phonetic?: string;
  translations: {
    zh: string;
  };
}

// Complete vocabulary database - 60 words
export const VOCABULARY: Word[] = [
  // ==================== ANIMALS (10 words) ====================
  {
    id: "dog",
    word: "dog",
    category: WordCategory.ANIMALS,
    level: 1,
    emoji: "🐶",
    phonetic: "/dɔːɡ/",
    translations: { zh: "狗" }
  },
  {
    id: "cat",
    word: "cat",
    category: WordCategory.ANIMALS,
    level: 1,
    emoji: "🐱",
    phonetic: "/kæt/",
    translations: { zh: "猫" }
  },
  {
    id: "bird",
    word: "bird",
    category: WordCategory.ANIMALS,
    level: 1,
    emoji: "🐦",
    phonetic: "/bɜːrd/",
    translations: { zh: "鸟" }
  },
  {
    id: "fish",
    word: "fish",
    category: WordCategory.ANIMALS,
    level: 1,
    emoji: "🐟",
    phonetic: "/fɪʃ/",
    translations: { zh: "鱼" }
  },
  {
    id: "rabbit",
    word: "rabbit",
    category: WordCategory.ANIMALS,
    level: 2,
    emoji: "🐰",
    phonetic: "/ˈræbɪt/",
    translations: { zh: "兔子" }
  },
  {
    id: "duck",
    word: "duck",
    category: WordCategory.ANIMALS,
    level: 2,
    emoji: "🦆",
    phonetic: "/dʌk/",
    translations: { zh: "鸭子" }
  },
  {
    id: "elephant",
    word: "elephant",
    category: WordCategory.ANIMALS,
    level: 3,
    emoji: "🐘",
    phonetic: "/ˈelɪfənt/",
    translations: { zh: "大象" }
  },
  {
    id: "lion",
    word: "lion",
    category: WordCategory.ANIMALS,
    level: 3,
    emoji: "🦁",
    phonetic: "/ˈlaɪən/",
    translations: { zh: "狮子" }
  },
  {
    id: "monkey",
    word: "monkey",
    category: WordCategory.ANIMALS,
    level: 3,
    emoji: "🐵",
    phonetic: "/ˈmʌŋki/",
    translations: { zh: "猴子" }
  },
  {
    id: "panda",
    word: "panda",
    category: WordCategory.ANIMALS,
    level: 2,
    emoji: "🐼",
    phonetic: "/ˈpændə/",
    translations: { zh: "熊猫" }
  },

  // ==================== FRUITS (8 words) ====================
  {
    id: "apple",
    word: "apple",
    category: WordCategory.FRUITS,
    level: 1,
    emoji: "🍎",
    phonetic: "/ˈæpl/",
    translations: { zh: "苹果" }
  },
  {
    id: "banana",
    word: "banana",
    category: WordCategory.FRUITS,
    level: 1,
    emoji: "🍌",
    phonetic: "/bəˈnænə/",
    translations: { zh: "香蕉" }
  },
  {
    id: "orange",
    word: "orange",
    category: WordCategory.FRUITS,
    level: 1,
    emoji: "🍊",
    phonetic: "/ˈɔːrɪndʒ/",
    translations: { zh: "橙子" }
  },
  {
    id: "grape",
    word: "grape",
    category: WordCategory.FRUITS,
    level: 2,
    emoji: "🍇",
    phonetic: "/ɡreɪp/",
    translations: { zh: "葡萄" }
  },
  {
    id: "strawberry",
    word: "strawberry",
    category: WordCategory.FRUITS,
    level: 2,
    emoji: "🍓",
    phonetic: "/ˈstrɔːberi/",
    translations: { zh: "草莓" }
  },
  {
    id: "watermelon",
    word: "watermelon",
    category: WordCategory.FRUITS,
    level: 2,
    emoji: "🍉",
    phonetic: "/ˈwɔːtərmelən/",
    translations: { zh: "西瓜" }
  },
  {
    id: "peach",
    word: "peach",
    category: WordCategory.FRUITS,
    level: 3,
    emoji: "🍑",
    phonetic: "/piːtʃ/",
    translations: { zh: "桃子" }
  },
  {
    id: "cherry",
    word: "cherry",
    category: WordCategory.FRUITS,
    level: 3,
    emoji: "🍒",
    phonetic: "/ˈtʃeri/",
    translations: { zh: "樱桃" }
  },

  // ==================== COLORS (6 words) ====================
  {
    id: "red",
    word: "red",
    category: WordCategory.COLORS,
    level: 1,
    emoji: "🔴",
    phonetic: "/red/",
    translations: { zh: "红色" }
  },
  {
    id: "blue",
    word: "blue",
    category: WordCategory.COLORS,
    level: 1,
    emoji: "🔵",
    phonetic: "/bluː/",
    translations: { zh: "蓝色" }
  },
  {
    id: "green",
    word: "green",
    category: WordCategory.COLORS,
    level: 1,
    emoji: "🟢",
    phonetic: "/ɡriːn/",
    translations: { zh: "绿色" }
  },
  {
    id: "yellow",
    word: "yellow",
    category: WordCategory.COLORS,
    level: 1,
    emoji: "🟡",
    phonetic: "/ˈjeloʊ/",
    translations: { zh: "黄色" }
  },
  {
    id: "purple",
    word: "purple",
    category: WordCategory.COLORS,
    level: 2,
    emoji: "🟣",
    phonetic: "/ˈpɜːrpl/",
    translations: { zh: "紫色" }
  },
  {
    id: "orange-color",
    word: "orange",
    category: WordCategory.COLORS,
    level: 2,
    emoji: "🟠",
    phonetic: "/ˈɔːrɪndʒ/",
    translations: { zh: "橙色" }
  },

  // ==================== NUMBERS (10 words) ====================
  {
    id: "one",
    word: "one",
    category: WordCategory.NUMBERS,
    level: 1,
    emoji: "1️⃣",
    phonetic: "/wʌn/",
    translations: { zh: "一" }
  },
  {
    id: "two",
    word: "two",
    category: WordCategory.NUMBERS,
    level: 1,
    emoji: "2️⃣",
    phonetic: "/tuː/",
    translations: { zh: "二" }
  },
  {
    id: "three",
    word: "three",
    category: WordCategory.NUMBERS,
    level: 1,
    emoji: "3️⃣",
    phonetic: "/θriː/",
    translations: { zh: "三" }
  },
  {
    id: "four",
    word: "four",
    category: WordCategory.NUMBERS,
    level: 1,
    emoji: "4️⃣",
    phonetic: "/fɔːr/",
    translations: { zh: "四" }
  },
  {
    id: "five",
    word: "five",
    category: WordCategory.NUMBERS,
    level: 1,
    emoji: "5️⃣",
    phonetic: "/faɪv/",
    translations: { zh: "五" }
  },
  {
    id: "six",
    word: "six",
    category: WordCategory.NUMBERS,
    level: 2,
    emoji: "6️⃣",
    phonetic: "/sɪks/",
    translations: { zh: "六" }
  },
  {
    id: "seven",
    word: "seven",
    category: WordCategory.NUMBERS,
    level: 2,
    emoji: "7️⃣",
    phonetic: "/ˈsevn/",
    translations: { zh: "七" }
  },
  {
    id: "eight",
    word: "eight",
    category: WordCategory.NUMBERS,
    level: 2,
    emoji: "8️⃣",
    phonetic: "/eɪt/",
    translations: { zh: "八" }
  },
  {
    id: "nine",
    word: "nine",
    category: WordCategory.NUMBERS,
    level: 3,
    emoji: "9️⃣",
    phonetic: "/naɪn/",
    translations: { zh: "九" }
  },
  {
    id: "ten",
    word: "ten",
    category: WordCategory.NUMBERS,
    level: 3,
    emoji: "🔟",
    phonetic: "/ten/",
    translations: { zh: "十" }
  },

  // ==================== FAMILY (6 words) ====================
  {
    id: "mom",
    word: "mom",
    category: WordCategory.FAMILY,
    level: 1,
    emoji: "👩",
    phonetic: "/mɑːm/",
    translations: { zh: "妈妈" }
  },
  {
    id: "dad",
    word: "dad",
    category: WordCategory.FAMILY,
    level: 1,
    emoji: "👨",
    phonetic: "/dæd/",
    translations: { zh: "爸爸" }
  },
  {
    id: "baby",
    word: "baby",
    category: WordCategory.FAMILY,
    level: 2,
    emoji: "👶",
    phonetic: "/ˈbeɪbi/",
    translations: { zh: "宝宝" }
  },
  {
    id: "brother",
    word: "brother",
    category: WordCategory.FAMILY,
    level: 3,
    emoji: "👦",
    phonetic: "/ˈbrʌðər/",
    translations: { zh: "哥哥/弟弟" }
  },
  {
    id: "sister",
    word: "sister",
    category: WordCategory.FAMILY,
    level: 3,
    emoji: "👧",
    phonetic: "/ˈsɪstər/",
    translations: { zh: "姐姐/妹妹" }
  },
  {
    id: "grandma",
    word: "grandma",
    category: WordCategory.FAMILY,
    level: 2,
    emoji: "👵",
    phonetic: "/ˈɡrænmɑː/",
    translations: { zh: "奶奶/外婆" }
  },

  // ==================== BODY (6 words) ====================
  {
    id: "eye",
    word: "eye",
    category: WordCategory.BODY,
    level: 1,
    emoji: "👁️",
    phonetic: "/aɪ/",
    translations: { zh: "眼睛" }
  },
  {
    id: "nose",
    word: "nose",
    category: WordCategory.BODY,
    level: 1,
    emoji: "👃",
    phonetic: "/noʊz/",
    translations: { zh: "鼻子" }
  },
  {
    id: "mouth",
    word: "mouth",
    category: WordCategory.BODY,
    level: 1,
    emoji: "👄",
    phonetic: "/maʊθ/",
    translations: { zh: "嘴巴" }
  },
  {
    id: "hand",
    word: "hand",
    category: WordCategory.BODY,
    level: 2,
    emoji: "✋",
    phonetic: "/hænd/",
    translations: { zh: "手" }
  },
  {
    id: "foot",
    word: "foot",
    category: WordCategory.BODY,
    level: 2,
    emoji: "🦶",
    phonetic: "/fʊt/",
    translations: { zh: "脚" }
  },
  {
    id: "ear",
    word: "ear",
    category: WordCategory.BODY,
    level: 3,
    emoji: "👂",
    phonetic: "/ɪr/",
    translations: { zh: "耳朵" }
  },

  // ==================== CLOTHES (7 words) ====================
  {
    id: "hat",
    word: "hat",
    category: WordCategory.CLOTHES,
    level: 1,
    emoji: "🎩",
    phonetic: "/hæt/",
    translations: { zh: "帽子" }
  },
  {
    id: "shirt",
    word: "shirt",
    category: WordCategory.CLOTHES,
    level: 2,
    emoji: "👕",
    phonetic: "/ʃɜːrt/",
    translations: { zh: "衬衫" }
  },
  {
    id: "shoe",
    word: "shoe",
    category: WordCategory.CLOTHES,
    level: 2,
    emoji: "👞",
    phonetic: "/ʃuː/",
    translations: { zh: "鞋子" }
  },
  {
    id: "dress",
    word: "dress",
    category: WordCategory.CLOTHES,
    level: 2,
    emoji: "👗",
    phonetic: "/dres/",
    translations: { zh: "连衣裙" }
  },
  {
    id: "pants",
    word: "pants",
    category: WordCategory.CLOTHES,
    level: 3,
    emoji: "👖",
    phonetic: "/pænts/",
    translations: { zh: "裤子" }
  },
  {
    id: "sock",
    word: "sock",
    category: WordCategory.CLOTHES,
    level: 3,
    emoji: "🧦",
    phonetic: "/sɑːk/",
    translations: { zh: "袜子" }
  },
  {
    id: "coat",
    word: "coat",
    category: WordCategory.CLOTHES,
    level: 3,
    emoji: "🧥",
    phonetic: "/koʊt/",
    translations: { zh: "外套" }
  },

  // ==================== FOOD (7 words) ====================
  {
    id: "bread",
    word: "bread",
    category: WordCategory.FOOD,
    level: 2,
    emoji: "🍞",
    phonetic: "/bred/",
    translations: { zh: "面包" }
  },
  {
    id: "milk",
    word: "milk",
    category: WordCategory.FOOD,
    level: 2,
    emoji: "🥛",
    phonetic: "/mɪlk/",
    translations: { zh: "牛奶" }
  },
  {
    id: "egg",
    word: "egg",
    category: WordCategory.FOOD,
    level: 2,
    emoji: "🥚",
    phonetic: "/eɡ/",
    translations: { zh: "鸡蛋" }
  },
  {
    id: "cake",
    word: "cake",
    category: WordCategory.FOOD,
    level: 3,
    emoji: "🍰",
    phonetic: "/keɪk/",
    translations: { zh: "蛋糕" }
  },
  {
    id: "ice-cream",
    word: "ice cream",
    category: WordCategory.FOOD,
    level: 3,
    emoji: "🍦",
    phonetic: "/ˈaɪs kriːm/",
    translations: { zh: "冰淇淋" }
  },
  {
    id: "cookie",
    word: "cookie",
    category: WordCategory.FOOD,
    level: 3,
    emoji: "🍪",
    phonetic: "/ˈkʊki/",
    translations: { zh: "饼干" }
  },
  {
    id: "pizza",
    word: "pizza",
    category: WordCategory.FOOD,
    level: 2,
    emoji: "🍕",
    phonetic: "/ˈpiːtsə/",
    translations: { zh: "披萨" }
  },
];

// Helper functions for vocabulary access
export function getWordsByCategory(category: WordCategory): Word[] {
  return VOCABULARY.filter(word => word.category === category);
}

export function getWordsByLevel(level: number): Word[] {
  return VOCABULARY.filter(word => word.level === level);
}

export function getWordById(id: string): Word | undefined {
  return VOCABULARY.find(word => word.id === id);
}

export function getRandomWords(count: number, level?: number): Word[] {
  let pool = level ? getWordsByLevel(level) : [...VOCABULARY];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getWordsForGame(count: number, categories?: WordCategory[]): Word[] {
  let pool = categories
    ? VOCABULARY.filter(word => categories.includes(word.category))
    : [...VOCABULARY];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Category metadata for UI display
export const CATEGORY_INFO = {
  [WordCategory.ANIMALS]: { emoji: "🐾", label: "Animals", labelZh: "动物" },
  [WordCategory.FRUITS]: { emoji: "🍎", label: "Fruits", labelZh: "水果" },
  [WordCategory.COLORS]: { emoji: "🎨", label: "Colors", labelZh: "颜色" },
  [WordCategory.NUMBERS]: { emoji: "🔢", label: "Numbers", labelZh: "数字" },
  [WordCategory.FAMILY]: { emoji: "👨‍👩‍👧‍👦", label: "Family", labelZh: "家庭" },
  [WordCategory.BODY]: { emoji: "👤", label: "Body", labelZh: "身体" },
  [WordCategory.CLOTHES]: { emoji: "👔", label: "Clothes", labelZh: "衣服" },
  [WordCategory.FOOD]: { emoji: "🍽️", label: "Food", labelZh: "食物" },
};

// Level metadata for UI display
export const LEVEL_INFO = {
  1: { label: "Level 1", labelZh: "入门", ageRange: "2-4岁", color: "bg-green-500" },
  2: { label: "Level 2", labelZh: "初级", ageRange: "3-5岁", color: "bg-blue-500" },
  3: { label: "Level 3", labelZh: "中级", ageRange: "4-6岁", color: "bg-purple-500" },
};
