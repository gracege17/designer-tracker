import React, { useState, useEffect, useRef } from 'react'
import { CaretLeft } from 'phosphor-react'
import ButtonPrimaryCTA from './ButtonPrimaryCTA'
import { ProjectStorage } from '../utils/storage'

interface TaskEntryProps {
  selectedProjectIds: string[]
  initialTaskDescription?: string
  onNext: (description: string) => void
  onBack: () => void
}

const TaskEntryImproved: React.FC<TaskEntryProps> = ({
  selectedProjectIds,
  initialTaskDescription = '',
  onNext,
  onBack
}) => {
  const [description, setDescription] = useState(initialTaskDescription)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleNext = () => {
    if (description.trim()) {
      onNext(description.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && description.trim()) {
      e.preventDefault()
      handleNext()
    }
  }

  // Get current project info
  const currentProject = selectedProjectIds.length > 0 
    ? ProjectStorage.getProjectById(selectedProjectIds[0])
    : null

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-black z-10 p-5 border-b border-[#49454F]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left: Back Button */}
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/[0.04] rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
          
          {/* Center: Current Project Name */}
          {currentProject && (
            <span className="text-[16px] font-bold text-[#E6E1E5] text-center truncate px-2">{currentProject.name}</span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-[32px] font-normal text-[#E6E1E5] mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            What did you work on for <span className="font-bold">{currentProject?.name}</span>?
          </h2>
          <p className="text-[16px] text-[#CAC4D0]">
            Describe what you accomplished today
          </p>
        </div>

        {/* Textarea Container */}
        <textarea
          ref={textareaRef}
          value={description}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Redesigned the homepage hero section and created 3 new component variants for the design system..."
          className="w-full min-h-[140px] p-4 bg-white/[0.04] border border-[#49454F] text-[#E6E1E5] placeholder:text-[#938F99] focus:outline-none focus:border-[#EC5429] resize-none"
        />
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-black p-5">
        <div className="max-w-md mx-auto">
          <ButtonPrimaryCTA
            onClick={handleNext}
            disabled={!description.trim()}
            className={description.trim() ? '' : 'bg-white/[0.04] text-[#938F99] cursor-not-allowed hover:bg-white/[0.04]'}
          >
            {description.trim() ? 'Continue' : 'Describe your task to continue'}
          </ButtonPrimaryCTA>
        </div>
      </footer>
    </div>
  )
}

export default TaskEntryImproved

