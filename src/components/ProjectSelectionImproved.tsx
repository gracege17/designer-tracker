import React, { useState, useEffect } from 'react'
import { CaretLeft, X } from 'phosphor-react'
import ButtonPrimaryCTA from './ButtonPrimaryCTA'
import ButtonSecondary from './ButtonSecondary'
import ButtonIcon from './ButtonIcon'
import TagDismissible from './TagDismissible'
import { Project } from '../types'
import { ProjectStorage, EntryStorage } from '../utils/storage'
import { createProject } from '../utils/dataHelpers'

interface ProjectSelectionProps {
  projects: Project[]
  initialSelectedProjects?: string[]
  onProjectsSelected: (projectIds: string[]) => void
  onBack: () => void
  onProjectDeleted?: () => void
}

const ProjectSelectionImproved: React.FC<ProjectSelectionProps> = ({ 
  projects,
  initialSelectedProjects = [],
  onProjectsSelected, 
  onBack, 
  onProjectDeleted
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>(initialSelectedProjects)
  const [localProjects, setLocalProjects] = useState<Project[]>(projects)
  const [showAddInput, setShowAddInput] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  // Update local projects when projects prop changes (e.g., after adding a new project)
  useEffect(() => {
    setLocalProjects(projects)
  }, [projects])

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
    <div className="flex flex-col min-h-screen bg-black slide-in-right">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-black z-10 p-5">
        <div className="max-w-md mx-auto">
          <ButtonIcon
            onClick={onBack}
            className="-ml-2 rounded-full hover:bg-white/[0.04] active:scale-95 opacity-100"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </ButtonIcon>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-2 pb-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-[32px] font-bold text-[#E6E1E5] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            What did you work on?
          </h2>
          <p className="text-[16px] text-[#CAC4D0]">
          Select one or more projects you worked on today — for example, "Website Redesign" or "Client Dashboard".
          </p>
        </div>

        {/* All Projects as Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {localProjects.map((project) => {
            const isSelected = selectedProjects.includes(project.id)

            const handleTagClick = () => {
              handleProjectToggle(project.id)
            }

            const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
              handleProjectDelete(project.id, event)
            }

            const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleProjectToggle(project.id)
              }
            }
 
            return (
              <TagDismissible
                key={project.id}
                label={project.name}
                onClick={handleTagClick}
                onKeyDown={handleKeyDown}
                aria-pressed={isSelected}
                onRemove={handleRemove}
                className={`w-full transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC5429]/60 ${
                  isSelected
                    ? 'bg-[#EC5429]/20 backdrop-blur-sm shadow-lg shadow-[#EC5429]/10 hover:bg-[#EC5429]/30'
                    : 'bg-white/[0.08] backdrop-blur-sm shadow-md hover:bg-white/[0.12]'
                }`}
                labelClassName={`text-[14px] transition-colors ${
                  isSelected ? 'text-[#EC5429]' : 'text-[#E6E1E5] font-normal'
                }`}
                removeButtonClassName={`${
                  isSelected ? 'text-[#EC5429]' : 'text-[#E6E1E5]'
                } opacity-50`}
              />
            )
          })}
        </div>

        {/* Add New Project - Inline Input or Button */}
        {showAddInput ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Project name"
              autoFocus
              className="w-full px-4 py-3 bg-white/[0.04] border border-[#49454F] text-[#E6E1E5] text-[14px] placeholder:text-[#938F99] focus:outline-none focus:border-[#EC5429] transition-colors"
            />
            <div className="flex gap-2 justify-end">
              <ButtonPrimaryCTA
                onClick={handleAddProject}
                disabled={!newProjectName.trim()}
                className={`w-auto px-5 py-3 text-[14px] active:scale-[0.99] ${newProjectName.trim() ? '' : 'bg-white/[0.04] text-[#938F99] cursor-not-allowed hover:bg-white/[0.04]'}`}
              >
                Add
              </ButtonPrimaryCTA>
              <ButtonSecondary
                onClick={() => {
                  setShowAddInput(false)
                  setNewProjectName('')
                }}
                className="w-auto px-5 py-3 border-[#49454F] hover:bg-[#36343B]"
              >
                Cancel
              </ButtonSecondary>
            </div>
          </div>
        ) : (
          <ButtonPrimaryCTA
            onClick={() => setShowAddInput(true)}
            className="w-auto px-5 py-3 text-[16px] active:scale-[0.99]"
          >
            + Project
          </ButtonPrimaryCTA>
        )}
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-black p-5">
        <div className="max-w-md mx-auto">
          <ButtonPrimaryCTA
            onClick={handleNext}
            disabled={selectedProjects.length === 0}
            className={selectedProjects.length === 0 ? 'bg-white/[0.04] text-[#938F99] cursor-not-allowed hover:bg-white/[0.04]' : ''}
          >
            {selectedProjects.length > 0 
              ? `Continue with ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}`
              : 'Select at least one project'
            }
          </ButtonPrimaryCTA>
        </div>
      </footer>
    </div>
  )
}

export default ProjectSelectionImproved

