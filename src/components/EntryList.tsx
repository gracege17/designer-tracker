import React, { useState } from 'react'
import { ArrowLeft, ChevronRight, Home, Plus, BarChart2, Calendar, Search, X } from 'lucide-react'
import { Entry, EMOTIONS } from '../types'
import { DateUtils } from '../utils/dateUtils'
import { ProjectStorage } from '../utils/storage'
import { getTodayDateString, calculateEntryAverageEmotion } from '../utils/dataHelpers'

interface EntryListProps {
  entries: Entry[]
  onBack: () => void
  onNavigateHome: () => void
  onNavigateAdd: () => void
  onNavigateInsights: () => void
  onViewEntry: (entry: Entry) => void
}

const EntryList: React.FC<EntryListProps> = ({ 
  entries, 
  onBack, 
  onNavigateHome, 
  onNavigateAdd, 
  onNavigateInsights,
  onViewEntry
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Sort entries by date (newest first)
  const sortedEntries = entries.sort((a, b) => b.date.localeCompare(a.date))

  // Filter entries based on search query
  const filteredEntries = sortedEntries.filter(entry => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    
    // Search by date
    const dateMatch = DateUtils.formatDate(new Date(entry.date)).toLowerCase().includes(query)
    if (dateMatch) return true
    
    // Search by task description or notes
    const taskMatch = entry.tasks.some(task => 
      task.description.toLowerCase().includes(query) ||
      (task.notes && task.notes.toLowerCase().includes(query))
    )
    if (taskMatch) return true
    
    // Search by project name
    const projectMatch = entry.tasks.some(task => {
      const project = ProjectStorage.getProjectById(task.projectId)
      return project?.name.toLowerCase().includes(query)
    })
    
    return projectMatch
  })

  // Group entries by month
  const groupEntriesByMonth = (entries: Entry[]) => {
    const grouped: Record<string, Entry[]> = {}
    
    entries.forEach(entry => {
      const date = new Date(entry.date)
      const monthKey = `${date.toLocaleString('en-US', { month: 'short' })}, ${date.getFullYear()}`
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }
      grouped[monthKey].push(entry)
    })
    
    return grouped
  }

  // Get primary task for each entry (first task or most representative)
  const getEntryDisplayData = (entry: Entry) => {
    if (entry.tasks.length === 0) return null
    
    // Use first task for now, could be enhanced to pick most representative
    const primaryTask = entry.tasks[0]
    const project = ProjectStorage.getProjectById(primaryTask.projectId)
    const averageEmotion = calculateEntryAverageEmotion(entry)
    const emotionEmoji = averageEmotion >= 4.5 ? '😄' : 
                        averageEmotion >= 3.5 ? '😊' : 
                        averageEmotion >= 2.5 ? '😐' : 
                        averageEmotion >= 1.5 ? '😰' : '😫'
    
    return {
      date: new Date(entry.date),
      emotion: emotionEmoji,
      taskDescription: primaryTask.description,
      projectName: project?.name || 'Unknown Project',
      taskCount: entry.tasks.length
    }
  }

  // Format date as "Wed, 01"
  const formatShortDate = (date: Date) => {
    const dayName = date.toLocaleString('en-US', { weekday: 'short' })
    const dayNumber = date.getDate().toString().padStart(2, '0')
    return `${dayName}, ${dayNumber}`
  }

  const groupedEntries = groupEntriesByMonth(filteredEntries)

  return (
    <div className="flex h-full min-h-screen w-full flex-col bg-background-light text-slate-800 screen-transition">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col bg-background-light/80 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center p-4">
          <button 
            onClick={onBack}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold">Past Reflections</h1>
          <div className="w-10"></div>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by date, task, or project..."
              className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-400 text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-slate-500 mt-2">
              {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2 text-center">
              No reflections yet
            </h3>
            <p className="text-slate-600 text-center">
              Start tracking your design work to see your history here.
            </p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2 text-center">
              No results found
            </h3>
            <p className="text-slate-600 text-center">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([monthKey, monthEntries]) => (
              <div key={monthKey}>
                {/* Month Header */}
                <div className="sticky top-0 bg-background-light/95 backdrop-blur-sm py-2 mb-3 z-10">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                    {monthKey}
                  </h3>
                </div>
                
                {/* Entries for this month */}
                <div className="space-y-2">
                  {monthEntries.map((entry) => {
                    const displayData = getEntryDisplayData(entry)
                    if (!displayData) return null

                    return (
                      <div 
                        key={entry.id}
                        onClick={() => onViewEntry(entry)}
                        className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-4 soft-shadow transition-all hover:shadow-md border border-slate-100"
                      >
                        {/* Emoji Badge */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 text-2xl flex-shrink-0">
                          {displayData.emotion}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {displayData.taskDescription}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>{formatShortDate(displayData.date)}</span>
                            {entry.tasks.length > 1 && (
                              <>
                                <span>•</span>
                                <span>+{entry.tasks.length - 1} task{entry.tasks.length - 1 > 1 ? 's' : ''}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight size={20} className="text-slate-300 flex-shrink-0" />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 bg-background-light/80 backdrop-blur-sm">
        <div className="flex justify-around border-t border-slate-200/50 py-2">
          <button 
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-end gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Home size={24} />
            <p className="text-xs font-medium">Home</p>
          </button>
          <button 
            onClick={onNavigateAdd}
            className="flex flex-col items-center justify-end gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <Plus size={24} />
            <p className="text-xs font-medium">Add</p>
          </button>
          <button 
            onClick={onNavigateInsights}
            className="flex flex-col items-center justify-end gap-1 text-slate-400 hover:text-primary transition-colors"
          >
            <BarChart2 size={24} />
            <p className="text-xs font-medium">Overview</p>
          </button>
          <button className="flex flex-col items-center justify-end gap-1 text-primary">
            <Calendar size={24} fill="currentColor" />
            <p className="text-xs font-medium">History</p>
          </button>
        </div>
        <div className="h-5 bg-background-light"></div>
      </footer>
    </div>
  )
}

export default EntryList
