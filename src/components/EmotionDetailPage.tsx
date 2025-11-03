import React, { useMemo } from 'react'
import { CaretLeft } from 'phosphor-react'
import { Entry, EmotionLevel } from '../types'
import { generateSummaryTags } from '../utils/smartSummaryService'

interface EmotionDetailPageProps {
  emotion: 'energized' | 'drained' | 'meaningful' | 'curious'
  entries: Entry[]
  onBack: () => void
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
  onBack
}) => {
  const config = emotionConfig[emotion]

  // Filter entries and tasks that match this emotion
  const { relevantEntries, relevantTasks } = useMemo(() => {
    const filteredEntries: Entry[] = []
    const allTasks: Array<{ date: string; description: string; projectName: string; notes?: string }> = []

    entries.forEach(entry => {
      const matchingTasks = entry.tasks.filter(task => {
        const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
        return emotions.some(e => config.emotions.includes(e))
      })

      if (matchingTasks.length > 0) {
        filteredEntries.push(entry)
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

    return { relevantEntries: filteredEntries, relevantTasks: allTasks }
  }, [entries, config.emotions])

  // Generate top 3 reason tags
  const topReasonTags = useMemo(() => {
    if (relevantTasks.length === 0) return []
    
    const tasksForAnalysis = relevantTasks.map(t => ({ description: t.description }))
    return generateSummaryTags(tasksForAnalysis).slice(0, 3)
  }, [relevantTasks])

  // Generate insight pattern
  const insightPattern = useMemo(() => {
    if (relevantTasks.length === 0) {
      return `You haven't logged any ${config.label.toLowerCase()} moments yet. Start tracking to discover your patterns!`
    }

    // Analyze patterns
    const projectCounts: Record<string, number> = {}
    relevantTasks.forEach(task => {
      projectCounts[task.projectName] = (projectCounts[task.projectName] || 0) + 1
    })

    const topProject = Object.entries(projectCounts)
      .sort(([, a], [, b]) => b - a)[0]

    const topTag = topReasonTags[0] || 'certain activities'

    // Generate contextual insight
    if (emotion === 'energized') {
      return `You tend to feel energized during "${topTag}". Your energy peaks when working on ${topProject[0]}.`
    } else if (emotion === 'drained') {
      return `"${topTag}" often leaves you feeling drained. Consider taking breaks during ${topProject[0]} tasks.`
    } else if (emotion === 'meaningful') {
      return `"${topTag}" brings the most meaning to your work. ${topProject[0]} consistently gives you purpose.`
    } else {
      return `Your curiosity is sparked by "${topTag}". ${topProject[0]} keeps you engaged and exploring.`
    }
  }, [relevantTasks, topReasonTags, emotion, config.label])

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

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    const groups: Record<string, typeof relevantTasks> = {}
    relevantTasks.forEach(task => {
      if (!groups[task.date]) {
        groups[task.date] = []
      }
      groups[task.date].push(task)
    })
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)) // Most recent first
  }, [relevantTasks])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
            </button>
            <h1 className="text-[20px] font-bold text-[#E6E1E5]">
              {config.label} Details
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
        
        {/* 1. Summary Header */}
        <div className={`${config.bgColor} p-6 rounded-2xl`}>
          <h2 className={`text-[28px] font-bold ${config.textColor} leading-tight mb-2`}>
            You felt {config.label.toLowerCase()} {relevantEntries.length} {relevantEntries.length === 1 ? 'time' : 'times'} this week
          </h2>
          <p className="text-[14px] text-[#CAC4D0]">
            Based on {relevantTasks.length} logged {relevantTasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>

        {/* 2. Top 3 Reason Tags */}
        {topReasonTags.length > 0 && (
          <div>
            <h3 className="text-[16px] font-bold text-[#E6E1E5] mb-3">
              Top Reasons
            </h3>
            <div className="flex flex-wrap gap-2">
              {topReasonTags.map((tag, index) => (
                <div
                  key={index}
                  className={`${config.bgColor} px-4 py-2 rounded-full`}
                >
                  <span className={`text-[14px] font-semibold ${config.textColor}`}>
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Logged Entries */}
        {groupedTasks.length > 0 && (
          <div>
            <h3 className="text-[16px] font-bold text-[#E6E1E5] mb-3">
              Your {config.label} Moments
            </h3>
            <div className="space-y-4">
              {groupedTasks.map(([date, tasks]) => (
                <div key={date}>
                  {/* Date Header */}
                  <p className="text-[12px] font-semibold text-[#938F99] uppercase tracking-wider mb-2">
                    {formatDate(date)}
                  </p>
                  
                  {/* Tasks for this date */}
                  <div className="space-y-2">
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        className="bg-white/[0.04] p-4 rounded-xl"
                      >
                        <p className="text-[14px] font-semibold text-[#E6E1E5] mb-1">
                          {task.description}
                        </p>
                        <p className="text-[12px] text-[#938F99]">
                          {task.projectName}
                        </p>
                        {task.notes && (
                          <p className="text-[12px] text-[#CAC4D0] mt-2 italic">
                            "{task.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Insight Pattern */}
        <div className="bg-white/[0.04] p-6 rounded-2xl border border-white/10">
          <div className="flex items-start gap-3">
            <div className={`w-1 h-full ${config.bgColor} rounded-full`}></div>
            <div>
              <h3 className="text-[14px] font-bold text-[#E6E1E5] mb-2">
                💡 Pattern Insight
              </h3>
              <p className="text-[14px] text-[#CAC4D0] leading-relaxed">
                {insightPattern}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Reflection Question */}
        <div className={`${config.bgColor} p-6 rounded-2xl border border-[${config.color}]/20`}>
          <h3 className="text-[12px] font-semibold text-[#938F99] uppercase tracking-wider mb-3">
            Reflect
          </h3>
          <p className={`text-[16px] font-medium ${config.textColor} leading-relaxed`}>
            {config.reflectionQuestion}
          </p>
        </div>

        {/* Empty State */}
        {relevantTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.04] flex items-center justify-center">
              <span className="text-[32px]">📝</span>
            </div>
            <h3 className="text-[18px] font-bold text-[#E6E1E5] mb-2">
              No {config.label.toLowerCase()} moments yet
            </h3>
            <p className="text-[14px] text-[#938F99]">
              Start logging your tasks to track when you feel {config.label.toLowerCase()}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default EmotionDetailPage

