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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleDarkMode={() => setIsDark(!isDark)}
        />
        
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;