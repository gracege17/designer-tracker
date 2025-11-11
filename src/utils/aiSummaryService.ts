import { Entry, EMOTIONS } from '../types'

interface DailySummary {
  summary: string
  timestamp: string
}

// Cache for daily summaries to avoid repeated API calls
const summaryCache = new Map<string, DailySummary>()

export const buildLocalSummary = (taskData: Array<{ emotion: number; taskType?: string }>): string => {
  if (taskData.length === 0) {
    return "Ready to capture today's design journey? Add your first task to get a personalized summary!"
  }

  const avgEmotion = taskData.reduce((sum, task) => sum + task.emotion, 0) / taskData.length
  const highEmotionTasks = taskData.filter(task => task.emotion >= 10)
  const lowEmotionTasks = taskData.filter(task => task.emotion <= 5)

  if (avgEmotion >= 10) {
    if (highEmotionTasks.length > 0) {
      const taskTypes = [...new Set(highEmotionTasks.map(t => t.taskType).filter(Boolean))]
      if (taskTypes.length > 0) {
        return `You were absolutely energized today, especially during ${taskTypes.join(' and ')} work. Your creative flow was unstoppable!`
      }
    }
    return 'You had an incredibly energizing day! Your creative flow was strong and you tackled exciting challenges with enthusiasm.'
  }

  if (avgEmotion >= 7) {
    return 'You had a solid, productive day with good momentum. You balanced different types of work effectively and made steady progress.'
  }

  if (avgEmotion >= 4) {
    if (lowEmotionTasks.length > 0) {
      return 'You worked through some challenging tasks today, but every step forward counts. You\'re building resilience and growing stronger.'
    }
    return 'You had a mixed day with ups and downs. Remember that both the highs and lows are part of your creative journey.'
  }

  return 'You pushed through some tough moments today. Remember that difficult days often lead to the biggest breakthroughs and growth.'
}

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

    const shouldUseLocalSummary =
      typeof window !== 'undefined' && import.meta.env.MODE !== 'production'

    if (shouldUseLocalSummary) {
      const summary = buildLocalSummary(taskData)
      summaryCache.set(cacheKey, {
        summary,
        timestamp: new Date().toISOString(),
      })
      return summary
    }

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
    const summary =
      data.summary || buildLocalSummary(taskData)

    // Cache the result
    summaryCache.set(cacheKey, {
      summary,
      timestamp: new Date().toISOString()
    })

    return summary
  } catch (error) {
    console.error('Error generating daily summary:', error)
    const fallbackTaskData = todayEntry.tasks.map(task => ({
      emotion: task.emotions && task.emotions.length > 0 ? task.emotions[0] : task.emotion,
      taskType: task.taskType,
    }))
    return buildLocalSummary(fallbackTaskData)
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
