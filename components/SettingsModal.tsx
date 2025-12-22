import React, { useEffect, useState } from 'react';
import { X, Bell, Music, Check, Download, Smartphone } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  deferredPrompt: any;
  setDeferredPrompt: (prompt: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings,
  deferredPrompt,
  setDeferredPrompt
}) => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);
  }, []);

  if (!isOpen) return null;

  const handleReminderToggle = async () => {
    if (!settings.reminderEnabled) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          onUpdateSettings({ ...settings, reminderEnabled: true });
        } else {
          alert("Notification permission is required to receive reminders.");
        }
      } else {
        alert("This browser does not support notifications.");
      }
    } else {
      onUpdateSettings({ ...settings, reminderEnabled: false });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ ...settings, reminderTime: e.target.value });
  };

  const handleMusicToggle = () => {
    onUpdateSettings({ ...settings, musicEnabled: !settings.musicEnabled });
  };

  const handleManualInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        onClose();
      }
    } else {
        alert("To install, use your browser's menu and select 'Add to Home Screen' or 'Install App'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-serif text-xl text-slate-800">Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Install App (Only show if not installed) */}
          {!isStandalone && (
             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <Smartphone size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-medium text-slate-800">Install App</p>
                      <p className="text-xs text-slate-500">For offline access</p>
                   </div>
                </div>
                <button 
                  onClick={handleManualInstall}
                  className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                   <Download size={16} />
                   <span>{deferredPrompt ? 'Install Now' : 'How to Install'}</span>
                </button>
             </div>
          )}

          {/* Music Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Music size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Background Music</p>
                <p className="text-xs text-slate-500">Play soothing music</p>
              </div>
            </div>
            <button
              onClick={handleMusicToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                settings.musicEnabled ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Notification Setting */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Daily Reminder</p>
                  <p className="text-xs text-slate-500">Get notified to pray</p>
                </div>
              </div>
              <button
                onClick={handleReminderToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  settings.reminderEnabled ? 'bg-amber-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Time Picker */}
            {settings.reminderEnabled && (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 animate-in slide-in-from-top-2">
                <span className="text-sm text-slate-600">Time</span>
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={handleTimeChange}
                  className="bg-white border border-slate-200 text-slate-800 text-sm rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;