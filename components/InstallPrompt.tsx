import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

interface InstallPromptProps {
  deferredPrompt: any;
  setDeferredPrompt: (prompt: any) => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ deferredPrompt, setDeferredPrompt }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);

  useEffect(() => {
    // 1. Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    
    if (isStandalone) return;

    // 2. Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    
    if (isIOS) {
      setPlatform('ios');
      const hasSeen = localStorage.getItem('pwa-prompt-seen-ios');
      if (!hasSeen) {
         setTimeout(() => setShowPrompt(true), 2000);
      }
    } else {
      // For Android/Desktop, wait for deferredPrompt
      if (deferredPrompt) {
        setPlatform('android');
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (platform === 'ios') {
        localStorage.setItem('pwa-prompt-seen-ios', 'true');
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[50] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-indigo-100 p-4 max-w-sm mx-auto relative ring-1 ring-black/5">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss} 
          className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 rounded-full p-1.5 shadow-sm border border-slate-100 transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex items-center space-x-4">
          <div className="shrink-0 bg-indigo-50 p-2 rounded-xl">
            <img 
              src="/192.png" 
              alt="App" 
              className="w-10 h-10 rounded-lg shadow-sm"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-sm">Install App</h3>
            <p className="text-xs text-slate-500 truncate">
              Offline access & better experience
            </p>
          </div>

          {platform === 'ios' ? (
             <div className="flex items-center space-x-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                <span>Share</span>
                <Share size={12} />
                <span>&rarr;</span>
                <PlusSquare size={12} />
             </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="shrink-0 py-2 px-4 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors active:scale-95"
            >
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
};