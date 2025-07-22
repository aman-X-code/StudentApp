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
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isDark, onToggleDarkMode }) => {
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
    <header className="sticky top-4 z-50 mx-4 lg:mx-6 mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 px-4 py-3 lg:px-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden text-gray-700 dark:text-gray-300"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
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