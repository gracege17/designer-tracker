import React from 'react'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { Entry, EMOTIONS } from '../types'
import { DateUtils } from '../utils/dateUtils'
import { ProjectStorage } from '../utils/storage'
import { calculateEntryAverageEmotion } from '../utils/dataHelpers'

interface EntryDetailProps {
  entry: Entry
  onBack: () => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
}

const EntryDetail: React.FC<EntryDetailProps> = ({ entry, onBack, onEditTask, onDeleteTask }) => {
  if (!entry) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light">
        <p className="text-slate-600">No entry data available</p>
      </div>
    )
  }
  
  if (!entry.tasks || entry.tasks.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light">
        <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-sm border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-slate-900" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 flex-1 text-center">
              Reflection Details
            </h1>
            <div className="w-10" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No tasks found</h3>
          <p className="text-slate-600 text-center">
            This reflection doesn't have any tasks yet.
          </p>
        </div>
      </div>
    )
  }
  
  const averageEmotion = calculateEntryAverageEmotion(entry)
  const emotionEmoji = EMOTIONS[Math.round(averageEmotion) as keyof typeof EMOTIONS]?.emoji || '😐'
  
  // Group tasks by project
  const tasksByProject: Record<string, typeof entry.tasks> = {}
  entry.tasks.forEach(task => {
    if (!tasksByProject[task.projectId]) {
      tasksByProject[task.projectId] = []
    }
    tasksByProject[task.projectId].push(task)
  })

  // Card colors for different projects (cycling through colors)
  const cardColors = [
    { bg: 'bg-red-50', border: 'border-red-200' },
    { bg: 'bg-blue-50', border: 'border-blue-200' },
    { bg: 'bg-green-50', border: 'border-green-200' },
    { bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { bg: 'bg-purple-50', border: 'border-purple-200' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-sm border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 flex-1 text-center">
            Reflection Details
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Date & Overall Mood */}
        <div className="pb-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            {DateUtils.formatDate(new Date(entry.date))}
          </h2>
          <p className="text-sm text-slate-600">
            {entry.tasks.length} task{entry.tasks.length !== 1 ? 's' : ''} logged
          </p>
        </div>

        {/* Tasks Grouped by Project */}
        {Object.entries(tasksByProject).map(([projectId, tasks], index) => {
          const project = ProjectStorage.getProjectById(projectId)
          const colorScheme = cardColors[index % cardColors.length]
          
          return (
            <div 
              key={projectId}
              className={`rounded-lg overflow-hidden soft-shadow ${colorScheme.bg} border ${colorScheme.border}`}
            >
              {/* Project Header */}
              <div className="p-4 pb-3">
                <div className="flex items-center gap-2">
                  {project && (
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {project?.name || 'Unknown Project'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Logged at {DateUtils.formatTime(new Date(tasks[0].createdAt))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tasks for this project */}
              <div className="space-y-3 px-4 pb-4">
                {tasks.map((task) => {
                  const emotions = task.emotions || [task.emotion]
                  
                  return (
                    <div key={task.id} className="p-4 bg-white/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-wrap gap-1 flex-shrink-0">
                          {emotions.map((emotionLevel) => {
                            const emotion = EMOTIONS[emotionLevel]
                            return (
                              <span key={emotionLevel} className="text-2xl">{emotion?.emoji || '😐'}</span>
                            )
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-medium break-words">
                            {task.description}
                          </p>
                          {task.notes && (
                            <p className="text-sm text-slate-600 mt-2 italic break-words">
                              "{task.notes}"
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {onEditTask && (
                            <button
                              onClick={() => onEditTask(task.id)}
                              className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Edit task"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          {onDeleteTask && (
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this task?')) {
                                  onDeleteTask(task.id)
                                }
                              }}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete task"
                            >
                              <Trash2 size={18} />
                            </button>
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
    </div>
  )
}

export default EntryDetail

