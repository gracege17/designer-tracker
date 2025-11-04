import React, { useState } from 'react'
import { CaretLeft, CaretRight } from 'phosphor-react'

interface OnboardingLearningPreferenceProps {
  onComplete: (preferences: string[]) => void
  onBack?: () => void
}

const learningOptions = [
  { value: 'visual', label: 'Visual', emoji: '🧠' },
  { value: 'listening', label: 'Listening', emoji: '🎧' },
  { value: 'reading', label: 'Reading', emoji: '📖' },
  { value: 'watching', label: 'Watching', emoji: '🎥' },
  { value: 'hands-on', label: 'Hands-on', emoji: '✍️' }
]

const OnboardingLearningPreference: React.FC<OnboardingLearningPreferenceProps> = ({ onComplete, onBack }) => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])

  const togglePreference = (value: string) => {
    setSelectedPreferences(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const handleNext = () => {
    if (selectedPreferences.length > 0) {
      onComplete(selectedPreferences)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]">
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] transition-colors"
          >
            <CaretLeft size={18} weight="bold" />
            Back
          </button>
        ) : <div />}
      </header>

      <main className="flex-1 px-6 pb-8">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="space-y-3">
            <h1 className="text-[30px] font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              What’s your favorite way to learn?
            </h1>
            <p className="text-[15px] text-[var(--md-sys-color-on-surface-variant)]">
              Choose one or more learning styles. We’ll tailor insights and resources to match how you absorb information best.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {learningOptions.map(option => {
              const isSelected = selectedPreferences.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => togglePreference(option.value)}
                  className="w-full text-left transition-all duration-200"
                  style={{
                    borderRadius: 'var(--radius, 14px)',
                    border: isSelected ? '1px solid var(--color-accent, #EC5429)' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(236, 84, 41, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    boxShadow: isSelected ? '0 14px 36px rgba(236, 84, 41, 0.28)' : 'none',
                    transform: isSelected ? 'translateY(-2px)' : 'translateY(0)' }
                  }
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden>{option.emoji}</span>
                      <span
                        className="text-sm"
                        style={{ fontWeight: 'var(--font-weight-medium, 600)' }}
                      >
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="text-xs uppercase tracking-wide text-[var(--color-accent, #EC5429)]">
                        Selected
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="px-6 pb-8">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedPreferences.length === 0}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all duration-200 ${
              selectedPreferences.length === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'text-[var(--md-sys-color-on-primary)] shadow-[0_18px_44px_rgba(236,84,41,0.4)] active:scale-[0.98]'
            }`}
            style={{
              background: selectedPreferences.length === 0 ? 'rgba(255,255,255,0.08)' : 'var(--color-accent, #EC5429)',
              fontWeight: 'var(--font-weight-medium, 600)'
            }}
          >
            Next
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </footer>
    </div>
  )
}

export default OnboardingLearningPreference


