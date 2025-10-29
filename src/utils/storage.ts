import { Entry, Task, Project, AppSettings, UserProfile } from '../types';

// Storage keys for different data types
const STORAGE_KEYS = {
  ENTRIES: 'designerTracker_entries',
  PROJECTS: 'designerTracker_projects', 
  SETTINGS: 'designerTracker_settings',
  ONBOARDING: 'designerTracker_onboarding',
  USER_PROFILE: 'designerTracker_userProfile'
} as const;

/**
 * Entry Storage Operations
 */
export const EntryStorage = {
  // Save entries to localStorage
  saveEntries: (entries: Entry[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries))
    } catch (error) {
      console.error('Error saving entries to localStorage:', error)
    }
  },

  // Load entries from localStorage
  loadEntries: (): Entry[] => {
    try {
      const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES)
      if (!savedEntries) return []
      
      const parsed = JSON.parse(savedEntries)
      return parsed.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
        tasks: entry.tasks.map((task: any) => ({
          ...task,
          emotion: typeof task.emotion === 'string' ? parseInt(task.emotion, 10) : task.emotion,
          emotions: task.emotions 
            ? task.emotions.map((e: any) => typeof e === 'string' ? parseInt(e, 10) : e)
            : undefined,
          createdAt: new Date(task.createdAt)
        }))
      }))
    } catch (error) {
      console.error('Error loading entries from localStorage:', error)
      return []
    }
  },

  // Get entry by ID
  getEntryById: (id: string): Entry | null => {
    const entries = EntryStorage.loadEntries()
    return entries.find(entry => entry.id === id) || null
  },

  // Get entries by date range
  getEntriesByDateRange: (startDate: string, endDate: string): Entry[] => {
    const entries = EntryStorage.loadEntries()
    return entries.filter(entry => entry.date >= startDate && entry.date <= endDate)
  },

  // Get entry by date (YYYY-MM-DD)
  getEntryByDate: (date: string): Entry | null => {
    const entries = EntryStorage.loadEntries()
    return entries.find(entry => entry.date === date) || null
  },

  // Validate that all project IDs in entry exist
  validateProjectIds: (entry: Entry): { isValid: boolean; invalidIds: string[] } => {
    const projects = ProjectStorage.loadProjects()
    const validProjectIds = new Set(projects.map(p => p.id))
    const invalidIds: string[] = []
    
    entry.tasks.forEach(task => {
      if (!validProjectIds.has(task.projectId)) {
        invalidIds.push(task.projectId)
      }
    })
    
    return {
      isValid: invalidIds.length === 0,
      invalidIds: Array.from(new Set(invalidIds)) // Remove duplicates
    }
  },

  // Save single entry (create or update)
  saveEntry: (entry: Entry): void => {
    // Validate project IDs before saving
    const validation = EntryStorage.validateProjectIds(entry)
    if (!validation.isValid) {
      console.error(
        '❌ Attempted to save entry with invalid project IDs:', 
        validation.invalidIds,
        '\nEntry:', entry
      )
      throw new Error(
        `Cannot save entry: Invalid project IDs found (${validation.invalidIds.join(', ')}). ` +
        `Please ensure all projects exist before saving tasks.`
      )
    }
    
    const entries = EntryStorage.loadEntries()
    const existingIndex = entries.findIndex(e => e.id === entry.id)
    
    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entry, updatedAt: new Date() }
    } else {
      entries.push(entry)
    }
    
    EntryStorage.saveEntries(entries)
  },

  // Delete entry by ID
  deleteEntry: (id: string): void => {
    const entries = EntryStorage.loadEntries()
    const filteredEntries = entries.filter(entry => entry.id !== id)
    EntryStorage.saveEntries(filteredEntries)
  },

  // Clear all entries
  clearEntries: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ENTRIES)
    } catch (error) {
      console.error('Error clearing entries from localStorage:', error)
    }
  },
};

/**
 * Project Storage Operations
 */
export const ProjectStorage = {
  // Save projects to localStorage
  saveProjects: (projects: Project[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    } catch (error) {
      console.error('Error saving projects to localStorage:', error)
    }
  },

  // Load projects from localStorage
  loadProjects: (): Project[] => {
    try {
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS)
      if (!savedProjects) return []
      
      const parsed = JSON.parse(savedProjects)
      return parsed.map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt)
      }))
    } catch (error) {
      console.error('Error loading projects from localStorage:', error)
      return []
    }
  },

  // Get project by ID
  getProjectById: (id: string): Project | null => {
    const projects = ProjectStorage.loadProjects()
    return projects.find(project => project.id === id) || null
  },

  // Save single project (create or update)
  saveProject: (project: Project): void => {
    const projects = ProjectStorage.loadProjects()
    const existingIndex = projects.findIndex(p => p.id === project.id)
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project
    } else {
      projects.push(project)
    }
    
    ProjectStorage.saveProjects(projects)
  },

  // Delete project by ID
  deleteProject: (id: string): void => {
    const projects = ProjectStorage.loadProjects()
    const filteredProjects = projects.filter(project => project.id !== id)
    ProjectStorage.saveProjects(filteredProjects)
  },

  // Create default project for new users
  createDefaultProject: (): Project => {
    const defaultProject: Project = {
      id: 'default-project',
      name: 'My Design Work',
      color: '#FFD678', // Warm yellow
      createdAt: new Date()
    }
    
    ProjectStorage.saveProject(defaultProject)
    return defaultProject
  },

  // Clear all projects
  clearProjects: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROJECTS)
    } catch (error) {
      console.error('Error clearing projects from localStorage:', error)
    }
  },
};

