import React, { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { ProjectStorage } from '../utils/storage'
import Button from './Button'

interface TaskNotesProps {
  selectedProjectIds: string[]
  onAddAnotherTask: (notes?: string) => void
  onNextProject: (notes?: string) => void
  onDoneReflecting: (notes?: string) => void
  onBack: () => void
  isLastProject?: boolean
}

const TaskNotes: React.FC<TaskNotesProps> = ({ 
  selectedProjectIds, 
  onAddAnotherTask,
  onNextProject,
  onDoneReflecting,
  onBack,
  isLastProject = false
}) => {
  const [notes, setNotes] = useState('')

  // Get the first selected project for the header
  const firstProject = selectedProjectIds.length > 0 
    ? ProjectStorage.getProjectById(selectedProjectIds[0])
    : null

  const handleAddAnotherTask = () => {
    onAddAnotherTask(notes.trim() || undefined)
  }

  const handleNextProject = () => {
    onNextProject(notes.trim() || undefined)
  }

  const handleDoneReflecting = () => {
    onDoneReflecting(notes.trim() || undefined)
  }

  const projectName = firstProject?.name || 'Selected Projects'
  const isMultipleProjects = selectedProjectIds.length > 1

  return (
    <div className="flex flex-col justify-between min-h-screen bg-background-light">
      <div className="p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="text-slate-900 p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          {firstProject && (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: firstProject.color }}
              />
              <span className="text-sm font-medium text-slate-700">{firstProject.name}</span>
            </div>
          )}
          <div className="w-8"></div>
        </header>

        {/* Main Content */}
        <main>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Why did you feel that way?
          </h1>
          <p className="text-slate-500 mb-8">
            Optional
          </p>
          <textarea
            className="w-full min-h-[140px] p-4 bg-slate-50 border-none rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:outline-none soft-shadow resize-none"
            placeholder="e.g., The client loved the direction — felt proud!"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
          />
          <div className="text-right mt-2">
            <span className="text-sm text-slate-500">
              {notes.length}/1000 characters
            </span>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="p-6 space-y-4">
        <button
          onClick={handleAddAnotherTask}
          className="w-full py-4 text-center rounded-lg bg-slate-50 text-slate-900 font-bold soft-shadow hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          <span>Add Another Task</span>
        </button>
        
        <Button
          title={isLastProject ? "Done Reflecting" : "Next Project →"}
          onPress={isLastProject ? handleDoneReflecting : handleNextProject}
          variant="primary"
          size="large"
          className="w-full rounded-lg font-bold"
        />
      </footer>
    </div>
  )
}

export default TaskNotes
