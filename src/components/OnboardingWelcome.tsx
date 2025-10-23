import React from 'react'
import { Sparkle, Heart, TrendUp, BookOpen } from 'phosphor-react'
import Button from './Button'

interface OnboardingWelcomeProps {
  onGetStarted: () => void
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/20 via-background-light to-background-light">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* App Icon / Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center soft-shadow">
            <Sparkle size={48} weight="fill" className="text-slate-900" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">
          Welcome to Your
          <br />
          Design Journey
        </h1>
        
        <p className="text-lg text-slate-600 text-center mb-12 max-w-md leading-relaxed">
          A calm space to reflect on your design work and discover what brings you joy.
        </p>

        {/* Feature Cards */}
        <div className="w-full max-w-md space-y-4 mb-12">
          <div className="bg-white rounded-2xl p-5 soft-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Heart size={24} weight="fill" className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Track Your Emotions</h3>
              <p className="text-sm text-slate-600">
                Log how each task makes you feel with simple emoji selections
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 soft-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <TrendUp size={24} weight="regular" className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Discover Patterns</h3>
              <p className="text-sm text-slate-600">
                See what energizes you and what drains you over time
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 soft-shadow flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <BookOpen size={24} weight="regular" className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">3-Minute Daily Check-in</h3>
              <p className="text-sm text-slate-600">
                Quick, gentle check-ins that fit your busy life
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-8">
        <div className="bg-white rounded-2xl p-6 soft-shadow mb-4">
          <p className="text-center text-sm text-slate-600 mb-4">
            <span className="font-semibold text-slate-900">100% Private.</span> Everything stays on your device.
          </p>
          <Button 
            variant="primary" 
            size="large" 
            onPress={onGetStarted}
            className="w-full"
          >
            Get Started ✨
          </Button>
        </div>
        
        <p className="text-center text-xs text-slate-500">
          No account needed • Takes 2 minutes to set up
        </p>
      </div>
    </div>
  )
}

export default OnboardingWelcome