/**
 * Settings Storage Operations
 */
export const SettingsStorage = {
  // Save settings to localStorage
  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings to localStorage:', error)
    }
  },

  // Load settings from localStorage
  loadSettings: (): AppSettings => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (!savedSettings) {
        // Return default settings
        return {
          dailyReminderEnabled: false,
          theme: 'light',
          accessibilityMode: false,
          dataExportEnabled: true
        }
      }
      
      return JSON.parse(savedSettings)
    } catch (error) {
      console.error('Error loading settings from localStorage:', error)
      return {
        dailyReminderEnabled: false,
        theme: 'light',
        accessibilityMode: false,
        dataExportEnabled: true
      }
    }
  },
};

/**
 * Onboarding Storage Operations
 */
export const OnboardingStorage = {
  // Check if onboarding is completed
  isOnboardingCompleted: (): boolean => {
    try {
      const completed = localStorage.getItem(STORAGE_KEYS.ONBOARDING)
      return completed === 'true'
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      return false
    }
  },

  // Mark onboarding as completed
  markOnboardingCompleted: (): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true')
    } catch (error) {
      console.error('Error marking onboarding as completed:', error)
    }
  },

  // Reset onboarding status
  resetOnboarding: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING)
    } catch (error) {
      console.error('Error resetting onboarding:', error)
    }
  },
};

/**
 * User Profile Storage Operations
 */
export const UserProfileStorage = {
  // Save user profile
  saveUserProfile: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile => {
    try {
      const existingProfile = UserProfileStorage.getUserProfile()
      
      const userProfile: UserProfile = existingProfile ? {
        ...existingProfile,
        ...profile,
        updatedAt: new Date()
      } : {
        id: `user_${Date.now()}`,
        ...profile,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile))
      return userProfile
    } catch (error) {
      console.error('Error saving user profile:', error)
      throw error
    }
  },

  // Get user profile
  getUserProfile: (): UserProfile | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
      if (!saved) return null
      
      const parsed = JSON.parse(saved)
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      return null
    }
  },

  // Update user profile
  updateUserProfile: (updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): UserProfile | null => {
    try {
      const existingProfile = UserProfileStorage.getUserProfile()
      if (!existingProfile) return null
      
      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date()
      }
      
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile))
      return updatedProfile
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  },

  // Clear user profile
  clearUserProfile: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE)
    } catch (error) {
      console.error('Error clearing user profile:', error)
    }
  }
};

/**
 * Data Export/Import Operations
 */
export const DataExportImport = {
  // Export all data as JSON
  exportAllData: () => {
    const entries = EntryStorage.loadEntries()
    const projects = ProjectStorage.loadProjects()
    const settings = SettingsStorage.loadSettings()
    
    return {
      entries,
      projects,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  },

  // Export entries as CSV
  exportEntriesAsCSV: (entries: Entry[]): string => {
    const headers = ['Date', 'Project', 'Task Description', 'Task Type', 'Emotion', 'Emotion Level', 'Notes', 'Created At']
    
    const rows = entries.flatMap(entry => 
      entry.tasks.map(task => {
        const project = ProjectStorage.getProjectById(task.projectId)
        return [
          entry.date,
          project?.name || 'Unknown Project',
          task.description,
          task.taskType,
          task.emotion === 1 ? '😫' : task.emotion === 2 ? '😕' : task.emotion === 3 ? '😐' : task.emotion === 4 ? '😊' : '😍',
          task.emotion.toString(),
          task.notes || '',
          task.createdAt.toISOString()
        ]
      })
    )
    
    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
  },

  // Import data from JSON
  importData: (data: any): boolean => {
    try {
      if (data.entries) {
        EntryStorage.saveEntries(data.entries)
      }
      if (data.projects) {
        ProjectStorage.saveProjects(data.projects)
      }
      if (data.settings) {
        SettingsStorage.saveSettings(data.settings)
      }
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  },

  // Clear all data
  clearAllData: (): void => {
    EntryStorage.clearEntries()
    ProjectStorage.saveProjects([])
    OnboardingStorage.resetOnboarding()
  }
};

/**
 * Legacy compatibility - keeping the old StorageUtils for existing components
 * TODO: Remove this once all components are updated to use the new storage system
 */
export const StorageUtils = {
  saveEntries: EntryStorage.saveEntries,
  loadEntries: EntryStorage.loadEntries,
  clearEntries: EntryStorage.clearEntries,
  exportAsJSON: (entries: any[]) => JSON.stringify(entries, null, 2),
  exportAsCSV: DataExportImport.exportEntriesAsCSV
};