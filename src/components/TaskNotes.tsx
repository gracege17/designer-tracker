import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ProjectStorage } from '../utils/storage'
import { useTheme } from '../context/ThemeContext'
import FlowerProgress from './FlowerProgress'

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
  const { theme } = useTheme()

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
    <div className="flex flex-col min-h-screen bg-[#FFF9F8] dark:bg-[#1C1B1F]">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[#FFF9F8] dark:bg-[#1C1B1F] z-10 p-5 border-b border-slate-200 dark:border-[#2B2930]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2B2930] rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <ArrowLeft size={24} className="text-slate-900 dark:text-[#E6E1E5]" />
          </button>
          
          {/* Current Project Name */}
          {firstProject && (
            <span className="text-[16px] font-bold text-slate-900 dark:text-[#E6E1E5]">{firstProject.name}</span>
          )}

          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          {/* Flower Progress Tracker */}
          <FlowerProgress filledSteps={[true, true, true, true]} />
          
          <h2 className="text-[32px] font-bold text-slate-900 dark:text-[#E6E1E5] mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why did you feel that way?
          </h2>
          <p className="text-[16px] text-slate-700 dark:text-[#CAC4D0]">
            Optional
          </p>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full min-h-[140px] p-4 bg-white dark:bg-[#2B2930] border border-slate-200 dark:border-[#3A3840] text-slate-900 dark:text-[#E6E1E5] placeholder:text-slate-400 dark:placeholder:text-[#938F99] focus:outline-none focus:border-slate-400 dark:focus:border-[#F37E58] resize-none"
          placeholder="e.g., The client loved the direction — felt proud!"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-[#FFF9F8] dark:bg-[#1C1B1F] p-5">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={handleAddAnotherTask}
            className="w-full py-5 px-6 text-center bg-[#FFF9F8] dark:bg-[#2B2930] border text-slate-900 dark:text-[#E6E1E5] font-medium text-[17px] hover:bg-slate-50 dark:hover:bg-[#3A3840] transition-all active:scale-[0.99]"
            style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
          >
            + Add another task
          </button>
          
          <button
            onClick={isLastProject ? handleDoneReflecting : handleNextProject}
            className="w-full py-5 px-6 font-medium text-[17px] transition-all duration-200 bg-[#F37E58] text-slate-900 dark:text-white hover:bg-[#E66A44] dark:hover:bg-[#AF4336] active:scale-[0.98]"
          >
            {isLastProject ? "Done Reflecting" : "Next Project"}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default TaskNotes
