import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { TimerState } from '../types';

interface PrayerTimerProps {
  initialDurationSeconds: number;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onComplete: () => void;
}

const PrayerTimer: React.FC<PrayerTimerProps> = ({ 
  initialDurationSeconds, 
  onStart,
  onPause,
  onReset,
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState(initialDurationSeconds);
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  const [duration, setDuration] = useState(initialDurationSeconds);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: number | undefined;

    if (timerState === TimerState.RUNNING && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerState(TimerState.COMPLETED);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && timerState !== TimerState.COMPLETED) {
      setTimerState(TimerState.COMPLETED);
      onComplete();
    }

    return () => clearInterval(interval);
  }, [timerState, timeLeft, onComplete]);

  const handleStart = () => {
    setTimerState(TimerState.RUNNING);
    onStart?.();
  };

  const handlePause = () => {
    setTimerState(TimerState.PAUSED);
    onPause?.();
  };

  const handleReset = () => {
    setTimerState(TimerState.IDLE);
    setTimeLeft(duration);
    onReset?.();
  };

  const handleDurationChange = (newDuration: number) => {
    if (timerState === TimerState.IDLE) {
      setDuration(newDuration);
      setTimeLeft(newDuration);
    }
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / duration;
  const dashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Duration Selector */}
      {timerState === TimerState.IDLE && (
        <div className="flex space-x-4 mb-8">
          {[60, 120, 180].map((sec) => (
            <button
              key={sec}
              onClick={() => handleDurationChange(sec)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                duration === sec
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sec / 60} Min
            </button>
          ))}
        </div>
      )}

      {/* Timer Display */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-linear ${
              timerState === TimerState.COMPLETED ? 'text-green-500' : 'text-indigo-400'
            }`}
          />
        </svg>

        <div className="text-center z-10 flex flex-col items-center">
          {timerState === TimerState.COMPLETED ? (
            <CheckCircle2 size={48} className="text-green-500 mb-2 animate-bounce" />
          ) : (
             <span className="text-5xl font-light text-slate-700 font-mono tracking-tighter">
               {formatTime(timeLeft)}
             </span>
          )}
           <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest">
             {timerState === TimerState.RUNNING ? "Praying..." : 
              timerState === TimerState.COMPLETED ? "Amen" : "Prayer Time"}
           </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-6">
        {timerState === TimerState.RUNNING ? (
          <button
            onClick={handlePause}
            className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg text-slate-600 hover:text-indigo-600 transition-all border border-slate-100"
          >
            <Pause size={24} fill="currentColor" />
          </button>
        ) : timerState === TimerState.IDLE || timerState === TimerState.PAUSED ? (
          <button
            onClick={handleStart}
            className="flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full shadow-xl shadow-indigo-200 text-white hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95"
          >
            <Play size={32} fill="currentColor" className="ml-1" />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-indigo-50 text-indigo-700 rounded-full font-medium hover:bg-indigo-100 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default PrayerTimer;