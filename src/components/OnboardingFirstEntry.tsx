import React from 'react'
import { CheckCircle2, Smile, FileText, MessageSquare } from 'lucide-react'
import Button from './Button'

interface OnboardingFirstEntryProps {
  onStartEntry: () => void
}

const OnboardingFirstEntry: React.FC<OnboardingFirstEntryProps> = ({ onStartEntry }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-primary"></div>
          <div className="h-2 flex-1 rounded-full bg-primary"></div>
          <div className="h-2 flex-1 rounded-full bg-primary"></div>
          <div className="h-2 flex-1 rounded-full bg-primary"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow px-6 py-8">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
          You're All Set! 🎉
        </h2>
        <p className="text-slate-600 text-center mb-8 leading-relaxed">
          Let's walk through your first daily reflection. It takes just 3 minutes!
        </p>

        {/* Steps Preview */}
        <div className="space-y-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">1. Describe Your Task</h3>
                <p className="text-sm text-slate-600">
                  What did you work on today? Be brief—just a sentence or two.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Smile size={20} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">2. Pick Your Emotions</h3>
                <p className="text-sm text-slate-600">
                  How did it make you feel? Choose from 12 emotions—you can pick multiple!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">3. Add Notes (Optional)</h3>
                <p className="text-sm text-slate-600">
                  Want to reflect more? Add a quick note about why you felt that way.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-5 border border-primary/20">
          <p className="text-sm text-slate-700 text-center">
            💡 <span className="font-semibold">Pro tip:</span> There's no right or wrong way to reflect. 
            Just be honest with yourself—it's your safe space.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-8">
        <button
          onClick={onStartEntry}
          className="w-full bg-primary text-slate-900 font-bold py-4 px-6 rounded-xl text-lg soft-shadow transition-all duration-200 ease-out hover:opacity-90 hover:scale-[0.98] active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Start My First Reflection</span>
          <span>✨</span>
        </button>
        
        <p className="text-center text-xs text-slate-500 mt-4">
          You can always edit or delete reflections later
        </p>
      </div>
    </div>
  )
}

export default OnboardingFirstEntry

