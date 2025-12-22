import React, { useEffect, useState } from 'react';
import { X, Check, Calendar, Trophy } from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      // Load history
      const savedHistory = JSON.parse(localStorage.getItem('prayer-history') || '[]');
      const today = new Date().toISOString().split('T')[0];
      
      // Add today if not exists
      let newHistory = savedHistory;
      if (!savedHistory.includes(today)) {
        newHistory = [...savedHistory, today];
        localStorage.setItem('prayer-history', JSON.stringify(newHistory));
      }
      
      setHistory(newHistory);
      setCurrentDate(new Date());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const renderCalendar = () => {
    const days = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const isChecked = history.includes(dateStr);
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      days.push(
        <div key={d} className="flex flex-col items-center justify-center h-9 w-9">
          <div 
            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
              isChecked 
                ? 'bg-green-500 text-white shadow-sm scale-110' 
                : isToday 
                  ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                  : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {isChecked ? <Check size={14} strokeWidth={3} /> : d}
          </div>
        </div>
      );
    }

    return days;
  };

  const streak = calculateStreak(history);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center">
          <div className="absolute top-4 right-4">
             <button onClick={onClose} className="text-white/70 hover:text-white bg-white/10 rounded-full p-1">
               <X size={18} />
             </button>
          </div>
          
          <div className="flex justify-center mb-3">
             <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
               <Check size={32} className="text-white" />
             </div>
          </div>
          <h2 className="text-2xl font-serif font-bold">Amen</h2>
          <p className="text-indigo-100 text-sm">Prayer Completed</p>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Streak Badge */}
          <div className="flex items-center justify-center space-x-2 bg-amber-50 text-amber-700 py-2 px-4 rounded-full mx-auto w-max mb-6 border border-amber-100">
            <Trophy size={16} className="text-amber-500" />
            <span className="text-sm font-bold">{streak} Day Streak</span>
          </div>

          {/* Calendar */}
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="font-semibold text-slate-700">{monthNames[month]} {year}</span>
            <Calendar size={16} className="text-slate-400" />
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-xs text-slate-400 font-medium">
             <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
          >
            Continue in Grace
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple helper to calculate current streak
function calculateStreak(dates: string[]): number {
  if (!dates.length) return 0;
  
  const sortedDates = [...dates].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // If no entry for today or yesterday, streak is broken (or 0 if starting today)
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
     return 0;
  }

  let streak = 1;
  let currentDate = new Date(sortedDates[0]);

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }
  return streak;
}

export default CheckInModal;
