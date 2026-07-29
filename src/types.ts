export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  occupation: string;
  schoolCompany: string;
  profilePicture: string; // Avatar URL or base64
  streak: number;
  productivityScore: number;
  achievements: string[];
  role: 'admin' | 'user';
}

export interface Routine {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  title: string;
  completed: boolean;
  completedAt?: string; // Timestamp
}

export interface ScreenTime {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mobile: number; // in minutes
  desktop: number; // in minutes
  purpose: 'Study' | 'Work' | 'Coding' | 'Entertainment' | 'Social Media' | 'Gaming' | 'YouTube' | 'Movies' | 'Other';
}

export interface Goal {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  title: string;
  completed: boolean;
}

export interface Journal {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  learnedToday: string;
  skillPracticed: string;
  mistakesMade: string;
  improveTomorrow: string;
}

export interface Reflection {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  productivityRating: number; // 1-5
  timeWasters: string;
  happinessFactors: string;
  mood: '😊' | '😃' | '😐' | '😔' | '😴';
}

export interface ChatbotMessage {
  id: string;
  userId: string;
  timestamp: string;
  sender: 'user' | 'ai';
  message: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
}

export interface Feedback {
  id: string;
  userId: string;
  username: string;
  text: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'routine' | 'screen' | 'general';
  timestamp: string;
  read: boolean;
}
