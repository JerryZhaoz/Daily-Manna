import React, { useEffect, useState } from 'react';
import { MonitorDown, X, Share, MoreVertical, PlusSquare } from 'lucide-react';

export const InstallPwa: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 1. Check if app is already running in standalone mode (installed)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true;
    
    if (isStandaloneMode) {
        setIsStandalone(true);
        return; // Don't do anything else if installed
    }

    // 2. Detect iOS for specific instructions
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // 3. Listen for the 'beforeinstallprompt' event (Chrome/Android)
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log('Capture install prompt event');
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      // Logic 1: We have a native prompt (Android/Chrome)
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Logic 2: No native prompt (iOS or blocked) -> Show manual instructions
      setShowInstructions(true);
    }
  };

  // Don't render anything if installed or not mounted yet
  if (isStandalone || !mounted) return null;

  return (
    <>
      {/* Floating Install Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in-up w-full px-4 max-w-sm flex justify-center">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-full shadow-lg hover:bg-stone-900 transition-all font-medium text-sm w-auto whitespace-nowrap"
        >
          <MonitorDown size={18} />
          {isIOS ? 'Add to Home Screen' : 'Install App'}
        </button>
      </div>

      {/* Manual Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <button 
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
                <X size={24} />
            </button>

            <h3 className="text-xl font-serif text-stone-800 mb-4">
                Install Daily Manna
            </h3>
            
            <p className="text-stone-500 text-sm mb-4">
                To access this app like a native app, add it to your home screen.
            </p>

            <div className="space-y-4 text-stone-700 text-sm bg-stone-50 p-4 rounded-xl border border-stone-100">
                {isIOS ? (
                    <>
                        <p className="flex items-center gap-3">
                            <span className="bg-stone-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">1</span>
                            Tap the Share button <Share size={16} />
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="bg-stone-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">2</span>
                            Scroll down and select <br/> "Add to Home Screen" <PlusSquare size={16} />
                        </p>
                    </>
                ) : (
                    <>
                         <p className="flex items-center gap-3">
                            <span className="bg-stone-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">1</span>
                            Tap the menu icon <MoreVertical size={16} />
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="bg-stone-200 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">2</span>
                            Select "Install App" or <br/> "Add to Home Screen"
                        </p>
                    </>
                )}
            </div>
            
            <div className="mt-6 text-center">
                <button 
                    onClick={() => setShowInstructions(false)}
                    className="text-emerald-700 font-medium text-sm hover:underline"
                >
                    Close
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};