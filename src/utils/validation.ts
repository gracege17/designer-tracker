import { ValidationError } from '../types';

/**
 * Validation utility functions
 */

export class Validator {
  private errors: ValidationError[] = [];

  /**
   * Add an error to the validation results
   */
  private addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  /**
   * Check if a value is required (not empty)
   */
  required(value: any, field: string, message?: string): this {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      this.addError(field, message || `${field} is required`);
    }
    return this;
  }

  /**
   * Check if a string has minimum length
   */
  minLength(value: string, minLength: number, field: string, message?: string): this {
    if (value && value.length < minLength) {
      this.addError(field, message || `${field} must be at least ${minLength} characters`);
    }
    return this;
  }

  /**
   * Check if a string has maximum length
   */
  maxLength(value: string, maxLength: number, field: string, message?: string): this {
    if (value && value.length > maxLength) {
      this.addError(field, message || `${field} must be no more than ${maxLength} characters`);
    }
    return this;
  }

  /**
   * Check if a value is a valid email
   */
  email(value: string, field: string, message?: string): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      this.addError(field, message || 'Please enter a valid email address');
    }
    return this;
  }

  /**
   * Check if a value matches a pattern
   */
  pattern(value: string, pattern: RegExp, field: string, message: string): this {
    if (value && !pattern.test(value)) {
      this.addError(field, message);
    }
    return this;
  }

  /**
   * Custom validation function
   */
  custom(condition: boolean, field: string, message: string): this {
    if (!condition) {
      this.addError(field, message);
    }
    return this;
  }

  /**
   * Get validation results
   */
  getErrors(): ValidationError[] {
    return this.errors;
  }

  /**
   * Check if validation passed (no errors)
   */
  isValid(): boolean {
    return this.errors.length === 0;
  }

  /**
   * Reset validation errors
   */
  reset(): this {
    this.errors = [];
    return this;
  }
}

/**
 * Quick validation functions for common use cases
 */

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

/**
 * Form validation helper
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  rules: Record<keyof T, (value: any) => string | null>
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  Object.keys(rules).forEach((field) => {
    const rule = rules[field as keyof T];
    const error = rule(values[field as keyof T]);
    if (error) {
      errors.push({ field: field as string, message: error });
    }
  });
  
  return errors;
};

/**
 * Specific validators for Designer's Life Tracker data models
 */

import { Task, Project, Entry, EmotionLevel, TaskType } from '../types';

export const TaskValidators = {
  /**
   * Validate task description
   */
  description: (description: string): string | null => {
    if (!description || description.trim() === '') {
      return 'Task description is required';
    }
    if (description.length < 3) {
      return 'Task description must be at least 3 characters';
    }
    if (description.length > 500) {
      return 'Task description must be no more than 500 characters';
    }
    return null;
  },

  /**
   * Validate project ID
   */
  projectId: (projectId: string): string | null => {
    if (!projectId || projectId.trim() === '') {
      return 'Please select a project';
    }
    return null;
  },

  /**
   * Validate task type
   */
  taskType: (taskType: TaskType): string | null => {
    const validTypes: TaskType[] = [
      'wireframing', 'user-research', 'visual-design', 'prototyping',
      'user-testing', 'design-system', 'meetings', 'feedback-review',
      'documentation', 'other'
    ];
    
    if (!validTypes.includes(taskType)) {
      return 'Please select a valid task type';
    }
    return null;
  },

  /**
   * Validate emotion level
   */
  emotion: (emotion: EmotionLevel): string | null => {
    if (!emotion || ![1, 2, 3, 4, 5].includes(emotion)) {
      return 'Please select how this task made you feel';
    }
    return null;
  },

  /**
   * Validate optional notes
   */
  notes: (notes?: string): string | null => {
    if (notes && notes.length > 1000) {
      return 'Notes must be no more than 1000 characters';
    }
    return null;
  },

  /**
   * Validate complete task object
   */
  validateTask: (task: Partial<Task>): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    const descriptionError = TaskValidators.description(task.description || '');
    if (descriptionError) errors.push({ field: 'description', message: descriptionError });
    
    const projectError = TaskValidators.projectId(task.projectId || '');
    if (projectError) errors.push({ field: 'projectId', message: projectError });
    
    const taskTypeError = TaskValidators.taskType(task.taskType as TaskType);
    if (taskTypeError) errors.push({ field: 'taskType', message: taskTypeError });
    
    const emotionError = TaskValidators.emotion(task.emotion as EmotionLevel);
    if (emotionError) errors.push({ field: 'emotion', message: emotionError });
    
    const notesError = TaskValidators.notes(task.notes);
    if (notesError) errors.push({ field: 'notes', message: notesError });
    
    return errors;
  },
};

