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
    <div className="flex flex-col min-h-screen bg-[#F5F6EB]">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[#F5F6EB] z-10 p-5 border-b border-slate-200">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </button>
          
          {/* Current Project Name */}
          {currentProject && (
            <span className="text-[16px] font-bold text-slate-900">{currentProject.name}</span>
          )}

          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-5 pt-6 pb-4 max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-[32px] font-normal text-slate-900 mb-2 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            What task did you work on <span className="font-bold">{currentProject?.name}</span>?
          </h2>
          <p className="text-[16px] text-slate-700">
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
          className="w-full min-h-[140px] p-4 bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 resize-none"
        />
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-[#F5F6EB] p-5">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={!description.trim()}
            className={`
              w-full py-5 px-6 font-medium text-[17px] transition-all duration-200
              ${description.trim()
                ? 'bg-[#000] text-white hover:bg-slate-900 active:scale-[0.98]'
                : 'bg-[#999] text-white cursor-not-allowed'
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

