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
    <div className="min-h-screen flex flex-col bg-background-light">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-primary"></div>
          <div className="h-2 flex-1 rounded-full bg-primary"></div>
          <div className="h-2 flex-1 rounded-full bg-primary"></div>
          <div className="h-2 flex-1 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow px-6 py-8">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
            <Palette size={32} className="text-primary" />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
          Create Your First Project
        </h2>
        <p className="text-slate-600 text-center mb-8 leading-relaxed">
          Projects help you organize your work. Start with one you're currently working on.
        </p>

        {/* Project Name Input */}
        <div className="mb-6">
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

        {/* Color Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Choose a Color
          </label>
          <div className="grid grid-cols-6 gap-3">
            {PROJECT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-full aspect-square rounded-xl transition-all duration-200 ${
                  selectedColor === color
                    ? 'ring-4 ring-primary ring-offset-2 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Example Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4" style={{ borderLeftColor: selectedColor }}>
          <p className="text-sm font-medium text-slate-600 mb-2">Preview:</p>
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-slate-900 font-semibold">
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
          className={`w-full bg-primary text-slate-900 font-bold py-4 px-6 rounded-xl text-lg soft-shadow transition-all duration-200 ease-out flex items-center justify-center gap-2 ${
            !projectName.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90 hover:scale-[0.98] active:scale-95'
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

