import React from 'react';
import { UserProgress } from '../types';
import { Flame, CalendarCheck, Share2 } from 'lucide-react';
import { THEME_COLORS } from '../constants';

interface ProgressDashboardProps {
  progress: UserProgress;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress }) => {
  
  const handleShare = () => {
    const text = `Daily Manna Streak: ${progress.streak} days 🔥\nTotal Check-ins: ${progress.totalCheckIns} ✅\n#DailyManna #SpiritualHabit`;
    if (navigator.share) {
      navigator.share({
        title: 'Daily Manna Progress',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Stats copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Streak Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center">
          <div className={`p-3 rounded-full bg-orange-50 text-orange-500 mb-2`}>
            <Flame size={24} fill="currentColor" />
          </div>
          <span className="text-3xl font-bold text-stone-800">{progress.streak}</span>
          <span className="text-xs text-stone-400 uppercase tracking-wider">Day Streak</span>
        </div>

        {/* Total Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center">
          <div className={`p-3 rounded-full bg-emerald-50 text-emerald-600 mb-2`}>
            <CalendarCheck size={24} />
          </div>
          <span className="text-3xl font-bold text-stone-800">{progress.totalCheckIns}</span>
          <span className="text-xs text-stone-400 uppercase tracking-wider">Total Check-ins</span>
        </div>
      </div>
      
      {/* Mini History Visualization (Last 7 days) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 mb-6">
        <h3 className="text-sm font-semibold text-stone-600 mb-4">Past 7 Days</h3>
        <div className="flex justify-between items-center px-2">
            {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toISOString().split('T')[0];
                const isCompleted = progress.history.includes(dateStr);
                const isToday = i === 6;
                const dayLabel = date.toLocaleDateString('en-US', { weekday: 'narrow' });

                return (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                                ${isCompleted 
                                    ? 'bg-emerald-600 text-white shadow-md scale-110' 
                                    : isToday 
                                        ? 'bg-stone-50 text-stone-400 border border-stone-200'
                                        : 'bg-stone-50 text-stone-300'
                                }
                            `}
                        >
                            {isCompleted && '✓'}
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider ${isToday ? 'text-stone-800 font-bold' : 'text-stone-400'}`}>{dayLabel}</span>
                    </div>
                );
            })}
        </div>
      </div>

      <button 
        onClick={handleShare}
        className="w-full py-3 rounded-xl border border-stone-200 text-stone-500 font-medium hover:bg-stone-50 hover:text-stone-800 transition-colors flex items-center justify-center gap-2"
      >
        <Share2 size={18} />
        Share Progress
      </button>
    </div>
  );
};