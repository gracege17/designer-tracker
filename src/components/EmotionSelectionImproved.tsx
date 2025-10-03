import React, { useState } from 'react'
import { ArrowLeft, Heart, Check } from 'lucide-react'
import { EmotionLevel, EMOTIONS } from '../types'
import { ProjectStorage } from '../utils/storage'

interface EmotionSelectionProps {
  selectedProjectIds: string[]
  initialTaskDescription?: string
  initialEmotion?: EmotionLevel[]
  onNext: (emotions: EmotionLevel[]) => void
  onBack: () => void
}

const EmotionSelectionImproved: React.FC<EmotionSelectionProps> = ({
  selectedProjectIds,
  initialTaskDescription,
  initialEmotion = [],
  onNext,
  onBack
}) => {
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionLevel[]>(initialEmotion)

  const handleEmotionToggle = (emotion: EmotionLevel) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    )
  }

  const handleNext = () => {
    if (selectedEmotions.length > 0) {
      onNext(selectedEmotions)
    }
  }

  // Get current project
  const currentProject = selectedProjectIds.length > 0 
    ? ProjectStorage.getProjectById(selectedProjectIds[0])
    : null

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-background-light/95 backdrop-blur-sm z-10 border-b border-slate-100">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95"
          >
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          
          {/* Current Project Name */}
          {currentProject && (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentProject.color }}
              />
              <span className="text-sm font-medium text-slate-700">{currentProject.name}</span>
            </div>
          )}

          <div className="w-8"></div>
        </div>

      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 pt-8 pb-4">
        {/* Title Section with Selected Count */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={24} className="text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">
              How did it make you feel?
            </h2>
          </div>
          
          {/* Selected Count - Above description */}
          {selectedEmotions.length > 0 ? (
            <p className="text-sm font-medium text-slate-600 emotion-bounce">
              <Check size={14} className="text-primary inline mr-1.5 align-text-bottom" />
              {selectedEmotions.length} emotion{selectedEmotions.length > 1 ? 's' : ''} selected
            </p>
          ) : (
            <p className="text-slate-600">
              Choose one or more emotions
            </p>
          )}
        </div>

        {/* Task Preview (Optional) */}
        {initialTaskDescription && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 line-clamp-2">
              "{initialTaskDescription}"
            </p>
          </div>
        )}

        {/* Emotions Grid - 3 columns, 4 rows */}
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(EMOTIONS) as EmotionLevel[]).map((emotionLevel) => {
            const emotion = EMOTIONS[emotionLevel]
            const isSelected = selectedEmotions.includes(emotionLevel)

            return (
              <button
                key={emotionLevel}
                onClick={() => handleEmotionToggle(emotionLevel)}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10 scale-105 pulse-ring'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-105 active:scale-95'
                  }
                `}
              >
                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center emotion-bounce">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Emoji - Larger and animated */}
                <span className={`
                  text-4xl mb-2 transition-all duration-300
                  ${isSelected ? 'scale-125 rotate-12' : 'scale-100 rotate-0 hover:scale-110'}
                `}>
                  {emotion.emoji}
                </span>

                {/* Label */}
                <span className={`
                  text-sm font-medium transition-colors
                  ${isSelected ? 'text-primary' : 'text-slate-700'}
                `}>
                  {emotion.label}
                </span>

                {/* Selection Glow */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                )}
              </button>
            )
          })}
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-mono-50/95 backdrop-blur-sm border-t border-mono-200 p-6">
        <button
          onClick={handleNext}
          disabled={selectedEmotions.length === 0}
          className={`
            w-full py-4 px-6 rounded-xl font-normal text-lg transition-all duration-200
            ${selectedEmotions.length > 0
              ? 'bg-mono-900 text-mono-50 hover:bg-mono-800 active:scale-[0.98]'
              : 'bg-mono-200 text-mono-400 cursor-not-allowed'
            }
          `}
        >
          {selectedEmotions.length > 0
            ? 'Continue'
            : 'Select at least one emotion'
          }
        </button>
      </footer>
    </div>
  )
}

export default EmotionSelectionImproved

