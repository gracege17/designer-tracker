/**
 * Weekly Insights Service
 * 
 * Generates AI-powered insights based on the user's weekly emotional data and task patterns.
 * Provides contextual, empathetic summaries of their week.
 */

interface WeeklyInsightsInput {
  taskCount: number
  emotionBreakdown?: {
    calm: number
    happy: number
    excited: number
    frustrated: number
    anxious: number
  }
  timeRange: 'week' | 'month'
}

/**
 * Generate weekly insights based on task count and emotional patterns
 * 
 * This provides a reflective summary of the user's week/month, acknowledging
 * their efforts, emotions, and offering gentle encouragement.
 */
export function generateWeeklyInsights(input: WeeklyInsightsInput): string {
  const { taskCount, emotionBreakdown, timeRange } = input
  
  const periodLabel = timeRange === 'week' ? 'this week' : 'this month'
  const periodLabelCapitalized = timeRange === 'week' ? 'This week' : 'This month'
  
  // No data case
  if (taskCount === 0 || !emotionBreakdown) {
    return `You haven't logged any tasks ${periodLabel} yet. When you're ready, your reflections will be waiting here.`
  }

  // Calculate emotional scores
  const { calm, happy, excited, frustrated, anxious } = emotionBreakdown
  const positiveScore = calm + happy + excited
  const negativeScore = frustrated + anxious
  const overallTone = positiveScore > negativeScore ? 'positive' : 'challenging'
  
  // Find dominant emotion
  const emotions = [
    { name: 'calm', value: calm },
    { name: 'happy', value: happy },
    { name: 'excited', value: excited },
    { name: 'frustrated', value: frustrated },
    { name: 'anxious', value: anxious }
  ]
  const dominant = emotions.sort((a, b) => b.value - a.value)[0]
  const secondary = emotions[1]

  // Generate contextual insights based on patterns
  
  // Pattern 1: Very low activity (1-5 tasks)
  if (taskCount <= 5) {
    if (overallTone === 'positive') {
      return `You logged ${taskCount} task${taskCount > 1 ? 's' : ''} ${periodLabel}. Sometimes slow weeks are exactly what we need to recharge.`
    } else {
      return `You logged ${taskCount} task${taskCount > 1 ? 's' : ''} ${periodLabel} while managing some tough emotions. That takes real strength.`
    }
  }

  // Pattern 2: Light-moderate activity (6-15 tasks)
  if (taskCount <= 15) {
    if (overallTone === 'positive') {
      if (dominant.value > 0.5) {
        return `You completed ${taskCount} tasks ${periodLabel} with a strong sense of ${dominant.name}. You're finding your rhythm beautifully.`
      }
      if (secondary.value > 0.3) {
        return `${periodLabelCapitalized} brought ${taskCount} tasks, and you navigated them with ${dominant.name} and ${secondary.name}. That's balance in action.`
      }
      return `You worked through ${taskCount} tasks ${periodLabel} with steady, positive energy. Keep honoring your pace.`
    } else {
      if (frustrated > 0.5) {
        return `You pushed through ${taskCount} tasks ${periodLabel} despite significant frustration. That resilience deserves recognition.`
      }
      if (anxious > 0.5) {
        return `You managed ${taskCount} tasks ${periodLabel} while carrying anxiety. Remember: you're doing more than enough.`
      }
      return `${periodLabelCapitalized} brought ${taskCount} tasks and some challenging emotions. You're navigating it with courage.`
    }
  }

  // Pattern 3: Moderate-high activity (16-30 tasks)
  if (taskCount <= 30) {
    if (overallTone === 'positive') {
      if (excited > 0.5) {
        return `You powered through ${taskCount} tasks ${periodLabel} with vibrant energy! Your excitement is contagious.`
      }
      if (happy > 0.5) {
        return `${taskCount} tasks completed ${periodLabel}, and you felt genuinely happy through it. This is your sweet spot.`
      }
      if (calm > 0.5) {
        return `You moved through ${taskCount} tasks ${periodLabel} with remarkable calm and focus. That's mastery showing up.`
      }
      return `You completed ${taskCount} tasks ${periodLabel} with positive momentum. You're in your element.`
    } else {
      if (frustrated > 0.5) {
        return `You tackled ${taskCount} tasks ${periodLabel} while managing frustration. That's not easy—give yourself credit.`
      }
      if (anxious > 0.4) {
        return `${taskCount} tasks ${periodLabel} while managing anxiety is no small feat. Be proud of showing up anyway.`
      }
      return `You worked through ${taskCount} tasks ${periodLabel} during a challenging period. Your consistency is impressive.`
    }
  }

  // Pattern 4: High activity (31-50 tasks)
  if (taskCount <= 50) {
    if (overallTone === 'positive') {
      return `${taskCount} tasks ${periodLabel}! You're operating at a high level with positive energy. Remember to celebrate this momentum.`
    } else {
      return `You accomplished ${taskCount} tasks ${periodLabel} despite emotional challenges. That kind of dedication is remarkable—but don't forget to rest.`
    }
  }

  // Pattern 5: Very high activity (50+ tasks)
  if (overallTone === 'positive') {
    return `${taskCount} tasks ${periodLabel}—wow! You're in powerful creative flow. Just remember: rest is part of the rhythm too.`
  } else {
    return `You pushed through ${taskCount} tasks ${periodLabel} during a difficult time. Please take a moment to acknowledge how much strength that took.`
  }
}

/**
 * AI-powered weekly insights
 * 
 * Calls Vercel API endpoint which uses OpenAI GPT for personalized reflections
 */
export async function generateWeeklyInsightsWithAI(
  input: WeeklyInsightsInput
): Promise<string> {
  const { taskCount, emotionBreakdown, timeRange } = input
  
  // Check if we're in development mode
  const isDev = typeof window !== 'undefined' && import.meta.env.MODE !== 'production'
  
  if (isDev || !emotionBreakdown) {
    return generateWeeklyInsights(input)
  }

  try {
    const response = await fetch('/api/generate-weekly-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskCount,
        emotionBreakdown,
        timeRange
      })
    })

    if (!response.ok) {
      throw new Error('API call failed')
    }

    const data = await response.json()
    
    if (data.useRuleBased) {
      // API said to use rule-based (no API key configured)
      return generateWeeklyInsights(input)
    }
    
    return data.reflection || generateWeeklyInsights(input)
  } catch (error) {
    console.error('AI weekly insights generation failed:', error)
    return generateWeeklyInsights(input)
  }
}

