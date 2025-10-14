import React, { useState } from 'react'
import { Palette, ArrowRight, Plus, X } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import { PROJECT_COLORS } from '../types'

interface OnboardingFirstProjectProps {
  onComplete: (projects: Array<{ name: string; color: string }>) => void
  onSkip: () => void
}

interface Project {
  name: string
  color: string
}

const OnboardingFirstProject: React.FC<OnboardingFirstProjectProps> = ({ onComplete, onSkip }) => {
  const [projectName, setProjectName] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')

  const handleAddProject = () => {
    if (!projectName.trim()) {
      setError('Please enter a project name')
      return
    }
    
    // Add project to list with default color
    const newProject: Project = {
      name: projectName.trim(),
      color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length]
    }
    
    setProjects([...projects, newProject])
    setProjectName('')
    setError('')
  }

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    if (projects.length === 0) {
      setError('Please add at least one project')
      return
    }
    onComplete(projects)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && projectName.trim()) {
      handleAddProject()
    }
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
          Create Your Projects
        </h2>
        <p className="text-[16px] text-slate-700 text-center mb-8 leading-relaxed">
          Add the projects you're currently working on. You can add more later.
        </p>

        {/* Project Name Input */}
        <div className="mb-4">
          <Input
            label="Project Name"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Mobile App Redesign"
            error={error}
            autoFocus
          />
        </div>

        {/* Add Project Button */}
        <button
          onClick={handleAddProject}
          disabled={!projectName.trim()}
          className={`w-full mb-6 py-3 px-4 border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-2 ${
            projectName.trim()
              ? 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]'
              : 'border-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus size={20} />
          <span className="font-medium">Add Project</span>
        </button>

        {/* Projects List */}
        {projects.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600">Your Projects ({projects.length}):</p>
            <div className="flex flex-wrap gap-2">
              {projects.map((project, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-full group hover:border-slate-300 transition-all"
                >
                  <span className="text-slate-900 font-medium text-[15px]">
                    {project.name}
                  </span>
                  <button
                    onClick={() => handleRemoveProject(index)}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                    aria-label={`Remove ${project.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={handleContinue}
          disabled={projects.length === 0}
          className={`w-full text-white font-bold py-5 px-6 text-[17px] transition-all duration-200 flex items-center justify-center gap-2 ${
            projects.length === 0
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

