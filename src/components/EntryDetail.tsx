import React from 'react'
import { CaretLeft } from 'phosphor-react'
import BottomNav from './BottomNav'
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
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-[#CAC4D0]">No entry data available</p>
      </div>
    )
  }

  // Check if this entry is from today (only today's entries can be edited)
  const isToday = DateUtils.isDateStringToday(entry.date)
  
  if (!entry.tasks || entry.tasks.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <header className="sticky top-0 z-10 bg-black border-b border-[#49454F] p-5">
          <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#E6E1E5]">
            Reflection Details
          </h1>
            <div className="w-10" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <h3 className="text-xl font-semibold text-[#E6E1E5] mb-2">No tasks found</h3>
          <p className="text-[#CAC4D0] text-center">
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
    <div className="flex flex-col min-h-screen bg-black">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-black border-b border-[#49454F] p-5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#E6E1E5]">
            Reflection Details
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-6 pb-32 max-w-md mx-auto w-full overflow-y-auto">
        {/* Date */}
        <div className="mb-6">
          <h2 className="text-[28px] font-bold text-[#E6E1E5]">
            {DateUtils.formatDate(DateUtils.parseLocalDate(entry.date))}
          </h2>
          {!isToday && (
            <p className="text-[14px] text-[#938F99] mt-2">
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
              <h3 className="text-[16px] font-bold text-[#E6E1E5] mb-4">
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
                      className={`bg-white/[0.04] p-4 border border-[#49454F] transition-all ${
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
                              <div key={`${emotionLevel}-${index}`} className="flex items-center justify-center">
                                {emotion?.iconPath ? (
                                  <img 
                                    src={emotion.iconPath} 
                                    alt={emotion.label}
                                    className="w-8 h-8"
                                    style={{ filter: 'brightness(1.5) contrast(1.2)' }}
                                  />
                                ) : (
                                  <span className="text-2xl">{emotion?.emoji || '😐'}</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-[16px] font-medium text-[#E6E1E5] mb-1 break-words">
                            {task.description}
                          </p>
                          {task.notes && (
                            <p className="text-[14px] text-[#CAC4D0] italic break-words">
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
      <BottomNav
        activeTab="history"
        onNavigateHome={onNavigateHome || (() => {})}
        onNavigateInsights={onNavigateInsights || (() => {})}
        onNavigateAdd={onNavigateAdd || (() => {})}
        onNavigateHistory={() => {}}
        onNavigateSettings={onNavigateSettings || (() => {})}
      />
    </div>
  )
}

export default EntryDetail

