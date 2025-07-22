import React from 'react';
import {
  HomeIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  ChartBarIcon,
  SpeakerWaveIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
  { id: 'schedule', name: 'Schedule', icon: CalendarDaysIcon },
  { id: 'assignments', name: 'Assignments', icon: BookOpenIcon },
  { id: 'grades', name: 'Grades', icon: ChartBarIcon },
  { id: 'announcements', name: 'Announcements', icon: SpeakerWaveIcon },
  { id: 'ai-assistant', name: 'AI Assistant', icon: SparklesIcon },
  { id: 'pomodoro', name: 'Pomodoro Timer', icon: ClockIcon },
  { id: 'profile', name: 'Profile', icon: UserCircleIcon },
  { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">EduHub</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Student Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              onClose();
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>v1.0.0</p>
          <p>© 2024 EduHub</p>
        </div>
      </div>
    </div>
  );
};