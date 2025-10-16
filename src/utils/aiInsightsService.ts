import { Entry } from '../types'
import { ProjectStorage } from './storage'

export interface AIInsights {
  passion: {
    insight: string
    tasks: string[]
  }
  energy: {
    insight: string
    tasks: string[]
  }
  drained: {
    insight: string
    tasks: string[]
  }
  meaningful: {
    insight: string
    tasks: string[]
  }
}

interface TaskForAI {
  description: string
  projectName: string
  emotions: number[]
}

export class AIInsightsService {
  private static API_ENDPOINT = '/api/generate-insights'

  /**
   * Generate AI insights from entries
   */
  static async generateInsights(entries: Entry[]): Promise<AIInsights> {
    // Prepare tasks for AI analysis
    const tasks: TaskForAI[] = []
    
    entries.forEach(entry => {
      entry.tasks.forEach(task => {
        const project = ProjectStorage.getProjectById(task.projectId)
        const emotions = task.emotions && task.emotions.length > 0 
          ? task.emotions.map(e => typeof e === 'string' ? parseInt(e, 10) : e)
          : [typeof task.emotion === 'string' ? parseInt(task.emotion, 10) : task.emotion]
        
        tasks.push({
          description: task.description,
          projectName: project?.name || 'Unknown Project',
          emotions
        })
      })
    })

    if (tasks.length === 0) {
      throw new Error('No tasks to analyze')
    }

    // Call the serverless API
    const response = await fetch(this.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate insights')
    }

    const data = await response.json()
    return data.insights
  }

  /**
   * Check if AI insights are available (has API key configured)
   */
  static async checkAvailability(): Promise<boolean> {
    try {
      // Try a simple health check (could add a dedicated endpoint)
      return true // For now, assume always available
    } catch {
      return false
    }
  }
}

// Storage key for caching insights
const INSIGHTS_CACHE_KEY = 'designerTracker_aiInsights'
const INSIGHTS_CACHE_TIMESTAMP_KEY = 'designerTracker_aiInsightsTimestamp'

export const AIInsightsCache = {
  save: (insights: AIInsights): void => {
    try {
      localStorage.setItem(INSIGHTS_CACHE_KEY, JSON.stringify(insights))
      localStorage.setItem(INSIGHTS_CACHE_TIMESTAMP_KEY, new Date().toISOString())
    } catch (error) {
      console.error('Failed to cache insights:', error)
    }
  },

  load: (): { insights: AIInsights | null; timestamp: Date | null } => {
    try {
      const cached = localStorage.getItem(INSIGHTS_CACHE_KEY)
      const timestamp = localStorage.getItem(INSIGHTS_CACHE_TIMESTAMP_KEY)
      
      if (!cached) return { insights: null, timestamp: null }
      
      return {
        insights: JSON.parse(cached),
        timestamp: timestamp ? new Date(timestamp) : null
      }
    } catch (error) {
      console.error('Failed to load cached insights:', error)
      return { insights: null, timestamp: null }
    }
  },

  clear: (): void => {
    localStorage.removeItem(INSIGHTS_CACHE_KEY)
    localStorage.removeItem(INSIGHTS_CACHE_TIMESTAMP_KEY)
  },

  isStale: (maxAgeHours: number = 24): boolean => {
    const { timestamp } = AIInsightsCache.load()
    if (!timestamp) return true
    
    const ageHours = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60)
    return ageHours > maxAgeHours
  }
}

