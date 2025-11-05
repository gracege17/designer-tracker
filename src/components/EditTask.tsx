import React, { useState } from 'react'
import { CaretLeft } from 'phosphor-react'
import { Task, EmotionLevel, EMOTIONS, Project } from '../types'
import { ProjectStorage } from '../utils/storage'
import Button from './Button'
import ButtonIcon from './ButtonIcon'

interface EditTaskProps {
  task: Task
  entryDate: string
  onSave: (updatedTask: Task) => void
  onCancel: () => void
}

const EditTask: React.FC<EditTaskProps> = ({ task, entryDate, onSave, onCancel }) => {
  const [description, setDescription] = useState(task.description)
  
  // Initialize with existing emotions, ensuring we always have at least the primary emotion
  const initialEmotions = task.emotions && task.emotions.length > 0 
    ? task.emotions 
    : [task.emotion]
  
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionLevel[]>(initialEmotions)
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
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-[#49454F] p-4">
        <div className="flex items-center justify-between mb-4">
          <ButtonIcon
            onClick={onCancel}
            className="rounded-full hover:bg-white/[0.04] active:scale-95 opacity-100"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </ButtonIcon>
          <h1 className="text-lg font-bold text-[#E6E1E5] flex-1 text-center">
            Edit Task
          </h1>
          <div className="w-10" />
        </div>
        
        {/* Project Name */}
        <div className="flex items-center justify-center">
          <p className="text-sm text-[#CAC4D0]">
            {project?.name || 'Unknown Project'}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Task Description */}
        <div>
          <label className="block text-sm font-medium text-[#E6E1E5] mb-2">
            Task Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white/[0.04] border border-[#49454F] focus:ring-2 focus:ring-[#EC5429]/50 focus:border-[#EC5429] placeholder-[#938F99] text-[#E6E1E5] text-base focus:outline-none"
            rows={4}
            maxLength={500}
            placeholder="What did you work on?"
          />
          <p className="text-xs text-[#938F99] mt-1 text-right">
            {description.length}/500
          </p>
        </div>

        {/* Emotions */}
        <div>
          <label className="block text-sm font-medium text-[#E6E1E5] mb-2">
            How did it make you feel?
          </label>
          <p className="text-xs text-[#938F99] mb-3">
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
                  flex flex-col items-center justify-center py-4 px-2 transition-all duration-200 border-2
                  ${isSelected
                      ? 'bg-[#FFD678] border-[#EC5429] scale-105 shadow-lg' 
                      : 'bg-white/[0.04] border-[#49454F] hover:border-[#938F99] active:scale-95'
                    }
                  `}
                  style={{ borderRadius: '0 24px 0 0' }}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <span className="text-3xl">{emotion.emoji}</span>
                  </div>
                  <span className={`text-[11px] font-medium text-center leading-tight ${
                    isSelected ? 'text-slate-900' : 'text-[#E6E1E5]'
                  }`}>
                    {emotion.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[#E6E1E5] mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-white/[0.04] border border-[#49454F] focus:ring-2 focus:ring-[#EC5429]/50 focus:border-[#EC5429] placeholder-[#938F99] text-[#E6E1E5] text-base focus:outline-none"
            rows={3}
            maxLength={500}
            placeholder="Why did you feel that way?"
          />
          <p className="text-xs text-[#938F99] mt-1 text-right">
            {notes.length}/500
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-black/80 backdrop-blur-sm border-t border-[#49454F] p-4 space-y-3">
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
          className="w-full py-3 text-[#CAC4D0] font-medium hover:text-[#E6E1E5] transition-colors"
        >
          Cancel
        </button>
      </footer>
    </div>
  )
}

export default EditTask

