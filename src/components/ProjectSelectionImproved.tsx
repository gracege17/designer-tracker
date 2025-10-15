import React, { useState } from 'react'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Project } from '../types'
import { ProjectStorage, EntryStorage } from '../utils/storage'
import { createProject } from '../utils/dataHelpers'

interface ProjectSelectionProps {
  projects: Project[]
  onProjectsSelected: (projectIds: string[]) => void
  onBack: () => void
  onAddNewProject: () => void
  onProjectDeleted?: () => void
}

const ProjectSelectionImproved: React.FC<ProjectSelectionProps> = ({ 
  projects,
  onProjectsSelected, 
  onBack, 
  onAddNewProject,
  onProjectDeleted
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [localProjects, setLocalProjects] = useState<Project[]>(projects)
  const [showAddInput, setShowAddInput] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const handleProjectToggle = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleProjectDelete = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent toggling when clicking X
    
    const project = localProjects.find(p => p.id === projectId)
    if (!project) return
    
    // Check if project has any tasks
    const entries = EntryStorage.loadEntries()
    const hasTasksInProject = entries.some(entry => 
      entry.tasks.some(task => task.projectId === projectId)
    )
    
    if (hasTasksInProject) {
      alert(`Cannot delete "${project.name}" because it has tasks.\n\nTo delete this project, first remove all its tasks from your reflections.`)
      return
    }
    
    if (window.confirm(`Delete "${project.name}" from your projects?\n\nThis cannot be undone.`)) {
      ProjectStorage.deleteProject(projectId)
      setLocalProjects(prev => prev.filter(p => p.id !== projectId))
      setSelectedProjects(prev => prev.filter(id => id !== projectId))
      
      if (onProjectDeleted) {
        onProjectDeleted()
      }
    }
  }

  const handleNext = () => {
    if (selectedProjects.length > 0) {
      onProjectsSelected(selectedProjects)
    }
  }

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      // Create new project
      const newProject = createProject(newProjectName.trim(), '#94A3B8')
      
      // Save to storage
      ProjectStorage.saveProject(newProject)
      
      // Add to local projects
      setLocalProjects(prev => [...prev, newProject])
      
      // Auto-select the new project
      setSelectedProjects(prev => [...prev, newProject.id])
      
      // Reset form
      setNewProjectName('')
      setShowAddInput(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddProject()
    } else if (e.key === 'Escape') {
      setShowAddInput(false)
      setNewProjectName('')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F6EB] slide-in-right">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[#F5F6EB] z-10 p-5">
        <div className="max-w-md mx-auto">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-2 pb-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-[32px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            What did you work on?
          </h2>
          <p className="text-[16px] text-slate-700">
            Select the projects you worked on today
          </p>
        </div>

        {/* All Projects as Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {localProjects.map((project, index) => {
            const isSelected = selectedProjects.includes(project.id)
            
            // Use orange for all selected projects
            const bgColor = isSelected ? '#FF8C42' : '#FFFFFF'

            return (
              <div
                key={project.id}
                className="flex items-center justify-between px-5 py-3 border transition-all"
                style={{ 
                  backgroundColor: bgColor, 
                  borderColor: 'rgba(0, 0, 0, 0.6)' 
                }}
              >
                <button
                  onClick={() => handleProjectToggle(project.id)}
                  className="flex-1 text-left active:scale-[0.99] transition-all"
                >
                  <span className="text-[14px] font-normal text-slate-900">
                    {project.name}
                  </span>
                </button>
                <button
                  onClick={(e) => handleProjectDelete(project.id, e)}
                  className="ml-3 p-1 hover:bg-black/10 rounded transition-all active:scale-90"
                  title="Delete project"
                >
                  <X size={20} className="text-slate-900 opacity-50" strokeWidth={2.5} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Add New Project - Inline Input or Button */}
        {showAddInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Project name"
              autoFocus
              className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 text-slate-900 text-[14px] focus:outline-none focus:border-slate-400 transition-colors"
            />
            <button
              onClick={handleAddProject}
              disabled={!newProjectName.trim()}
              className={`
                px-5 py-3 font-medium text-[14px] transition-all active:scale-[0.99]
                ${newProjectName.trim()
                  ? 'bg-[#000] text-white hover:bg-slate-900'
                  : 'bg-[#999] text-white cursor-not-allowed'
                }
              `}
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddInput(false)
                setNewProjectName('')
              }}
              className="px-5 py-3 bg-white border text-slate-900 font-medium text-[14px] hover:bg-slate-50 transition-all active:scale-[0.99]"
              style={{ borderColor: 'rgba(0, 0, 0, 0.6)' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="px-5 py-3 bg-[#000] text-white font-medium text-[16px] hover:bg-slate-900 transition-all active:scale-[0.99]"
          >
            + Project
          </button>
        )}
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-[#F5F6EB] p-5">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedProjects.length === 0}
            className={`
              w-full py-5 px-6 font-medium text-[17px] transition-all duration-200
              ${selectedProjects.length > 0
                ? 'bg-[#000] text-white hover:bg-slate-900 active:scale-[0.98]'
                : 'bg-[#999] text-white cursor-not-allowed'
              }
            `}
          >
            {selectedProjects.length > 0 
              ? `Continue with ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}`
              : 'Select at least one project'
            }
          </button>
        </div>
      </footer>
    </div>
  )
}

export default ProjectSelectionImproved

