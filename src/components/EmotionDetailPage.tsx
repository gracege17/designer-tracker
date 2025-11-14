import React, { useMemo } from 'react'
import { CaretLeft } from 'phosphor-react'
import { Entry, EmotionLevel } from '../types'
import { generateSummaryTags, areTagsMeaningful, generateSummaryTagsWithAI } from '../utils/smartSummaryService'
import { getCurrentWeekEntries } from '../utils/dataHelpers'
import BottomNav from './BottomNav'
import Badge from './Badge'

interface EmotionDetailPageProps {
  emotion: 'energized' | 'drained' | 'meaningful' | 'curious'
  entries: Entry[]
  timeRange?: 'week' | 'month' // Time range from Insights page
  onBack: () => void
  onNavigateHome: () => void
  onNavigateAdd: () => void
  onNavigateHistory: () => void
  onNavigateSettings: () => void
}

// Emotion configuration
const emotionConfig = {
  energized: {
    label: 'Energized',
    color: '#FF2D55',
    bgColor: 'bg-[#FF2D55]/10',
    textColor: 'text-[#FF2D55]',
    emotions: [10, 3, 1] as EmotionLevel[], // Energized, Excited, Happy
    reflectionQuestion: "What energizes you most about your creative work?"
  },
  drained: {
    label: 'Drained',
    color: '#938F99',
    bgColor: 'bg-[#938F99]/10',
    textColor: 'text-[#938F99]',
    emotions: [15, 12, 4] as EmotionLevel[], // Drained, Tired, Frustrated
    reflectionQuestion: "What patterns do you notice when you feel drained?"
  },
  meaningful: {
    label: 'Meaningful',
    color: '#F4C95D',
    bgColor: 'bg-[#F4C95D]/10',
    textColor: 'text-[#F4C95D]',
    emotions: [11, 8, 13] as EmotionLevel[], // Proud, Satisfied, Surprised
    reflectionQuestion: "What makes your work feel most meaningful to you?"
  },
  curious: {
    label: 'Curious',
    color: '#AF52DE',
    bgColor: 'bg-[#AF52DE]/10',
    textColor: 'text-[#AF52DE]',
    emotions: [3, 9, 2] as EmotionLevel[], // Excited, Nostalgic, Neutral (curious exploration)
    reflectionQuestion: "What sparks your curiosity in design?"
  }
}

