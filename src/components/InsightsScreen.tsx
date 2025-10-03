import React, { useState } from 'react'
import { ArrowLeft, Home, Plus, BarChart2, Calendar } from 'lucide-react'
import { Entry, EMOTIONS, TASK_TYPE_LABELS } from '../types'
import { ProjectStorage } from '../utils/storage'
import { getCurrentWeekEntries, getCurrentMonthEntries, calculateAverageEmotion, getMostEnergizingTaskType, getMostDrainingTaskType } from '../utils/dataHelpers'

interface InsightsScreenProps {
  entries: Entry[]
  onBack: () => void
  onNavigateHome: () => void
  onNavigateAdd: () => void
  onNavigateHistory: () => void
  onViewEntry: (entry: Entry) => void
}

type TimeRange = 'week' | 'month'

const InsightsScreen: React.FC<InsightsScreenProps> = ({
  entries,
  onBack,
  onNavigateHome,
  onNavigateAdd,
  onNavigateHistory,
  onViewEntry
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week')

  // Get data based on selected time range
  const currentEntries = selectedTimeRange === 'week' 
    ? getCurrentWeekEntries(entries)
    : getCurrentMonthEntries(entries)

  // Calculate insights
  const averageEmotion = calculateAverageEmotion(currentEntries)
  const mostEnergizingTaskType = getMostEnergizingTaskType(currentEntries)
  const mostDrainingTaskType = getMostDrainingTaskType(currentEntries)

  // Get weekly emotional calendar data (last 7 days)
  const getWeeklyEmotionalData = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const calendarData = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      const dayEntry = entries.find(entry => entry.date === dateString)
      
      if (dayEntry && dayEntry.tasks.length > 0) {
        const avgEmotion = dayEntry.tasks.reduce((sum, task) => sum + task.emotion, 0) / dayEntry.tasks.length
        const emoji = avgEmotion >= 4.5 ? '🥳' : 
                     avgEmotion >= 3.5 ? '😊' : 
                     avgEmotion >= 2.5 ? '😐' : 
                     avgEmotion >= 1.5 ? '😰' : '😫'
        
        calendarData.push({
          label: days[calendarData.length],
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
          label: days[calendarData.length],
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
      const dateString = date.toISOString().split('T')[0]
      const dayEntry = entries.find(entry => entry.date === dateString)
      
      if (dayEntry && dayEntry.tasks.length > 0) {
        const avgEmotion = dayEntry.tasks.reduce((sum, task) => sum + task.emotion, 0) / dayEntry.tasks.length
        const emoji = avgEmotion >= 4.5 ? '🥳' : 
                     avgEmotion >= 3.5 ? '😊' : 
                     avgEmotion >= 2.5 ? '😐' : 
                     avgEmotion >= 1.5 ? '😰' : '😫'
        
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

  // Get top projects by emotion levels
  const getTopProjects = () => {
    const projectEmotions: Record<string, number[]> = {}
    
    currentEntries.forEach(entry => {
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

    // Top Motivators - highest average emotions (>=9)
    const motivators = projectAverages
      .filter(item => item.averageEmotion >= 9)
      .sort((a, b) => b.averageEmotion - a.averageEmotion)
      .slice(0, 2)

    // Top Frustrators - low emotions (<=4)
    const frustrators = projectAverages
      .filter(item => item.averageEmotion <= 4)
      .sort((a, b) => a.averageEmotion - b.averageEmotion)
      .slice(0, 2)

    // Top Struggles - medium-low emotions (4-7)
    const struggles = projectAverages
      .filter(item => item.averageEmotion > 4 && item.averageEmotion <= 7)
      .sort((a, b) => a.averageEmotion - b.averageEmotion)
      .slice(0, 2)

    // Top Happy Moments - high emotions (>=10)
    const happy = projectAverages
      .filter(item => item.averageEmotion >= 10)
      .sort((a, b) => b.averageEmotion - a.averageEmotion)
      .slice(0, 2)

    return { motivators, frustrators, struggles, happy }
  }

  const { motivators, frustrators, struggles, happy } = getTopProjects()

  // Generate insight card
  const getInsightCard = () => {
    if (currentEntries.length === 0) {
      return {
        title: "Start tracking to see insights!",
        subtitle: "Add some reflections to discover your patterns."
      }
    }

    if (averageEmotion >= 4) {
      return {
        title: "You're having a great time!",
        subtitle: `Your average mood is ${averageEmotion.toFixed(1)}/5. Keep up the positive energy!`
      }
    } else if (averageEmotion <= 2) {
      return {
        title: "Consider taking a break.",
        subtitle: "Your mood has been low. Try focusing on tasks that energize you."
      }
    } else {
      return {
        title: "You're finding your balance.",
        subtitle: "Mix of challenging and rewarding work. Great progress!"
      }
    }
  }

  const insightCard = getInsightCard()

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light screen-transition">
      <div className="flex-grow">
        {/* Header */}
        <header className="flex items-center p-4 pb-2 justify-between bg-background-light sticky top-0 z-10">
          <button 
            onClick={onBack}
            className="text-slate-900 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-slate-900 text-lg font-bold flex-1 text-center pr-10">
            Your {selectedTimeRange === 'week' ? 'Week' : 'Month'} in Review
          </h1>
        </header>

        {/* Time Range Toggle */}
        <div className="px-4 py-3">
          <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-primary/20 p-1">
            <label className={`flex cursor-pointer h-full grow items-center justify-center rounded-full px-2 text-sm font-medium transition-all ${
              selectedTimeRange === 'week' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600'
            }`}>
              <span className="truncate">This Week</span>
              <input 
                checked={selectedTimeRange === 'week'}
                onChange={() => setSelectedTimeRange('week')}
                className="invisible w-0" 
                name="time-toggle" 
                type="radio" 
                value="week"
              />
            </label>
            <label className={`flex cursor-pointer h-full grow items-center justify-center rounded-full px-2 text-sm font-medium transition-all ${
              selectedTimeRange === 'month' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600'
            }`}>
              <span className="truncate">This Month</span>
              <input 
                checked={selectedTimeRange === 'month'}
                onChange={() => setSelectedTimeRange('month')}
                className="invisible w-0" 
                name="time-toggle" 
                type="radio" 
                value="month"
              />
            </label>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-4 space-y-4">
          {/* Emotional Calendar */}
          <section className="bg-white rounded-lg p-4 border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Emotional Calendar</h2>
            <p className="text-sm text-slate-600 mb-4">
              Your daily emotions this {selectedTimeRange}
            </p>
            
            {selectedTimeRange === 'week' ? (
              /* Weekly View - Single Row */
              <div className="flex justify-around items-center text-center">
                {weeklyData.map((day, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
                      day.hasData 
                        ? 'cursor-pointer hover:scale-110' 
                        : ''
                    }`}
                    title={day.hasData 
                      ? `${day.taskCount} task${day.taskCount > 1 ? 's' : ''} - Average mood: ${day.avgEmotion.toFixed(1)}/5`
                      : 'No reflection logged'
                    }
                    onClick={() => {
                      if (day.hasData && day.entry) {
                        onViewEntry(day.entry)
                      }
                    }}
                  >
                    <span className="text-3xl">{day.emoji}</span>
                    <span className={`text-xs font-normal ${day.hasData ? 'text-mono-900' : 'text-mono-400'}`}>
                      {day.label}
                    </span>
                  </div>
                ))}
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
                  {monthlyData.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day.isEmpty ? (
                        <div className="w-full h-full"></div>
                      ) : (
                        <div 
                          className={`w-full h-full flex flex-col items-center justify-center text-xs transition-all duration-200 relative ${
                            day.hasData 
                              ? 'cursor-pointer hover:scale-110' 
                              : ''
                          }`}
                          title={day.hasData 
                            ? `${day.date} - ${day.taskCount} task${day.taskCount > 1 ? 's' : ''} - Mood: ${day.avgEmotion.toFixed(1)}/5`
                            : `${day.date} - No reflection logged`
                          }
                          onClick={() => {
                            if (day.hasData && day.entry) {
                              onViewEntry(day.entry)
                            }
                          }}
                        >
                          <span className="text-xl mb-0.5">{day.emoji}</span>
                          <span className={`font-normal text-xs ${day.hasData ? 'text-mono-900' : 'text-mono-400'}`}>
                            {day.date}
                          </span>
                          {day.isToday && (
                            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-mono-900 rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </section>

          {/* Top Motivators */}
          {motivators.length > 0 && (
            <section className="bg-white rounded-lg p-4 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Top Motivators</h2>
              <p className="text-sm text-slate-600 mb-3">Projects that energize you</p>
              <div className="space-y-3">
                {motivators.map((motivator, index) => {
                  const project = ProjectStorage.getProjectById(motivator.projectId)
                  return (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        {project && (
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                        )}
                        <span className="font-medium text-slate-900">
                          {project?.name || 'Unknown Project'}
                        </span>
                      </div>
                      <span className="text-2xl">⚡</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Top Frustrators */}
          {frustrators.length > 0 && (
            <section className="bg-white rounded-lg p-4 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Top Frustrators</h2>
              <p className="text-sm text-slate-600 mb-3">Projects that caused stress</p>
              <div className="space-y-3">
                {frustrators.map((frustrator, index) => {
                  const project = ProjectStorage.getProjectById(frustrator.projectId)
                  return (
                    <div key={index} className="flex items-center justify-between bg-red-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        {project && (
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                        )}
                        <span className="font-medium text-slate-900">
                          {project?.name || 'Unknown Project'}
                        </span>
                      </div>
                      <span className="text-2xl">😠</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Top Struggles */}
          {struggles.length > 0 && (
            <section className="bg-white rounded-lg p-4 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Top Struggles</h2>
              <p className="text-sm text-slate-600 mb-3">Projects that need attention</p>
              <div className="space-y-3">
                {struggles.map((struggle, index) => {
                  const project = ProjectStorage.getProjectById(struggle.projectId)
                  return (
                    <div key={index} className="flex items-center justify-between bg-yellow-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        {project && (
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                        )}
                        <span className="font-medium text-slate-900">
                          {project?.name || 'Unknown Project'}
                        </span>
                      </div>
                      <span className="text-2xl">😰</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Top Happy Moments */}
          {happy.length > 0 && (
            <section className="bg-white rounded-lg p-4 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Top Happy Moments</h2>
              <p className="text-sm text-slate-600 mb-3">Projects that brought you joy</p>
              <div className="space-y-3">
                {happy.map((happyMoment, index) => {
                  const project = ProjectStorage.getProjectById(happyMoment.projectId)
                  return (
                    <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        {project && (
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                        )}
                        <span className="font-medium text-slate-900">
                          {project?.name || 'Unknown Project'}
                        </span>
                      </div>
                      <span className="text-2xl">😀</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Insight Cards */}
          <section className="bg-white rounded-lg p-4 border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Insight Cards</h2>
            <div className="bg-primary/20 p-4 rounded text-center">
              <p className="font-bold text-slate-900">{insightCard.title}</p>
              <p className="text-sm text-slate-700 mt-1">{insightCard.subtitle}</p>
            </div>
          </section>
        </main>
      </div>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 bg-background-light/80 backdrop-blur-sm">
        <div className="flex justify-around border-t border-primary/20 py-2">
          <button 
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-end gap-1 text-slate-500 hover:text-primary transition-colors"
          >
            <Home size={24} />
            <p className="text-xs font-medium">Home</p>
          </button>
          <button 
            onClick={onNavigateAdd}
            className="flex flex-col items-center justify-end gap-1 text-slate-500 hover:text-primary transition-colors"
          >
            <Plus size={24} />
            <p className="text-xs font-medium">Add</p>
          </button>
          <button className="flex flex-col items-center justify-end gap-1 text-primary">
            <BarChart2 size={24} fill="currentColor" />
            <p className="text-xs font-medium">Overview</p>
          </button>
          <button 
            onClick={onNavigateHistory}
            className="flex flex-col items-center justify-end gap-1 text-slate-500 hover:text-primary transition-colors"
          >
            <Calendar size={24} />
            <p className="text-xs font-medium">History</p>
          </button>
        </div>
        <div className="h-5 bg-background-light"></div>
      </footer>
    </div>
  )
}

export default InsightsScreen
