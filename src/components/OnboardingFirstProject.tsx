import React, { useState } from 'react'
import { Palette, ArrowRight } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import { PROJECT_COLORS } from '../types'

interface OnboardingFirstProjectProps {
  onComplete: (projectName: string, projectColor: string) => void
  onSkip: () => void
}

const OnboardingFirstProject: React.FC<OnboardingFirstProjectProps> = ({ onComplete, onSkip }) => {
  const [projectName, setProjectName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0])
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (!projectName.trim()) {
      setError('Please enter a project name')
      return
    }
    onComplete(projectName.trim(), selectedColor)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6EB]">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 bg-[#FFD678]" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-[#FFD678]" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-[#FFD678]" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-slate-200" style={{ borderRadius: '0 8px 0 0' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow px-6 py-8">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-[#FFD678] flex items-center justify-center mx-auto" style={{ borderRadius: '0 16px 0 0' }}>
            <Palette size={32} className="text-slate-900" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-[28px] font-bold text-slate-900 mb-3 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          Create Your First Project
        </h2>
        <p className="text-[16px] text-slate-700 text-center mb-8 leading-relaxed">
          Projects help you organize your work. Start with one you're currently working on.
        </p>

        {/* Project Name Input */}
        <div className="mb-8">
          <Input
            label="Project Name"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value)
              setError('')
            }}
            placeholder="e.g., Mobile App Redesign"
            error={error}
            autoFocus
          />
        </div>

        {/* Example Card */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-600">Preview:</p>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-full">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-slate-900 font-medium text-[15px]">
              {projectName || 'Your Project Name'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={handleContinue}
          disabled={!projectName.trim()}
          className={`w-full text-white font-bold py-5 px-6 text-[17px] transition-all duration-200 flex items-center justify-center gap-2 ${
            !projectName.trim()
              ? 'bg-[#999] cursor-not-allowed'
              : 'bg-[#000] hover:bg-slate-900 active:scale-[0.98]'
          }`}
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
        
        <button
          onClick={onSkip}
          className="w-full py-3 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
        >
          I'll add projects later
        </button>
      </div>
    </div>
  )
}

export default OnboardingFirstProject

