import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
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
    <div className="flex flex-col min-h-screen bg-[#F5F6EB]">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[#F5F6EB] z-10 p-5 border-b border-slate-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          
          {/* Current Project Name */}
          {currentProject && (
            <span className="text-[16px] font-bold text-slate-900">{currentProject.name}</span>
          )}

          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-[32px] font-bold text-slate-900 mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            How did it make you feel?
          </h2>
          <p className="text-[16px] text-slate-700">
            Describe what you accomplished today
          </p>
        </div>

        {/* Emotions Grid - 4 columns */}
        <div className="grid grid-cols-4 gap-3">
          {(Object.keys(EMOTIONS) as EmotionLevel[]).map((emotionLevel) => {
            const emotion = EMOTIONS[emotionLevel]
            const isSelected = selectedEmotions.includes(emotionLevel)

            return (
              <button
                key={emotionLevel}
                onClick={() => handleEmotionToggle(emotionLevel)}
                className={`
                  flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-200
                  ${isSelected
                    ? 'bg-slate-400 scale-105'
                    : 'bg-[#D1D5DB] hover:bg-slate-300 active:scale-95'
                  }
                `}
              >
                {/* Emoji circle placeholder - will show actual emoji */}
                <div className="w-12 h-12 rounded-full bg-white/30 mb-2 flex items-center justify-center">
                  <span className="text-2xl">{emotion.emoji}</span>
                </div>

                {/* Label */}
                <span className="text-[11px] font-medium text-slate-900 text-center">
                  {emotion.label}
                </span>
              </button>
            )
          })}
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-[#F5F6EB] p-5">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedEmotions.length === 0}
            className={`
              w-full py-5 px-6 font-medium text-[17px] transition-all duration-200
              ${selectedEmotions.length > 0
                ? 'bg-[#000] text-white hover:bg-slate-900 active:scale-[0.98]'
                : 'bg-[#999] text-white cursor-not-allowed'
              }
            `}
          >
            {selectedEmotions.length > 0
              ? 'Continue'
              : 'Select at least one emotion'
            }
          </button>
        </div>
      </footer>
    </div>
  )
}

export default EmotionSelectionImproved

