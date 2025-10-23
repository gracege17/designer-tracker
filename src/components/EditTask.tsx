import React, { useState } from 'react'
import { CaretLeft } from 'phosphor-react'
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
      // Remove duplicate emotions
      const uniqueEmotions = Array.from(new Set(selectedEmotions))
      const updatedTask: Task = {
        ...task,
        description: description.trim(),
        emotion: uniqueEmotions[0],
        emotions: uniqueEmotions,
        notes: notes.trim() || undefined,
      }
      onSave(updatedTask)
    }
  }

  // Get all emotion options from EMOTIONS constant
  const emotionOptions = (Object.keys(EMOTIONS) as EmotionLevel[]).map(level => EMOTIONS[level])

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
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
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
            Pick as many as you'd like
          </p>
          <div className="grid grid-cols-4 gap-3">
            {emotionOptions.map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion.level)
              
              return (
                <button
                  key={emotion.level}
                  type="button"
                  onClick={() => handleEmotionToggle(emotion.level)}
                className={`
                  flex flex-col items-center justify-center py-4 px-2 transition-all duration-200 border
                  ${isSelected
                      ? 'bg-[#FFD678] border-slate-900 scale-105' 
                      : 'bg-white border-slate-200 hover:border-slate-300 active:scale-95'
                    }
                  `}
                  style={{ borderRadius: '0 24px 0 0' }}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <span className="text-3xl">{emotion.emoji}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-900 text-center leading-tight">
                    {emotion.label}
                  </span>
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

