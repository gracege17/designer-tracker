import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
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
    <div className="flex flex-col min-h-screen bg-[#FFF9F8] dark:bg-[#1C1B1F]">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[#FFF9F8] dark:bg-[#1C1B1F] z-10 p-5 border-b border-slate-200 dark:border-[#49454F]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#2B2930] rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <ArrowLeft size={24} className="text-slate-900 dark:text-[#E6E1E5]" />
          </button>
          
          {/* Current Project Name */}
          {currentProject && (
            <span className="text-[16px] font-bold text-slate-900 dark:text-[#E6E1E5]">{currentProject.name}</span>
          )}

          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-[32px] font-normal text-slate-900 dark:text-[#E6E1E5] mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            What did you work on for <span className="font-bold">{currentProject?.name}</span>?
          </h2>
          <p className="text-[16px] text-slate-700 dark:text-[#CAC4D0]">
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
          className="w-full min-h-[140px] p-4 bg-white dark:bg-[#2B2930] border border-slate-200 dark:border-[#49454F] text-slate-900 dark:text-[#E6E1E5] placeholder:text-slate-400 dark:placeholder:text-[#938F99] focus:outline-none focus:border-slate-400 dark:focus:border-[#F37E58] resize-none"
        />
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-[#FFF9F8] dark:bg-[#1C1B1F] p-5">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={!description.trim()}
            className={`
              w-full py-5 px-6 font-medium text-[17px] transition-all duration-200
              ${description.trim()
                ? 'bg-[#F37E58] text-white hover:bg-[#E66A44] dark:hover:bg-[#AF4336] active:scale-[0.98]'
                : 'bg-slate-200 dark:bg-[#2B2930] text-slate-400 dark:text-[#938F99] cursor-not-allowed'
              }
            `}
          >
            {description.trim() ? 'Continue' : 'Describe your task to continue'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default TaskEntryImproved