const EmotionDetailPage: React.FC<EmotionDetailPageProps> = ({
  emotion,
  entries,
  timeRange = 'week', // Default to week if not specified
  onBack,
  onNavigateHome,
  onNavigateAdd,
  onNavigateHistory,
  onNavigateSettings
}) => {
  const config = emotionConfig[emotion]
  
  // State for AI-generated content
  const [aiTriggers, setAiTriggers] = React.useState<string[]>([])
  const [aiInsight, setAiInsight] = React.useState<string>('')
  const [isLoadingAI, setIsLoadingAI] = React.useState(true)

  // Filter entries based on selected time range
  const filteredEntries = useMemo(() => {
    if (timeRange === 'week') {
      return getCurrentWeekEntries(entries)
    } else {
      // Month view - get current month's entries
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      
      return entries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate.getFullYear() === year && entryDate.getMonth() === month
      })
    }
  }, [entries, timeRange])

  // Filter entries and tasks that match this emotion
  const { relevantEntries, relevantTasks } = useMemo(() => {
    const relevantEntriesArray: Entry[] = []
    const allTasks: Array<{ date: string; description: string; projectName: string; notes?: string }> = []

    filteredEntries.forEach(entry => {
      const matchingTasks = entry.tasks.filter(task => {
        const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
        return emotions.some(e => config.emotions.includes(e))
      })

      if (matchingTasks.length > 0) {
        relevantEntriesArray.push(entry)
        matchingTasks.forEach(task => {
          allTasks.push({
            date: entry.date,
            description: task.description,
            projectName: task.projectName || 'Unknown Project',
            notes: task.notes
          })
        })
      }
    })

    return { relevantEntries: relevantEntriesArray, relevantTasks: allTasks }
  }, [filteredEntries, config.emotions])

  // Cache for AI insights (in-memory, per session)
  const insightCache = React.useRef<Map<string, { triggers: string[]; insight: string }>>(new Map())

  // Load AI-generated triggers and insight
  React.useEffect(() => {
    const loadAIContent = async () => {
      // Create cache key based on emotion, time range, and task count
      const cacheKey = `${emotion}-${timeRange}-${relevantTasks.length}`
      
      // Check cache first
      if (insightCache.current.has(cacheKey)) {
        const cached = insightCache.current.get(cacheKey)!
        setAiTriggers(cached.triggers)
        setAiInsight(cached.insight)
        setIsLoadingAI(false)
        return
      }
      
      setIsLoadingAI(true)
      
      if (relevantTasks.length === 0) {
        setAiTriggers([])
        const emptyInsight = `You haven't logged any ${config.label.toLowerCase()} moments ${periodLabel} yet. Start tracking to discover your patterns!`
        setAiInsight(emptyInsight)
        setIsLoadingAI(false)
        return
      }

      // Check if we're in development mode
      const isDev = typeof window !== 'undefined' && import.meta.env.MODE !== 'production'
      
      if (isDev) {
        // Use pattern-based in dev
        const tasksForAnalysis = relevantTasks.map(t => ({ description: t.description }))
        const triggers = generateSummaryTags(tasksForAnalysis).slice(0, 3)
        setAiTriggers(triggers)
        setAiInsight(insightPattern)
        insightCache.current.set(cacheKey, { triggers, insight: insightPattern })
        setIsLoadingAI(false)
        return
      }

      try {
        const response = await fetch('/api/generate-emotion-insight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tasks: relevantTasks.map(t => ({
              description: t.description,
              date: t.date,
              projectName: t.projectName
            })),
            emotionCategory: emotion,
            timeRange
          })
        })

        if (!response.ok) {
          throw new Error('API call failed')
        }

        const data = await response.json()
        
        if (data.useRuleBased) {
          // Fall back to pattern-based
          const tasksForAnalysis = relevantTasks.map(t => ({ description: t.description }))
          const triggers = generateSummaryTags(tasksForAnalysis).slice(0, 3)
          setAiTriggers(triggers)
          setAiInsight(insightPattern)
          insightCache.current.set(cacheKey, { triggers, insight: insightPattern })
        } else {
          const triggers = data.triggers || []
          const insight = data.insight || insightPattern
          setAiTriggers(triggers)
          setAiInsight(insight)
          // Cache the AI result
          insightCache.current.set(cacheKey, { triggers, insight })
        }
      } catch (error) {
        console.error('AI insight generation failed:', error)
        // Fall back to pattern-based
        const tasksForAnalysis = relevantTasks.map(t => ({ description: t.description }))
        const triggers = generateSummaryTags(tasksForAnalysis).slice(0, 3)
        setAiTriggers(triggers)
        setAiInsight(insightPattern)
        insightCache.current.set(cacheKey, { triggers, insight: insightPattern })
      } finally {
        setIsLoadingAI(false)
      }
    }

    loadAIContent()
  }, [relevantTasks, emotion, timeRange])

  // Generate top 3 reason tags (fallback/backup)
  const topReasonTags = useMemo(() => {
    return aiTriggers.length > 0 ? aiTriggers : []
  }, [aiTriggers])

  // Generate insight pattern
  const insightPattern = useMemo(() => {
    if (relevantTasks.length === 0) {
      return `You haven't logged any ${config.label.toLowerCase()} moments yet. Start tracking to discover your patterns!`
    }

    // Analyze patterns
    const projectCounts: Record<string, number> = {}
    const timeOfDayPattern: Record<string, number> = { morning: 0, afternoon: 0, evening: 0 }
    
    relevantTasks.forEach(task => {
      projectCounts[task.projectName] = (projectCounts[task.projectName] || 0) + 1
      
      // Check for time-related keywords in description
      const desc = task.description.toLowerCase()
      if (desc.includes('morning') || desc.includes('start')) timeOfDayPattern.morning++
      else if (desc.includes('afternoon') || desc.includes('lunch')) timeOfDayPattern.afternoon++
      else if (desc.includes('evening') || desc.includes('end')) timeOfDayPattern.evening++
    })

    const topProject = Object.entries(projectCounts)
      .sort(([, a], [, b]) => b - a)[0]

    const topTimeOfDay = Object.entries(timeOfDayPattern)
      .sort(([, a], [, b]) => b - a)[0]

    // Generate contextual insight based on patterns
    if (emotion === 'energized') {
      if (topTimeOfDay[1] > 0) {
        return `Energized feelings emerged most often in the ${topTimeOfDay[0]}, especially after physical activity or productive starts to your day.`
      }
      return `You tend to feel energized when working on ${topProject[0]}. These moments often involve team collaboration and social interaction.`
    } else if (emotion === 'drained') {
      return `Energy tends to dip during complex tasks and extended work sessions. Consider scheduling breaks to maintain your creative energy.`
    } else if (emotion === 'meaningful') {
      return `Meaningful moments cluster around accomplishments and helping others. ${topProject[0]} consistently gives you a sense of purpose.`
    } else {
      return `Your curiosity sparks during exploration and learning. New challenges and creative problem-solving keep you engaged.`
    }
  }, [relevantTasks, emotion, config.label])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Get date range (week or month)
  const getDateRange = () => {
    const today = new Date()
    
    if (timeRange === 'month') {
      // Month: "November 2025"
      return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } else {
      // Week: "Nov 10 - Nov 16"
      const dayOfWeek = today.getDay()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - dayOfWeek)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      const formatWeekDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
      
      return `${formatWeekDate(startOfWeek)} - ${formatWeekDate(endOfWeek)}`
    }
  }
  
  // Get period label (for display text)
  const periodLabel = timeRange === 'month' ? 'this month' : 'this week'

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
            </button>
            <p className="text-[14px] text-[#938F99]">
              {getDateRange()}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-8">
        
        {/* 1. Summary Header */}
        <div>
          <h2 className="text-[32px] font-bold text-white leading-tight mb-2">
            {config.label}
          </h2>
          <p className="text-[14px] text-[#938F99]">
            {relevantTasks.length} {relevantTasks.length === 1 ? 'task' : 'tasks'} {periodLabel}
          </p>
        </div>

        {/* 2. Insight Card */}
        <div 
          className="bg-white/[0.04] p-[20px]"
          style={{ borderRadius: '8px' }}
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-[20px] font-bold text-[#E6E1E5]">
              ✨ Insight
            </h2>
            <p className="text-[14px] font-normal text-[#938F99] leading-relaxed">
              {isLoadingAI ? 'Analyzing patterns...' : (aiInsight || insightPattern)}
            </p>
          </div>
        </div>

        {/* 3. Top Triggers */}
        {topReasonTags.length > 0 && (
          <div>
            <h3 className="text-[12px] font-semibold text-[#938F99] uppercase tracking-wider mb-3">
              Top Triggers
            </h3>
            {areTagsMeaningful(topReasonTags) ? (
              <div className="flex flex-wrap gap-2">
                {topReasonTags.map((tag, index) => (
                  <Badge
                    key={index}
                    tone="neutral"
                    size="md"
                    uppercase={false}
                    className="text-white"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-[#938F99] italic">
                Not enough detail to identify patterns. Try using more descriptive task names like "Design homepage hero section" instead of "Today task".
              </p>
            )}
          </div>
        )}

        {/* 4. Related Tasks */}
        {relevantTasks.length > 0 && (
          <div>
            <h3 className="text-[12px] font-semibold text-[#938F99] uppercase tracking-wider mb-4">
              Related Tasks
            </h3>
            <div className="space-y-3">
              {relevantTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-3"
                >
                  <p className="text-[15px] text-white leading-snug flex-1">
                    {task.description}
                  </p>
                  <span className="text-[13px] text-[#938F99] whitespace-nowrap">
                    {formatDate(task.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {relevantTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.04] flex items-center justify-center">
              <span className="text-[32px]">📝</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#E6E1E5] mb-2">
              No {config.label.toLowerCase()} moments {periodLabel}
            </h3>
            <p className="text-[14px] text-[#938F99]">
              Start logging your tasks to track when you feel {config.label.toLowerCase()}
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="overview"
        onNavigateHome={onNavigateHome}
        onNavigateInsights={onBack}
        onNavigateAdd={onNavigateAdd}
        onNavigateHistory={onNavigateHistory}
        onNavigateSettings={onNavigateSettings}
      />
    </div>
  )
}

export default EmotionDetailPage

