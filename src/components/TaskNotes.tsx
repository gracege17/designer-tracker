import React, { useState, useRef } from 'react'
import { CaretLeft } from 'phosphor-react'
import ButtonPrimaryCTA from './ButtonPrimaryCTA'
import ButtonSecondary from './ButtonSecondary'
import ButtonIcon from './ButtonIcon'
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
  const savedNotesRef = useRef<string | undefined>()

  // Get the first selected project for the header
  const firstProject = selectedProjectIds.length > 0 
    ? ProjectStorage.getProjectById(selectedProjectIds[0])
    : null

  const handleAddAnotherTask = () => {
    // Capture and save current notes
    savedNotesRef.current = notes.trim() || undefined
    
    // Reset form
    setNotes('')
    
    // Call the original handler to move to next task
    onAddAnotherTask(savedNotesRef.current)
    
    // Clear saved notes
    savedNotesRef.current = undefined
  }

  const handleNextProject = () => {
    onNextProject(notes.trim() || undefined)
  }

  const handleDoneReflecting = () => {
    onDoneReflecting(notes.trim() || undefined)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-black z-10 p-5 border-b border-[#2B2930]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left: Back Button */}
          <ButtonIcon
            onClick={onBack}
            className="-ml-2 rounded-full hover:bg-white/[0.04] active:scale-95 opacity-100"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </ButtonIcon>
          
          {/* Center: Current Project Name */}
          {firstProject && (
            <span className="text-[16px] font-bold text-[#E6E1E5] text-center truncate px-2">{firstProject.name}</span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-[32px] font-bold text-[#E6E1E5] mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why did you feel that way?
          </h2>
          <p className="text-[16px] text-[#CAC4D0]">
            Optional
          </p>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full min-h-[140px] p-4 bg-white/[0.04] border border-[#3A3840] text-[#E6E1E5] placeholder:text-[#938F99] focus:outline-none focus:border-[#EC5429] resize-none"
          placeholder="e.g., The client loved the direction — felt proud!"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-black p-5">
        <div className="max-w-md mx-auto space-y-3">
          <ButtonSecondary onClick={handleAddAnotherTask}>
            + Add another task
          </ButtonSecondary>
          
          <ButtonPrimaryCTA
            onClick={isLastProject ? handleDoneReflecting : handleNextProject}
          >
            {isLastProject ? 'Done Reflecting' : 'Next Project'}
          </ButtonPrimaryCTA>
        </div>
      </footer>
    </div>
  )
}

export default TaskNotes
