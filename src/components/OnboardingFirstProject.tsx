import React, { useState } from 'react'
import { CaretLeft, X, Plus } from 'phosphor-react'
import { PROJECT_COLORS } from '../types'

interface OnboardingFirstProjectProps {
  userName: string
  onComplete: (projects: Array<{ name: string; color: string }>) => void
  onSkip: () => void
  onBack?: () => void
}

interface Project {
  name: string
  color: string
}

const OnboardingFirstProject: React.FC<OnboardingFirstProjectProps> = ({ userName, onComplete, onSkip, onBack }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [showAddInput, setShowAddInput] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAddProject = () => {
    const trimmedName = newProjectName.trim()
    
    if (!trimmedName) {
      setError('Please enter a project name')
      return
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = projects.some(
      p => p.name.toLowerCase() === trimmedName.toLowerCase()
    )

    if (isDuplicate) {
      setError('A project with this name already exists')
      return
    }

    const newProject: Project = {
      name: trimmedName,
      color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length]
    }

    setProjects(prev => [...prev, newProject])
    setNewProjectName('')
    setShowAddInput(false)
    setError(null)
  }

  const handleRemoveProject = (index: number) => {
    setProjects(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddProject()
    } else if (e.key === 'Escape') {
      setShowAddInput(false)
      setNewProjectName('')
      setError(null)
    }
  }

  const handleContinue = () => {
    if (projects.length > 0) {
      onComplete(projects)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-[var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(236,84,41,0.35)]"></div>
          <div className="h-2 flex-1 rounded-full bg-[var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(236,84,41,0.35)]"></div>
          <div className="h-2 flex-1 rounded-full bg-[var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(236,84,41,0.35)]"></div>
          <div className="h-2 flex-1 rounded-full bg-white/10"></div>
        </div>
      </div>

      {/* Back Button */}
      {onBack && (
        <div className="px-6 pt-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] transition-colors"
          >
            <CaretLeft size={24} weight="bold" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-grow px-6 py-8">
        {/* Title & Description */}
        <h2 className="text-[28px] font-bold text-[var(--md-sys-color-on-surface)] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          What did you work on?
        </h2>
        <p className="text-[16px] text-[var(--md-sys-color-on-surface-variant)] mb-8 leading-relaxed">
          Select one or more projects you worked on today — for example, "Website Redesign" or "Client Dashboard".
        </p>

        {/* Project Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-full"
            >
              <span className="text-[15px] text-[var(--md-sys-color-on-surface)]">
                {project.name}
              </span>
              <button
                onClick={() => handleRemoveProject(index)}
                className="p-1 text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Project Button / Input */}
        {showAddInput ? (
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => {
                  setNewProjectName(e.target.value)
                  setError(null)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Project name"
                maxLength={24}
                autoFocus
                className="w-full px-4 py-3 bg-white/[0.04] border border-[#49454F] focus:border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-surface)] text-[15px] rounded-lg outline-none transition-colors"
              />
              <p className={`text-xs mt-1 ml-1 ${
                newProjectName.length === 24 ? 'text-[var(--md-sys-color-primary)]' : 'text-[var(--md-sys-color-on-surface-variant)]'
              }`}>
                {newProjectName.length}/24
              </p>
              {error && (
                <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowAddInput(false)
                  setNewProjectName('')
                  setError(null)
                }}
                className="px-4 py-2 text-[var(--md-sys-color-on-surface-variant)] border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                disabled={!newProjectName.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  newProjectName.trim()
                    ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:opacity-90'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] font-semibold rounded-lg shadow-[0_12px_30px_rgba(236,84,41,0.3)] hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Plus size={20} weight="bold" />
            <span>Project</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-8 space-y-3">
        <button
          onClick={handleContinue}
          disabled={projects.length === 0}
          className={`w-full font-semibold py-3 px-4 text-[17px] rounded-2xl transition-all duration-200 ${
            projects.length === 0
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-[0_18px_44px_rgba(236,84,41,0.4)] hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          {projects.length === 0 ? 'Select at least one project' : 'Next'}
        </button>
        <button
          onClick={onSkip}
          className="w-full py-3 px-4 text-[15px] text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

export default OnboardingFirstProject
