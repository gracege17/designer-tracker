import React, { useState } from 'react'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Project } from '../types'
import { ProjectStorage } from '../utils/storage'
import Button from './Button'

interface ProjectSelectionProps {
  projects: Project[]
  onProjectsSelected: (projectIds: string[]) => void
  onBack: () => void
  onAddNewProject: () => void
  onProjectDeleted: () => void
}

const ProjectSelection: React.FC<ProjectSelectionProps> = ({ 
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
    event.stopPropagation() // Prevent project selection
    setEditingProject(project.id)
    setEditingName(project.name)
  }

  const handleSaveEdit = (projectId: string) => {
    if (editingName.trim() && editingName.trim() !== '') {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        const updatedProject = { ...project, name: editingName.trim() }
        ProjectStorage.saveProject(updatedProject)
        onProjectDeleted() // Refresh projects list
      }
    }
    setEditingProject(null)
    setEditingName('')
  }

  const handleCancelEdit = () => {
    setEditingProject(null)
    setEditingName('')
  }

  const handleDeleteProject = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent project selection when clicking delete
    
    // Show confirmation
    if (window.confirm('Delete this project? This can\'t be undone.')) {
      // Remove from selected projects if it was selected
      setSelectedProjects(prev => prev.filter(id => id !== projectId))
      
      // Delete from storage
      ProjectStorage.deleteProject(projectId)
      
      // Notify parent to refresh projects list
      onProjectDeleted()
    }
  }

  const handleNext = () => {
    if (selectedProjects.length > 0) {
      onProjectsSelected(selectedProjects)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-semibold text-center flex-grow text-slate-900">
          Today's Reflection
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 pt-8 pb-4">
        <h2 className="text-3xl font-semibold mb-6 text-slate-900">
          Which projects did you work on today?
        </h2>
        
        {/* Project Selection */}
        <div className="flex flex-wrap gap-4 mb-8">
          {projects.map((project) => {
            const isSelected = selectedProjects.includes(project.id)
            const isEditing = editingProject === project.id
            
            return (
              <div key={project.id} className="relative">
                {/* Delete Button - Always visible on top */}
                <button
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-400 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 shadow-sm"
                  title={`Delete ${project.name}`}
                >
                  <X size={12} />
                </button>

                {isEditing ? (
                  /* Edit Mode */
                  <div className="flex items-center gap-3 py-4 px-6 rounded-full bg-white border border-primary soft-shadow">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleSaveEdit(project.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(project.id)
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                      className="bg-transparent text-lg font-medium text-slate-900 outline-none min-w-0 flex-1"
                      autoFocus
                      maxLength={50}
                    />
                  </div>
                ) : (
                  /* Display Mode */
                  <button
                    onClick={() => handleProjectToggle(project.id)}
                    onDoubleClick={(e) => handleEditProject(project, e)}
                    className={`
                      flex items-center gap-3 py-4 px-6 rounded-full text-lg font-medium 
                      soft-shadow hover:shadow-md transition-all duration-200
                      ${isSelected 
                        ? 'bg-white border text-slate-900 shadow-md' 
                        : 'bg-white/80 border border-slate-200 text-slate-800 hover:bg-white hover:shadow-lg'
                      }
                    `}
                    style={{
                      borderColor: isSelected ? project.color : undefined,
                      boxShadow: isSelected ? `0 0 0 1px ${project.color}40` : undefined
                    }}
                    title="Double-tap to edit project name"
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{project.name}</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Add New Project Button */}
        <button 
          onClick={onAddNewProject}
          className="flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
        >
          <Plus size={20} />
          <span>Add new project</span>
        </button>
      </main>

      {/* Footer with Next Button */}
      <footer className="p-6">
        <Button
          title="Next"
          onPress={handleNext}
          variant="primary"
          size="large"
          disabled={selectedProjects.length === 0}
          className="w-full rounded-full font-bold text-xl"
          emoji="→"
        />
      </footer>
    </div>
  )
}

export default ProjectSelection
