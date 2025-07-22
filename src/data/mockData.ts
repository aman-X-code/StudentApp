import { Student, Assignment, ClassSchedule, Grade, Announcement } from '../types';

export const mockStudent: Student = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@school.edu',
  studentId: 'STU2024001',
  class: '12th Grade',
  section: 'A',
  phone: '+1 (555) 123-4567',
  address: '123 Education Street, Learning City, LC 12345'
};

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Physics Lab Report',
    subject: 'Physics',
    description: 'Complete analysis of the pendulum experiment with calculations and conclusions.',
    dueDate: new Date('2024-12-20'),
    status: 'pending',
    maxMarks: 25,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Essay on Shakespeare',
    subject: 'English Literature',
    description: 'Write a 1500-word essay analyzing themes in Hamlet.',
    dueDate: new Date('2024-12-22'),
    submittedDate: new Date('2024-12-18'),
    status: 'submitted',
    maxMarks: 30,
    obtainedMarks: 28,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Calculus Problem Set 5',
    subject: 'Mathematics',
    description: 'Complete problems 1-20 from Chapter 8: Integration Techniques.',
    dueDate: new Date('2024-12-25'),
    status: 'pending',
    maxMarks: 20,
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Chemistry Quiz Preparation',
    subject: 'Chemistry',
    description: 'Study organic chemistry reactions for upcoming quiz.',
    dueDate: new Date('2024-12-19'),
    status: 'late',
    maxMarks: 15,
    priority: 'high'
  }
];

export const mockSchedule: ClassSchedule[] = [
  { id: '1', subject: 'Mathematics', teacher: 'Dr. Smith', room: '201', startTime: '08:00', endTime: '09:00', day: 'Monday', color: '#3b82f6' },
  { id: '2', subject: 'Physics', teacher: 'Prof. Johnson', room: '303', startTime: '09:15', endTime: '10:15', day: 'Monday', color: '#ef4444' },
  { id: '3', subject: 'Chemistry', teacher: 'Dr. Brown', room: '205', startTime: '10:30', endTime: '11:30', day: 'Monday', color: '#10b981' },
  { id: '4', subject: 'English Literature', teacher: 'Ms. Davis', room: '102', startTime: '12:30', endTime: '13:30', day: 'Monday', color: '#8b5cf6' },
  
  { id: '5', subject: 'Physics', teacher: 'Prof. Johnson', room: '303', startTime: '08:00', endTime: '09:00', day: 'Tuesday', color: '#ef4444' },
  { id: '6', subject: 'Mathematics', teacher: 'Dr. Smith', room: '201', startTime: '09:15', endTime: '10:15', day: 'Tuesday', color: '#3b82f6' },
  { id: '7', subject: 'History', teacher: 'Mr. Wilson', room: '105', startTime: '10:30', endTime: '11:30', day: 'Tuesday', color: '#f59e0b' },
  { id: '8', subject: 'Physical Education', teacher: 'Coach Taylor', room: 'Gym', startTime: '12:30', endTime: '13:30', day: 'Tuesday', color: '#06b6d4' },

  { id: '9', subject: 'Chemistry', teacher: 'Dr. Brown', room: '205', startTime: '08:00', endTime: '09:00', day: 'Wednesday', color: '#10b981' },
  { id: '10', subject: 'English Literature', teacher: 'Ms. Davis', room: '102', startTime: '09:15', endTime: '10:15', day: 'Wednesday', color: '#8b5cf6' },
  { id: '11', subject: 'Mathematics', teacher: 'Dr. Smith', room: '201', startTime: '10:30', endTime: '11:30', day: 'Wednesday', color: '#3b82f6' },
  { id: '12', subject: 'Biology', teacher: 'Dr. Garcia', room: '208', startTime: '12:30', endTime: '13:30', day: 'Wednesday', color: '#84cc16' },

  { id: '13', subject: 'History', teacher: 'Mr. Wilson', room: '105', startTime: '08:00', endTime: '09:00', day: 'Thursday', color: '#f59e0b' },
  { id: '14', subject: 'Physics', teacher: 'Prof. Johnson', room: '303', startTime: '09:15', endTime: '10:15', day: 'Thursday', color: '#ef4444' },
  { id: '15', subject: 'Biology', teacher: 'Dr. Garcia', room: '208', startTime: '10:30', endTime: '11:30', day: 'Thursday', color: '#84cc16' },
  { id: '16', subject: 'Art', teacher: 'Ms. Anderson', room: 'Art Room', startTime: '12:30', endTime: '13:30', day: 'Thursday', color: '#ec4899' },

  { id: '17', subject: 'English Literature', teacher: 'Ms. Davis', room: '102', startTime: '08:00', endTime: '09:00', day: 'Friday', color: '#8b5cf6' },
  { id: '18', subject: 'Chemistry', teacher: 'Dr. Brown', room: '205', startTime: '09:15', endTime: '10:15', day: 'Friday', color: '#10b981' },
  { id: '19', subject: 'Mathematics', teacher: 'Dr. Smith', room: '201', startTime: '10:30', endTime: '11:30', day: 'Friday', color: '#3b82f6' },
  { id: '20', subject: 'Computer Science', teacher: 'Mr. Lee', room: 'Lab 1', startTime: '12:30', endTime: '13:30', day: 'Friday', color: '#6366f1' }
];

export const mockGrades: Grade[] = [
  { id: '1', subject: 'Mathematics', examType: 'Midterm', maxMarks: 100, obtainedMarks: 92, grade: 'A', date: new Date('2024-11-15') },
  { id: '2', subject: 'Physics', examType: 'Quiz 1', maxMarks: 25, obtainedMarks: 22, grade: 'A-', date: new Date('2024-11-10') },
  { id: '3', subject: 'Chemistry', examType: 'Lab Test', maxMarks: 30, obtainedMarks: 28, grade: 'A-', date: new Date('2024-11-20') },
  { id: '4', subject: 'English Literature', examType: 'Essay', maxMarks: 40, obtainedMarks: 36, grade: 'A-', date: new Date('2024-11-12') },
  { id: '5', subject: 'History', examType: 'Assignment', maxMarks: 20, obtainedMarks: 18, grade: 'A-', date: new Date('2024-11-18') },
  { id: '6', subject: 'Biology', examType: 'Practical', maxMarks: 35, obtainedMarks: 33, grade: 'A', date: new Date('2024-11-22') }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Winter Break Schedule',
    content: 'Classes will be suspended from December 23, 2024, to January 8, 2025. Regular classes will resume on January 9, 2025.',
    category: 'holiday',
    date: new Date('2024-12-15'),
    priority: 'high',
    isRead: false
  },
  {
    id: '2',
    title: 'Science Fair Registration Open',
    content: 'Registration for the annual Science Fair is now open. Submit your project proposals by January 15, 2025.',
    category: 'event',
    date: new Date('2024-12-14'),
    priority: 'medium',
    isRead: true
  },
  {
    id: '3',
    title: 'Final Examination Schedule',
    content: 'Final examinations will begin on February 1, 2025. Detailed schedule will be shared next week.',
    category: 'exam',
    date: new Date('2024-12-13'),
    priority: 'high',
    isRead: false
  },
  {
    id: '4',
    title: 'Library New Books Arrival',
    content: 'New collection of science and literature books have arrived at the library. Visit during lunch hours to explore.',
    category: 'general',
    date: new Date('2024-12-12'),
    priority: 'low',
    isRead: true
  }
];