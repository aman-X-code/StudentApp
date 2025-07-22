import React from 'react';
import { motion } from 'framer-motion';
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import { usePWA } from '../../hooks/usePWA';
import { useNotifications } from '../../hooks/useNotifications';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

interface SettingsProps {
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDark, onToggleDarkMode }) => {
  const { isInstallable, isInstalled, install } = usePWA();
  const { permission, requestPermission } = useNotifications();
  const isOnline = useOfflineStatus();

  const handleNotificationPermission = async () => {
    if (permission === 'default') {
      await requestPermission();
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 px-4 lg:px-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Customize your app experience and manage preferences
        </p>
      </div>

      {/* App Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">App Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
              <WifiIcon className={`h-5 w-5 ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {isOnline ? 'Online' : 'Offline'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connection status
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className={`p-2 rounded-lg ${isInstalled ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <ArrowDownTrayIcon className={`h-5 w-5 ${isInstalled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {isInstalled ? 'Installed' : 'Web App'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PWA status
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className={`p-2 rounded-lg ${
              permission === 'granted' ? 'bg-green-100 dark:bg-green-900/20' :
              permission === 'denied' ? 'bg-red-100 dark:bg-red-900/20' :
              'bg-yellow-100 dark:bg-yellow-900/20'
            }`}>
              <BellIcon className={`h-5 w-5 ${
                permission === 'granted' ? 'text-green-600 dark:text-green-400' :
                permission === 'denied' ? 'text-red-600 dark:text-red-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`} />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Denied' : 'Default'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notifications
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              {isDark ? (
                <MoonIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <SunIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes</p>
            </div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDark ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* PWA Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progressive Web App</h3>
        
        <div className="space-y-4">
          {isInstallable && (
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <ArrowDownTrayIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Install App</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add EduHub to your home screen for quick access</p>
                </div>
              </div>
              <button
                onClick={install}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Install
              </button>
            </div>
          )}

          {permission !== 'granted' && (
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center space-x-3">
                <BellIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Enable Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about assignments and announcements</p>
                </div>
              </div>
              <button
                onClick={handleNotificationPermission}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Enable
              </button>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Clear Cache</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Clear stored data and refresh the app</p>
              </div>
            </div>
            <button
              onClick={clearCache}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
        
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
            <InformationCircleIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">EduHub - Student Portal</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A comprehensive progressive web application for managing your academic life. 
              Track assignments, view schedules, check grades, and stay updated with school announcements.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Built with React & TypeScript</span>
              <span>•</span>
              <span>PWA Enabled</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};