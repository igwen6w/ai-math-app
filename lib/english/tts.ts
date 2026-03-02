// Text-to-Speech utility for English learning games
// Uses Web Speech API with child-friendly settings

export interface TTSOptions {
  rate?: number;        // Speech rate (0.1 to 10), default 0.9 for slower, child-friendly speech
  pitch?: number;       // Speech pitch (0 to 2), default 1.1 for friendly tone
  volume?: number;      // Volume (0 to 1), default 1
  language?: 'en-US' | 'en-GB' | 'en-AU';  // English accent
}

export class TextToSpeech {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.initialize();
    }
  }

  private initialize() {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Load voices
    const loadVoices = () => {
      this.voices = this.synth!.getVoices();
      this.isInitialized = true;
    };

    // Chrome loads voices asynchronously
    if (this.synth.getVoices().length === 0) {
      this.synth.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }

  /**
   * Speak text with child-friendly settings
   * @param text - Text to speak
   * @param options - Optional TTS settings
   */
  speak(text: string, options: TTSOptions = {}): void {
    if (!this.synth) {
      console.warn('Speech synthesis not available');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Child-friendly settings
    utterance.rate = options.rate ?? 0.9;      // Slower for children
    utterance.pitch = options.pitch ?? 1.1;    // Friendly tone
    utterance.volume = options.volume ?? 1;    // Full volume

    // Set language
    utterance.lang = options.language ?? 'en-US';

    // Try to find a good English voice
    const preferredVoice = this.findBestVoice(options.language ?? 'en-US');
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Speak
    this.synth.speak(utterance);
  }

  /**
   * Speak a word with spelling (letter by letter)
   * Useful for teaching spelling
   */
  spellWord(word: string, options: TTSOptions = {}): void {
    if (!this.synth) return;

    this.synth.cancel();

    // First speak the whole word
    const wordUtterance = new SpeechSynthesisUtterance(word);
    wordUtterance.rate = options.rate ?? 0.9;
    wordUtterance.pitch = options.pitch ?? 1.1;
    wordUtterance.lang = options.language ?? 'en-US';
    const preferredVoice = this.findBestVoice(options.language ?? 'en-US');
    if (preferredVoice) wordUtterance.voice = preferredVoice;

    // Then spell it letter by letter
    const letters = word.split('').join(', '); // "d, o, g"
    const spellUtterance = new SpeechSynthesisUtterance(letters);
    spellUtterance.rate = options.rate ?? 0.7;  // Even slower for spelling
    spellUtterance.pitch = options.pitch ?? 1.1;
    spellUtterance.lang = options.language ?? 'en-US';
    if (preferredVoice) spellUtterance.voice = preferredVoice;

    // Queue: word first, then spelling
    this.synth.speak(wordUtterance);
    this.synth.speak(spellUtterance);
  }

  /**
   * Speak letters one by one with a pause
   * Useful for teaching letter recognition
   */
  speakLetters(letters: string[], options: TTSOptions = {}): void {
    if (!this.synth) return;

    this.synth.cancel();

    letters.forEach((letter, index) => {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.rate = options.rate ?? 0.7;
      utterance.pitch = options.pitch ?? 1.1;
      utterance.lang = options.language ?? 'en-US';
      const preferredVoice = this.findBestVoice(options.language ?? 'en-US');
      if (preferredVoice) utterance.voice = preferredVoice;

      this.synth!.speak(utterance);
    });
  }

  /**
   * Stop all speech immediately
   */
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Pause speech (can be resumed)
   */
  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  /**
   * Get all available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  /**
   * Find the best English voice
   * Prefers female voices (often more child-friendly) and high-quality voices
   */
  private findBestVoice(lang: string): SpeechSynthesisVoice | null {
    const englishVoices = this.voices.filter(voice =>
      voice.lang.startsWith(lang.split('-')[0])  // e.g., 'en' matches 'en-US', 'en-GB', etc.
    );

    if (englishVoices.length === 0) {
      return null;
    }

    // Prefer voices that:
    // 1. Match the exact language
    // 2. Have "Female" or "Google" in the name (often higher quality)
    // 3. Are local (not remote)
    const exactMatch = englishVoices.filter(v => v.lang === lang);
    const pool = exactMatch.length > 0 ? exactMatch : englishVoices;

    const preferred = pool.find(v =>
      v.local &&
      (v.name.includes('Female') ||
       v.name.includes('Google') ||
       v.name.includes('Samantha') ||
       v.name.includes('Victoria') ||
       v.name.includes('Karen'))
    );

    return preferred || pool[0];
  }

  /**
   * Check if TTS is supported
   */
  isSupported(): boolean {
    return this.synth !== null;
  }

  /**
   * Check if TTS is ready (voices loaded)
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Singleton instance
export const tts = new TextToSpeech();

// Convenience functions
export function speak(text: string, options?: TTSOptions): void {
  tts.speak(text, options);
}

export function spellWord(word: string, options?: TTSOptions): void {
  tts.spellWord(word, options);
}

export function stopSpeech(): void {
  tts.stop();
}

/**
 * Check if we're in a browser environment that supports speech synthesis
 */
export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
