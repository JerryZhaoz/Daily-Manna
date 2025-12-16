import React, { useEffect, useState } from 'react';
import { MonitorDown } from 'lucide-react';

export const InstallPwa: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true;
    
    if (isStandaloneMode) {
        return;
    }

    // Standard Chrome/Android prompt handler
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowButton(false);
      }
    }
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in-up w-full px-4 max-w-sm flex justify-center">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-full shadow-lg hover:bg-stone-900 transition-all font-medium text-sm w-auto whitespace-nowrap"
      >
        <MonitorDown size={18} />
        Install App
      </button>
    </div>
  );
};