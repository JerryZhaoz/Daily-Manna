import React, { useState, useEffect } from 'react';
import { Moon, HeartHandshake } from 'lucide-react';

const LateNightCheck: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Check if it is between 22:00 and 22:59 (10 PM)
      if (currentHour === 22) {
        const todayStr = now.toDateString();
        const lastChecked = localStorage.getItem('night-check-seen');
        
        // Only show if we haven't shown it today
        if (lastChecked !== todayStr) {
          setIsOpen(true);
        }
      }
    };

    // Check immediately on mount
    checkTime();

    // Check every minute just in case the user keeps the app open
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    const todayStr = new Date().toDateString();
    localStorage.setItem('night-check-seen', todayStr);
    setIsOpen(false);
  };

  const handleGoToPrayer = () => {
    handleDismiss();
    const prayerSection = document.getElementById('prayer-section');
    if (prayerSection) {
      prayerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-indigo-100">
        <div className="bg-indigo-900 p-6 text-center relative overflow-hidden">
          {/* Decorative moon */}
          <div className="absolute -top-4 -right-4 text-indigo-800 opacity-50">
            <Moon size={100} />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-indigo-800/50 p-3 rounded-full mb-3 ring-1 ring-indigo-400/30">
              <Moon size={32} className="text-indigo-200" />
            </div>
            <h3 className="font-serif text-xl text-white tracking-wide">Late Night</h3>
          </div>
        </div>

        <div className="p-8 text-center">
          <p className="text-xl text-slate-800 font-serif mb-2">
            The night is quiet.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            "Have you talked with the Lord today?"
          </p>

          <div className="space-y-3">
            <button 
              onClick={handleGoToPrayer}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <HeartHandshake size={18} />
              <span>Pray Now</span>
            </button>
            <button 
              onClick={handleDismiss}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium transition-colors"
            >
              Yes, I have
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LateNightCheck;