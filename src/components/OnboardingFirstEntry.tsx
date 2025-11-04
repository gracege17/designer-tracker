import React from 'react'
import { CheckCircle, Smiley, FileText, ChatCircle } from 'phosphor-react'
import Button from './Button'

interface OnboardingFirstEntryProps {
  onStartEntry: () => void
}

const OnboardingFirstEntry: React.FC<OnboardingFirstEntryProps> = ({ onStartEntry }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-[var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(236,84,41,0.35)]"></div>
          <div className="h-2 flex-1 rounded-full bg-[var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(236,84,41,0.35)]"></div>
          <div className="h-2 flex-1 rounded-full bg-[var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(236,84,41,0.35)]"></div>
          <div className="h-2 flex-1 rounded-full bg-[var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(236,84,41,0.35)]"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow px-6 py-8">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-[rgba(88,199,190,0.2)] flex items-center justify-center mx-auto" style={{ borderRadius: '0 16px 0 0' }}>
            <CheckCircle size={32} weight="regular" className="text-[#A6F4EB]" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-[28px] font-bold text-[var(--md-sys-color-on-surface)] mb-3 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          You're All Set! 🎉
        </h2>
        <p className="text-[16px] text-[var(--md-sys-color-on-surface-variant)] text-center mb-8 leading-relaxed">
          Let's walk through your first daily reflection. It takes just 3 minutes!
        </p>

        {/* Steps Preview */}
        <div className="space-y-4 mb-8">
          <div className="bg-[var(--md-sys-color-surface-container)] p-5 border border-white/10" style={{ borderRadius: '0 32px 0 0' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[rgba(175,82,222,0.24)] flex items-center justify-center flex-shrink-0" style={{ borderRadius: '0 12px 0 0' }}>
                <FileText size={20} weight="regular" className="text-[#E0B3FF]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--md-sys-color-on-surface)] mb-1">1. Describe Your Task</h3>
                <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  What did you work on today? Be brief—just a sentence or two.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--md-sys-color-surface-container)] p-5 border border-white/10" style={{ borderRadius: '0 32px 0 0' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[rgba(236,84,41,0.22)] flex items-center justify-center flex-shrink-0" style={{ borderRadius: '0 12px 0 0' }}>
                <Smiley size={20} weight="regular" className="text-[var(--md-sys-color-primary)]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--md-sys-color-on-surface)] mb-1">2. Pick Your Emotions</h3>
                <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  How did it make you feel? Choose from 12 emotions—you can pick multiple!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--md-sys-color-surface-container)] p-5 border border-white/10" style={{ borderRadius: '0 32px 0 0' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[rgba(88,199,190,0.24)] flex items-center justify-center flex-shrink-0" style={{ borderRadius: '0 12px 0 0' }}>
                <ChatCircle size={20} weight="regular" className="text-[#A6F4EB]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--md-sys-color-on-surface)] mb-1">3. Add Notes (Optional)</h3>
                <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                  Want to reflect more? Add a quick note about why you felt that way.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-[var(--md-sys-color-surface-container-high)] p-5 border border-white/10" style={{ borderRadius: '0 24px 0 0' }}>
          <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] text-center">
            💡 <span className="font-semibold text-[var(--md-sys-color-on-surface)]">Pro tip:</span> There's no right or wrong way to reflect. 
            Just be honest with yourself—it's your safe space.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-8">
        <button
          onClick={onStartEntry}
          className="w-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-semibold py-3 px-4 text-[17px] transition-all duration-200 hover:bg-[var(--md-sys-color-primary-hover)] active:scale-[0.98] flex items-center justify-center gap-2 rounded-2xl shadow-[0_20px_48px_rgba(236,84,41,0.45)]"
        >
          <span>Start My First Reflection</span>
          <span>✨</span>
        </button>
        
        <p className="text-center text-xs text-[var(--md-sys-color-on-surface-variant)] mt-4">
          You can always edit or delete reflections later
        </p>
      </div>
    </div>
  )
}

export default OnboardingFirstEntry

