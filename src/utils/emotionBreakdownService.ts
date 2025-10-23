import { Entry, EMOTIONS } from '../types'

export interface EmotionBreakdown {
  calm: number
  happy: number
  excited: number
  frustrated: number
  anxious: number
}

export interface TodayEmotionData {
  breakdown: EmotionBreakdown
  mainEmotion: string
  dominantEmoji: string
  totalTasks: number
  representativeTasks: {
    calm?: string
    happy?: string
    excited?: string
    frustrated?: string
    anxious?: string
  }
}

// Map emotion levels to our 5 dimensions
const EMOTION_MAPPING = {
  // Calm emotions (2, 9, 11)
  calm: [2, 9, 11],
  // Happy emotions (1, 13, 16)
  happy: [1, 13, 16],
  // Excited emotions (3, 7, 10)
  excited: [3, 7, 10],
  // Frustrated emotions (5, 14, 15)
  frustrated: [5, 14, 15],
  // Anxious emotions (6, 8, 12)
  anxious: [6, 8, 12]
}

export const calculateTodayEmotionBreakdown = (todayEntry: Entry | undefined): TodayEmotionData => {
  if (!todayEntry || todayEntry.tasks.length === 0) {
    return {
      breakdown: {
        calm: 0.2,
        happy: 0.2,
        excited: 0.2,
        frustrated: 0.2,
        anxious: 0.2
      },
      mainEmotion: 'neutral',
      dominantEmoji: '😐',
      totalTasks: 0,
      representativeTasks: {}
    }
  }

  const tasks = todayEntry.tasks
  const emotionCounts = {
    calm: 0,
    happy: 0,
    excited: 0,
    frustrated: 0,
    anxious: 0
  }

  const representativeTasks: { [key: string]: string } = {}
  const emotionTotals: { [key: string]: number } = {}

  // Count emotions and collect representative tasks
  tasks.forEach(task => {
    const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
    
    emotions.forEach(emotion => {
      // Map emotion to category
      for (const [category, emotionLevels] of Object.entries(EMOTION_MAPPING)) {
        if (emotionLevels.includes(emotion)) {
          emotionCounts[category as keyof EmotionBreakdown]++
          
          // Store representative task for this emotion category
          if (!representativeTasks[category]) {
            representativeTasks[category] = task.description
          }
          
          // Track total for this category
          emotionTotals[category] = (emotionTotals[category] || 0) + emotion
        }
      }
    })
  })

  // Calculate percentages
  const totalEmotions = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0)
  
  const breakdown: EmotionBreakdown = {
    calm: totalEmotions > 0 ? emotionCounts.calm / totalEmotions : 0.2,
    happy: totalEmotions > 0 ? emotionCounts.happy / totalEmotions : 0.2,
    excited: totalEmotions > 0 ? emotionCounts.excited / totalEmotions : 0.2,
    frustrated: totalEmotions > 0 ? emotionCounts.frustrated / totalEmotions : 0.2,
    anxious: totalEmotions > 0 ? emotionCounts.anxious / totalEmotions : 0.2
  }

  // Find dominant emotion
  const dominantCategory = Object.entries(emotionCounts).reduce((a, b) => 
    emotionCounts[a[0] as keyof EmotionBreakdown] > emotionCounts[b[0] as keyof EmotionBreakdown] ? a : b
  )[0]

  // Get dominant emoji based on highest emotion level in dominant category
  let dominantEmoji = '😐'
  let mainEmotion = 'neutral'
  
  if (dominantCategory && emotionTotals[dominantCategory]) {
    const avgEmotion = emotionTotals[dominantCategory] / emotionCounts[dominantCategory as keyof EmotionBreakdown]
    const emotion = EMOTIONS[Math.round(avgEmotion)]
    dominantEmoji = emotion?.emoji || '😐'
    mainEmotion = dominantCategory
  }

  return {
    breakdown,
    mainEmotion,
    dominantEmoji,
    totalTasks: tasks.length,
    representativeTasks
  }
}

// Calculate emotion breakdown from multiple entries (e.g., weekly data)
export const getEmotionBreakdown = (entries: Entry[]): TodayEmotionData | null => {
  if (!entries || entries.length === 0) {
    return null
  }

  const allTasks = entries.flatMap(entry => entry.tasks)
  
  if (allTasks.length === 0) {
    return null
  }

  const emotionCounts = {
    calm: 0,
    happy: 0,
    excited: 0,
    frustrated: 0,
    anxious: 0
  }

  const representativeTasks: { [key: string]: string } = {}
  const emotionTotals: { [key: string]: number } = {}

  // Count emotions and collect representative tasks
  allTasks.forEach(task => {
    const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
    
    emotions.forEach(emotion => {
      // Map emotion to category
      for (const [category, emotionLevels] of Object.entries(EMOTION_MAPPING)) {
        if (emotionLevels.includes(emotion)) {
          emotionCounts[category as keyof EmotionBreakdown]++
          
          // Store representative task for this emotion category
          if (!representativeTasks[category]) {
            representativeTasks[category] = task.description
          }
          
          // Track total for this category
          emotionTotals[category] = (emotionTotals[category] || 0) + emotion
        }
      }
    })
  })

  // Calculate percentages
  const totalEmotions = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0)
  
  if (totalEmotions === 0) {
    return null
  }

  const breakdown: EmotionBreakdown = {
    calm: emotionCounts.calm / totalEmotions,
    happy: emotionCounts.happy / totalEmotions,
    excited: emotionCounts.excited / totalEmotions,
    frustrated: emotionCounts.frustrated / totalEmotions,
    anxious: emotionCounts.anxious / totalEmotions
  }

  // Find dominant emotion
  const dominantCategory = Object.entries(emotionCounts).reduce((a, b) => 
    emotionCounts[a[0] as keyof EmotionBreakdown] > emotionCounts[b[0] as keyof EmotionBreakdown] ? a : b
  )[0]

  // Get dominant emoji based on highest emotion level in dominant category
  let dominantEmoji = '😐'
  let mainEmotion = 'neutral'
  
  if (dominantCategory && emotionTotals[dominantCategory]) {
    const avgEmotion = emotionTotals[dominantCategory] / emotionCounts[dominantCategory as keyof EmotionBreakdown]
    const emotion = EMOTIONS[Math.round(avgEmotion)]
    dominantEmoji = emotion?.emoji || '😐'
    mainEmotion = dominantCategory
  }

  return {
    breakdown,
    mainEmotion,
    dominantEmoji,
    totalTasks: allTasks.length,
    representativeTasks
  }
}

// Get color for dominant emotion
export const getEmotionColor = (emotion: string): string => {
  const colors = {
    calm: '#AF52DE',      // Curious - Purple, conveys inspiration and exploration
    happy: '#F4C95D',     // Meaningful - Soft golden yellow, warm and purposeful
    excited: '#FF2D55',   // Energized - Bright reddish-orange, energetic and friendly
    frustrated: '#48484A', // Drained - Dark grayish blue, represents low energy or fatigue
    anxious: '#AF52DE',   // Curious - Same as calm for consistency
    neutral: '#E3E3E3'
  }
  return colors[emotion as keyof typeof colors] || colors.neutral
}
