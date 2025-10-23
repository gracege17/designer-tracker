import React, { useState } from 'react'
import { CaretLeft } from 'phosphor-react'
import { EmotionLevel, EMOTIONS } from '../types'
import { ProjectStorage } from '../utils/storage'
import FlowerProgress from './FlowerProgress'

interface EmotionSelectionProps {
  selectedProjectIds: string[]
  initialTaskDescription?: string
  initialEmotion?: EmotionLevel[]
  onNext: (emotions: EmotionLevel[]) => void
  onBack: () => void
  taskCount?: number
}

const EmotionSelectionImproved: React.FC<EmotionSelectionProps> = ({
  selectedProjectIds,
  initialTaskDescription,
  initialEmotion = [],
  onNext,
  onBack,
  taskCount = 0
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
    <div className="flex flex-col min-h-screen bg-black">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-black z-10 p-5 border-b border-[#2B2930]">
        <div className="max-w-md mx-auto grid grid-cols-3 items-center">
          {/* Left: Back Button */}
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/[0.04] rounded-full transition-all duration-200 active:scale-95 -ml-2 justify-self-start"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
          
          {/* Center: Current Project Name */}
          {currentProject && (
            <span className="text-[16px] font-bold text-[#E6E1E5] text-center truncate px-2">{currentProject.name}</span>
          )}

          {/* Right: Counter Badge */}
          <div className="justify-self-end">
            <div className="flex items-center gap-1.5">
              <img 
                src="/images/colored-flower.png" 
                alt="flower" 
                className="w-6 h-6"
              />
              <span className="text-sm font-medium text-[#E6E1E5]">
                ({taskCount})
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8">
          {/* Flower Progress Tracker */}
          <FlowerProgress filledSteps={[true, true, true, false]} />
          
          <h2 className="text-[32px] font-normal text-[#E6E1E5] mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            How did it make you feel?
          </h2>
          <p className="text-[16px] text-[#CAC4D0]">
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
                    ? 'bg-[#FFD678]/40 border-slate-900 scale-105'
                    : 'bg-white/[0.04] border-[#3A3840] hover:border-[#4A4850] active:scale-95'
                  }
                `}
                style={{ borderRadius: '0 24px 0 0' }}
              >
                {/* Emoji */}
                <div className="mb-2 flex items-center justify-center">
                  <span className="text-3xl">{emotion.emoji}</span>
                </div>

                {/* Label */}
                <span className="text-[11px] font-medium text-[#E6E1E5] text-center leading-tight">
                  {emotion.label}
                </span>
              </button>
            )
          })}
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-black p-5">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedEmotions.length === 0}
            className={`
              w-full py-5 px-6 font-medium text-[17px] transition-all duration-200
              ${selectedEmotions.length > 0
                ? 'bg-[#EC5429] text-white hover:bg-[#F76538] active:scale-[0.98]'
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

