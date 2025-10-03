import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'
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
  const [charCount, setCharCount] = useState(initialTaskDescription.length)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const MAX_CHARS = 500

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [description])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= MAX_CHARS) {
      setDescription(text)
      setCharCount(text.length)
    }
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
    <div className="flex flex-col min-h-screen bg-background-light">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-background-light/95 backdrop-blur-sm z-10 border-b border-slate-100">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 active:scale-95"
          >
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          
          {/* Current Project Name */}
          {currentProject && (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentProject.color }}
              />
              <span className="text-sm font-medium text-slate-700">{currentProject.name}</span>
            </div>
          )}

          <div className="w-8"></div>
        </div>

      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 pt-8 pb-4 flex flex-col">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={24} className="text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">
              What task did you work on?
            </h2>
          </div>
          <p className="text-slate-600">
            Describe what you accomplished today
          </p>
        </div>

        {/* Textarea Container */}
        <div className="flex-grow flex flex-col">
          <div className={`
            relative flex-grow rounded-2xl border-2 transition-all duration-200
            ${isFocused 
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
              : 'border-slate-200 bg-white'
            }
          `}>
            <textarea
              ref={textareaRef}
              value={description}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Redesigned the homepage hero section and created 3 new component variants for the design system..."
              className="w-full min-h-[200px] p-4 bg-transparent border-none focus:outline-none focus:ring-0 text-base text-slate-900 placeholder:text-slate-400 resize-none"
            />

            {/* Character Counter */}
            <div className="absolute bottom-4 right-4">
              <span className={`
                text-xs font-medium transition-colors
                ${charCount > MAX_CHARS * 0.9 
                  ? 'text-orange-600' 
                  : charCount > MAX_CHARS * 0.8
                  ? 'text-yellow-600'
                  : 'text-slate-400'
                }
              `}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
            <Sparkles size={16} className="flex-shrink-0 mt-0.5" />
            <p>
              <span className="font-medium">Pro tip:</span> Include what you did, not just task names. 
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">⌘ Enter</kbd> to continue.
            </p>
          </div>
        </div>
      </main>

      {/* Sticky Bottom CTA */}
      <footer className="sticky bottom-0 bg-mono-50/95 backdrop-blur-sm border-t border-mono-200 p-6">
        <button
          onClick={handleNext}
          disabled={!description.trim()}
          className={`
            w-full py-4 px-6 rounded-xl font-normal text-lg transition-all duration-200
            ${description.trim()
              ? 'bg-mono-900 text-mono-50 hover:bg-mono-800 active:scale-[0.98]'
              : 'bg-mono-200 text-mono-400 cursor-not-allowed'
            }
          `}
        >
          {description.trim() ? 'Continue' : 'Describe your task to continue'}
        </button>
      </footer>
    </div>
  )
}

export default TaskEntryImproved

