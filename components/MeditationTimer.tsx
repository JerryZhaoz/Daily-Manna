import React, { useState, useEffect, useCallback } from 'react';
import { THEME_COLORS } from '../constants';
import { Play, Square, CheckCircle2, Clock } from 'lucide-react';

interface MeditationTimerProps {
  onComplete: () => void;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({ onComplete }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(2);
  const [timeLeft, setTimeLeft] = useState(120); // Default 2 mins
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Reset timer when duration changes
  useEffect(() => {
    if (!isActive && !isDone) {
      setTimeLeft(selectedMinutes * 60);
    }
  }, [selectedMinutes, isActive, isDone]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsDone(true);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalSeconds = selectedMinutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  if (isDone) {
    return (
      <div className="flex flex-col items-center mt-8 animate-fade-in-up">
        <button
          onClick={onComplete}
          className={`${THEME_COLORS.button} ${THEME_COLORS.buttonText} px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 flex items-center gap-2`}
        >
          <CheckCircle2 size={24} />
          今日已完成 (Check-in)
        </button>
        <p className="mt-4 text-stone-500 text-sm">默想结束，愿神赐福你的一天。</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto mt-8 p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            {/* Background Circle */}
            <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#E7E5E4" // stone-200
                    strokeWidth="4"
                    fill="transparent"
                />
                {/* Progress Circle */}
                <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#047857" // emerald-700
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                    className="transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                />
            </svg>
            
            <div className="flex flex-col items-center z-10">
                <span className="text-4xl font-light text-stone-700 font-serif tabular-nums">
                    {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-stone-400 uppercase tracking-widest mt-1">
                    Meditation
                </span>
            </div>
        </div>

        {!isActive && !isDone && (
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((min) => (
              <button
                key={min}
                onClick={() => setSelectedMinutes(min)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedMinutes === min
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {min} min
              </button>
            ))}
          </div>
        )}

        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-all ${
            isActive 
              ? 'border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-600' 
              : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          {isActive ? (
            <>
              <Square size={18} fill="currentColor" /> 暂停 (Pause)
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" /> 开始默想 (Start)
            </>
          )}
        </button>
        
        <p className="mt-4 text-xs text-stone-400 text-center max-w-xs">
           花 {selectedMinutes} 分钟安静下来，反复思想刚才的经文。
        </p>
      </div>
    </div>
  );
};