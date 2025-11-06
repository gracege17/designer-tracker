import React, { useState } from 'react'
import { CaretLeft } from 'phosphor-react'
import ButtonPrimaryCTA from './ButtonPrimaryCTA'
import ButtonSecondary from './ButtonSecondary'
import { Heading1, BodyTextPrimary, BodyTextSecondary, AlertSuccess } from './Typography'
import { Project } from '../types'
import { ProjectStorage } from '../utils/storage'
import { createProject } from '../utils/dataHelpers'

interface AddProjectProps {
  onProjectAdded: (project: Project) => void
  onBack: () => void
}

const AddProject: React.FC<AddProjectProps> = ({ onProjectAdded, onBack }) => {
  const [projectName, setProjectName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastProjectName, setLastProjectName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectName.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      // Create new project with default color
      const newProject = createProject(projectName.trim(), '#94A3B8')
      
      // Save to storage
      ProjectStorage.saveProject(newProject)
      
      // Notify parent component
      onProjectAdded(newProject)
      
      // Store the project name and show success
      setLastProjectName(projectName.trim())
      setShowSuccess(true)
      
      // Clear the form
      setProjectName('')
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
      
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDone = () => {
    onBack()
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9F8]">
      {/* Header */}
      <header className="sticky top-0 bg-[#FFF9F8] z-10 p-5 border-b border-slate-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
          <Heading1>
            Add New Project
          </Heading1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-6 pb-32 max-w-md mx-auto w-full overflow-y-auto">
        {/* Success Message */}
        {showSuccess && (
          <AlertSuccess className="mb-4 p-4 bg-green-50 border border-green-200 animate-fade-in">
            ✓ "{lastProjectName}" added successfully!
          </AlertSuccess>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block mb-2">
              <BodyTextPrimary as="span" className="block mb-2">
                Project Name
              </BodyTextPrimary>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Website Redesign"
                required
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-[16px] focus:outline-none focus:border-slate-400 transition-colors"
              />
            </label>
            <BodyTextSecondary className="mt-2">
              Add one project at a time. Click Done when finished.
            </BodyTextSecondary>
          </div>
        </form>
      </main>

      {/* Footer with Save Button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#FFF9F8] p-5 border-t border-slate-200">
        <div className="max-w-md mx-auto space-y-3">
          {/* Primary CTA - Create Project */}
          <ButtonPrimaryCTA
            onClick={handleSubmit}
            disabled={!projectName.trim() || isSubmitting}
            className={!projectName.trim() || isSubmitting ? 'bg-[#999] hover:bg-[#999] cursor-not-allowed' : ''}
          >
            {isSubmitting ? 'Creating...' : '+ Add Project'}
          </ButtonPrimaryCTA>

          {/* Secondary Action - Done */}
          <button
            onClick={handleDone}
            className="w-full py-5 px-6 text-center bg-[#FFF9F8] border text-slate-900 font-medium text-[17px] hover:bg-slate-50 transition-all active:scale-[0.99]"
            style={{ borderColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            Done
          </button>
        </div>
      </footer>
    </div>
  )
}

export default AddProject
