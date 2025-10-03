import React, { useState } from 'react'
import { ArrowLeft, Plus, X, Check, Sparkles } from 'lucide-react'
import { Project } from '../types'
import { ProjectStorage } from '../utils/storage'

interface ProjectSelectionProps {
  projects: Project[]
  onProjectsSelected: (projectIds: string[]) => void
  onBack: () => void
  onAddNewProject: () => void
  onProjectDeleted: () => void
}

const ProjectSelectionImproved: React.FC<ProjectSelectionProps> = ({ 
  projects,
  onProjectsSelected, 
  onBack, 
  onAddNewProject,
  onProjectDeleted
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleProjectToggle = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleEditProject = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditingProject(project.id)
    setEditingName(project.name)
  }

  const handleSaveEdit = (projectId: string) => {
    if (editingName.trim()) {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        const updatedProject = { ...project, name: editingName.trim() }
        ProjectStorage.saveProject(updatedProject)
        onProjectDeleted()
      }
    }
    setEditingProject(null)
    setEditingName('')
  }

  const handleDeleteProject = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    if (window.confirm('Delete this project? This cannot be undone.')) {
      setSelectedProjects(prev => prev.filter(id => id !== projectId))
      ProjectStorage.deleteProject(projectId)
      onProjectDeleted()
    }
  }

  const handleNext = () => {
    if (selectedProjects.length > 0) {
      onProjectsSelected(selectedProjects)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light slide-in-right">
      {/* Sticky Header with Progress */}
      <header className="sticky top-0 bg-background-light/95 backdrop-blur-sm z-10 border-b border-slate-100">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95"
          >
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          

          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 pt-6 pb-4">
        {/* Title with Icon */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={24} className="text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">
              What did you work on?
            </h2>
          </div>
          <p className="text-slate-600">
            Select the projects you worked on today
          </p>
        </div>


        {/* Projects Grid */}
        <div className="space-y-3 mb-6">
          {projects.map((project) => {
            const isSelected = selectedProjects.includes(project.id)
            const isEditing = editingProject === project.id

            return (
              <div
                key={project.id}
                onClick={() => !isEditing && handleProjectToggle(project.id)}
                className={`
                  relative group cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200
                  ${isSelected 
                    ? 'bg-primary/5 border-primary shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div className={`
                    flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-slate-300 group-hover:border-primary/50'
                    }
                  `}>
                    {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>

                  {/* Color Dot */}
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white"
                    style={{ backgroundColor: project.color }}
                  />

                  {/* Project Name */}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleSaveEdit(project.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(project.id)
                        if (e.key === 'Escape') {
                          setEditingProject(null)
                          setEditingName('')
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="flex-1 text-base font-semibold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    />
                  ) : (
                    <span
                      className="flex-1 text-base font-semibold text-slate-900"
                      onDoubleClick={(e) => handleEditProject(project, e)}
                    >
                      {project.name}
                    </span>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-100">
                    <button
                      onClick={(e) => handleEditProject(project, e)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit project name"
                    >
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <X size={16} className="text-slate-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Add New Project Button */}
        <button
          onClick={onAddNewProject}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-slate-600 hover:text-primary font-medium"
        >
          <Plus size={20} />
          <span>Add new project</span>
        </button>

        {/* Helper Text */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Tip: Double-tap a project name to edit it
        </p>
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-mono-50/95 backdrop-blur-sm border-t border-mono-200 p-6">
        <button
          onClick={handleNext}
          disabled={selectedProjects.length === 0}
          className={`
            w-full py-4 px-6 rounded-xl font-normal text-lg transition-all duration-200
            ${selectedProjects.length > 0
              ? 'bg-mono-900 text-mono-50 hover:bg-mono-800 active:scale-[0.98]'
              : 'bg-mono-200 text-mono-400 cursor-not-allowed'
            }
          `}
        >
          {selectedProjects.length > 0 
            ? `Continue with ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}`
            : 'Select at least one project'
          }
        </button>
      </footer>
    </div>
  )
}

export default ProjectSelectionImproved

