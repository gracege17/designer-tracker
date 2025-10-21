import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { EmotionLevel, EMOTIONS } from '../types'
import { ProjectStorage } from '../utils/storage'
import { useTheme } from '../context/ThemeContext'
import FlowerProgress from './FlowerProgress'

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
  const { theme } = useTheme()

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
    <div className="flex flex-col min-h-screen bg-[#FFF9F8] dark:bg-[#1C1B1F]">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[#FFF9F8] dark:bg-[#1C1B1F] z-10 p-5 border-b border-slate-200 dark:border-[#2B2930]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2B2930] rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <ArrowLeft size={24} className="text-slate-900 dark:text-[#E6E1E5]" />
          </button>
          
          {/* Current Project Name */}
          {currentProject && (
            <span className="text-[16px] font-bold text-slate-900 dark:text-[#E6E1E5]">{currentProject.name}</span>
          )}

          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8">
          {/* Flower Progress Tracker */}
          <FlowerProgress filledSteps={[true, true, true, false]} />
          
          <h2 className="text-[32px] font-normal text-slate-900 dark:text-[#E6E1E5] mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            How did it make you feel?
          </h2>
          <p className="text-[16px] text-slate-700 dark:text-[#CAC4D0]">
            Pick as many as you'd like
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
                  flex flex-col items-center justify-center py-4 px-2 transition-all duration-200 border
                  ${isSelected
                    ? 'bg-[#FFD678] dark:bg-[#FFD678]/40 border-slate-900 dark:border-slate-900 scale-105'
                    : 'bg-white dark:bg-[#2B2930] border-slate-200 dark:border-[#3A3840] hover:border-slate-300 dark:hover:border-[#4A4850] active:scale-95'
                  }
                `}
                style={{ borderRadius: '0 24px 0 0' }}
              >
                {/* Emoji */}
                <div className="mb-2 flex items-center justify-center">
                  <span className="text-3xl">{emotion.emoji}</span>
                </div>

                {/* Label */}
                <span className="text-[11px] font-medium text-slate-900 dark:text-[#E6E1E5] text-center leading-tight">
                  {emotion.label}
                </span>
              </button>
            )
          })}
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-[#FFF9F8] dark:bg-[#1C1B1F] p-5">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedEmotions.length === 0}
            className={`
              w-full py-5 px-6 font-medium text-[17px] transition-all duration-200
              ${selectedEmotions.length > 0
                ? 'bg-[#F37E58] text-slate-900 dark:text-white hover:bg-[#E66A44] dark:hover:bg-[#AF4336] active:scale-[0.98]'
                : 'bg-[#999] text-white cursor-not-allowed'
              }
            `}
          >
            {selectedEmotions.length > 0
              ? 'Continue'
              : 'Pick an emotion to continue'
            }
          </button>
        </div>
      </footer>
    </div>
  )
}

export default EmotionSelectionImproved

