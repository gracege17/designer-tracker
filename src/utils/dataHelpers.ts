import { Entry, Task, Project, EmotionLevel, TaskType } from '../types';

/**
 * Utility functions for working with data models
 */

/**
 * Generate unique IDs
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date to YYYY-MM-DD string (using local timezone)
 */
export const formatDateForStorage = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDateString = (): string => {
  return formatDateForStorage(new Date());
};

/**
 * Create a new Task object
 */
export const createTask = (
  projectId: string,
  description: string,
  taskType: TaskType,
  emotion: EmotionLevel,
  notes?: string
): Task => {
  return {
    id: generateId(),
    projectId,
    description: description.trim(),
    taskType,
    emotion,
    notes: notes?.trim() || undefined,
    createdAt: new Date()
  };
};

/**
 * Create a new Project object
 */
export const createProject = (
  name: string,
  color: string
): Project => {
  return {
    id: generateId(),
    name: name.trim(),
    color,
    createdAt: new Date()
  };
};

/**
 * Create a new Entry object
 */
export const createEntry = (
  date: string,
  tasks: Task[]
): Entry => {
  return {
    id: generateId(),
    date,
    tasks,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Create an entry for today with a single task
 */
export const createTodayEntry = (
  projectId: string,
  taskDescription: string,
  taskType: TaskType,
  emotion: EmotionLevel,
  notes?: string
): Entry => {
  const task = createTask(projectId, taskDescription, taskType, emotion, notes);
  return createEntry(getTodayDateString(), [task]);
};

/**
 * Add a task to an existing entry
 */
export const addTaskToEntry = (
  entry: Entry,
  projectId: string,
  taskDescription: string,
  taskType: TaskType,
  emotion: EmotionLevel,
  notes?: string
): Entry => {
  const newTask = createTask(projectId, taskDescription, taskType, emotion, notes);
  
  return {
    ...entry,
    tasks: [...entry.tasks, newTask],
    updatedAt: new Date()
  };
};

/**
 * Update a task in an entry
 */
export const updateTaskInEntry = (
  entry: Entry,
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>
): Entry => {
  const updatedTasks = entry.tasks.map(task => 
    task.id === taskId 
      ? { ...task, ...updates }
      : task
  );

  return {
    ...entry,
    tasks: updatedTasks,
    updatedAt: new Date()
  };
};

/**
 * Remove a task from an entry
 */
export const removeTaskFromEntry = (
  entry: Entry,
  taskId: string
): Entry => {
  return {
    ...entry,
    tasks: entry.tasks.filter(task => task.id !== taskId),
    updatedAt: new Date()
  };
};

/**
 * Calculate average emotion for an entry
 */
export const calculateEntryAverageEmotion = (entry: Entry): number => {
  if (entry.tasks.length === 0) return 0;
  
  const total = entry.tasks.reduce((sum, task) => sum + task.emotion, 0);
  return Math.round((total / entry.tasks.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate average emotion for multiple entries
 */
export const calculateAverageEmotion = (entries: Entry[]): number => {
  const allTasks = entries.flatMap(entry => entry.tasks);
  if (allTasks.length === 0) return 0;
  
  const total = allTasks.reduce((sum, task) => sum + task.emotion, 0);
  return Math.round((total / allTasks.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Get most common task type from entries
 */
export const getMostCommonTaskType = (entries: Entry[]): TaskType | null => {
  const allTasks = entries.flatMap(entry => entry.tasks);
  if (allTasks.length === 0) return null;
  
  const taskTypeCounts: Record<TaskType, number> = {} as Record<TaskType, number>;
  
  allTasks.forEach(task => {
    taskTypeCounts[task.taskType] = (taskTypeCounts[task.taskType] || 0) + 1;
  });
  
  let mostCommon: TaskType | null = null;
  let maxCount = 0;
  
  Object.entries(taskTypeCounts).forEach(([taskType, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = taskType as TaskType;
    }
  });
  
  return mostCommon;
};

/**
 * Get task type with highest average emotion
 */
export const getMostEnergizingTaskType = (entries: Entry[]): TaskType | null => {
  const allTasks = entries.flatMap(entry => entry.tasks);
  if (allTasks.length === 0) return null;
  
  const taskTypeEmotions: Record<TaskType, number[]> = {} as Record<TaskType, number[]>;
  
  allTasks.forEach(task => {
    if (!taskTypeEmotions[task.taskType]) {
      taskTypeEmotions[task.taskType] = [];
    }
    taskTypeEmotions[task.taskType].push(task.emotion);
  });
  
  let mostEnergizing: TaskType | null = null;
  let highestAverage = 0;
  
  Object.entries(taskTypeEmotions).forEach(([taskType, emotions]) => {
    const average = emotions.reduce((sum, emotion) => sum + emotion, 0) / emotions.length;
    if (average > highestAverage) {
      highestAverage = average;
      mostEnergizing = taskType as TaskType;
    }
  });
  
  return mostEnergizing;
};

/**
 * Get task type with lowest average emotion
 */
export const getMostDrainingTaskType = (entries: Entry[]): TaskType | null => {
  const allTasks = entries.flatMap(entry => entry.tasks);
  if (allTasks.length === 0) return null;
  
  const taskTypeEmotions: Record<TaskType, number[]> = {} as Record<TaskType, number[]>;
  
  allTasks.forEach(task => {
    if (!taskTypeEmotions[task.taskType]) {
      taskTypeEmotions[task.taskType] = [];
    }
    taskTypeEmotions[task.taskType].push(task.emotion);
  });
  
  let mostDraining: TaskType | null = null;
  let lowestAverage = 6; // Start higher than max emotion level
  
  Object.entries(taskTypeEmotions).forEach(([taskType, emotions]) => {
    const average = emotions.reduce((sum, emotion) => sum + emotion, 0) / emotions.length;
    if (average < lowestAverage) {
      lowestAverage = average;
      mostDraining = taskType as TaskType;
    }
  });
  
  return mostDraining;
};

/**
 * Filter entries by date range
 */
export const filterEntriesByDateRange = (
  entries: Entry[],
  startDate: string,
  endDate: string
): Entry[] => {
  return entries.filter(entry => 
    entry.date >= startDate && entry.date <= endDate
  );
};

/**
 * Get entries for current week
 */
export const getCurrentWeekEntries = (entries: Entry[]): Entry[] => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startDateString = formatDateForStorage(startOfWeek);
  const endDateString = formatDateForStorage(endOfWeek);
  
  return filterEntriesByDateRange(entries, startDateString, endDateString);
};

/**
 * Get entries for current month
 */
export const getCurrentMonthEntries = (entries: Entry[]): Entry[] => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const startDateString = formatDateForStorage(startOfMonth);
  const endDateString = formatDateForStorage(endOfMonth);
  
  return filterEntriesByDateRange(entries, startDateString, endDateString);
};

/**
 * Check if an entry exists for a specific date
 */
export const hasEntryForDate = (entries: Entry[], date: string): boolean => {
  return entries.some(entry => entry.date === date);
};

/**
 * Get the most recent entry
 */
export const getMostRecentEntry = (entries: Entry[]): Entry | null => {
  if (entries.length === 0) return null;
  
  return entries.reduce((latest, current) => 
    current.date > latest.date ? current : latest
  );
};

/**
 * Count total tasks across all entries
 */
export const getTotalTaskCount = (entries: Entry[]): number => {
  return entries.reduce((total, entry) => total + entry.tasks.length, 0);
};

/**
 * Get unique project IDs from entries
 */
export const getUniqueProjectIds = (entries: Entry[]): string[] => {
  const projectIds = new Set<string>();
  
  entries.forEach(entry => {
    entry.tasks.forEach(task => {
      projectIds.add(task.projectId);
    });
  });
  
  return Array.from(projectIds);
};