export const ProjectValidators = {
  /**
   * Validate project name
   */
  name: (name: string): string | null => {
    if (!name || name.trim() === '') {
      return 'Project name is required';
    }
    if (name.length < 2) {
      return 'Project name must be at least 2 characters';
    }
    if (name.length > 100) {
      return 'Project name must be no more than 100 characters';
    }
    return null;
  },

  /**
   * Validate project color
   */
  color: (color: string): string | null => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!color || !hexColorRegex.test(color)) {
      return 'Please select a valid color';
    }
    return null;
  },

  /**
   * Validate complete project object
   */
  validateProject: (project: Partial<Project>): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    const nameError = ProjectValidators.name(project.name || '');
    if (nameError) errors.push({ field: 'name', message: nameError });
    
    const colorError = ProjectValidators.color(project.color || '');
    if (colorError) errors.push({ field: 'color', message: colorError });
    
    return errors;
  },
};

export const EntryValidators = {
  /**
   * Validate entry date
   */
  date: (date: string): string | null => {
    if (!date) {
      return 'Entry date is required';
    }
    
    // Check if date is in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return 'Date must be in YYYY-MM-DD format';
    }
    
    // Check if date is valid
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Please enter a valid date';
    }
    
    // Check if date is not in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (parsedDate > today) {
      return 'Entry date cannot be in the future';
    }
    
    return null;
  },

  /**
   * Validate entry tasks
   */
  tasks: (tasks: Task[]): string | null => {
    if (!tasks || tasks.length === 0) {
      return 'Please add at least one task to your entry';
    }
    
    if (tasks.length > 10) {
      return 'You can add up to 10 tasks per entry';
    }
    
    return null;
  },

  /**
   * Validate complete entry object
   */
  validateEntry: (entry: Partial<Entry>): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    const dateError = EntryValidators.date(entry.date || '');
    if (dateError) errors.push({ field: 'date', message: dateError });
    
    const tasksError = EntryValidators.tasks(entry.tasks || []);
    if (tasksError) errors.push({ field: 'tasks', message: tasksError });
    
    // Validate each task
    if (entry.tasks) {
      entry.tasks.forEach((task, index) => {
        const taskErrors = TaskValidators.validateTask(task);
        taskErrors.forEach(error => {
          errors.push({
            field: `tasks[${index}].${error.field}`,
            message: error.message
          });
        });
      });
    }
    
    return errors;
  },
};

/**
 * Date utility functions for validation
 */
export const DateUtils = {
  /**
   * Format date to YYYY-MM-DD string
   */
  formatDate: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  /**
   * Get today's date in YYYY-MM-DD format
   */
  today: (): string => {
    return DateUtils.formatDate(new Date());
  },

  /**
   * Check if date string is today
   */
  isToday: (dateString: string): boolean => {
    return dateString === DateUtils.today();
  },

  /**
   * Get date range for current week
   */
  getCurrentWeek: (): { start: string; end: string } => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: DateUtils.formatDate(startOfWeek),
      end: DateUtils.formatDate(endOfWeek),
    };
  },

  /**
   * Get date range for current month
   */
  getCurrentMonth: (): { start: string; end: string } => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      start: DateUtils.formatDate(startOfMonth),
      end: DateUtils.formatDate(endOfMonth),
    };
  },
};
