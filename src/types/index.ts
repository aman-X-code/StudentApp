export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  class: string;
  section: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: Date;
  submittedDate?: Date;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  maxMarks: number;
  obtainedMarks?: number;
  priority: 'low' | 'medium' | 'high';
}

export interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  color: string;
}

export interface Grade {
  id: string;
  subject: string;
  examType: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  date: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'event' | 'holiday' | 'exam' | 'general';
  date: Date;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
}

export interface AttendanceRecord {
  id: string;
  subject: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}
