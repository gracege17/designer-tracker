import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ProjectStorage } from '../utils/storage'

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
    <div className="flex flex-col min-h-screen bg-[#FFF9F8]">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[#FFF9F8] z-10 p-5 border-b border-slate-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          
          {/* Current Project Name */}
          {firstProject && (
            <span className="text-[16px] font-bold text-slate-900">{firstProject.name}</span>
          )}

          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-[32px] font-bold text-slate-900 mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why did you feel that way?
          </h2>
          <p className="text-[16px] text-slate-700">
            Optional
          </p>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full min-h-[140px] p-4 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 resize-none"
          placeholder="e.g., The client loved the direction — felt proud!"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-[#FFF9F8] p-5">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={handleAddAnotherTask}
            className="w-full py-5 px-6 text-center bg-[#FFF9F8] border text-slate-900 font-medium text-[17px] hover:bg-slate-50 transition-all active:scale-[0.99]"
            style={{ borderColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            + Add another task
          </button>
          
          <button
            onClick={isLastProject ? handleDoneReflecting : handleNextProject}
            className="w-full py-5 px-6 font-medium text-[17px] transition-all duration-200 bg-[#000] text-white hover:bg-slate-900 active:scale-[0.98]"
          >
            {isLastProject ? "Done Reflecting" : "Next Project"}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default TaskNotes
