import React from 'react'
import { Sparkle, Heart, TrendUp, BookOpen } from 'phosphor-react'
import Button from './Button'

interface OnboardingWelcomeProps {
  onGetStarted: () => void
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[rgba(236,84,41,0.18)] via-[var(--md-sys-color-surface)] to-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)]">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* App Icon / Logo */}
        <div className="mb-10 relative">
          <div className="w-24 h-24 rounded-3xl bg-[var(--md-sys-color-surface-container-high)] border border-white/10 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <Sparkle size={48} weight="fill" className="text-[var(--md-sys-color-primary)]" />
          </div>
          <div className="absolute -top-3 -right-3 w-9 h-9 rounded-2xl bg-[rgba(236,84,41,0.25)] flex items-center justify-center border border-white/10">
            <span className="text-xl">✨</span>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold leading-tight text-center">
          Welcome to Your
          <br />
          Design Journey
        </h1>
        
        <p className="text-lg text-[var(--md-sys-color-on-surface-variant)] text-center mb-12 max-w-md leading-relaxed">
          A calm space to reflect on your design work and discover what brings you joy.
        </p>

        {/* Feature Cards */}
        <div className="w-full max-w-md space-y-4 mb-12">
          <div className="bg-[var(--md-sys-color-surface-container)] border border-white/5 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-[rgba(236,84,41,0.18)] flex items-center justify-center flex-shrink-0">
              <Heart size={24} weight="fill" className="text-[var(--md-sys-color-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--md-sys-color-on-surface)] mb-1">Track Your Emotions</h3>
              <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                Log how each task makes you feel with simple emoji selections.
              </p>
            </div>
          </div>

          <div className="bg-[var(--md-sys-color-surface-container)] border border-white/5 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-[rgba(88,130,234,0.18)] flex items-center justify-center flex-shrink-0">
              <TrendUp size={24} weight="regular" className="text-[#98A8FF]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--md-sys-color-on-surface)] mb-1">Discover Patterns</h3>
              <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                See what energizes you and what drains you over time.
              </p>
            </div>
          </div>

          <div className="bg-[var(--md-sys-color-surface-container)] border border-white/5 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-[rgba(175,82,222,0.16)] flex items-center justify-center flex-shrink-0">
              <BookOpen size={24} weight="regular" className="text-[#E0B3FF]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--md-sys-color-on-surface)] mb-1">3-Minute Daily Check-in</h3>
              <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                Quick, gentle check-ins that fit your busy life.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-10">
        <div className="bg-[var(--md-sys-color-surface-container-high)] border border-white/5 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] mb-4">
          <p className="text-center text-sm text-[var(--md-sys-color-on-surface-variant)] mb-4">
            <span className="font-semibold text-[var(--md-sys-color-on-surface)]">100% Private.</span> Everything stays on your device.
          </p>
          <Button 
            title="Get Started ✨"
            variant="primary" 
            size="large" 
            onPress={onGetStarted}
            className="w-full bg-[var(--md-sys-color-primary)] border-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-hover)] hover:border-[var(--md-sys-color-primary-hover)] text-[var(--md-sys-color-on-primary)] font-semibold tracking-wide"
          />
        </div>
        
        <p className="text-center text-xs text-[var(--md-sys-color-on-surface-variant)]">
          No account needed • Takes 2 minutes to set up
        </p>
      </div>
    </div>
  )
}

export default OnboardingWelcome

