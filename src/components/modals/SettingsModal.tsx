import React, { useState } from 'react';
import { X, Mic, Video, Bell, RotateCcw, Check, Sliders, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { VectorDrawIcon } from '../common/VectorDrawIcon';

interface SettingsModalProps {
  onClose: () => void;
  onResetData: () => void;
  onLogout?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onResetData, onLogout }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [micInput, setMicInput] = useState('Default - Integrated Microphone');
  const [camInput, setCamInput] = useState('Default - HD Web Camera');
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    onResetData();
    setResetDone(true);
    setTimeout(() => {
      setResetDone(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111a2e] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-transparent dark:border-white/10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#3525cd] dark:text-[#818cf8]" />
            <h2 className="font-display font-bold text-lg text-[#0b1c30] dark:text-slate-100">
              Platform & Audio Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] dark:text-slate-400 hover:text-[#0b1c30] dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Appearance / Dark Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#f8f9ff] dark:bg-[#182642] rounded-2xl border border-[#e5eeff] dark:border-white/10">
            <div className="flex items-center gap-3">
              <VectorDrawIcon 
                name={isDark ? "moon" : "sun"} 
                size="xs" 
                badge={false} 
                triggerKey={theme}
              />
              <div>
                <span className="font-semibold text-[#0b1c30] dark:text-slate-100 block text-xs">Appearance Theme</span>
                <span className="text-[11px] text-[#565e74] dark:text-slate-400">
                  {isDark ? 'Dark Mode (Night Glow active)' : 'Light Mode (Modern daylight)'}
                </span>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isDark 
                  ? 'bg-[#3525cd] text-white shadow-xs' 
                  : 'bg-white text-[#3525cd] border border-[#c7c4d8]/60 shadow-xs'
              }`}
            >
              {isDark ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          {/* Audio Input Device */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#0b1c30] dark:text-slate-200 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#3525cd] dark:text-[#818cf8]" />
              Audio Input Device (Arena)
            </label>
            <select
              value={micInput}
              onChange={e => setMicInput(e.target.value)}
              className="w-full bg-[#f8f9ff] dark:bg-[#182642] border border-[#c7c4d8]/60 dark:border-white/10 rounded-xl p-2.5 text-[#0b1c30] dark:text-slate-200 outline-hidden"
            >
              <option value="Default - Integrated Microphone">Default - Integrated Microphone</option>
              <option value="USB Headset Microphone">External USB Headset Microphone</option>
              <option value="Studio Condenser Mic">Studio Condenser Mic</option>
            </select>
          </div>

          {/* Camera Device */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#0b1c30] dark:text-slate-200 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#3525cd] dark:text-[#818cf8]" />
              Video Input Device (Arena)
            </label>
            <select
              value={camInput}
              onChange={e => setCamInput(e.target.value)}
              className="w-full bg-[#f8f9ff] dark:bg-[#182642] border border-[#c7c4d8]/60 dark:border-white/10 rounded-xl p-2.5 text-[#0b1c30] dark:text-slate-200 outline-hidden"
            >
              <option value="Default - HD Web Camera">Default - HD Web Camera (720p/1080p)</option>
              <option value="Virtual Studio Camera">OBS / Virtual Studio Camera</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 bg-[#f8f9ff] dark:bg-[#182642] rounded-xl border border-[#e5eeff] dark:border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#3525cd] dark:text-[#818cf8]" />
              <span className="font-semibold text-[#0b1c30] dark:text-slate-200">Collab & Interview Alerts</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={e => setNotifications(e.target.checked)}
              className="w-4 h-4 text-[#3525cd] dark:text-[#818cf8] rounded-sm accent-[#3525cd]"
            />
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl border border-[#ba1a1a]/30 text-[#ba1a1a] dark:text-rose-400 hover:bg-[#ffdad6]/40 dark:hover:bg-rose-950/30 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {resetDone ? 'Reset Complete!' : 'Reset All Progress & Mock Data'}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[#eceef3] dark:border-white/10 flex items-center justify-between gap-3">
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-700/40 text-rose-500 dark:text-rose-400 hover:bg-rose-950/20 font-bold text-xs transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 bg-[#3525cd] hover:bg-[#1e00a9] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
