// Designer's Life Tracker - Type Definitions

// Core emotion tracking types
export type EmotionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export interface EmotionData {
  level: EmotionLevel;
  emoji: string;
  label: string;
  iconPath?: string; // Optional custom icon path
}

// Task and project types for reflection logging
export interface Task {
  id: string;
  projectId: string;
  description: string;
  taskType: TaskType;
  emotion: EmotionLevel; // Single emotion for backward compatibility
  emotions?: EmotionLevel[]; // Multiple emotions support
  notes?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD format
  tasks: Task[];
  overallFeeling?: number; // 0-100 slider value from "How's your day so far?"
  createdAt: Date;
  updatedAt: Date;
}

// Task type categories for design work
export type TaskType = 
  | 'wireframing'
  | 'user-research'
  | 'visual-design'
  | 'prototyping'
  | 'user-testing'
  | 'design-system'
  | 'meetings'
  | 'feedback-review'
  | 'documentation'
  | 'other';

// Insights and analytics types
export interface WeeklyInsight {
  weekStart: string;
  weekEnd: string;
  totalTasks: number;
  averageEmotion: number;
  mostEnergizingTaskType: TaskType;
  mostDrainingTaskType: TaskType;
  projectSatisfaction: ProjectSatisfaction[];
  emotionTrend: EmotionTrend[];
}

export interface MonthlyInsight {
  month: string;
  year: number;
  totalTasks: number;
  averageEmotion: number;
  emotionDistribution: EmotionDistribution;
  taskTypeAnalysis: TaskTypeAnalysis[];
  projectComparison: ProjectSatisfaction[];
  patterns: InsightPattern[];
}

export interface ProjectSatisfaction {
  projectId: string;
  projectName: string;
  averageEmotion: number;
  taskCount: number;
}

export interface EmotionTrend {
  date: string;
  averageEmotion: number;
}

export interface EmotionDistribution {
  level1: number; // 😫
  level2: number; // 😕
  level3: number; // 😐
  level4: number; // 😊
  level5: number; // 😍
}

export interface TaskTypeAnalysis {
  taskType: TaskType;
  averageEmotion: number;
  taskCount: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface InsightPattern {
  type: 'energizing' | 'draining' | 'neutral';
  description: string;
  confidence: number; // 0-1
  suggestion?: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  DailyLog: { date?: string };
  Projects: undefined;
  ProjectDetail: { projectId: string };
  Insights: undefined;
  WeeklyInsights: { weekStart: string };
  MonthlyInsights: { month: string; year: number };
  EntryHistory: undefined;
  EntryDetail: { entryId: string };
  Onboarding: undefined;
  Settings: undefined;
};

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: ValidationError[];
  isSubmitting: boolean;
}

// Storage types for AsyncStorage
export interface StorageKeys {
  ENTRIES: 'entries';
  PROJECTS: 'projects';
  SETTINGS: 'settings';
  ONBOARDING_COMPLETED: 'onboardingCompleted';
}

// Settings and preferences
export interface AppSettings {
  dailyReminderEnabled: boolean;
  reminderTime?: string; // HH:MM format
  theme: 'light' | 'dark' | 'auto';
  accessibilityMode: boolean;
  dataExportEnabled: boolean;
}

// User Profile for onboarding and analytics
export interface UserProfile {
  id: string;
  name: string;
  jobTitle: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  learningPreferences?: string[];
  authMethod?: 'google' | 'facebook' | 'email' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

// Utility types for components
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Constants for emotion system
export const EMOTIONS: Record<EmotionLevel, EmotionData> = {
  1: { level: 1, emoji: '😀', label: 'Happy', iconPath: '/icons/32px-png/32px-Happy.png' },
  2: { level: 2, emoji: '😌', label: 'Calm', iconPath: '/icons/32px-png/32px-joy.png' },
  3: { level: 3, emoji: '🤩', label: 'Excited', iconPath: '/icons/32px-png/32px-Excited.png' },
  4: { level: 4, emoji: '😠', label: 'Frustrated', iconPath: '/icons/32px-png/32px-Frustrated.png' },
  5: { level: 5, emoji: '😢', label: 'Sad', iconPath: '/icons/32px-png/32px-Sad.png' },
  6: { level: 6, emoji: '😰', label: 'Anxious', iconPath: '/icons/32px-png/32px-Anxious.png' },
  7: { level: 7, emoji: '😮', label: 'Surprised', iconPath: '/icons/32px-png/32px-Surprised.png' },
  8: { level: 8, emoji: '😐', label: 'Neutral', iconPath: '/icons/32px-png/32px-Neutral.png' },
  9: { level: 9, emoji: '🥹', label: 'Nostalgic', iconPath: '/icons/32px-png/32px-Nostalgic.png' },
  10: { level: 10, emoji: '⚡', label: 'Energized', iconPath: '/icons/32px-png/32px-Energized.png' },
  11: { level: 11, emoji: '🙂', label: 'Normal', iconPath: '/icons/32px-png/32px-Neutral.png' },
  12: { level: 12, emoji: '😴', label: 'Tired', iconPath: '/icons/32px-png/32px-Tired.png' },
  13: { level: 13, emoji: '😊', label: 'Satisfied', iconPath: '/icons/32px-png/32px-Satisfied.png' },
  14: { level: 14, emoji: '😖', label: 'Annoyed', iconPath: '/icons/32px-png/32px-Annoyed.png' },
  15: { level: 15, emoji: '😫', label: 'Drained', iconPath: '/icons/32px-png/32px-Drained.png' },
  16: { level: 16, emoji: '😍', label: 'Proud', iconPath: '/icons/32px-png/32px-Proud.png' },
};

// Task type labels for UI
export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  'wireframing': 'Wireframing',
  'user-research': 'User Research',
  'visual-design': 'Visual Design',
  'prototyping': 'Prototyping',
  'user-testing': 'User Testing',
  'design-system': 'Design System',
  'meetings': 'Meetings',
  'feedback-review': 'Feedback & Review',
  'documentation': 'Documentation',
  'other': 'Other',
};

// Design system colors - cozy, calm, minimal aesthetic
export const DESIGN_COLORS = {
  // Primary palette
  background: '#FEFBEA', // Soft cream background
  text: '#5E5E5E', // Gentle gray text
  cta: '#FFD678', // Warm yellow CTA
  
  // Supporting colors
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#9E9E9E',
  darkGray: '#3E3E3E',
  
  // Emotion colors (softer versions)
  emotion1: '#FFB3B3', // Soft red for frustrated
  emotion2: '#FFCC99', // Soft orange for disappointed
  emotion3: '#E6E6E6', // Light gray for neutral
  emotion4: '#B3E5D1', // Soft green for satisfied
  emotion5: '#FFE066', // Soft yellow for energized
};

// Project color palette - warm, cozy tones
export const PROJECT_COLORS = [
  '#FFD678', // Warm yellow (matches CTA)
  '#FFB3B3', // Soft coral
  '#B3E5D1', // Sage green
  '#E6D3F7', // Lavender
  '#FFE066', // Light yellow
  '#F7D794', // Peach
  '#A8E6CF', // Mint
  '#FFB6C1', // Light pink
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
];
