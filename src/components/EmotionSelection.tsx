import React, { useState } from 'react'
import { CaretLeft } from 'phosphor-react'
import { EmotionLevel, EMOTIONS } from '../types'
import { ProjectStorage } from '../utils/storage'
import Button from './Button'

interface EmotionSelectionProps {
  selectedProjectIds: string[]
  onNext: (emotions: EmotionLevel[]) => void
  onBack: () => void
}

const EmotionSelection: React.FC<EmotionSelectionProps> = ({ 
  selectedProjectIds, 
  onNext, 
  onBack 
}) => {
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionLevel[]>([])

  // Get the first selected project for the header
  const firstProject = selectedProjectIds.length > 0 
    ? ProjectStorage.getProjectById(selectedProjectIds[0])
    : null

  const handleNext = () => {
    if (selectedEmotions.length > 0) {
      onNext(selectedEmotions)
    }
  }

  const handleEmotionToggle = (emotion: EmotionLevel) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotion)) {
        // Remove emotion if already selected
        return prev.filter(e => e !== emotion)
      } else {
        // Add emotion if not selected
        return [...prev, emotion]
      }
    })
  }

  const projectName = firstProject?.name || 'Selected Projects'
  const isMultipleProjects = selectedProjectIds.length > 1

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

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-background-light">
        <button 
          onClick={() => {
            console.log('EmotionSelection back button clicked')
            onBack()
          }}
          className="text-slate-900 p-1 hover:bg-slate-100 rounded-full transition-colors"
        >
          <CaretLeft size={24} weight="bold" />
        </button>
        <h2 className="text-lg font-bold text-center text-slate-900 flex-1 -ml-6">
          {isMultipleProjects ? `${projectName} + ${selectedProjectIds.length - 1} more` : projectName}
        </h2>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            How did it make you feel?
          </h1>
          <p className="text-sm text-slate-600">
            Pick as many as you'd like
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {emotionOptions.map((emotion) => {
            const isSelected = selectedEmotions.includes(emotion.level)
            
            return (
              <button
                key={emotion.level}
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
      </main>

      {/* Footer */}
      <footer className="p-4 pb-8 bg-background-light">
        <Button
          title="Next"
          onPress={handleNext}
          variant="primary"
          size="large"
          disabled={selectedEmotions.length === 0}
          className="w-full h-12 rounded-full font-bold text-lg"
        />
      </footer>
    </div>
  )
}

export default EmotionSelection
