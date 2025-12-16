import React, { useState, useEffect } from 'react';
import { DailyContent, UserProgress, AppState, STORAGE_KEYS } from './types';
import { fetchDailyVerse } from './services/geminiService';
import { VerseDisplay } from './components/VerseDisplay';
import { MeditationTimer } from './components/MeditationTimer';
import { ProgressDashboard } from './components/ProgressDashboard';
import { InstallPwa } from './components/InstallPwa';
import { THEME_COLORS } from './constants';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    lastCheckIn: null,
    streak: 0,
    totalCheckIns: 0,
    history: []
  });

  // Load progress and content on mount
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Load User Progress (Local "Database")
    // Data is stored in localStorage, which persists in the browser
    const storedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    let currentProgress = storedProgress 
      ? JSON.parse(storedProgress) 
      : { lastCheckIn: null, streak: 0, totalCheckIns: 0, history: [] };
    
    // Fix: Ensure history is an array if older version existed
    if (!Array.isArray(currentProgress.history)) currentProgress.history = [];

    setProgress(currentProgress);

    // 2. Check completion status
    const isCompletedToday = currentProgress.lastCheckIn === todayStr;

    // 3. Load or Fetch Daily Content
    const loadContent = async () => {
        const cachedContentStr = localStorage.getItem(STORAGE_KEYS.DAILY_CONTENT);
        let content: DailyContent | null = null;

        if (cachedContentStr) {
            const parsed = JSON.parse(cachedContentStr);
            if (parsed.date === todayStr) {
                content = parsed;
            }
        }

        if (!content) {
            content = await fetchDailyVerse();
            localStorage.setItem(STORAGE_KEYS.DAILY_CONTENT, JSON.stringify(content));
        }

        setDailyContent(content);

        if (isCompletedToday) {
            setAppState(AppState.COMPLETED);
        } else {
            setAppState(AppState.IDLE);
        }
    };

    loadContent();
  }, []);

  const handleStartMeditation = () => {
    setAppState(AppState.MEDITATING);
  };

  const handleCheckIn = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setProgress(prev => {
        // Calculate Streak
        let newStreak = prev.streak;
        
        // If last check-in was yesterday, increment streak. 
        // If last check-in was today, keep same.
        // If older, reset to 1.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (prev.lastCheckIn === yesterdayStr) {
            newStreak += 1;
        } else if (prev.lastCheckIn !== todayStr) {
            newStreak = 1;
        }

        const newHistory = prev.history.includes(todayStr) 
            ? prev.history 
            : [...prev.history, todayStr];

        const newProgress = {
            lastCheckIn: todayStr,
            streak: newStreak,
            totalCheckIns: prev.history.includes(todayStr) ? prev.totalCheckIns : prev.totalCheckIns + 1,
            history: newHistory
        };

        // Update local database (localStorage)
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
        return newProgress;
    });

    setAppState(AppState.COMPLETED);
  };

  if (appState === AppState.LOADING || !dailyContent) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${THEME_COLORS.bg}`}>
        <Loader2 className={`animate-spin ${THEME_COLORS.accent}`} size={48} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${THEME_COLORS.bg} transition-colors duration-500`}>
      <header className="pt-8 pb-4 text-center">
        <h1 className="text-lg font-serif tracking-widest text-stone-500 uppercase">Daily Manna</h1>
      </header>

      <main className="container mx-auto px-4 pb-20 max-w-2xl">
        
        {/* Main Verse Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mb-6 min-h-[400px] flex flex-col justify-center relative">
           {appState === AppState.COMPLETED && (
               <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                   Done Today
               </div>
           )}
           <VerseDisplay content={dailyContent} />
        </div>

        {/* Action Area */}
        <div className="transition-all duration-500 ease-in-out">
            {appState === AppState.IDLE && (
                <div className="flex justify-center animate-fade-in-up">
                    <button
                        onClick={handleStartMeditation}
                        className={`${THEME_COLORS.button} ${THEME_COLORS.buttonText} px-10 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transform transition hover:-translate-y-1`}
                    >
                        Start Meditation
                    </button>
                </div>
            )}

            {appState === AppState.MEDITATING && (
                <MeditationTimer onComplete={handleCheckIn} />
            )}

            {appState === AppState.COMPLETED && (
                <div className="animate-fade-in">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-serif text-stone-800 mb-2">Devotion Completed</h3>
                        <p className="text-stone-500">Good job! See you tomorrow.</p>
                    </div>
                    <ProgressDashboard progress={progress} />
                </div>
            )}
        </div>
      </main>

      {/* PWA Install Button */}
      <InstallPwa />

      <footer className="text-center py-6 text-stone-400 text-xs">
        <p>© {new Date().getFullYear()} Daily Manna. Habit over Knowledge.</p>
      </footer>
    </div>
  );
};

export default App;