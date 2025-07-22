import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Schedule } from './components/Schedule/Schedule';
import { Assignments } from './components/Assignments/Assignments';
import { Grades } from './components/Grades/Grades';
import { Announcements } from './components/Announcements/Announcements';
import { Profile } from './components/Profile/Profile';
import { Settings } from './components/Settings/Settings';
import { AIAssistant } from './components/AIAssistant/AIAssistant';
import { PomodoroTimer } from './components/PomodoroTimer/PomodoroTimer';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <Schedule />;
      case 'assignments':
        return <Assignments />;
      case 'grades':
        return <Grades />;
      case 'announcements':
        return <Announcements />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings isDark={isDark} onToggleDarkMode={() => setIsDark(!isDark)} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Always visible on desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOpen={true}
            onClose={() => {}}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-64 h-full bg-white dark:bg-gray-900 shadow-xl">
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleDarkMode={() => setIsDark(!isDark)}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;