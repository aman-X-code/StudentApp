import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  BookOpenIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { mockAssignments, mockSchedule, mockGrades, mockAnnouncements } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const pendingAssignments = mockAssignments.filter(a => a.status === 'pending').length;
  const todaySchedule = mockSchedule.filter(s => s.day === format(new Date(), 'EEEE'));
  const averageGrade = mockGrades.reduce((sum, grade) => sum + (grade.obtainedMarks / grade.maxMarks) * 100, 0) / mockGrades.length;
  const unreadAnnouncements = mockAnnouncements.filter(a => !a.isRead).length;

  // Notification hook
  const { sendNotification, permission, requestPermission, isSupported } = useNotifications();

  const handleDemoNotification = async () => {
    if (permission !== 'granted') {
      await requestPermission();
    }
    sendNotification('Demo Notification', {
      body: 'This is a demo notification from your dashboard!',
      icon: '/pwa-192x192.png',
    });
  };

  const gradeData = mockGrades.map(grade => ({
    subject: grade.subject.split(' ')[0],
    percentage: Math.round((grade.obtainedMarks / grade.maxMarks) * 100)
  }));

  const stats = [
    {
      title: 'Pending Assignments',
      value: pendingAssignments,
      icon: BookOpenIcon,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Today\'s Classes',
      value: todaySchedule.length,
      icon: CalendarDaysIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Average Grade',
      value: `${Math.round(averageGrade)}%`,
      icon: ChartBarIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'New Announcements',
      value: unreadAnnouncements,
      icon: ClockIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="space-y-6 px-4 lg:px-6 pb-6">
      {/* Demo Notification Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleDemoNotification}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
          disabled={!isSupported}
        >
          Show Demo Notification
        </button>
      </div>
      {/* Welcome Message */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
            <span className="text-2xl">🌅</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Hi, Alex!</h1>
            <p className="text-white/90">Ready to make today productive?</p>
          </div>
        </div>
        <div className="rounded-xl p-4 bg-white/20 backdrop-blur-sm border border-white/30">
          <p className="text-white">You have <span className="font-bold text-yellow-200">{pendingAssignments}</span> assignments pending and <span className="font-bold text-cyan-200">{todaySchedule.length}</span> classes today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todaySchedule.slice(0, 4).map((class_) => (
              <div key={class_.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: class_.color }}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{class_.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{class_.teacher} • {class_.room}</p>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {class_.startTime} - {class_.endTime}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grade Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {mockAssignments.slice(0, 3).map((assignment) => (
            <div key={assignment.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                assignment.status === 'submitted' ? 'bg-green-500' :
                assignment.status === 'late' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{assignment.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {assignment.subject} • Due {format(assignment.dueDate, 'MMM d, yyyy')}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  assignment.status === 'submitted' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  assignment.status === 'late' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};