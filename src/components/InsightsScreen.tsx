import React, { useState } from 'react'
import { HouseSimple, Plus, ChartBar, Notepad, GearSix, CalendarBlank, X, CaretRight, DotsThree, CaretLeft } from 'phosphor-react'
import BottomNav from './BottomNav'
import { Entry, EMOTIONS, TASK_TYPE_LABELS, EmotionLevel } from '../types'
import { ProjectStorage } from '../utils/storage'
import { calculateAverageEmotion, getMostEnergizingTaskType, getMostDrainingTaskType } from '../utils/dataHelpers'
import Card from './Card'
import EmotionalRadarChart from './EmotionalRadarChart'
import { getEmotionBreakdown } from '../utils/emotionBreakdownService'
import { generateWeeklyInsights } from '../utils/weeklyInsightsService'
import { generateSummaryTags } from '../utils/smartSummaryService'

type EmotionType = 'energized' | 'drained' | 'meaningful' | 'curious'

interface InsightsScreenProps {
  entries: Entry[]
  onNavigateHome: () => void
  onNavigateAdd: () => void
  onNavigateHistory: () => void
  onNavigateSettings?: () => void
  onViewEntry: (entry: Entry) => void
  onEmotionClick: (emotion: EmotionType) => void
}

type TimeRange = 'week' | 'month'

