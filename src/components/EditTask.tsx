import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Task, EmotionLevel, EMOTIONS, Project } from '../types'
import { ProjectStorage } from '../utils/storage'
import Button from './Button'

interface EditTaskProps {
  task: Task
  entryDate: string
  onSave: (updatedTask: Task) => void
  onCancel: () => void
}

const EditTask: React.FC<EditTaskProps> = ({ task, entryDate, onSave, onCancel }) => {
  const [description, setDescription] = useState(task.description)
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionLevel[]>(
    task.emotions || [task.emotion]
  )
  const [notes, setNotes] = useState(task.notes || '')

  const project = ProjectStorage.getProjectById(task.projectId)

  const handleEmotionToggle = (emotion: EmotionLevel) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotion)) {
        return prev.filter(e => e !== emotion)
      } else {
        return [...prev, emotion]
      }
    })
  }

  const handleSave = () => {
    if (description.trim() && selectedEmotions.length > 0) {
      const updatedTask: Task = {
        ...task,
        description: description.trim(),
        emotion: selectedEmotions[0],
        emotions: selectedEmotions,
        notes: notes.trim() || undefined,
      }
      onSave(updatedTask)
    }
  }

  // All 12 emotion options
  const emotionOptions = [
    { level: 1 as EmotionLevel, emoji: '😀', label: 'Happy' },
    { level: 2 as EmotionLevel, emoji: '😌', label: 'Relaxed' },
    { level: 3 as EmotionLevel, emoji: '🤩', label: 'Excited' },
    { level: 4 as EmotionLevel, emoji: '😠', label: 'Angry' },
    { level: 5 as EmotionLevel, emoji: '😢', label: 'Sad' },
    { level: 6 as EmotionLevel, emoji: '😰', label: 'Anxious' },
    { level: 7 as EmotionLevel, emoji: '😮', label: 'Surprised' },
    { level: 8 as EmotionLevel, emoji: '😐', label: 'Bored' },
    { level: 9 as EmotionLevel, emoji: '🥹', label: 'Nostalgic' },
    { level: 10 as EmotionLevel, emoji: '⚡', label: 'Energized' },
    { level: 11 as EmotionLevel, emoji: '🙂', label: 'Normal' },
    { level: 12 as EmotionLevel, emoji: '😴', label: 'Tired' },
  ]

  const isValid = description.trim().length > 0 && selectedEmotions.length > 0

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-sm border-b border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 flex-1 text-center">
            Edit Task
          </h1>
          <div className="w-10" />
        </div>
        
        {/* Project Name */}
        <div className="flex items-center gap-2 justify-center">
          {project && (
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
          )}
          <p className="text-sm text-slate-600">
            {project?.name || 'Unknown Project'}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Task Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Task Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-400 text-slate-900 text-base"
            rows={4}
            maxLength={500}
            placeholder="What did you work on?"
          />
          <p className="text-xs text-slate-500 mt-1 text-right">
            {description.length}/500
          </p>
        </div>

        {/* Emotions */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            How did it make you feel?
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Select all that apply
          </p>
          <div className="grid grid-cols-3 gap-3">
            {emotionOptions.map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion.level)
              
              return (
                <button
                  key={emotion.level}
                  type="button"
                  onClick={() => handleEmotionToggle(emotion.level)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl shadow-sm space-y-2 
                    transition-all duration-200 hover:scale-105
                    ${isSelected 
                      ? 'bg-primary/30 ring-2 ring-primary shadow-md' 
                      : 'bg-white hover:bg-slate-50'
                    }
                  `}
                >
                  <span className="text-3xl">{emotion.emoji}</span>
                  <span className="text-xs font-medium text-slate-900">{emotion.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-400 text-slate-900 text-base"
            rows={3}
            maxLength={500}
            placeholder="Why did you feel that way?"
          />
          <p className="text-xs text-slate-500 mt-1 text-right">
            {notes.length}/500
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background-light/80 backdrop-blur-sm border-t border-slate-200 p-4 space-y-3">
        <Button
          title="Save Changes"
          onPress={handleSave}
          variant="primary"
          size="large"
          disabled={!isValid}
          className="w-full h-12 rounded-full font-bold text-lg"
        />
        <button
          onClick={onCancel}
          className="w-full py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>
      </footer>
    </div>
  )
}

export default EditTask

