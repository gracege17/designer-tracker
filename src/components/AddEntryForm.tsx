import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { TaskType, EmotionLevel, TASK_TYPE_LABELS, EMOTIONS } from '../types'
import { ProjectStorage } from '../utils/storage'
import EmotionPicker from './EmotionPicker'
import Button from './Button'
import Input from './Input'

interface AddEntryFormProps {
  onSubmit: (entry: { 
    project: string
    taskName: string
    taskType: TaskType
    emotion: EmotionLevel
    notes?: string
  }) => void
  onCancel: () => void
  selectedProjectIds?: string[]
  initialTaskDescription?: string
  initialEmotion?: EmotionLevel | null
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({ 
  onSubmit, 
  onCancel, 
  selectedProjectIds = [], 
  initialTaskDescription = '',
  initialEmotion = null
}) => {
  const [project, setProject] = useState('')
  const [taskName, setTaskName] = useState(initialTaskDescription)
  const [taskType, setTaskType] = useState<TaskType | ''>('')
  const [emotion, setEmotion] = useState<EmotionLevel | undefined>(initialEmotion || undefined)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get selected projects from storage
  const selectedProjects = selectedProjectIds
    .map(id => ProjectStorage.getProjectById(id))
    .filter(Boolean)

  // Get task types from the types file
  const taskTypes: TaskType[] = [
    'wireframing',
    'user-research', 
    'visual-design',
    'prototyping',
    'user-testing',
    'design-system',
    'meetings',
    'feedback-review',
    'documentation',
    'other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (project && taskName && taskType && emotion && !isSubmitting) {
      setIsSubmitting(true)
      
      // Add a small delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onSubmit({ 
        project, 
        taskName, 
        taskType: taskType as TaskType, 
        emotion,
        notes: notes.trim() || undefined
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background-light">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-background-light border-b border-slate-200/50">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Add New Reflection
          </h1>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-3">
              Choose Project for this Task
            </label>
            <div className="space-y-2">
              {selectedProjects.map((projectOption) => (
                <button
                  key={projectOption.id}
                  type="button"
                  onClick={() => setProject(projectOption.name)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors soft-shadow ${
                    project === projectOption.name
                      ? 'border-primary bg-primary/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: projectOption.color }}
                    />
                    <span className="font-medium text-slate-800">
                      {projectOption.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Task Name */}
          <div>
            <Input
              label="Task Description"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What did you work on?"
              required
            />
          </div>

          {/* Task Type Selection */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-3">
              Task Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {taskTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTaskType(type)}
                  className={`p-3 rounded-lg border-2 transition-colors text-left soft-shadow ${
                    taskType === type
                      ? 'border-primary bg-primary/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-800">
                    {TASK_TYPE_LABELS[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Emotion Display (Read-only since selected in previous step) */}
          {emotion && (
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-3">
                How it made you feel
              </label>
              <div className="bg-primary/10 rounded-lg p-4 soft-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{EMOTIONS[emotion].emoji}</span>
                  <span className="text-lg font-medium text-slate-800">
                    {EMOTIONS[emotion].label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Optional Notes */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-3">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional thoughts about this task?"
              rows={3}
              className="w-full p-4 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none text-slate-800 resize-none soft-shadow"
              maxLength={1000}
            />
            <p className="text-sm text-slate-500 mt-1">
              {notes.length}/1000 characters
            </p>
          </div>
        </form>
      </main>

      {/* Submit Button */}
      <div className="p-6 bg-background-light border-t border-slate-200/50">
        <Button
          title={isSubmitting ? "Saving..." : "Save Reflection"}
          onPress={handleSubmit}
          variant="primary"
          size="large"
          disabled={!project || !taskName || !taskType || !emotion || isSubmitting}
          loading={isSubmitting}
          className="w-full rounded-full font-bold"
        />
      </div>
    </div>
  )
}

export default AddEntryForm

