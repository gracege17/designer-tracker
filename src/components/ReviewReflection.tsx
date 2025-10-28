import React from 'react'
import { CaretLeft } from 'phosphor-react'
import { EMOTIONS } from '../types'
import { ProjectStorage } from '../utils/storage'

interface TaskReview {
  id: string
  projectId: string
  description: string
  emotion: 1 | 2 | 3 | 4 | 5
  notes?: string
}

interface ReviewReflectionProps {
  tasks: TaskReview[]
  onBack: () => void
  onEditTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onSaveReflection: () => void
}

const ReviewReflection: React.FC<ReviewReflectionProps> = ({
  tasks,
  onBack,
  onEditTask,
  onDeleteTask,
  onSaveReflection
}) => {
  // Group tasks by project
  const tasksByProject = tasks.reduce((acc, task) => {
    if (!acc[task.projectId]) {
      acc[task.projectId] = []
    }
    acc[task.projectId].push(task)
    return acc
  }, {} as Record<string, TaskReview[]>)

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="sticky top-0 bg-black z-10 p-5 border-b border-[#49454F]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/[0.08] rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
          <h1 className="text-[18px] font-bold text-[#E6E1E5]">
            Today's Tasks
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-6 pb-4 max-w-md mx-auto w-full overflow-y-auto">
        {Object.entries(tasksByProject).map(([projectId, projectTasks]) => {
          const project = ProjectStorage.getProjectById(projectId)
          
          return (
            <div key={projectId} className="mb-6">
              {/* Project Name */}
              <h2 className="text-[18px] font-bold text-[#E6E1E5] mb-4">
                {project?.name || 'Unknown Project'}
              </h2>

              {/* Tasks */}
              <div className="space-y-3">
                {projectTasks.map((task) => {
                  const emotions = task.emotions || [task.emotion]
                  const uniqueEmotions = Array.from(new Set(emotions))
                  
                  return (
                    <div 
                      key={task.id} 
                      className="bg-white/[0.04] p-4 cursor-pointer transition-all active:scale-[0.99] hover:bg-white/[0.08]"
                      style={{ borderRadius: '12px' }}
                      onClick={() => {
                        const action = window.confirm('What would you like to do with this task?\n\nPress OK to edit, or Cancel to delete.')
                        if (action) {
                          onEditTask(task.id)
                        } else {
                          if (window.confirm('Are you sure you want to delete this task?')) {
                            onDeleteTask(task.id)
                          }
                        }
                      }}
                    >
                      <div className="flex items-start gap-3 mb-2">
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
                                    className="w-6 h-6"
                                    style={{ filter: 'brightness(1.3) contrast(1.1)' }}
                                  />
                                ) : (
                                  <span className="text-2xl">{emotion?.emoji || '😐'}</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-[16px] font-medium text-[#E6E1E5] mb-1">{task.description}</p>
                          {task.notes && (
                            <p className="text-[14px] text-[#938F99] italic">"{task.notes}"</p>
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

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-[#E6E1E5] mb-2">
              No tasks yet
            </h3>
            <p className="text-[#938F99]">
              Start by capturing a moment from your day.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-black p-5 border-t border-[#49454F]">
        <div className="max-w-md mx-auto">
          <button
            onClick={onSaveReflection}
            disabled={tasks.length === 0}
            className={`
              w-full py-2 px-4 font-bold text-[17px] transition-all duration-200 rounded-full
              ${tasks.length > 0
                ? 'bg-[#EC5429] text-white hover:bg-[#F76538] active:scale-[0.98]'
                : 'bg-[#49454F] text-[#938F99] cursor-not-allowed'
              }
            `}
          >
            Save reflections
          </button>
        </div>
      </footer>
    </div>
  )
}

export default ReviewReflection
