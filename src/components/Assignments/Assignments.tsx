import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import {
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { mockAssignments } from '../../data/mockData';
import { Assignment } from '../../types';

export const Assignments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'late'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'subject' | 'priority'>('dueDate');

  const getFilteredAssignments = () => {
    let filtered = mockAssignments;
    
    if (filter !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === filter);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });
  };

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'submitted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'late':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'late':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'graded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getPriorityColor = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-green-500';
    }
  };

  const isOverdue = (dueDate: Date, status: Assignment['status']) => {
    return status === 'pending' && isAfter(new Date(), dueDate);
  };

  const isDueSoon = (dueDate: Date, status: Assignment['status']) => {
    const threeDaysFromNow = addDays(new Date(), 3);
    return status === 'pending' && isBefore(dueDate, threeDaysFromNow) && !isAfter(new Date(), dueDate);
  };

  const filteredAssignments = getFilteredAssignments();
  const stats = {
    total: mockAssignments.length,
    pending: mockAssignments.filter(a => a.status === 'pending').length,
    submitted: mockAssignments.filter(a => a.status === 'submitted').length,
    late: mockAssignments.filter(a => a.status === 'late').length
  };

  return (
    <div className="space-y-6 px-4 lg:px-6 pb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your assignments and track progress
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Assignments</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="late">Late</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="subject">Sort by Subject</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-600 dark:text-gray-300' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Submitted', value: stats.submitted, color: 'text-green-600 dark:text-green-400' },
          { label: 'Late', value: stats.late, color: 'text-red-600 dark:text-red-400' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl border-l-4 border-r border-t border-b border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 ${getPriorityColor(assignment.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(assignment.status)}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {assignment.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <BookOpenIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{assignment.subject}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span className={`${
                          isOverdue(assignment.dueDate, assignment.status) 
                            ? 'text-red-600 dark:text-red-400 font-medium' 
                            : isDueSoon(assignment.dueDate, assignment.status)
                            ? 'text-yellow-600 dark:text-yellow-400 font-medium'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          Due {format(assignment.dueDate, 'MMM d, yyyy')}
                        </span>
                      </div>

                      {assignment.submittedDate && (
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600 dark:text-gray-300">
                            Submitted {format(assignment.submittedDate, 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </span>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.priority === 'high' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : assignment.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
                        </span>
                      </div>

                      {assignment.obtainedMarks !== undefined ? (
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {assignment.obtainedMarks}/{assignment.maxMarks}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">marks</span>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Max: </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {assignment.maxMarks} marks
                          </span>
                        </div>
                      )}
                    </div>

                    {(isOverdue(assignment.dueDate, assignment.status) || isDueSoon(assignment.dueDate, assignment.status)) && (
                      <div className={`p-3 rounded-lg ${
                        isOverdue(assignment.dueDate, assignment.status)
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                      }`}>
                        <p className={`text-sm font-medium ${
                          isOverdue(assignment.dueDate, assignment.status)
                            ? 'text-red-800 dark:text-red-400'
                            : 'text-yellow-800 dark:text-yellow-400'
                        }`}>
                          {isOverdue(assignment.dueDate, assignment.status)
                            ? '⚠️ This assignment is overdue!'
                            : '📅 Due soon - don\'t forget to submit!'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No assignments found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};