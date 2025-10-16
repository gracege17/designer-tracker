import { Entry, Task } from '../types'

export interface InsightCardData {
  insight: string
  tasks: string[]
}

export interface AIInsights {
  passion: InsightCardData
  energy: InsightCardData
  drained: InsightCardData
  meaningful: InsightCardData
}

interface AIResponse {
  success: boolean
  insights: AIInsights
  tasksAnalyzed: number
}

/**
 * Fetch AI-generated insights for the given tasks
 * @param tasks - Array of tasks with emotions
 * @param forceRegenerate - If true, bypass cache and generate fresh insights
 */
export const fetchAiInsights = async (
  tasks: { description: string; projectName: string; emotions: number[] }[],
  forceRegenerate = false
): Promise<AIInsights | null> => {
  try {
    // Check cache first (unless force regenerate)
    if (!forceRegenerate) {
      const cached = localStorage.getItem('ai_insights_cache')
      const cacheTimestamp = localStorage.getItem('ai_insights_timestamp')
      
      if (cached && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp, 10)
        // Cache valid for 1 hour
        if (cacheAge < 60 * 60 * 1000) {
          return JSON.parse(cached)
        }
      }
    }

    // Call the API
    const response = await fetch('/api/generate-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data: AIResponse = await response.json()

    if (data.success && data.insights) {
      // Cache the result
      localStorage.setItem('ai_insights_cache', JSON.stringify(data.insights))
      localStorage.setItem('ai_insights_timestamp', Date.now().toString())
      
      return data.insights
    }

    return null
  } catch (error) {
    console.error('Failed to fetch AI insights:', error)
    return null
  }
}

/**
 * Prepare tasks from entries for AI analysis
 */
export const prepareTasksForAI = (entries: Entry[]): { description: string; projectName: string; emotions: number[] }[] => {
  const tasks: { description: string; projectName: string; emotions: number[] }[] = []

  entries.forEach(entry => {
    entry.tasks.forEach(task => {
      // Get emotions array (handle both old single emotion and new multiple emotions)
      const emotions = task.emotions && task.emotions.length > 0 
        ? task.emotions.map(e => typeof e === 'string' ? parseInt(e, 10) : e)
        : [typeof task.emotion === 'string' ? parseInt(task.emotion, 10) : task.emotion]

      tasks.push({
        description: task.description,
        projectName: task.projectId, // Will be replaced with actual project name
        emotions,
      })
    })
  })

  return tasks
}

/**
 * Clear AI insights cache (useful for debugging)
 */
export const clearAICache = (): void => {
  localStorage.removeItem('ai_insights_cache')
  localStorage.removeItem('ai_insights_timestamp')
}
