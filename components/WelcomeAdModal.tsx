import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AdUnit } from './AdUnit';

export const WelcomeAdModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal on first load of the session
    const hasSeenAd = sessionStorage.getItem('hasSeenWelcomeAd');
    if (!hasSeenAd) {
      // Small delay to ensure smoother entrance
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenWelcomeAd', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm p-2 shadow-2xl relative flex flex-col items-center">
        {/* Close Button */}
        <button 
            onClick={() => setIsOpen(false)}
            className="absolute -top-12 right-0 md:-right-12 text-white/80 hover:text-white p-2 bg-stone-800/50 rounded-full backdrop-blur-md transition-all"
            aria-label="Close Ad"
        >
            <X size={24} />
        </button>

        <div className="w-full bg-stone-50 rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center">
             {/* 
                IMPORTANT: Replace '1234567890' with a specific Ad Unit ID 
                configured as a 'Rectangle' or 'Responsive' Display Ad in AdSense 
             */}
             <AdUnit slotId="1234567890" format="auto" />
        </div>
        
        <p className="text-[10px] text-stone-300 uppercase tracking-widest mt-2">
            Sponsored Message
        </p>

        <button 
            onClick={() => setIsOpen(false)}
            className="mt-4 mb-2 w-full py-3 bg-stone-800 text-white rounded-xl font-medium"
        >
            Continue to Daily Manna
        </button>
      </div>
    </div>
  );
};