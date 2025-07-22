import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  SpeakerWaveIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { mockAnnouncements } from '../../data/mockData';
import { Announcement } from '../../types';

export const Announcements: React.FC = () => {
  const [filter, setFilter] = useState<'all' | Announcement['category']>('all');
  const [showRead, setShowRead] = useState(true);

  const getFilteredAnnouncements = () => {
    let filtered = mockAnnouncements;
    
    if (filter !== 'all') {
      filtered = filtered.filter(announcement => announcement.category === filter);
    }
    
    if (!showRead) {
      filtered = filtered.filter(announcement => !announcement.isRead);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getCategoryIcon = (category: Announcement['category']) => {
    switch (category) {
      case 'academic':
        return <AcademicCapIcon className="h-5 w-5" />;
      case 'event':
        return <CalendarDaysIcon className="h-5 w-5" />;
      case 'holiday':
        return <CalendarDaysIcon className="h-5 w-5" />;
      case 'exam':
        return <AcademicCapIcon className="h-5 w-5" />;
      default:
        return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: Announcement['category']) => {
    switch (category) {
      case 'academic':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'event':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'holiday':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'exam':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityIcon = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <InformationCircleIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const markAsRead = (id: string) => {
    // In a real app, this would update the backend
    const announcement = mockAnnouncements.find(a => a.id === id);
    if (announcement) {
      announcement.isRead = true;
    }
  };

  const filteredAnnouncements = getFilteredAnnouncements();
  const unreadCount = mockAnnouncements.filter(a => !a.isRead).length;
  const categories = ['all', 'academic', 'event', 'holiday', 'exam', 'general'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Stay updated with school news and important information
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showRead}
              onChange={(e) => setShowRead(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-600 dark:text-gray-300">Show read</span>
          </label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: mockAnnouncements.length, color: 'text-gray-600 dark:text-gray-300' },
          { label: 'Unread', value: unreadCount, color: 'text-red-600 dark:text-red-400' },
          { label: 'High Priority', value: mockAnnouncements.filter(a => a.priority === 'high').length, color: 'text-orange-600 dark:text-orange-400' },
          { label: 'This Week', value: mockAnnouncements.filter(a => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(a.date) > weekAgo;
          }).length, color: 'text-blue-600 dark:text-blue-400' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 ${
              !announcement.isRead ? 'ring-2 ring-blue-500/20 border-blue-200 dark:border-blue-800' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl ${getCategoryColor(announcement.category)}`}>
                {getCategoryIcon(announcement.category)}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        !announcement.isRead 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {announcement.title}
                      </h3>
                      
                      {!announcement.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                      
                      {announcement.priority !== 'low' && (
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(announcement.priority)}
                        </div>
                      )}
                    </div>

                    <p className={`text-sm leading-relaxed ${
                      !announcement.isRead 
                        ? 'text-gray-600 dark:text-gray-300' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {announcement.content}
                    </p>
                  </div>

                  {!announcement.isRead && (
                    <button
                      onClick={() => markAsRead(announcement.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                      {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                    </span>

                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>{format(announcement.date, 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  {announcement.priority === 'high' && (
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">High Priority</span>
                    </div>
                  )}
                </div>

                {announcement.priority === 'high' && !announcement.isRead && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">
                      📢 Important: Please read this announcement carefully and take necessary action if required.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <SpeakerWaveIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No announcements found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};