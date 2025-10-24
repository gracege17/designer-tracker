import React, { useState, useEffect } from 'react'
import { CaretLeft, Plus, X } from 'phosphor-react'
import { Project } from '../types'
import { ProjectStorage, EntryStorage } from '../utils/storage'
import { createProject } from '../utils/dataHelpers'
import FlowerProgress from './FlowerProgress'

interface ProjectSelectionProps {
  projects: Project[]
  initialSelectedProjects?: string[]
  onProjectsSelected: (projectIds: string[]) => void
  onBack: () => void
  onAddNewProject: () => void
  onProjectDeleted?: () => void
}

const ProjectSelectionImproved: React.FC<ProjectSelectionProps> = ({ 
  projects,
  initialSelectedProjects = [],
  onProjectsSelected, 
  onBack, 
  onAddNewProject,
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
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/[0.04] rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-2 pb-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          {/* Flower Progress Tracker */}
          <FlowerProgress filledSteps={[true, false, false, false]} />
          
          <h2 className="text-[32px] font-bold text-[#E6E1E5] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            What did you work on?
          </h2>
          <p className="text-[16px] text-[#CAC4D0]">
          Select one or more projects you worked on today — for example, "Website Redesign" or "Client Dashboard".
          </p>
        </div>

        {/* All Projects as Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {localProjects.map((project, index) => {
            const isSelected = selectedProjects.includes(project.id)
            
            // Dynamic styling based on selection (Dark mode only)
            const getStyles = () => {
              if (isSelected) {
                return {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#FD654F',
                  textColor: 'text-black'
                }
              } else {
                return {
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  textColor: 'text-[#E6E1E5]'
                }
              }
            }
            
            const styles = getStyles()

            return (
              <div
                key={project.id}
                className="flex items-center justify-between px-5 py-3 border transition-all"
                style={{ 
                  backgroundColor: styles.backgroundColor, 
                  borderColor: styles.borderColor 
                }}
              >
                <button
                  onClick={() => handleProjectToggle(project.id)}
                  className="flex-1 text-left active:scale-[0.99] transition-all"
                >
                  <span className={`text-[14px] font-normal ${styles.textColor}`}>
                    {project.name}
                  </span>
                </button>
                <button
                  onClick={(e) => handleProjectDelete(project.id, e)}
                  className="ml-3 p-1 hover:bg-white/10 rounded transition-all active:scale-90"
                  title="Delete project"
                >
                  <X 
                    size={20} 
                    weight="bold"
                    className={`opacity-50 ${isSelected ? 'text-black' : styles.textColor}`}
                  />
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
              className="flex-1 px-4 py-3 bg-white/[0.04] border border-[#49454F] text-[#E6E1E5] text-[14px] placeholder:text-[#938F99] focus:outline-none focus:border-[#EC5429] transition-colors"
            />
            <button
              onClick={handleAddProject}
              disabled={!newProjectName.trim()}
              className={`
                px-5 py-3 font-medium text-[14px] transition-all active:scale-[0.99]
                ${newProjectName.trim()
                  ? 'bg-[#EC5429] text-white hover:bg-[#F76538]'
                  : 'bg-white/[0.04] text-[#938F99] cursor-not-allowed'
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
              className="px-5 py-3 bg-white/[0.04] border border-[#49454F] text-[#E6E1E5] font-medium text-[14px] hover:bg-[#36343B] transition-all active:scale-[0.99]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="px-5 py-3 bg-[#EC5429] text-white font-medium text-[16px] hover:bg-[#F76538] transition-all active:scale-[0.99]"
          >
            + Project
          </button>
        )}
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-black p-5">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedProjects.length === 0}
            className={`
              w-full py-2.5 px-4 font-medium text-[17px] transition-all duration-200
              ${selectedProjects.length > 0
                ? 'bg-[#EC5429] text-white hover:bg-[#F76538] active:scale-[0.98]'
                : 'bg-white/[0.04] text-[#938F99] cursor-not-allowed'
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

