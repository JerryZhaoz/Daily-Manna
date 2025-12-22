export interface DevotionalContent {
  principle: string;
  reference: string; // e.g., "Proverbs 3:5"
  reflectionQuestion: string;
  letGoItem: string;
  prayerFocus: string;
}

export enum TimerState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export interface AppSettings {
  musicEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // "07:00"
}

export const FALLBACK_CONTENT: DevotionalContent = {
  principle: "Trust in the LORD with all your heart and lean not on your own understanding.",
  reference: "Proverbs 3:5",
  reflectionQuestion: "Where am I currently relying on my own strength instead of seeking God's guidance?",
  letGoItem: "The need to control outcomes.",
  prayerFocus: "Peace and surrender regarding the future."
};

export const DEFAULT_SETTINGS: AppSettings = {
  musicEnabled: true,
  reminderEnabled: false,
  reminderTime: "07:00"
};