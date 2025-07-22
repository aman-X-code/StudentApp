import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee } from 'lucide-react';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  Cog6ToothIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface PomodoroSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';
type TimerStatus = 'idle' | 'running' | 'paused';

export const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });

  const [currentMode, setCurrentMode] = useState<TimerMode>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getCurrentDuration = () => {
    switch (currentMode) {
      case 'work': return settings.workDuration * 60;
      case 'shortBreak': return settings.shortBreak * 60;
      case 'longBreak': return settings.longBreak * 60;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = getCurrentDuration();
    return ((total - timeLeft) / total) * 100;
  };

  const getModeConfig = () => {
    switch (currentMode) {
      case 'work':
        return {
          title: 'Focus Time',
          icon: AcademicCapIcon,
          color: 'from-blue-500 to-purple-600',
          bgColor: 'bg-blue-500/20'
        };
      case 'shortBreak':
        return {
          title: 'Short Break',
          icon: Coffee,
          color: 'from-green-500 to-teal-600',
          bgColor: 'bg-green-500/20'
        };
      case 'longBreak':
        return {
          title: 'Long Break',
          icon: Coffee,
          color: 'from-orange-500 to-red-600',
          bgColor: 'bg-orange-500/20'
        };
    }
  };

  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && status === 'running') {
      handleTimerComplete();
    }
  }, [timeLeft, status]);

  const handleTimerComplete = () => {
    setStatus('idle');
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // Send notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const modeConfig = getModeConfig();
      new Notification(`${modeConfig.title} Complete!`, {
        body: currentMode === 'work' ? 'Time for a break!' : 'Ready to focus again?',
        icon: '/pwa-192x192.png'
      });
    }

    // Auto-switch to next mode
    if (currentMode === 'work') {
      setCompletedSessions(prev => prev + 1);
      const nextMode = (completedSessions + 1) % settings.longBreakInterval === 0 
        ? 'longBreak' 
        : 'shortBreak';
      setCurrentMode(nextMode);
      setTimeLeft(nextMode === 'longBreak' ? settings.longBreak * 60 : settings.shortBreak * 60);
    } else {
      setCurrentMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
  };

  const handleStart = () => {
    setStatus('running');
  };

  const handlePause = () => {
    setStatus('paused');
  };

  const handleStop = () => {
    setStatus('idle');
    setTimeLeft(getCurrentDuration());
  };

  const handleModeChange = (mode: TimerMode) => {
    setCurrentMode(mode);
    setStatus('idle');
    setTimeLeft(mode === 'work' ? settings.workDuration * 60 : 
                mode === 'shortBreak' ? settings.shortBreak * 60 : 
                settings.longBreak * 60);
  };

  const modeConfig = getModeConfig();
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

  return (
    <div className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-purple-600 dark:via-blue-600 dark:to-indigo-800 px-10 lg:px-12 pb-6 -mx-4 lg:-mx-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pomodoro Timer</h1>
          <p className="text-gray-600 dark:text-white/80">Stay focused and productive with time management</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="glass-button text-gray-700 dark:text-white bg-white/60 dark:bg-white/20 hover:bg-white/80 dark:hover:bg-white/30 border border-gray-200 dark:border-white/30"
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timer Settings</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Duration (min)
                </label>
                <input
                  type="number"
                  value={settings.workDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 25 }))}
                  className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Break (min)
                </label>
                <input
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) => setSettings(prev => ({ ...prev, shortBreak: parseInt(e.target.value) || 5 }))}
                  className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Long Break (min)
                </label>
                <input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) => setSettings(prev => ({ ...prev, longBreak: parseInt(e.target.value) || 15 }))}
                  className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Long Break Interval
                </label>
                <input
                  type="number"
                  value={settings.longBreakInterval}
                  onChange={(e) => setSettings(prev => ({ ...prev, longBreakInterval: parseInt(e.target.value) || 4 }))}
                  className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-300 dark:border-gray-600"
                  min="2"
                  max="10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Timer */}
      <div className="glass-card p-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Mode Selector */}
          <div className="flex space-x-2 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 dark:border-gray-600">
            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((mode) => {
              const config = mode === 'work' 
                ? { title: 'Focus', icon: AcademicCapIcon }
                : { title: mode === 'shortBreak' ? 'Short' : 'Long', icon: Coffee };
              
              return (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                    currentMode === mode 
                      ? 'bg-white/80 dark:bg-gray-700/50 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <config.icon className="h-4 w-4" />
                  <span>{config.title}</span>
                </button>
              );
            })}
          </div>

          {/* Timer Circle */}
          <div className="relative">
            <svg className="w-64 h-64 timer-circle" viewBox="0 0 240 240">
              <circle
                cx="120"
                cy="120"
                r="120"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="120"
                cy="120"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="timer-progress"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`p-4 rounded-2xl bg-white/80 dark:bg-gray-800/50 mb-2 border border-gray-200 dark:border-gray-600`}>
                <modeConfig.icon className="h-8 w-8 text-gray-700 dark:text-gray-200" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                {modeConfig.title}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {status === 'idle' || status === 'paused' ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <PlayIcon className="h-5 w-5" />
                <span>{status === 'paused' ? 'Resume' : 'Start'}</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePause}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <PauseIcon className="h-5 w-5" />
                <span>Pause</span>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="flex items-center space-x-2 px-6 py-3 bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl text-gray-700 dark:text-gray-200 font-semibold shadow-lg hover:bg-white/80 dark:hover:bg-gray-700/50 transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              <StopIcon className="h-5 w-5" />
              <span>Stop</span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{completedSessions}</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor(completedSessions / settings.longBreakInterval)}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Cycles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((completedSessions * settings.workDuration) / 60 * 10) / 10}h
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">Focus Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio element for notifications */}
      <audio
        ref={audioRef}
        preload="auto"
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
      />
    </div>
  );
};