import React, { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';

interface AdOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const AdOverlay: React.FC<AdOverlayProps> = ({ isOpen, onClose, title = "A Moment of Grace" }) => {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      setCountdown(3);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Close Button Area */}
      <div className="absolute top-4 right-4">
        {canClose ? (
          <button 
            onClick={onClose}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-all border border-white/20"
          >
            <span>Close</span>
            <X size={18} />
          </button>
        ) : (
          <div className="text-white/50 text-sm font-mono px-4 py-2">
            Continue in {countdown}s
          </div>
        )}
      </div>

      <div className="w-full max-w-md flex flex-col items-center space-y-8 text-center">
        <h3 className="text-white/80 font-serif text-2xl tracking-widest uppercase">{title}</h3>
        
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
           <div className="flex justify-center text-indigo-400 mb-4">
             <Heart size={48} fill="currentColor" className="animate-pulse" />
           </div>
           
           <p className="text-slate-200 text-lg font-serif italic leading-relaxed mb-4">
             "Free creation is not easy, maintained only by meager advertising income. May the Lord bless you."
           </p>
           
           <p className="text-slate-400 text-xs uppercase tracking-widest">
             Soli Deo Gloria
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdOverlay;