import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfWeek } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { mockSchedule } from '../../data/mockData';

export const Schedule: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00', '09:15', '10:30', '12:30'];
  
  const currentTime = new Date();
  const currentDay = format(currentTime, 'EEEE');
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const isCurrentTimeSlot = (day: string, startTime: string) => {
    if (day !== currentDay) return false;
    
    const [hour, minute] = startTime.split(':').map(Number);
    const slotStart = hour * 60 + minute;
    const slotEnd = slotStart + 60; // Assuming 1-hour slots
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    return currentTimeMinutes >= slotStart && currentTimeMinutes <= slotEnd;
  };

  const getClassForTimeSlot = (day: string, timeSlot: string) => {
    return mockSchedule.find(
      class_ => class_.day === day && class_.startTime === timeSlot
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = addDays(currentWeek, direction === 'next' ? 7 : -7);
    setCurrentWeek(newWeek);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Class Schedule</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Week of {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setCurrentWeek(new Date())}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="p-4 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
            Time
          </div>
          {dayNames.map((day) => (
            <div key={day} className="p-4 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 last:border-r-0">
              <div>{day}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                {format(weekDays[dayNames.indexOf(day)], 'MMM d')}
              </div>
            </div>
          ))}
        </div>

        {timeSlots.map((timeSlot, timeIndex) => (
          <div key={timeSlot} className="grid grid-cols-6 border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 flex items-center">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">{timeSlot}</span>
              </div>
            </div>
            
            {dayNames.map((day, dayIndex) => {
              const classItem = getClassForTimeSlot(day, timeSlot);
              const isActive = isCurrentTimeSlot(day, timeSlot);
              
              return (
                <motion.div
                  key={`${day}-${timeSlot}`}
                  className="p-4 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[80px] flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (timeIndex * dayNames.length + dayIndex) * 0.05 }}
                >
                  {classItem ? (
                    <div
                      className={`w-full p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
                          : 'hover:shadow-md'
                      }`}
                      style={{
                        backgroundColor: `${classItem.color}15`,
                        borderLeft: `4px solid ${classItem.color}`
                      }}
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {classItem.subject}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {classItem.teacher}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {classItem.room}
                      </p>
                      {isActive && (
                        <div className="flex items-center mt-2 text-xs text-blue-600 dark:text-blue-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                          Live Now
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-12 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <span className="text-xs text-gray-400">Free Period</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Today's Classes Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Classes ({currentDay})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockSchedule
            .filter(class_ => class_.day === currentDay)
            .map((class_) => (
              <motion.div
                key={class_.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="w-3 h-3 rounded-full mt-2"
                    style={{ backgroundColor: class_.color }}
                  ></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {class_.subject}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {class_.teacher}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {class_.room}
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {class_.startTime} - {class_.endTime}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};