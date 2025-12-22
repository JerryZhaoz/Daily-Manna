import { DevotionalContent, FALLBACK_CONTENT } from "../types";
import { BIBLE_DATA } from "../data/bibleData";

export const generateDailyDevotional = async (): Promise<DevotionalContent> => {
  try {
    // Determine a random index. 
    // Since App.tsx caches the result by date in localStorage, 
    // we can just pick a random one here. If the user refreshes, 
    // App.tsx will load the cached version. If it's a new day, 
    // a new random one is picked.
    
    if (!BIBLE_DATA || BIBLE_DATA.length === 0) {
        return FALLBACK_CONTENT;
    }

    const randomIndex = Math.floor(Math.random() * BIBLE_DATA.length);
    return BIBLE_DATA[randomIndex];

  } catch (error) {
    console.error("Failed to load local devotional:", error);
    return FALLBACK_CONTENT;
  }
};