const InsightsScreen: React.FC<InsightsScreenProps> = ({
  entries,
  onNavigateHome,
  onNavigateAdd,
  onNavigateHistory,
  onNavigateSettings,
  onViewEntry,
  onEmotionClick
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week')
  const [showFullCalendar, setShowFullCalendar] = useState(false)
  const [timeOffset, setTimeOffset] = useState(0) // 0 = current week/month, -1 = previous, 1 = next

  // Helper function to extract keywords from task description
  const extractKeywords = (description: string): string => {
    // Remove common words and get first 2-3 meaningful words
    const words = description.split(' ')
    const meaningfulWords = words.filter(word => 
      word.length > 2 && 
      !['the', 'and', 'for', 'with', 'from'].includes(word.toLowerCase())
    )
    
    // Return first 1-2 words max
    return meaningfulWords.slice(0, 2).join(' ') || words.slice(0, 2).join(' ')
  }

  // Prevent body scroll when calendar is open
  React.useEffect(() => {
    if (showFullCalendar) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showFullCalendar])

  // Get data based on selected time range with offset
  const getEntriesForTimeRange = () => {
    const today = new Date()
    
    if (selectedTimeRange === 'week') {
      // Calculate week start/end with offset
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() + (timeOffset * 7))
      
      const dayOfWeek = targetDate.getDay() // 0 = Sunday, 1 = Monday, etc.
      const startOfWeek = new Date(targetDate)
      startOfWeek.setDate(targetDate.getDate() - dayOfWeek)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      const startDateString = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`
      const endDateString = `${endOfWeek.getFullYear()}-${String(endOfWeek.getMonth() + 1).padStart(2, '0')}-${String(endOfWeek.getDate()).padStart(2, '0')}`
      
      return entries.filter(entry => entry.date >= startDateString && entry.date <= endDateString)
    } else {
      // Calculate month start/end with offset
      const targetDate = new Date(today.getFullYear(), today.getMonth() + timeOffset, 1)
      const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
      const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
      
      const startDateString = `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}-${String(startOfMonth.getDate()).padStart(2, '0')}`
      const endDateString = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`
      
      return entries.filter(entry => entry.date >= startDateString && entry.date <= endDateString)
    }
  }
  
  const currentEntries = getEntriesForTimeRange()

  // Calculate insights from ALL entries (not just current time range)
  const averageEmotion = calculateAverageEmotion(entries)
  const mostEnergizingTaskType = getMostEnergizingTaskType(entries)
  const mostDrainingTaskType = getMostDrainingTaskType(entries)

  // Get calendar data for a specific month
  const getMonthCalendarData = (monthOffset: number = 0) => {
    const today = new Date()
    const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()
    
    const calendarGrid = []
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarGrid.push({
        date: null,
        emoji: '',
        hasData: false,
        isEmpty: true,
        dateString: null,
        entry: null
      })
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateYear = date.getFullYear()
      const dateMonth = String(date.getMonth() + 1).padStart(2, '0')
      const dateDay = String(date.getDate()).padStart(2, '0')
      const dateString = `${dateYear}-${dateMonth}-${dateDay}`
      const dayEntry = entries.find(entry => entry.date === dateString)
      
      if (dayEntry && dayEntry.tasks.length > 0) {
        // Get the first emotion from the first task (consistent with EntryList display)
        const firstTask = dayEntry.tasks[0]
        const emotionLevel = firstTask.emotions && firstTask.emotions.length > 0 
          ? firstTask.emotions[0] 
          : firstTask.emotion
        const emoji = EMOTIONS[emotionLevel]?.emoji || '😐'
        
        // Still calculate average for tooltip/stats
        const avgEmotion = dayEntry.tasks.reduce((sum, task) => sum + task.emotion, 0) / dayEntry.tasks.length
        
        calendarGrid.push({
          date: day,
          emoji: emoji,
          hasData: true,
          avgEmotion: avgEmotion,
          taskCount: dayEntry.tasks.length,
          isEmpty: false,
          isToday: day === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
          dateString: dateString,
          entry: dayEntry
        })
      } else {
        calendarGrid.push({
          date: day,
          emoji: '⚪',
          hasData: false,
          avgEmotion: 0,
          taskCount: 0,
          isEmpty: false,
          isToday: day === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
          dateString: dateString,
          entry: null
        })
      }
    }
    
    return calendarGrid
  }

  const currentMonthData = getMonthCalendarData(0) // October
  const nextMonthData = getMonthCalendarData(1) // November

  // Get current date formatted based on time range
  const getFormattedDate = () => {
    const today = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    if (selectedTimeRange === 'week') {
      // For week view: "Oct 22, 2025"
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() + (timeOffset * 7))
      const month = months[targetDate.getMonth()]
      const day = targetDate.getDate()
      const year = targetDate.getFullYear()
      return `${month} ${day}, ${year}`
    } else {
      // For month view: "Oct, 2025"
      const targetDate = new Date(today.getFullYear(), today.getMonth() + timeOffset, 1)
      const month = months[targetDate.getMonth()]
      const year = targetDate.getFullYear()
      return `${month}, ${year}`
    }
  }
  
  // Handle time range change - reset offset when switching between week/month
  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range)
    setTimeOffset(0)
  }
  
  // Navigate previous/next
  const handlePrevious = () => {
    setTimeOffset(timeOffset - 1)
  }
  
  const handleNext = () => {
    setTimeOffset(timeOffset + 1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black screen-transition">
      <main className="flex-1 p-5 pb-32 overflow-y-auto max-w-md mx-auto w-full">
        {/* Header with Week/Month Tabs and Calendar Icon */}
        <div className="mb-6">
          {/* Top Row: Tabs and Calendar Icon */}
          <div className="flex items-center justify-between mb-6">
            {/* Week/Month Tabs */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleTimeRangeChange('week')}
                className={`text-[32px] font-bold transition-colors ${
                  selectedTimeRange === 'week' 
                    ? 'text-white' 
                    : 'text-[#938F99]'
                }`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Week
              </button>
              <button
                onClick={() => handleTimeRangeChange('month')}
                className={`text-[32px] font-bold transition-colors ${
                  selectedTimeRange === 'month' 
                    ? 'text-white' 
                    : 'text-[#938F99]'
                }`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Month
              </button>
            </div>
            
            {/* Calendar Icon */}
            <button
              onClick={() => setShowFullCalendar(true)}
              className="p-2 hover:bg-white/[0.04] rounded-lg transition-all active:scale-95"
            >
              <CalendarBlank size={24} weight="regular" className="text-[#EC5429]" />
            </button>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              className="p-1 hover:bg-white/[0.04] rounded-lg transition-all active:scale-95"
            >
              <CaretLeft size={20} weight="bold" className="text-white" />
            </button>
            
            <h2 className="text-[18px] font-semibold text-white min-w-[180px] text-center">
              {getFormattedDate()}
            </h2>
            
            <button
              onClick={handleNext}
              className="p-1 hover:bg-white/[0.04] rounded-lg transition-all active:scale-95"
            >
              <CaretRight size={20} weight="bold" className="text-white" />
            </button>
          </div>
        </div>

        {/* No data message */}
        {entries.length === 0 && (
          <div className="bg-white/[0.04] p-6 mb-6 text-center" style={{ borderRadius: '4px 47px 4px 4px' }}>
            <p className="text-[16px] font-medium text-[#E6E1E5] mb-2">No data yet</p>
            <p className="text-[14px] text-[#CAC4D0]">Add some reflections to see insights here.</p>
          </div>
        )}

        {/* Insight Cards - Moved from Dashboard */}
        {(() => {
          // Get tasks from current time range (week or month)
          const allTasks = currentEntries.length > 0 ? currentEntries.flatMap(entry => entry.tasks) : []
          
          // Helper function to get emotions array from task
          const getEmotions = (task: any): number[] => {
            const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
            // Convert to numbers in case they're stored as strings
            return emotions.map((e: any) => typeof e === 'string' ? parseInt(e, 10) : e)
          }
          
          // Group tasks by project with emotion counts
          const projectEmotionMap = new Map<string, { projectId: string; emotions: EmotionLevel[] }>()
          
          allTasks.forEach(task => {
            const taskEmotions = getEmotions(task)
            const existing = projectEmotionMap.get(task.projectId)
            if (existing) {
              existing.emotions.push(...taskEmotions)
            } else {
              projectEmotionMap.set(task.projectId, {
                projectId: task.projectId,
                emotions: [...taskEmotions]
              })
            }
          })
          
          // 1. What gave you energy - Happy (1), Excited (3), Energized (10), Satisfied (13), Proud (16)
          const energyEmotions = [1, 3, 10, 13, 16]
          const energyProjects = Array.from(projectEmotionMap.values())
            .filter(p => p.emotions.some(e => energyEmotions.includes(e)))
            .sort((a, b) => {
              const aCount = a.emotions.filter(e => energyEmotions.includes(e)).length
              const bCount = b.emotions.filter(e => energyEmotions.includes(e)).length
              return bCount - aCount
            })
            .slice(0, 3)
          
          // 2. What drained you - Sad (5), Anxious (6), Neutral (8), Tired (12), Annoyed (14), Drained (15)
          const drainingEmotions = [5, 6, 8, 12, 14, 15]
          const drainingProjects = Array.from(projectEmotionMap.values())
            .filter(p => p.emotions.some(e => drainingEmotions.includes(e)))
            .sort((a, b) => {
              const aCount = a.emotions.filter(e => drainingEmotions.includes(e)).length
              const bCount = b.emotions.filter(e => drainingEmotions.includes(e)).length
              return bCount - aCount
            })
            .slice(0, 3)
          
          // 3. What felt meaningful - Calm (2), Nostalgic (9), Normal (11), Satisfied (13)
          const meaningfulEmotions = [2, 9, 11, 13]
          const meaningfulProjects = Array.from(projectEmotionMap.values())
            .filter(p => p.emotions.some(e => meaningfulEmotions.includes(e)))
            .sort((a, b) => {
              const aCount = a.emotions.filter(e => meaningfulEmotions.includes(e)).length
              const bCount = b.emotions.filter(e => meaningfulEmotions.includes(e)).length
              return bCount - aCount
            })
            .slice(0, 3)
          
          // 4. What sparked your passion - Excited (3), Surprised (7), Energized (10), Proud (16)
          const passionEmotions = [3, 7, 10, 16]
          const passionProjects = Array.from(projectEmotionMap.values())
            .filter(p => p.emotions.some(e => passionEmotions.includes(e)))
            .sort((a, b) => {
              const aCount = a.emotions.filter(e => passionEmotions.includes(e)).length
              const bCount = b.emotions.filter(e => passionEmotions.includes(e)).length
              return bCount - aCount
            })
            .slice(0, 3)
          
          // Calculate task counts for each emotion category
          const energyTasks = allTasks.filter(task => {
            const emotions = getEmotions(task)
            return emotions.some(e => energyEmotions.includes(e))
          })
          const drainingTasks = allTasks.filter(task => {
            const emotions = getEmotions(task)
            return emotions.some(e => drainingEmotions.includes(e))
          })
          const meaningfulTasks = allTasks.filter(task => {
            const emotions = getEmotions(task)
            return emotions.some(e => meaningfulEmotions.includes(e))
          })
          const passionTasks = allTasks.filter(task => {
            const emotions = getEmotions(task)
            return emotions.some(e => passionEmotions.includes(e))
          })
          
          return (
            <>
              {/* Week's Reflection Card */}
              {(() => {
                // Use time-filtered entries for insights
                const filteredEntries = currentEntries
                const emotionBreakdown = getEmotionBreakdown(filteredEntries)
                const taskCount = filteredEntries.reduce((sum, entry) => sum + entry.tasks.length, 0)
                
                const insights = generateWeeklyInsights({
                  taskCount,
                  emotionBreakdown: emotionBreakdown?.breakdown,
                  timeRange: selectedTimeRange
                })

                return (
                  <div 
                    className="bg-white/[0.04] mb-4 p-[20px]"
                    style={{ borderRadius: '8px' }}
                  >
                    <div className="flex flex-col gap-3">
                      <h2 className="text-[20px] font-bold text-[#E6E1E5]">
                        {selectedTimeRange === 'week' ? "Week's Reflection" : "Month's Reflection"}
                      </h2>
                      <p className="text-[14px] font-normal text-[#938F99] leading-relaxed">
                        {insights}
                      </p>
                    </div>
                  </div>
                )
              })()}

              {/* Emotional Radar Chart */}
              {(() => {
                // Use time-filtered entries for the radar chart
                const filteredEntries = currentEntries
                const emotionBreakdown = getEmotionBreakdown(filteredEntries)
                
                if (emotionBreakdown) {
                  return (
                    <div 
                      className="bg-white/[0.04] mb-4 p-[20px]"
                      style={{ borderRadius: '8px' }}
                    >
                      <div className="flex flex-col items-center">
                        <EmotionalRadarChart 
                          emotionData={emotionBreakdown}
                          taskCount={emotionBreakdown.totalTasks}
                          view={selectedTimeRange === 'week' ? 'weekly' : 'monthly'}
                          showLabels={true}
                          size={240}
                        />
                      </div>
                    </div>
                  )
                }
                return null
              })()}

              <div className="grid grid-cols-2 gap-3 mb-6">
              {/* 1. Energized */}
              <div 
                onClick={() => onEmotionClick('energized')}
                className="bg-white/[0.04] transition-all active:scale-[0.98] cursor-pointer p-5 min-w-[160px] min-h-[180px] sm:min-w-[214px] sm:h-[198px] overflow-hidden"
                style={{ borderRadius: '16px' }}
              >
                <div className="flex flex-col h-full justify-between">
                  {/* Emotion name (top) */}
                  <h3 className="text-[10px] font-semibold text-[#938F99] uppercase tracking-wider">
                    Energized
                  </h3>
                  
                  {/* Summary Tag (center, main focus) */}
                  {energyTasks.length > 0 ? (
                    <div className="flex-1 flex flex-col justify-center">
                      {(() => {
                        const summaryTags = generateSummaryTags(energyTasks).slice(0, 1)
                        
                        return (
                          <p className="text-[20px] font-bold text-[#FF2D55] leading-tight">
                            {summaryTags[0] || 'Team collaboration'}
                          </p>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-[20px] font-bold text-[#FF2D55]/50 leading-tight italic">
                        No tasks yet
                      </p>
                    </div>
                  )}
                  
                  {/* Task count (bottom) */}
                  <p className="text-[11px] text-[#938F99]">
                    {energyTasks.length} {energyTasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>
              
              {/* 2. Drained */}
              <div 
                onClick={() => onEmotionClick('drained')}
                className="bg-white/[0.04] transition-all active:scale-[0.98] cursor-pointer p-5 min-w-[160px] min-h-[180px] sm:min-w-[214px] sm:h-[198px] overflow-hidden"
                style={{ borderRadius: '16px' }}
              >
                <div className="flex flex-col h-full justify-between">
                  {/* Emotion name (top) */}
                  <h3 className="text-[10px] font-semibold text-[#938F99] uppercase tracking-wider">
                    Drained
                  </h3>
                  
                  {/* Summary Tag (center, main focus) */}
                  {drainingTasks.length > 0 ? (
                    <div className="flex-1 flex flex-col justify-center">
                      {(() => {
                        const summaryTags = generateSummaryTags(drainingTasks).slice(0, 1)
                        
                        return (
                          <p className="text-[20px] font-bold text-[#938F99] leading-tight">
                            {summaryTags[0] || 'Evening wrap-up'}
                          </p>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-[20px] font-bold text-[#938F99]/50 leading-tight italic">
                        No tasks yet
                      </p>
                    </div>
                  )}
                  
                  {/* Task count (bottom) */}
                  <p className="text-[11px] text-[#938F99]">
                    {drainingTasks.length} {drainingTasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>
              
              {/* 3. Meaningful */}
              <div 
                onClick={() => onEmotionClick('meaningful')}
                className="bg-white/[0.04] transition-all active:scale-[0.98] cursor-pointer p-5 min-w-[160px] min-h-[180px] sm:min-w-[214px] sm:h-[198px] overflow-hidden"
                style={{ borderRadius: '16px' }}
              >
                <div className="flex flex-col h-full justify-between">
                  {/* Emotion name (top) */}
                  <h3 className="text-[10px] font-semibold text-[#938F99] uppercase tracking-wider">
                    Meaningful
                  </h3>
                  
                  {/* Summary Tag (center, main focus) */}
                  {meaningfulTasks.length > 0 ? (
                    <div className="flex-1 flex flex-col justify-center">
                      {(() => {
                        const summaryTags = generateSummaryTags(meaningfulTasks).slice(0, 1)
                        
                        return (
                          <p className="text-[20px] font-bold text-[#F4C95D] leading-tight">
                            {summaryTags[0] || 'Organizing workflow'}
                          </p>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-[20px] font-bold text-[#F4C95D]/50 leading-tight italic">
                        No tasks yet
                      </p>
                    </div>
                  )}
                  
                  {/* Task count (bottom) */}
                  <p className="text-[11px] text-[#938F99]">
                    {meaningfulTasks.length} {meaningfulTasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>
              
              {/* 4. Curious */}
              <div 
                onClick={() => onEmotionClick('curious')}
                className="bg-white/[0.04] transition-all active:scale-[0.98] cursor-pointer p-5 min-w-[160px] min-h-[180px] sm:min-w-[214px] sm:h-[198px] overflow-hidden"
                style={{ borderRadius: '16px' }}
              >
                <div className="flex flex-col h-full justify-between">
                  {/* Emotion name (top) */}
                  <h3 className="text-[10px] font-semibold text-[#938F99] uppercase tracking-wider">
                    Curious
                  </h3>
                  
                  {/* Summary Tag (center, main focus) */}
                  {passionTasks.length > 0 ? (
                    <div className="flex-1 flex flex-col justify-center">
                      {(() => {
                        const summaryTags = generateSummaryTags(passionTasks).slice(0, 1)
                        
                        return (
                          <p className="text-[20px] font-bold text-[#AF52DE] leading-tight">
                            {summaryTags[0] || 'Team collaboration'}
                          </p>
                        )
                      })()}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-[20px] font-bold text-[#AF52DE]/50 leading-tight italic">
                        No tasks yet
                      </p>
                    </div>
                  )}
                  
                  {/* Task count (bottom) */}
                  <p className="text-[11px] text-[#938F99]">
                    {passionTasks.length} {passionTasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>
            </div>
            </>
          )
        })()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="overview"
        onNavigateHome={onNavigateHome}
        onNavigateInsights={() => {}}
        onNavigateAdd={onNavigateAdd}
        onNavigateHistory={onNavigateHistory}
        onNavigateSettings={onNavigateSettings || (() => {})}
      />

      {/* Full Calendar Bottom Sheet */}
      {showFullCalendar && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 z-50 transition-opacity overflow-hidden"
            onClick={() => setShowFullCalendar(false)}
          />
          
          {/* Bottom Sheet */}
          <div className="fixed inset-x-0 top-12 bottom-0 z-50 bg-black rounded-t-3xl overflow-hidden animate-slide-up shadow-2xl">
            {/* Pull Indicator */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-[#49454F] rounded-full"></div>
            </div>
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-black z-10">
              <div className="px-5 py-3 flex items-center justify-between">
                <button
                  onClick={() => setShowFullCalendar(false)}
                  className="text-[#EC5429] text-[16px] font-medium"
                >
                  Cancel
                </button>
                <h2 className="text-[18px] font-semibold text-[#E6E1E5]">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="w-16"></div> {/* Spacer for centering */}
              </div>

              {/* Calendar Header - Day Labels */}
              <div className="px-5 pt-4 pb-3 grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayName, idx) => (
                  <div key={idx} className="text-center text-sm font-medium text-[#938F99]">
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Border line below day labels */}
              <div className="border-b border-[#49454F]"></div>
            </div>

            {/* Scrollable Calendar Content */}
            <div className="overflow-y-auto h-[calc(100vh-200px)] px-5 pb-6">
              {/* Current Month (October) */}
              <h3 className="text-[20px] font-semibold text-[#E6E1E5] mb-4">
                {new Date().toLocaleDateString('en-US', { month: 'short' })}
              </h3>
              
              {/* October Calendar Grid */}
              <div className="grid grid-cols-7 gap-3 mb-8">
                {currentMonthData.map((day, index) => {
                  // Get emotion data
                  const getEmotion = () => {
                    if (day.isEmpty || !day.hasData) return { emoji: '⚪', label: 'No data', iconPath: undefined }
                    const firstTask = day.entry?.tasks[0]
                    if (!firstTask) return { emoji: '⚪', label: 'No data', iconPath: undefined }
                    
                    const emotionLevel = firstTask.emotions && firstTask.emotions.length > 0 
                      ? firstTask.emotions[0] 
                      : firstTask.emotion
                    
                    return EMOTIONS[emotionLevel] || { emoji: '😐', label: 'Neutral', iconPath: undefined }
                  }
                  
                  const emotion = getEmotion()
                  
                  return (
                    <div key={index} className="w-full">
                      {day.isEmpty ? (
                        <div className="w-full h-16"></div>
                      ) : (
                        <div 
                          className="flex flex-col items-center justify-start gap-1 py-2 min-h-[64px] transition-all relative"
                          onClick={() => {
                            if (day.hasData && day.entry) {
                              setShowFullCalendar(false)
                              onViewEntry(day.entry)
                            }
                          }}
                        >
                          {/* Date number */}
                          <span className="text-[14px] font-medium text-[#E6E1E5]">
                            {day.date}
                          </span>
                          
                          {/* Emoji */}
                          {day.hasData ? (
                            <div className="transition-all cursor-pointer hover:scale-110">
                              {emotion.iconPath ? (
                                <img 
                                  src={emotion.iconPath} 
                                  alt={emotion.label}
                                  className="w-8 h-8"
                                  style={{ filter: 'brightness(1.3) contrast(1.1)' }}
                                />
                              ) : (
                                <span className="text-2xl">{emotion.emoji}</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-2xl transition-all opacity-30">
                              ⚪
                            </div>
                          )}
                          
                          {/* Today indicator */}
                          {day.isToday && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-[#EC5429] rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Next Month (November) */}
              <h3 className="text-[20px] font-semibold text-[#E6E1E5] mb-4">
                {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'short' })}
              </h3>
              
              {/* November Calendar Grid */}
              <div className="grid grid-cols-7 gap-3 mb-8">
                {nextMonthData.map((day, index) => {
                  // Get emotion data
                  const getEmotion = () => {
                    if (day.isEmpty || !day.hasData) return { emoji: '⚪', label: 'No data', iconPath: undefined }
                    const firstTask = day.entry?.tasks[0]
                    if (!firstTask) return { emoji: '⚪', label: 'No data', iconPath: undefined }
                    
                    const emotionLevel = firstTask.emotions && firstTask.emotions.length > 0 
                      ? firstTask.emotions[0] 
                      : firstTask.emotion
                    
                    return EMOTIONS[emotionLevel] || { emoji: '😐', label: 'Neutral', iconPath: undefined }
                  }
                  
                  const emotion = getEmotion()
                  
                  return (
                    <div key={index} className="w-full">
                      {day.isEmpty ? (
                        <div className="w-full h-16"></div>
                      ) : (
                        <div 
                          className="flex flex-col items-center justify-start gap-1 py-2 min-h-[64px] transition-all relative"
                          onClick={() => {
                            if (day.hasData && day.entry) {
                              setShowFullCalendar(false)
                              onViewEntry(day.entry)
                            }
                          }}
                        >
                          {/* Date number */}
                          <span className="text-[14px] font-medium text-[#E6E1E5]">
                            {day.date}
                          </span>
                          
                          {/* Emoji */}
                          {day.hasData ? (
                            <div className="transition-all cursor-pointer hover:scale-110">
                              {emotion.iconPath ? (
                                <img 
                                  src={emotion.iconPath} 
                                  alt={emotion.label}
                                  className="w-8 h-8"
                                  style={{ filter: 'brightness(1.3) contrast(1.1)' }}
                                />
                              ) : (
                                <span className="text-2xl">{emotion.emoji}</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-2xl transition-all opacity-30">
                              ⚪
                            </div>
                          )}
                          
                          {/* Today indicator */}
                          {day.isToday && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-[#EC5429] rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default InsightsScreen
