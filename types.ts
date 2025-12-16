export interface DailyContent {
  date: string;
  scriptureText: string;
  reference: string;
  thought: string; // A single sentence for reflection
}

export interface UserProgress {
  lastCheckIn: string | null; // YYYY-MM-DD
  streak: number;
  totalCheckIns: number;
  history: string[]; // Array of YYYY-MM-DD
}

export enum AppState {
  LOADING = 'LOADING',
  IDLE = 'IDLE', // Viewing the verse
  MEDITATING = 'MEDITATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export const STORAGE_KEYS = {
  PROGRESS: 'manna_user_progress',
  DAILY_CONTENT: 'manna_daily_content_cache'
};

// Add global type for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}