import React from 'react';
import {
  Bars3Icon,
  BellIcon,
  MoonIcon,
  SunIcon,
  ArrowDownTrayIcon,
  WifiIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { usePWA } from '../../hooks/usePWA';
import { useNotifications } from '../../hooks/useNotifications';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

interface HeaderProps {
  onMenuClick: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isDark, onToggleDarkMode, sidebarOpen }) => {
  const { isInstallable, install } = usePWA();
  const { permission, requestPermission, sendNotification } = useNotifications();
  const isOnline = useOfflineStatus();

  const handleNotificationDemo = async () => {
    if (permission !== 'granted') {
      const result = await requestPermission();
      if (result !== 'granted') return;
    }

    const notifications = [
      {
        title: 'Assignment Reminder',
        body: 'Physics Lab Report is due in 2 days. Don\'t forget to submit!'
      },
      {
        title: 'New Announcement',
        body: 'Winter break schedule has been updated. Check announcements for details.'
      },
      {
        title: 'Grade Updated',
        body: 'Your Mathematics midterm grade is now available.'
      }
    ];

    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    sendNotification(randomNotification.title, { body: randomNotification.body });
  };

  return (
    <header className={`sticky top-2 z-50 mb-6 bg-white/10 dark:bg-gray-900/10 backdrop-blur-3xl border border-white/30 dark:border-gray-400/20 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-tl after:from-transparent after:via-white/5 after:to-white/10 after:pointer-events-none transition-all duration-300 ${
      sidebarOpen 
        ? 'mx-2 px-3 py-2 lg:mx-6 lg:px-6 lg:py-4' 
        : 'mx-4 px-4 py-4 lg:mx-6 lg:px-6'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden text-gray-700 dark:text-gray-300"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className={`${sidebarOpen ? 'hidden' : 'hidden lg:block'}`}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Welcome back, Alex! 👋
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Online/Offline status */}
          <div className="hidden sm:flex items-center space-x-2">
            {isOnline ? (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <WifiIcon className="h-4 w-4" />
                <span className="text-xs font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span className="text-xs font-medium">Offline</span>
              </div>
            )}
          </div>

          {/* Install PWA button */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Notification demo button */}
          <button
            onClick={handleNotificationDemo}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative text-gray-700 dark:text-gray-300"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};