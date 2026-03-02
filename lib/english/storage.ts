// Local storage utility for English learning games progress tracking
// Stores user progress, stars, and game completion data

export interface LevelProgress {
  completed: boolean;
  stars: number;        // 0-3 stars
  bestScore: number;    // Best score achieved
  attempts: number;     // Number of times played
  lastPlayedAt?: number;  // Timestamp
}

export interface GameProgress {
  levels: {
    [levelId: string]: LevelProgress;
  };
  totalStars: number;
  totalAttempts: number;
}

export interface UserProgress {
  version: string;      // For data migration
  totalStars: number;
  totalPoints: number;
  games: {
    [gameId: string]: GameProgress;
  };
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    autoPlayAudio: boolean;
  };
  achievements: string[];  // Achievement IDs
  lastUpdated: number;     // Timestamp
}

export const STORAGE_KEY = 'english_learning_progress';

// Current data version
export const DATA_VERSION = '1.0.0';

// Initial empty progress
export const initialProgress: UserProgress = {
  version: DATA_VERSION,
  totalStars: 0,
  totalPoints: 0,
  games: {},
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    autoPlayAudio: true,
  },
  achievements: [],
  lastUpdated: Date.now(),
};

export class GameStorage {
  /**
   * Load user progress from localStorage
   */
  loadProgress(): UserProgress {
    if (typeof window === 'undefined') {
      return initialProgress;
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return initialProgress;
      }

      const progress = JSON.parse(data) as UserProgress;

      // Migration: Add missing fields if version doesn't match
      if (progress.version !== DATA_VERSION) {
        return this.migrateProgress(progress);
      }

      return progress;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return initialProgress;
    }
  }

  /**
   * Save user progress to localStorage
   */
  saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      progress.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  /**
   * Reset all progress (clear localStorage)
   */
  clearProgress(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }

  /**
   * Update level progress after a game completion
   */
  updateLevelProgress(
    gameId: string,
    levelId: string,
    stars: number,
    score: number
  ): UserProgress {
    const progress = this.loadProgress();

    // Initialize game progress if doesn't exist
    if (!progress.games[gameId]) {
      progress.games[gameId] = {
        levels: {},
        totalStars: 0,
        totalAttempts: 0,
      };
    }

    const gameProgress = progress.games[gameId];

    // Initialize level progress if doesn't exist
    if (!gameProgress.levels[levelId]) {
      gameProgress.levels[levelId] = {
        completed: false,
        stars: 0,
        bestScore: 0,
        attempts: 0,
      };
    }

    const levelProgress = gameProgress.levels[levelId];

    // Update attempts
    levelProgress.attempts += 1;
    gameProgress.totalAttempts += 1;

    // Update stars (keep the best)
    const oldStars = levelProgress.stars;
    levelProgress.stars = Math.max(levelProgress.stars, stars);
    gameProgress.totalStars += (levelProgress.stars - oldStars);

    // Update best score
    levelProgress.bestScore = Math.max(levelProgress.bestScore, score);

    // Mark as completed if stars > 0
    if (stars > 0) {
      levelProgress.completed = true;
    }

    // Update timestamp
    levelProgress.lastPlayedAt = Date.now();

    // Recalculate total stars
    progress.totalStars = Object.values(progress.games).reduce(
      (sum, game) => sum + game.totalStars,
      0
    );

    // Calculate total points (stars * 10)
    progress.totalPoints = progress.totalStars * 10;

    // Save and return
    this.saveProgress(progress);
    return progress;
  }

  /**
   * Get progress for a specific game
   */
  getGameProgress(gameId: string): GameProgress | null {
    const progress = this.loadProgress();
    return progress.games[gameId] || null;
  }

  /**
   * Get progress for a specific level
   */
  getLevelProgress(gameId: string, levelId: string): LevelProgress | null {
    const gameProgress = this.getGameProgress(gameId);
    if (!gameProgress || !gameProgress.levels[levelId]) {
      return null;
    }
    return gameProgress.levels[levelId];
  }

  /**
   * Update settings
   */
  updateSettings(settings: Partial<UserProgress['settings']>): void {
    const progress = this.loadProgress();
    progress.settings = {
      ...progress.settings,
      ...settings,
    };
    this.saveProgress(progress);
  }

  /**
   * Get settings
   */
  getSettings(): UserProgress['settings'] {
    const progress = this.loadProgress();
    return progress.settings;
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(achievementId: string): void {
    const progress = this.loadProgress();
    if (!progress.achievements.includes(achievementId)) {
      progress.achievements.push(achievementId);
      this.saveProgress(progress);
    }
  }

  /**
   * Check if achievement is unlocked
   */
  hasAchievement(achievementId: string): boolean {
    const progress = this.loadProgress();
    return progress.achievements.includes(achievementId);
  }

  /**
   * Migrate old progress data to new version
   */
  private migrateProgress(oldProgress: any): UserProgress {
    // Add missing fields from old versions
    const migrated: UserProgress = {
      ...initialProgress,
      ...oldProgress,
      version: DATA_VERSION,
    };

    // Ensure games structure exists
    if (!migrated.games) {
      migrated.games = {};
    }

    // Ensure settings exist
    if (!migrated.settings) {
      migrated.settings = initialProgress.settings;
    }

    // Recalculate totals
    migrated.totalStars = Object.values(migrated.games).reduce(
      (sum, game) => sum + (game.totalStars || 0),
      0
    );
    migrated.totalPoints = migrated.totalStars * 10;

    this.saveProgress(migrated);
    return migrated;
  }

  /**
   * Export progress as JSON (for backup)
   */
  exportProgress(): string {
    const progress = this.loadProgress();
    return JSON.stringify(progress, null, 2);
  }

  /**
   * Import progress from JSON (for restore)
   */
  importProgress(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as UserProgress;
      const migrated = this.migrateProgress(imported);
      this.saveProgress(migrated);
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  }

  /**
   * Get statistics summary
   */
  getStatistics(): {
    totalStars: number;
    totalPoints: number;
    gamesPlayed: number;
    levelsCompleted: number;
    totalAttempts: number;
  } {
    const progress = this.loadProgress();

    let gamesPlayed = 0;
    let levelsCompleted = 0;
    let totalAttempts = 0;

    Object.values(progress.games).forEach(game => {
      gamesPlayed += 1;
      totalAttempts += game.totalAttempts;
      Object.values(game.levels).forEach(level => {
        if (level.completed) {
          levelsCompleted += 1;
        }
      });
    });

    return {
      totalStars: progress.totalStars,
      totalPoints: progress.totalPoints,
      gamesPlayed,
      levelsCompleted,
      totalAttempts,
    };
  }
}

// Singleton instance
export const storage = new GameStorage();

// Convenience functions
export function loadProgress(): UserProgress {
  return storage.loadProgress();
}

export function saveProgress(progress: UserProgress): void {
  storage.saveProgress(progress);
}

export function updateLevelProgress(
  gameId: string,
  levelId: string,
  stars: number,
  score: number
): UserProgress {
  return storage.updateLevelProgress(gameId, levelId, stars, score);
}

export function getStatistics() {
  return storage.getStatistics();
}
