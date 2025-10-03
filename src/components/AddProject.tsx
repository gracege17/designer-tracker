import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Project, PROJECT_COLORS } from '../types'
import { ProjectStorage } from '../utils/storage'
import { createProject } from '../utils/dataHelpers'
import Button from './Button'
import Input from './Input'

interface AddProjectProps {
  onProjectAdded: (project: Project) => void
  onBack: () => void
}

const AddProject: React.FC<AddProjectProps> = ({ onProjectAdded, onBack }) => {
  const [projectName, setProjectName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectName.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      // Create new project
      const newProject = createProject(projectName.trim(), selectedColor)
      
      // Save to storage
      ProjectStorage.saveProject(newProject)
      
      // Notify parent component
      onProjectAdded(newProject)
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300))
      
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsSubmitting(false)
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
          Add New Project
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 pt-8 pb-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Name */}
          <div>
            <Input
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Website Redesign, Mobile App, Branding"
              required
              className="text-lg"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-4">
              Choose a Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {PROJECT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-12 h-12 rounded-full transition-all duration-200
                    ${selectedColor === color 
                      ? 'ring-4 ring-slate-300 scale-110' 
                      : 'hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {projectName.trim() && (
            <div>
              <label className="block text-lg font-semibold text-slate-800 mb-4">
                Preview
              </label>
              <div 
                className="inline-flex items-center gap-2 py-3 px-5 rounded-full text-lg font-medium soft-shadow"
                style={{ backgroundColor: selectedColor + '33' }} // 20% opacity
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-slate-800">{projectName.trim()}</span>
              </div>
            </div>
          )}
        </form>
      </main>

      {/* Footer with Save Button */}
      <footer className="p-6">
        <Button
          title={isSubmitting ? "Creating..." : "Create Project"}
          onPress={handleSubmit}
          variant="primary"
          size="large"
          disabled={!projectName.trim() || isSubmitting}
          loading={isSubmitting}
          className="w-full rounded-full font-bold text-xl"
        />
      </footer>
    </div>
  )
}

export default AddProject
