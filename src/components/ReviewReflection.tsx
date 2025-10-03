import React from 'react'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { EMOTIONS } from '../types'
import { ProjectStorage } from '../utils/storage'
import Button from './Button'

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

  // Card colors for different projects (cycling through them)
  const cardColors = [
    'bg-red-50 border-red-100',
    'bg-blue-50 border-blue-100', 
    'bg-green-50 border-green-100',
    'bg-purple-50 border-purple-100',
    'bg-yellow-50 border-yellow-100',
    'bg-pink-50 border-pink-100'
  ]

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background-light">
      <div className="flex-grow">
        {/* Header */}
        <header className="sticky top-0 bg-background-light/80 backdrop-blur-sm z-10 p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="text-slate-900 p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-900">
              Today's Tasks
            </h1>
            <div className="w-8"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 space-y-6">
          {Object.entries(tasksByProject).map(([projectId, projectTasks], projectIndex) => {
            const project = ProjectStorage.getProjectById(projectId)
            const cardColorClass = cardColors[projectIndex % cardColors.length]
            
            return (
              <div key={projectId} className={`${cardColorClass} rounded-xl overflow-hidden border`}>
                {/* Project Header */}
                <div className="p-4">
                  <h2 className="font-bold text-slate-900 flex items-center gap-3">
                    {project && (
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    )}
                    Project: {project?.name || 'Unknown Project'}
                  </h2>
                </div>

                {/* Tasks */}
                {projectTasks.map((task) => {
                  const emotions = task.emotions || [task.emotion]
                  
                  return (
                    <div key={task.id} className="mt-3">
                      <div className="p-4 flex items-start space-x-4">
                        <div className="flex flex-wrap gap-1">
                          {emotions.map((emotionLevel) => {
                            const emotion = EMOTIONS[emotionLevel]
                            return (
                              <span key={emotionLevel} className="text-2xl">{emotion?.emoji || '😐'}</span>
                            )
                          })}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900 mb-1">{task.description}</p>
                          {task.notes && (
                            <p className="text-slate-600 text-sm italic">"{task.notes}"</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => onEditTask(task.id)}
                            className="text-slate-500 hover:text-slate-700 p-1 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteTask(task.id)}
                            className="text-slate-500 hover:text-red-600 p-1 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No tasks to review
              </h3>
              <p className="text-slate-600">
                Go back and add some tasks to your reflection.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background-light/80 backdrop-blur-sm p-4">
        <Button
          title="Save Reflection"
          onPress={onSaveReflection}
          variant="primary"
          size="large"
          disabled={tasks.length === 0}
          className="w-full rounded-xl font-bold"
        />
      </footer>
    </div>
  )
}

export default ReviewReflection
