import React, { useState, useEffect, useRef } from 'react';
import { generateDailyDevotional } from '../services/localService';
import { DevotionalContent, FALLBACK_CONTENT, AppSettings, DEFAULT_SETTINGS } from '../types';
import PrayerTimer from '../components/PrayerTimer';
import SettingsModal from '../components/SettingsModal';
import LateNightCheck from '../components/LateNightCheck';
import { InstallPrompt } from '../components/InstallPrompt';
import CheckInModal from '../components/CheckInModal';
import AdOverlay from '../components/AdOverlay';
import { BookOpen, Hand, HelpCircle, Loader2, Sparkles, Sun, Settings, Volume2, VolumeX, Share2, Heart } from 'lucide-react';
import { PageView } from '../App';

// Gentle soothing ambient music
const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-piano-111482.mp3";
const ICON_URL = "/192.png";

interface HomeProps {
  onNavigate: (page: PageView) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [content, setContent] = useState<DevotionalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLetGoAnimation, setShowLetGoAnimation] = useState(false);
  const [hasSurrendered, setHasSurrendered] = useState(false);
  
  // Settings & Music State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Ad States
  const [showSurrenderAd, setShowSurrenderAd] = useState(false);
  const [showPrayerEndAd, setShowPrayerEndAd] = useState(false);

  // Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load Content
  useEffect(() => {
    const loadContent = async () => {
      const today = new Date().toISOString().split('T')[0];
      const cachedData = localStorage.getItem(`devotional-${today}`);

      if (cachedData) {
        setContent(JSON.parse(cachedData));
        setLoading(false);
      } else {
        try {
          const data = await generateDailyDevotional();
          setContent(data);
          localStorage.setItem(`devotional-${today}`, JSON.stringify(data));
        } catch (e) {
          setContent(FALLBACK_CONTENT);
        } finally {
          setLoading(false);
        }
      }
    };
    loadContent();

    // Load Settings
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Audio Control Effect
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlayingMusic) {
      audioRef.current.play().catch(e => {
        console.warn("Autoplay blocked or failed:", e);
        setIsPlayingMusic(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlayingMusic]);

  // Update Settings Wrapper
  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('app-settings', JSON.stringify(newSettings));
  };

  // Notification Checker
  useEffect(() => {
    if (!settings.reminderEnabled) return;

    const checkTime = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Simple check to see if we just hit the minute
      if (currentTime === settings.reminderTime && now.getSeconds() < 2) {
        if (Notification.permission === "granted") {
          new Notification("Prayer Time", {
            body: "It's time for your daily prayer and reflection.",
            icon: ICON_URL
          });
        }
      }
    }, 1000);

    return () => clearInterval(checkTime);
  }, [settings.reminderEnabled, settings.reminderTime]);

  // Capture Install Prompt Event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Prayer Timer Handlers
  const handleTimerStart = () => {
    if (settings.musicEnabled) {
      setIsPlayingMusic(true);
    }
  };

  const handleTimerStop = () => {
    setIsPlayingMusic(false);
  };

  const handleTimerComplete = () => {
    setIsPlayingMusic(false);
    setShowPrayerEndAd(true);
  };

  const handlePrayerAdClose = () => {
    setShowPrayerEndAd(false);
    setIsCheckInOpen(true);
  };

  // Surrender Logic
  const handleLetGoClick = () => {
    setShowSurrenderAd(true);
  };

  const handleSurrenderAdClose = () => {
    setShowSurrenderAd(false);
    handleLetGoAnimation();
  };

  const handleLetGoAnimation = () => {
    setShowLetGoAnimation(true);
    setTimeout(() => {
      setHasSurrendered(true);
      setShowLetGoAnimation(false);
    }, 1500);
  };

  const toggleMusicManual = () => {
    setIsPlayingMusic(!isPlayingMusic);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Daily Grace',
      text: 'Join me in daily prayer and reflection with Daily Grace.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-400 mb-4" size={40} />
        <p className="text-slate-500 serif italic">Preparing your sanctuary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 pb-32 relative">
      <audio ref={audioRef} src={MUSIC_URL} loop />

      {/* --- MESSAGE OVERLAYS --- */}
      {/* Removed splashAd per user request to avoid repetitive popups on load */}

      <AdOverlay 
        isOpen={showSurrenderAd} 
        onClose={handleSurrenderAdClose} 
        title="Preparing Your Heart"
      />

      <AdOverlay 
        isOpen={showPrayerEndAd} 
        onClose={handlePrayerAdClose} 
        title="Prayer Completed"
      />

      {/* Helper Components */}
      <LateNightCheck />
      <CheckInModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} />
      
      <InstallPrompt deferredPrompt={deferredPrompt} setDeferredPrompt={setDeferredPrompt} />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        deferredPrompt={deferredPrompt}
        setDeferredPrompt={setDeferredPrompt}
      />

      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-gradient-to-b from-indigo-50/50 to-transparent flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-bold tracking-widest text-indigo-500 uppercase">Daily Grace</span>
            <Sun size={16} className="text-amber-400" />
          </div>
          <h1 className="text-3xl font-serif text-slate-900 leading-tight">
            Wait on the Lord<br />
            <span className="text-slate-400 italic text-2xl">and He shall renew...</span>
          </h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all"
            title="Share"
          >
            <Share2 size={24} />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all"
            title="Settings"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="px-4 max-w-md mx-auto space-y-6">
        
        {/* Card 1: Daily Principle */}
        {content && (
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen size={80} className="text-indigo-900" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Sparkles size={18} />
                </span>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Daily Principle</h2>
              </div>
              <p className="text-xl font-serif leading-relaxed text-slate-800 mb-4">
                "{content.principle}"
              </p>
              <p className="text-right text-sm font-medium text-indigo-500 font-mono">
                — {content.reference}
              </p>
            </div>
          </div>
        )}

        {/* Card 2: Reflection */}
        {content && (
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="flex items-center space-x-2 mb-4">
              <span className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <HelpCircle size={18} />
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Daily Reflection</h2>
            </div>
            <div className="pl-4 border-l-2 border-amber-200">
               <p className="text-lg text-slate-700 italic">
                {content.reflectionQuestion}
              </p>
            </div>
          </div>
        )}

        {/* Card 3: Let Go */}
        {content && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
            <div className="flex items-center space-x-2 mb-6">
               <span className="p-2 bg-white/10 rounded-lg text-white">
                <Hand size={18} />
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Today's Surrender</h2>
            </div>

            {!hasSurrendered ? (
              <div className={`transition-all duration-700 ${showLetGoAnimation ? 'opacity-0 scale-90 blur-lg' : 'opacity-100'}`}>
                <p className="text-xl serif mb-6 text-center text-indigo-100 leading-snug">
                  "{content.letGoItem}"
                </p>
                <button 
                  onClick={handleLetGoClick}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-sm font-medium tracking-wide transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Surrender to God</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 animate-in fade-in duration-1000">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                   <Sparkles size={24} className="text-green-400" />
                </div>
                <p className="text-slate-300 text-center text-sm">
                  Surrendered. May His peace be with you.<br/>
                  <span className="text-xs opacity-60">"Casting all your anxiety on Him."</span>
                </p>
                <button 
                   onClick={() => setHasSurrendered(false)}
                   className="mt-4 text-xs text-slate-500 underline hover:text-slate-300"
                >
                  Undo
                </button>
              </div>
            )}
          </div>
        )}

        <div className="my-8 border-t border-slate-200/60"></div>

        {/* Prayer Section */}
        {content && (
          <section id="prayer-section" className="relative">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h2 className="font-serif text-2xl text-slate-800">Prayer Time</h2>
              <button 
                onClick={toggleMusicManual}
                className={`p-1.5 rounded-full transition-all ${isPlayingMusic ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}
                title="Toggle Music"
              >
                {isPlayingMusic ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
            
            <p className="text-center text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              Focus: {content.prayerFocus}
            </p>
            
            <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 p-2 relative">
              <PrayerTimer 
                initialDurationSeconds={180} 
                onStart={handleTimerStart}
                onPause={handleTimerStop}
                onReset={handleTimerStop}
                onComplete={handleTimerComplete}
              />
            </div>
          </section>
        )}

      </main>

      <footer className="mt-8 pb-4">
         <div className="max-w-md mx-auto px-4 mb-6">
            <div className="mt-4 flex flex-col items-center text-center space-y-1">
               <div className="flex items-center justify-center text-indigo-300/50">
                   <Heart size={12} fill="currentColor" />
               </div>
               <p className="text-[10px] text-slate-400 font-light italic max-w-xs">
                 "Free creation is not easy, maintained only by meager advertising income. May the Lord bless you."
               </p>
               <p className="text-slate-300 text-[10px] mt-2">
                 © {new Date().getFullYear()} Daily Grace. Soli Deo Gloria.
               </p>
               <div className="flex flex-wrap justify-center items-center gap-3 mt-3">
                 <button onClick={() => onNavigate('privacy')} className="text-[10px] text-slate-500 hover:text-indigo-600">Privacy Policy</button>
                 <span className="text-[10px] text-slate-300">•</span>
                 <button onClick={() => onNavigate('terms')} className="text-[10px] text-slate-500 hover:text-indigo-600">Terms</button>
                 <span className="text-[10px] text-slate-300">•</span>
                 <button onClick={() => onNavigate('cookie')} className="text-[10px] text-slate-500 hover:text-indigo-600">Cookie Policy</button>
                 <span className="text-[10px] text-slate-300">•</span>
                 <button onClick={() => onNavigate('contact')} className="text-[10px] text-slate-500 hover:text-indigo-600">Contact</button>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;