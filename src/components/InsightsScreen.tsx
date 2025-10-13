import React, { useState } from 'react'
import { Home, Plus, BarChart2, Calendar, Settings } from 'lucide-react'
import { Entry, EMOTIONS, TASK_TYPE_LABELS } from '../types'
import { ProjectStorage } from '../utils/storage'
import { getCurrentWeekEntries, getCurrentMonthEntries, calculateAverageEmotion, getMostEnergizingTaskType, getMostDrainingTaskType } from '../utils/dataHelpers'

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

  // Get monthly calendar data (current month grid)
  const getMonthlyCalendarData = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    
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
  const monthlyData = getMonthlyCalendarData()

  // Get top projects by emotion levels (from ALL history)
  const getTopProjects = () => {
    const projectEmotions: Record<string, number[]> = {}
    
    entries.forEach(entry => {
      entry.tasks.forEach(task => {
        if (!projectEmotions[task.projectId]) {
          projectEmotions[task.projectId] = []
        }
        projectEmotions[task.projectId].push(task.emotion)
      })
    })

    const projectAverages = Object.entries(projectEmotions).map(([projectId, emotions]) => ({
      projectId,
      averageEmotion: emotions.reduce((sum, emotion) => sum + emotion, 0) / emotions.length,
      count: emotions.length
    }))

    // Sort all projects by different criteria and show top ones
    
    // Top Happy - just show projects with highest task count
    const happy = [...projectAverages]
      .sort((a, b) => b.count - a.count)
      .slice(0, 2)

    // Top Frustrators - show projects with lowest average emotion
    const frustrators = projectAverages.length > 0
      ? [...projectAverages]
          .sort((a, b) => a.averageEmotion - b.averageEmotion)
          .slice(0, 2)
      : []

    // Top Struggles - show middle emotion range projects
    const struggles = projectAverages.length > 2
      ? [...projectAverages]
          .sort((a, b) => b.count - a.count)
          .slice(0, 2)
      : []

    // Motivators not used anymore
    const motivators: any[] = []

    return { motivators, frustrators, struggles, happy }
  }

  const { motivators, frustrators, struggles, happy } = getTopProjects()

  // No insight card needed anymore - we just show project cards

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6EB] screen-transition">
      <main className="flex-1 p-5 pb-32 overflow-y-auto max-w-md mx-auto w-full">
        {/* Time Range Toggle */}
        <div className="mb-6 flex gap-6 items-baseline">
          <button
            onClick={() => setSelectedTimeRange('week')}
            className={`text-[28px] transition-all ${
              selectedTimeRange === 'week' 
                ? 'font-bold text-slate-900' 
                : 'font-normal text-slate-400'
            }`}
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedTimeRange('month')}
            className={`text-[28px] transition-all ${
              selectedTimeRange === 'month' 
                ? 'font-bold text-slate-900' 
                : 'font-normal text-slate-400'
            }`}
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Month
          </button>
        </div>

        {/* Emotional Calendar */}
        <div className="mb-6">
          {selectedTimeRange === 'week' ? (
            /* Weekly View - Colored Circles */
            <div>
              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                  <div key={dayName} className="text-center text-xs font-medium text-slate-500 py-2">
                    {dayName}
                  </div>
                ))}
              </div>
              
              {/* Week circles */}
              <div className="grid grid-cols-7 gap-2">
                {weeklyData.map((day, index) => {
                  // Get color based on emotion
                  const getEmotionColor = () => {
                    if (!day.hasData) return '#D1D5DB'
                    const firstTask = day.entry?.tasks[0]
                    if (!firstTask) return '#D1D5DB'
                    
                    const emotionLevel = firstTask.emotions && firstTask.emotions.length > 0 
                      ? firstTask.emotions[0] 
                      : firstTask.emotion
                    
                    // Map emotions to colors
                    if (emotionLevel <= 5) return '#EF4444' // Red for negative
                    if (emotionLevel <= 8) return '#6366F1' // Blue for neutral/bored
                    return '#8B5CF6' // Purple for positive
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className="flex flex-col items-center gap-2"
                    >
                      <div 
                        className="w-8 h-8 rounded-full transition-all cursor-pointer hover:scale-110"
                        style={{ backgroundColor: getEmotionColor() }}
                        onClick={() => {
                          if (day.hasData && day.entry) {
                            onViewEntry(day.entry)
                          }
                        }}
                      ></div>
                      <span className="text-[10px] font-medium text-slate-900">
                        {day.date}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
              /* Monthly View - Calendar Grid */
              <div>
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                    <div key={dayName} className="text-center text-xs font-medium text-slate-500 py-2">
                      {dayName}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {monthlyData.map((day, index) => {
                    // Get color based on emotion
                    const getEmotionColor = () => {
                      if (day.isEmpty || !day.hasData) return '#D1D5DB'
                      const firstTask = day.entry?.tasks[0]
                      if (!firstTask) return '#D1D5DB'
                      
                      const emotionLevel = firstTask.emotions && firstTask.emotions.length > 0 
                        ? firstTask.emotions[0] 
                        : firstTask.emotion
                      
                      // Map emotions to colors
                      if (emotionLevel <= 5) return '#EF4444' // Red for negative
                      if (emotionLevel <= 8) return '#6366F1' // Blue for neutral/bored
                      return '#8B5CF6' // Purple for positive
                    }
                    
                    return (
                      <div key={index} className="aspect-square">
                        {day.isEmpty ? (
                          <div className="w-full h-full"></div>
                        ) : (
                          <div 
                            className="w-full h-full flex flex-col items-center justify-center gap-1 transition-all relative"
                            onClick={() => {
                              if (day.hasData && day.entry) {
                                onViewEntry(day.entry)
                              }
                            }}
                          >
                            {/* Colored circle */}
                            <div 
                              className={`w-8 h-8 rounded-full transition-all ${day.hasData ? 'cursor-pointer hover:scale-110' : ''}`}
                              style={{ backgroundColor: getEmotionColor() }}
                            ></div>
                            
                            {/* Date number */}
                            <span className="text-[10px] font-medium text-slate-900">
                              {day.date}
                            </span>
                            
                            {/* Today indicator */}
                            {day.isToday && (
                              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
        </div>

        {/* No data message */}
        {entries.length === 0 && (
          <div className="bg-white p-6 mb-6 border border-slate-200 text-center" style={{ borderRadius: '0 48px 0 0' }}>
            <p className="text-[16px] font-medium text-slate-900 mb-2">No reflections yet</p>
            <p className="text-[14px] text-slate-600">Start tracking your design work to see insights here.</p>
          </div>
        )}

        {/* Top Happy - Orange Gradient */}
          {happy.length > 0 && (
            <div 
              className="p-4 mb-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
              style={{ 
                borderRadius: '0 48px 0 0',
                background: 'linear-gradient(180deg, #FA604D 0%, #F37E58 100%)'
              }}
            >
              <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-[12px] font-normal text-slate-900">Top Happy</p>
                
                <div className="space-y-1">
                  {happy.slice(0, 3).map((happyMoment, index) => {
                    const project = ProjectStorage.getProjectById(happyMoment.projectId)
                    return (
                      <p key={index} className="text-[20px] font-black text-slate-900 leading-tight">
                        {project?.name || 'Unknown Project'}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Top Frustrators - Green Gradient */}
          {frustrators.length > 0 && (
            <div 
              className="p-4 mb-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
              style={{ 
                borderRadius: '0 48px 0 0',
                background: 'linear-gradient(180deg, #DAE6E6 0%, #B8C6AD 100%)'
              }}
            >
              <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-[12px] font-normal text-slate-900">Top Frustraters</p>
                
                <div className="space-y-1">
                  {frustrators.slice(0, 3).map((frustrator, index) => {
                    const project = ProjectStorage.getProjectById(frustrator.projectId)
                    return (
                      <p key={index} className="text-[20px] font-black text-slate-900 leading-tight">
                        {project?.name || 'Unknown Project'}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Top Struggles - Light Gray Gradient */}
          {struggles.length > 0 && (
            <div 
              className="p-4 mb-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
              style={{ 
                borderRadius: '0 48px 0 0',
                background: 'linear-gradient(132deg, #E3E3E3 0%, #A69FAE 103.78%)'
              }}
            >
              <div className="flex flex-col items-start gap-2 w-full">
                <p className="text-[12px] font-normal text-slate-900">Top Struggles</p>
                
                <div className="space-y-1">
                  {struggles.slice(0, 3).map((struggle, index) => {
                    const project = ProjectStorage.getProjectById(struggle.projectId)
                    return (
                      <p key={index} className="text-[20px] font-black text-slate-900 leading-tight">
                        {project?.name || 'Unknown Project'}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="relative flex items-end justify-around px-4 py-3">
          {/* Home */}
          <button 
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_home-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-medium">Home</p>
          </button>

          {/* Overview */}
          <button className="flex flex-col items-center justify-center gap-1.5 text-slate-900 min-w-[64px] py-1">
            <img src="/icons/material-symbols_overview-outline-rounded.svg" alt="" className="w-[26px] h-[26px]" />
            <p className="text-[11px] font-medium">Overview</p>
          </button>

          {/* Add Button - Center & Elevated */}
          <button
            onClick={onNavigateAdd}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="bg-slate-900 rounded-[18px] px-6 py-3 shadow-xl hover:bg-slate-800 active:scale-95 transition-all">
              <Plus size={28} strokeWidth={2.5} className="text-white" />
            </div>
          </button>

          {/* History */}
          <button 
            onClick={onNavigateHistory}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/ic_round-history.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-medium">History</p>
          </button>

          {/* Setting */}
          <button 
            onClick={onNavigateSettings}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/uil_setting.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-medium">Setting</p>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default InsightsScreen
