import React, { useState } from 'react'
import { HouseSimple, Plus, ChartBar, Notepad, GearSix, CalendarBlank, X, CaretRight, DotsThree } from 'phosphor-react'
import BottomNav from './BottomNav'
import { Entry, EMOTIONS, TASK_TYPE_LABELS, EmotionLevel } from '../types'
import { ProjectStorage } from '../utils/storage'
import { getCurrentWeekEntries, getCurrentMonthEntries, calculateAverageEmotion, getMostEnergizingTaskType, getMostDrainingTaskType } from '../utils/dataHelpers'
import Card from './Card'
import EmotionalRadarChart from './EmotionalRadarChart'
import { getEmotionBreakdown } from '../utils/emotionBreakdownService'
import { generateWeeklyInsights } from '../utils/weeklyInsightsService'

interface InsightsScreenProps {
  entries: Entry[]
  onNavigateHome: () => void
  onNavigateAdd: () => void
  onNavigateHistory: () => void
  onNavigateSettings?: () => void
  onViewEntry: (entry: Entry) => void
}

type TimeRange = 'week' | 'month'

const InsightsScreen: React.FC<InsightsScreenProps> = ({
  entries,
  onNavigateHome,
  onNavigateAdd,
  onNavigateHistory,
  onNavigateSettings,
  onViewEntry
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week')
  const [showFullCalendar, setShowFullCalendar] = useState(false)

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

  // Get data based on selected time range (for calendar only)
  const currentEntries = selectedTimeRange === 'week' 
    ? getCurrentWeekEntries(entries)
    : getCurrentMonthEntries(entries)

  // Calculate insights from ALL entries (not just current time range)
  const averageEmotion = calculateAverageEmotion(entries)
  const mostEnergizingTaskType = getMostEnergizingTaskType(entries)
  const mostDrainingTaskType = getMostDrainingTaskType(entries)

  // Get weekly emotional calendar data (Monday to Sunday of current week)
  const getWeeklyEmotionalData = () => {
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] // Always Monday to Sunday
    const calendarData = []
    const today = new Date()
    
    // Find the Monday of the current week
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // If Sunday, go back 6 days, otherwise go back (dayOfWeek - 1) days
    const monday = new Date(today)
    monday.setDate(today.getDate() - daysFromMonday)
    
    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
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
        
        calendarData.push({
          label: dayLabels[i],
          emoji: emoji,
          hasData: true,
          avgEmotion: avgEmotion,
          taskCount: dayEntry.tasks.length,
          date: date.getDate(),
          dateString: dateString,
          entry: dayEntry
        })
      } else {
        calendarData.push({
          label: dayLabels[i],
          emoji: '⚪',
          hasData: false,
          avgEmotion: 0,
          taskCount: 0,
          date: date.getDate(),
          dateString: dateString,
          entry: null
        })
      }
    }
    
    return calendarData
  }

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

  const weeklyData = getWeeklyEmotionalData()
  const currentMonthData = getMonthCalendarData(0) // October
  const nextMonthData = getMonthCalendarData(1) // November

  // Get current date formatted
  const getCurrentDate = () => {
    const today = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[today.getMonth()]
    const day = today.getDate()
    const year = today.getFullYear()
    return `Today, ${month} ${day}, ${year}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-black screen-transition">
      <main className="flex-1 p-5 pb-32 overflow-y-auto max-w-md mx-auto w-full">
        {/* Header with Date and Calendar Icon */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[18px] font-semibold text-[#E6E1E5]">
            {getCurrentDate()}
          </h1>
          <button
            onClick={() => setShowFullCalendar(true)}
            className="p-2 hover:bg-white/[0.04] rounded-lg transition-all active:scale-95"
          >
            <CalendarBlank size={24} weight="regular" className="text-[#EC5429]" />
          </button>
        </div>

        {/* Emotional Calendar - Weekly View */}
        <div className="mb-6">
          {/* Weekly View - Emojis with day labels */}
          <div>
            {/* Week day headers (M T W T F S S) */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayName, idx) => (
                <div key={idx} className="text-center text-sm font-medium text-[#938F99]">
                  {dayName}
                </div>
              ))}
            </div>
              
              {/* Week emojis */}
              <div className="grid grid-cols-7 gap-2">
                {weeklyData.map((day, index) => {
                  // Get emoji based on emotion
                  const getEmotion = () => {
                    if (!day.hasData) return { emoji: '⚪', label: 'No data', iconPath: undefined }
                    const firstTask = day.entry?.tasks[0]
                    if (!firstTask) return { emoji: '⚪', label: 'No data', iconPath: undefined }
                    
                    const emotionLevel = firstTask.emotions && firstTask.emotions.length > 0 
                      ? firstTask.emotions[0] 
                      : firstTask.emotion
                    
                    return EMOTIONS[emotionLevel] || { emoji: '😐', label: 'Neutral', iconPath: undefined }
                  }
                  
                  const emotion = getEmotion()
                  
                  return (
                    <div 
                      key={index} 
                      className="flex flex-col items-center gap-1"
                    >
                      <div 
                        className={`transition-all ${day.hasData ? 'cursor-pointer hover:scale-110' : 'opacity-30'}`}
                        onClick={() => {
                          if (day.hasData && day.entry) {
                            onViewEntry(day.entry)
                          }
                        }}
                      >
                        {emotion.iconPath ? (
                          <img 
                            src={emotion.iconPath} 
                            alt={emotion.label}
                            className="w-8 h-8"
                            style={{ filter: 'brightness(1.3) contrast(1.1)' }}
                          />
                        ) : (
                          <span className="text-3xl">{emotion.emoji}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-[#E6E1E5]">
                        {day.date}
                      </span>
                    </div>
                  )
                })}
              </div>
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
          // Get all tasks from history
          const allTasks = entries.length > 0 ? entries.flatMap(entry => entry.tasks) : []
          
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
          
          return (
            <>
              {/* Week's Reflection Card */}
              {(() => {
                // Use time-filtered entries for insights
                const filteredEntries = selectedTimeRange === 'week' 
                  ? getCurrentWeekEntries(entries)
                  : getCurrentMonthEntries(entries)
                const emotionBreakdown = getEmotionBreakdown(filteredEntries)
                const taskCount = filteredEntries.reduce((sum, entry) => sum + entry.tasks.length, 0)
                
                const insights = generateWeeklyInsights({
                  taskCount,
                  emotionBreakdown: emotionBreakdown?.breakdown,
                  timeRange: selectedTimeRange
                })

                return (
                  <Card 
                    variant="glass" 
                    padding="small"
                    className="mb-4 !p-[20px]"
                  >
                    <div className="flex flex-col gap-3">
                      <h2 className="text-[20px] font-bold text-[#E6E1E5]">
                        {selectedTimeRange === 'week' ? "Week's Reflection" : "Month's Reflection"}
                      </h2>
                      <p className="text-[14px] font-normal text-[#938F99] leading-relaxed">
                        {insights}
                      </p>
                    </div>
                  </Card>
                )
              })()}

              {/* Emotional Radar Chart */}
              {(() => {
                // Use time-filtered entries for the radar chart
                const filteredEntries = selectedTimeRange === 'week' 
                  ? getCurrentWeekEntries(entries)
                  : getCurrentMonthEntries(entries)
                const emotionBreakdown = getEmotionBreakdown(filteredEntries)
                
                if (emotionBreakdown) {
                  return (
                    <Card 
                      variant="glass" 
                      padding="small"
                      className="mb-4 !p-[20px]"
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
                    </Card>
                  )
                }
                return null
              })()}

              <div className="grid grid-cols-2 gap-3 mb-6">
              {/* 1. Energized */}
              <Card 
                variant="glass" 
                padding="small"
                glassBackground="card"
                className="transition-all active:scale-[0.98] cursor-pointer !p-[14px] min-w-[160px] min-h-[180px] sm:min-w-[214px] sm:h-[198px] overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  {/* Header with title and chevron */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[14px] font-semibold text-[#E6E1E5]">
                        Energized
                      </h3>
                      <CaretRight size={20} weight="bold" className="text-[#EC5429] mt-1" />
                    </div>
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                  </div>
                  
                  {/* Today subtitle */}
                  <p className="text-[11px] font-normal text-[#938F99]">
                    Today
                  </p>
                  
                  {/* Tasks */}
                  {energyProjects.length > 0 ? (
                    <div className="space-y-1.5">
                      {(() => {
                        const energyTasks = allTasks
                          .filter(task => {
                            const emotions = getEmotions(task)
                            return emotions.some(e => energyEmotions.includes(e))
                          })
                          .slice(0, 2)
                        
                        return energyTasks.map((task, index) => (
                          <p key={index} className="text-[18px] font-bold text-[#FF2D55] leading-tight line-clamp-1">
                            {extractKeywords(task.description)}
                          </p>
                        ))
                      })()}
                    </div>
                  ) : (
                    <p className="text-[18px] font-bold text-[#FF2D55]/50 leading-tight italic">
                      No energizing tasks yet
                    </p>
                  )}
                  
                  {/* Three dots */}
                  <DotsThree size={24} weight="bold" className="text-[#938F99]" />
                </div>
              </Card>
              
              {/* 2. Drained */}
              <Card 
                variant="glass" 
                padding="small"
                glassBackground="card"
                className="transition-all active:scale-[0.98] cursor-pointer !p-[14px] min-w-[160px] min-h-[180px] sm:min-w-[214px] sm:h-[198px] overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  {/* Header with title and chevron */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[14px] font-semibold text-[#E6E1E5]">
                        Drained
                      </h3>
                      <CaretRight size={20} weight="bold" className="text-[#EC5429] mt-1" />
                    </div>
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                  </div>
                  
                  {/* Today subtitle */}
                  <p className="text-[11px] font-normal text-[#938F99]">
                    Today
                  </p>
                  
                  {/* Tasks */}
                  {drainingProjects.length > 0 ? (
                    <div className="space-y-1.5">
                      {(() => {
                        const drainingTasks = allTasks
                          .filter(task => {
                            const emotions = getEmotions(task)
                            return emotions.some(e => drainingEmotions.includes(e))
                          })
                          .slice(0, 2)
                        
                        return drainingTasks.map((task, index) => (
                          <p key={index} className="text-[18px] font-bold text-[#938F99] leading-tight line-clamp-1">
                            {extractKeywords(task.description)}
                          </p>
                        ))
                      })()}
                    </div>
                  ) : (
                    <p className="text-[18px] font-bold text-[#938F99]/50 leading-tight italic">
                      No draining tasks yet
                    </p>
                  )}
                  
                  {/* Three dots */}
                  <DotsThree size={24} weight="bold" className="text-[#938F99]" />
                </div>
              </Card>
              
              {/* 3. Meaningful */}
              <Card 
                variant="glass" 
                padding="small"
                glassBackground="card"
                className="transition-all active:scale-[0.98] cursor-pointer !p-[14px] min-w-[160px] min-h-[180px] sm:min-w-[214px] sm:h-[198px] overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  {/* Header with title and chevron */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[14px] font-semibold text-[#E6E1E5]">
                        Meaningful
                      </h3>
                      <CaretRight size={20} weight="bold" className="text-[#EC5429] mt-1" />
                    </div>
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                  </div>
                  
                  {/* Today subtitle */}
                  <p className="text-[11px] font-normal text-[#938F99]">
                    Today
                  </p>
                  
                  {/* Tasks */}
                  {meaningfulProjects.length > 0 ? (
                    <div className="space-y-1.5">
                      {(() => {
                        const meaningfulTasks = allTasks
                          .filter(task => {
                            const emotions = getEmotions(task)
                            return emotions.some(e => meaningfulEmotions.includes(e))
                          })
                          .slice(0, 2)
                        
                        return meaningfulTasks.map((task, index) => (
                          <p key={index} className="text-[18px] font-bold text-[#F4C95D] leading-tight line-clamp-1">
                            {extractKeywords(task.description)}
                          </p>
                        ))
                      })()}
                    </div>
                  ) : (
                    <p className="text-[18px] font-bold text-[#F4C95D]/50 leading-tight italic">
                      No meaningful tasks yet
                    </p>
                  )}
                  
                  {/* Three dots */}
                  <DotsThree size={24} weight="bold" className="text-[#938F99]" />
                </div>
              </Card>
              
              {/* 4. Curious */}
              <Card 
                variant="glass" 
                padding="small"
                glassBackground="card"
                className="transition-all active:scale-[0.98] cursor-pointer !p-[14px] min-w-[160px] min-h-[180px] sm:min-w-[214px] sm:h-[198px] overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  {/* Header with title and chevron */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between">
                      <h3 className="text-[14px] font-semibold text-[#E6E1E5]">
                        Curious
                      </h3>
                      <CaretRight size={20} weight="bold" className="text-[#EC5429] mt-1" />
                    </div>
                    <div className="w-full h-[1px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                  </div>
                  
                  {/* Today subtitle */}
                  <p className="text-[11px] font-normal text-[#938F99]">
                    Today
                  </p>
                  
                  {/* Tasks */}
                  {passionProjects.length > 0 ? (
                    <div className="space-y-1.5">
                      {(() => {
                        const passionTasks = allTasks
                          .filter(task => {
                            const emotions = getEmotions(task)
                            return emotions.some(e => passionEmotions.includes(e))
                          })
                          .slice(0, 2)
                        
                        return passionTasks.map((task, index) => (
                          <p key={index} className="text-[18px] font-bold text-[#AF52DE] leading-tight line-clamp-1">
                            {extractKeywords(task.description)}
                          </p>
                        ))
                      })()}
                    </div>
                  ) : (
                    <p className="text-[18px] font-bold text-[#AF52DE]/50 leading-tight italic">
                      No curious tasks yet
                    </p>
                  )}
                  
                  {/* Three dots */}
                  <DotsThree size={24} weight="bold" className="text-[#938F99]" />
                </div>
              </Card>
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
                                  className="w-6 h-6"
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
                                  className="w-6 h-6"
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
