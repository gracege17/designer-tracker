import React from 'react'
import { ArrowLeft, Home, Plus, BarChart2, Calendar, Settings } from 'lucide-react'
import { Entry, EMOTIONS } from '../types'
import { DateUtils } from '../utils/dateUtils'
import { ProjectStorage } from '../utils/storage'

interface EntryDetailProps {
  entry: Entry
  onBack: () => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  onNavigateHome?: () => void
  onNavigateAdd?: () => void
  onNavigateInsights?: () => void
  onNavigateHistory?: () => void
  onNavigateSettings?: () => void
}

const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onBack, onEditTask, onDeleteTask, onNavigateHome, onNavigateAdd, onNavigateInsights, onNavigateHistory, onNavigateSettings }) => {
  if (!entry) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FFF9F8] dark:bg-[#1C1B1F]">
        <p className="text-slate-600 dark:text-[#CAC4D0]">No entry data available</p>
      </div>
    )
  }

  // Check if this entry is from today (only today's entries can be edited)
  const isToday = DateUtils.isDateStringToday(entry.date)
  
  if (!entry.tasks || entry.tasks.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FFF9F8] dark:bg-[#1C1B1F]">
        <header className="sticky top-0 z-10 bg-[#FFF9F8] dark:bg-[#1C1B1F] border-b border-slate-200 dark:border-[#49454F] p-5">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95 -ml-2"
            >
              <ArrowLeft size={24} className="text-slate-900" />
            </button>
            <h1 className="text-[18px] font-bold text-slate-900 dark:text-[#E6E1E5]">
              Reflection Details
            </h1>
            <div className="w-10" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-[#E6E1E5] mb-2">No tasks found</h3>
          <p className="text-slate-600 dark:text-[#CAC4D0] text-center">
            This reflection is empty.
          </p>
        </div>
      </div>
    )
  }
  
  // Group tasks by project
  const tasksByProject: Record<string, typeof entry.tasks> = {}
  entry.tasks.forEach(task => {
    if (!tasksByProject[task.projectId]) {
      tasksByProject[task.projectId] = []
    }
    tasksByProject[task.projectId].push(task)
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F8] dark:bg-[#1C1B1F]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-[#FFF9F8] dark:bg-[#1C1B1F] border-b border-slate-200 dark:border-[#49454F] p-5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900">
            Reflection Details
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-6 pb-32 max-w-md mx-auto w-full overflow-y-auto">
        {/* Date */}
        <div className="mb-6">
          <h2 className="text-[28px] font-bold text-slate-900 dark:text-[#E6E1E5]">
            {DateUtils.formatDate(DateUtils.parseLocalDate(entry.date))}
          </h2>
          {!isToday && (
            <p className="text-[14px] text-slate-500 dark:text-[#938F99] mt-2">
              That day's already journaled into history. Let it chill.
            </p>
          )}
        </div>

        {/* Tasks Grouped by Project */}
        {Object.entries(tasksByProject).map(([projectId, tasks]) => {
          const project = ProjectStorage.getProjectById(projectId)
          
          return (
            <div key={projectId} className="mb-6">
              {/* Project Name */}
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-[#E6E1E5] mb-4">
                {project?.name || 'Unknown Project'}
              </h3>

              {/* Tasks for this project */}
              <div className="space-y-3">
                {tasks.map((task) => {
                  const emotions = task.emotions || [task.emotion]
                  const uniqueEmotions = Array.from(new Set(emotions))
                  
                  return (
                    <div 
                      key={task.id} 
                      className={`bg-white dark:bg-[#2B2930] p-4 border border-slate-200 dark:border-[#49454F] transition-all ${
                        isToday 
                          ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' 
                          : 'cursor-default opacity-75'
                      }`}
                      onClick={() => {
                        if (!isToday) {
                          // For historical entries, do nothing (read-only)
                          return
                        }
                        
                        const action = window.confirm('What would you like to do with this task?\n\nPress OK to edit, or Cancel to delete.')
                        if (action && onEditTask) {
                          onEditTask(task.id)
                        } else if (!action && onDeleteTask) {
                          if (window.confirm('Are you sure you want to delete this task?')) {
                            onDeleteTask(task.id)
                          }
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Emotion emojis */}
                        <div className="flex gap-1.5 flex-shrink-0">
                          {uniqueEmotions.map((emotionLevel, index) => {
                            const emotion = EMOTIONS[emotionLevel]
                            return (
                              <span key={`${emotionLevel}-${index}`} className="text-2xl">
                                {emotion?.emoji || '😐'}
                              </span>
                            )
                          })}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-[16px] font-medium text-slate-900 dark:text-[#E6E1E5] mb-1 break-words">
                            {task.description}
                          </p>
                          {task.notes && (
                            <p className="text-[14px] text-slate-600 dark:text-[#CAC4D0] italic break-words">
                              "{task.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#211F26] border-t border-slate-200 dark:border-[#49454F] z-50">
        <div className="relative flex items-end justify-around px-4 py-3">
          {/* Home */}
          <button 
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_home-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Home</p>
          </button>

          {/* Overview */}
          <button 
            onClick={onNavigateInsights}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_overview-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Overview</p>
          </button>

          {/* Add Button - Center & Elevated */}
          <button
            onClick={onNavigateAdd}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="bg-slate-900 dark:bg-[#D0BCFF] rounded-[18px] px-6 py-3 shadow-xl hover:bg-slate-800 dark:hover:bg-[#E8DEF8] active:scale-95 transition-all">
              <Plus size={28} strokeWidth={2.5} className="text-white dark:text-[#381E72]" />
            </div>
          </button>

          {/* History */}
          <button 
            onClick={onNavigateHistory}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/ic_round-history.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">History</p>
          </button>

          {/* Settings */}
          <button 
            onClick={onNavigateSettings}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/uil_setting.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Settings</p>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default EntryDetail

