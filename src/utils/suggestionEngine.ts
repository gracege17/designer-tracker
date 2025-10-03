import { Entry, Task, TASK_TYPE_LABELS, EMOTIONS } from '../types'
import { UserProfileStorage } from './storage'

/**
 * Suggestion Engine - Generates warm, encouraging, personalized insights
 */

export interface Suggestion {
  id: string
  type: 'insight' | 'encouragement' | 'tip' | 'pattern' | 'celebration'
  title: string
  message: string
  icon: string
  priority: 'high' | 'medium' | 'low'
  actionable?: string
}

/**
 * Generate personalized suggestions based on user's reflection patterns
 */
export const generateSuggestions = (entries: Entry[]): Suggestion[] => {
  const suggestions: Suggestion[] = []
  const userProfile = UserProfileStorage.getUserProfile()

  // Need at least 3 entries for meaningful insights
  if (entries.length < 3) {
    return getOnboardingSuggestions(entries.length)
  }

  // Analyze patterns
  const recentEntries = entries.slice(0, 14) // Last 2 weeks
  const allTasks = recentEntries.flatMap(entry => entry.tasks)

  // 1. Check for high-emotion tasks (celebrations)
  const celebrationSuggestion = generateCelebrationSuggestion(allTasks)
  if (celebrationSuggestion) suggestions.push(celebrationSuggestion)

  // 2. Identify energizing vs draining patterns
  const energyPatternSuggestion = generateEnergyPatternSuggestion(allTasks)
  if (energyPatternSuggestion) suggestions.push(energyPatternSuggestion)

  // 3. Check for consistent low emotions (support)
  const supportSuggestion = generateSupportSuggestion(allTasks)
  if (supportSuggestion) suggestions.push(supportSuggestion)

  // 4. Encourage consistency
  const consistencySuggestion = generateConsistencySuggestion(entries)
  if (consistencySuggestion) suggestions.push(consistencySuggestion)

  // 5. Career direction insights
  const careerSuggestion = generateCareerSuggestion(allTasks, userProfile?.jobTitle)
  if (careerSuggestion) suggestions.push(careerSuggestion)

  // 6. Work-life balance check
  const balanceSuggestion = generateBalanceSuggestion(allTasks)
  if (balanceSuggestion) suggestions.push(balanceSuggestion)

  // Sort by priority
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Suggestions for new users (less than 3 entries)
 */
const getOnboardingSuggestions = (entryCount: number): Suggestion[] => {
  if (entryCount === 0) {
    return [{
      id: 'onboarding_first',
      type: 'encouragement',
      title: 'Welcome! 🌟',
      message: 'Start your journey by adding your first daily reflection. It only takes 3 minutes!',
      icon: '✨',
      priority: 'high',
      actionable: 'Add your first reflection'
    }]
  }

  if (entryCount === 1) {
    return [{
      id: 'onboarding_second',
      type: 'encouragement',
      title: 'Great Start! 🎉',
      message: 'You\'ve taken the first step! Keep going for a few more days to start seeing patterns in what brings you joy.',
      icon: '🚀',
      priority: 'high',
      actionable: 'Continue reflecting daily'
    }]
  }

  return [{
    id: 'onboarding_third',
    type: 'tip',
    title: 'Building Your Habit 💪',
    message: 'You\'re on your way! Reflect for a few more days and we\'ll start showing you personalized insights about your work.',
    icon: '📊',
    priority: 'medium',
    actionable: 'Keep the momentum going'
  }]
}

/**
 * Celebrate high-emotion tasks
 */
const generateCelebrationSuggestion = (tasks: Task[]): Suggestion | null => {
  // Find tasks with very high emotions (10+)
  const highEmotionTasks = tasks.filter(task => {
    if (task.emotions && task.emotions.length > 0) {
      const avgEmotion = task.emotions.reduce((sum, e) => sum + e, 0) / task.emotions.length
      return avgEmotion >= 10
    }
    return task.emotion >= 10
  })

  if (highEmotionTasks.length >= 3) {
    const taskTypes = highEmotionTasks.map(t => TASK_TYPE_LABELS[t.taskType])
    const uniqueTypes = [...new Set(taskTypes)]

    return {
      id: 'celebration_high_emotion',
      type: 'celebration',
      title: '🎊 You\'re Thriving!',
      message: `You've had ${highEmotionTasks.length} amazing moments recently${uniqueTypes.length > 0 ? `, especially with ${uniqueTypes[0]}` : ''}. Keep doing what makes you light up!`,
      icon: '⚡',
      priority: 'high',
      actionable: 'Do more of what energizes you'
    }
  }

  return null
}

/**
 * Identify energy patterns (what energizes vs drains)
 */
const generateEnergyPatternSuggestion = (tasks: Task[]): Suggestion | null => {
  if (tasks.length < 5) return null

  // Calculate average emotion per task type
  const taskTypeEmotions: Record<string, number[]> = {}
  
  tasks.forEach(task => {
    if (!taskTypeEmotions[task.taskType]) {
      taskTypeEmotions[task.taskType] = []
    }
    
    if (task.emotions && task.emotions.length > 0) {
      const avgEmotion = task.emotions.reduce((sum, e) => sum + e, 0) / task.emotions.length
      taskTypeEmotions[task.taskType].push(avgEmotion)
    } else {
      taskTypeEmotions[task.taskType].push(task.emotion)
    }
  })

  // Find most energizing and most draining
  const averages = Object.entries(taskTypeEmotions).map(([type, emotions]) => ({
    type,
    avg: emotions.reduce((sum, e) => sum + e, 0) / emotions.length,
    count: emotions.length
  }))

  if (averages.length < 2) return null

  averages.sort((a, b) => b.avg - a.avg)
  const mostEnergizing = averages[0]
  const mostDraining = averages[averages.length - 1]

  // Only suggest if there's a clear difference
  if (mostEnergizing.avg - mostDraining.avg < 3) return null

  return {
    id: 'pattern_energy',
    type: 'insight',
    title: '💡 Pattern Detected',
    message: `${TASK_TYPE_LABELS[mostEnergizing.type]} consistently energizes you, while ${TASK_TYPE_LABELS[mostDraining.type]} tends to drain you. Consider delegating or minimizing draining tasks when possible.`,
    icon: '🎯',
    priority: 'high',
    actionable: `Schedule more ${TASK_TYPE_LABELS[mostEnergizing.type]}`
  }
}

/**
 * Provide support for consistently low emotions
 */
const generateSupportSuggestion = (tasks: Task[]): Suggestion | null => {
  if (tasks.length < 5) return null

  // Check recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5)
  const recentEmotions = recentTasks.map(task => {
    if (task.emotions && task.emotions.length > 0) {
      return task.emotions.reduce((sum, e) => sum + e, 0) / task.emotions.length
    }
    return task.emotion
  })

  const avgRecentEmotion = recentEmotions.reduce((sum, e) => sum + e, 0) / recentEmotions.length

  // If average emotion is low (< 5), provide gentle support
  if (avgRecentEmotion < 5) {
    return {
      id: 'support_low_mood',
      type: 'encouragement',
      title: '💙 You\'ve Got This',
      message: 'It looks like things have been challenging lately. Remember, tough phases are temporary. Consider taking a break, talking to a colleague, or focusing on tasks that usually energize you.',
      icon: '🌈',
      priority: 'high',
      actionable: 'Try a task you usually enjoy'
    }
  }

  return null
}

/**
 * Encourage consistency in reflection
 */
const generateConsistencySuggestion = (entries: Entry[]): Suggestion | null => {
  if (entries.length < 7) return null

  // Check if user has logged for 7+ consecutive days
  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  let consecutiveDays = 1
  
  for (let i = 0; i < sortedEntries.length - 1; i++) {
    const currentDate = new Date(sortedEntries[i].date)
    const nextDate = new Date(sortedEntries[i + 1].date)
    const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (dayDiff === 1) {
      consecutiveDays++
    } else {
      break
    }
  }

  if (consecutiveDays >= 7) {
    return {
      id: 'consistency_streak',
      type: 'celebration',
      title: `🔥 ${consecutiveDays}-Day Streak!`,
      message: `Amazing! You've been consistently reflecting for ${consecutiveDays} days. This kind of self-awareness is powerful for your career growth.`,
      icon: '🏆',
      priority: 'medium',
      actionable: 'Keep your streak alive'
    }
  }

  return null
}

/**
 * Career direction insights based on job title and task patterns
 */
const generateCareerSuggestion = (tasks: Task[], jobTitle?: string): Suggestion | null => {
  if (tasks.length < 10 || !jobTitle) return null

  // Analyze what tasks bring the most joy
  const taskTypeEmotions: Record<string, number[]> = {}
  
  tasks.forEach(task => {
    if (!taskTypeEmotions[task.taskType]) {
      taskTypeEmotions[task.taskType] = []
    }
    
    if (task.emotions && task.emotions.length > 0) {
      const avgEmotion = task.emotions.reduce((sum, e) => sum + e, 0) / task.emotions.length
      taskTypeEmotions[task.taskType].push(avgEmotion)
    } else {
      taskTypeEmotions[task.taskType].push(task.emotion)
    }
  })

  const averages = Object.entries(taskTypeEmotions)
    .map(([type, emotions]) => ({
      type,
      avg: emotions.reduce((sum, e) => sum + e, 0) / emotions.length
    }))
    .sort((a, b) => b.avg - a.avg)

  if (averages.length === 0) return null

  const topTask = averages[0]

  // Career-specific insights
  const insights: Record<string, string> = {
    'wireframing': 'Your love for wireframing suggests you might enjoy UX strategy roles or product design leadership.',
    'visual-design': 'Your passion for visual design could lead to art direction or brand design opportunities.',
    'user-research': 'Your interest in user research indicates strength in UX research or product strategy roles.',
    'prototyping': 'Your enthusiasm for prototyping suggests you\'d excel in interaction design or product innovation.',
    'design-systems': 'Your affinity for design systems points to strengths in design ops or platform design.',
    'client-meetings': 'Your energy in client meetings shows potential in design consulting or client partnership roles.',
    'team-collaboration': 'Your joy in collaboration suggests leadership or team management could be your path.'
  }

  const insight = insights[topTask.type]
  if (!insight) return null

  return {
    id: 'career_direction',
    type: 'pattern',
    title: '🚀 Career Insight',
    message: insight,
    icon: '💼',
    priority: 'medium',
    actionable: 'Explore opportunities in this direction'
  }
}

/**
 * Work-life balance check
 */
const generateBalanceSuggestion = (tasks: Task[]): Suggestion | null => {
  if (tasks.length < 10) return null

  // Check if user is overworking (many tasks per day on average)
  const taskCount = tasks.length
  const avgTasksPerDay = taskCount / 14 // Assuming 2 weeks of data

  if (avgTasksPerDay > 5) {
    return {
      id: 'balance_workload',
      type: 'tip',
      title: '⚖️ Balance Check',
      message: `You're averaging ${Math.round(avgTasksPerDay)} tasks per day. Remember to pace yourself and take breaks. Quality over quantity!`,
      icon: '🧘',
      priority: 'low',
      actionable: 'Schedule downtime'
    }
  }

  return null
}

/**
 * Get a motivational quote based on recent mood
 */
export const getMotivationalQuote = (recentAvgEmotion: number): string => {
  if (recentAvgEmotion >= 9) {
    const quotes = [
      "You're absolutely crushing it! Keep this energy going. 🌟",
      "Your positive momentum is inspiring! Stay in this flow. ⚡",
      "This is what thriving looks like. Amazing work! 🎉"
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  if (recentAvgEmotion >= 7) {
    const quotes = [
      "You're finding your rhythm. Trust the process. 🎵",
      "Steady progress is still progress. Keep going! 💪",
      "You're building something meaningful. Stay consistent. 🌱"
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  if (recentAvgEmotion >= 5) {
    const quotes = [
      "Every day is a fresh start. You've got this. 🌅",
      "Remember: growth happens outside comfort zones. 🌿",
      "Small steps forward are still forward. Keep moving. 🚶"
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  // Low emotion support
  const quotes = [
    "Tough times don't last, but resilient people do. 💙",
    "It's okay to have hard days. Tomorrow is a new opportunity. 🌈",
    "Be kind to yourself. You're doing better than you think. 🤗"
  ]
  return quotes[Math.floor(Math.random() * quotes.length)]
}

