import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Project } from '../types'
import { ProjectStorage } from '../utils/storage'
import Button from './Button'

interface TaskEntryProps {
  selectedProjectIds: string[]
  onNext: (taskDescription: string) => void
  onBack: () => void
}

const TaskEntry: React.FC<TaskEntryProps> = ({ 
  selectedProjectIds, 
  onNext, 
  onBack 
}) => {
  const [taskDescription, setTaskDescription] = useState('')

  // Get the first selected project for the header
  const firstProject = selectedProjectIds.length > 0 
    ? ProjectStorage.getProjectById(selectedProjectIds[0])
    : null

  const handleNext = () => {
    if (taskDescription.trim()) {
      onNext(taskDescription.trim())
    }
  }

  const projectName = firstProject?.name || 'Selected Projects'
  const isMultipleProjects = selectedProjectIds.length > 1

  return (
    <div className="flex flex-col h-screen justify-between p-6 bg-background-light">
      {/* Header */}
      <header>
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-primary/20 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-900" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 flex-grow text-center">
            {isMultipleProjects ? `${projectName} + ${selectedProjectIds.length - 1} more` : projectName}
          </h1>
          <div className="w-10"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900">
          What task did you work on?
        </h2>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center">
        <div className="space-y-4">
          <label 
            className="text-sm font-medium text-slate-700 sr-only" 
            htmlFor="task"
          >
            Task you worked on
          </label>
          <textarea
            className="w-full px-4 py-3 bg-background-light border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-400 text-slate-900 text-base soft-shadow resize-none"
            id="task"
            name="task"
            placeholder="e.g., Refined homepage layout and sketched out new logo concepts on my tablet."
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            maxLength={500}
          />
          <div className="text-right">
            <span className="text-sm text-slate-500">
              {taskDescription.length}/500 characters
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-4">
        <Button
          title="Next"
          onPress={handleNext}
          variant="primary"
          size="large"
          disabled={!taskDescription.trim()}
          className="w-full rounded-xl font-bold"
        />
      </footer>
    </div>
  )
}

export default TaskEntry
