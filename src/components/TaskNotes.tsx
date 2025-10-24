import React, { useState, useRef } from 'react'
import { CaretLeft } from 'phosphor-react'
import { ProjectStorage } from '../utils/storage'
import FlowerProgress from './FlowerProgress'

interface TaskNotesProps {
  selectedProjectIds: string[]
  onAddAnotherTask: (notes?: string) => void
  onNextProject: (notes?: string) => void
  onDoneReflecting: (notes?: string) => void
  onBack: () => void
  isLastProject?: boolean
  taskCount?: number
}

const TaskNotes: React.FC<TaskNotesProps> = ({ 
  selectedProjectIds, 
  onAddAnotherTask,
  onNextProject,
  onDoneReflecting,
  onBack,
  isLastProject = false,
  taskCount = 0
}) => {
  const [notes, setNotes] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const savedNotesRef = useRef<string | undefined>()

  // Get the first selected project for the header
  const firstProject = selectedProjectIds.length > 0 
    ? ProjectStorage.getProjectById(selectedProjectIds[0])
    : null

  const handleAddAnotherTask = () => {
    // Capture and save current notes
    savedNotesRef.current = notes.trim() || undefined
    
    // Trigger meteor animation
    setIsAnimating(true)
  }

  const handleAnimationComplete = () => {
    // Animation complete - now save the task and increment count
    setIsAnimating(false)
    
    // Small delay to let animation fully complete before transitioning
    setTimeout(() => {
      // Reset form
      setNotes('')
      
      // Call the original handler to move to next task
      // This will save the current task and increment the count
      onAddAnotherTask(savedNotesRef.current)
      
      // Clear saved notes
      savedNotesRef.current = undefined
    }, 100) // Brief delay after animation completes
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
    <div className="flex flex-col min-h-screen bg-black">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-black z-10 p-5 border-b border-[#2B2930]">
        <div className="max-w-md mx-auto grid grid-cols-3 items-center">
          {/* Left: Back Button */}
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/[0.04] rounded-full transition-all duration-200 active:scale-95 -ml-2 justify-self-start"
          >
                <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
          
          {/* Center: Current Project Name */}
          {firstProject && (
            <span className="text-[16px] font-bold text-[#E6E1E5] text-center truncate px-2">{firstProject.name}</span>
          )}

          {/* Right: Counter Badge */}
          <div className="justify-self-end">
            <div className="flex items-center gap-1.5">
              <img 
                src="/images/colored-flower.png" 
                alt="flower" 
                className="w-6 h-6"
              />
              <span className="text-sm font-medium text-[#E6E1E5]">
                ({taskCount})
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          {/* Flower Progress Tracker */}
          <FlowerProgress 
            filledSteps={[true, true, true, true]} 
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete}
          />
          
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
          <button
            onClick={handleAddAnotherTask}
            className="w-full py-5 px-6 text-center bg-white/[0.04] border text-[#E6E1E5] font-medium text-[17px] hover:bg-[#3A3840] transition-all active:scale-[0.99]"
            style={{ borderColor: 'rgba(255, 255, 255, 0.6)' }}
          >
            + Add another task
          </button>
          
          <button
            onClick={isLastProject ? handleDoneReflecting : handleNextProject}
            className="w-full py-2.5 px-4 font-medium text-[17px] transition-all duration-200 bg-[#EC5429] text-white hover:bg-[#F76538] active:scale-[0.98]"
          >
            {isLastProject ? "Done Reflecting" : "Next Project"}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default TaskNotes
