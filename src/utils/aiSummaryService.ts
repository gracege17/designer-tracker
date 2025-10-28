import { Entry, EMOTIONS } from '../types'

interface DailySummary {
  summary: string
  timestamp: string
}

// Cache for daily summaries to avoid repeated API calls
const summaryCache = new Map<string, DailySummary>()

export const generateDailySummary = async (todayEntry: Entry | undefined): Promise<string> => {
  if (!todayEntry || todayEntry.tasks.length === 0) {
    return "Add your first task to see today's summary."
  }

  const cacheKey = `${todayEntry.date}-${todayEntry.tasks.length}`
  const cached = summaryCache.get(cacheKey)
  
  if (cached) {
    return cached.summary
  }

  try {
    // Prepare task data for AI
    const taskData = todayEntry.tasks.map(task => {
      const emotion = task.emotions && task.emotions.length > 0 
        ? task.emotions[0] 
        : task.emotion
      const emoji = EMOTIONS[emotion]?.emoji || '😐'
      
      return {
        description: task.description,
        emotion: emotion,
        emoji: emoji,
        taskType: task.taskType
      }
    })

    const response = await fetch('/api/generate-daily-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: taskData,
        date: todayEntry.date
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate summary')
    }

    const data = await response.json()
    const summary = data.summary || "Productive day with mixed work. Great momentum."

    // Cache the result
    summaryCache.set(cacheKey, {
      summary,
      timestamp: new Date().toISOString()
    })

    return summary
  } catch (error) {
    console.error('Error generating daily summary:', error)
    
    // Fallback summary based on task analysis
    const avgEmotion = todayEntry.tasks.reduce((sum, task) => {
      const emotion = task.emotions && task.emotions.length > 0 
        ? task.emotions[0] 
        : task.emotion
      return sum + emotion
    }, 0) / todayEntry.tasks.length

    if (avgEmotion >= 10) {
      return "Energizing day. Strong creative flow and focus."
    } else if (avgEmotion >= 7) {
      return "Solid, productive day. Good momentum throughout."
    } else if (avgEmotion >= 4) {
      return "Challenging work ahead. Every step counts."
    } else {
      return "Tough moments today. Progress through perseverance."
    }
  }
}

// Clear cache when needed (e.g., when user adds new tasks)
export const clearSummaryCache = (date?: string) => {
  if (date) {
    // Clear cache for specific date
    for (const [key] of summaryCache) {
      if (key.startsWith(date)) {
        summaryCache.delete(key)
      }
    }
  } else {
    // Clear all cache
    summaryCache.clear()
  }
}
