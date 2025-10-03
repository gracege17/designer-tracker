import React from 'react'
import { Plus, Settings, Home, PlusCircle, BarChart2, Calendar } from 'lucide-react'
import { Entry, EMOTIONS } from '../types'
import { DateUtils } from '../utils/dateUtils'
import { getTodayDateString, getCurrentWeekEntries, getTotalTaskCount, getMostEnergizingTaskType } from '../utils/dataHelpers'
import { ProjectStorage, UserProfileStorage } from '../utils/storage'
import { generateSuggestions, getMotivationalQuote } from '../utils/suggestionEngine'
import SuggestionsCard from './SuggestionsCard'

interface DashboardProps {
  entries: Entry[]
  onAddEntry: () => void
  onViewEntries: () => void
  onViewInsights: () => void
  isLoading?: boolean
}

const Dashboard: React.FC<DashboardProps> = ({ entries, onAddEntry, onViewEntries, onViewInsights, isLoading = false }) => {
  // Get user profile
  const userProfile = UserProfileStorage.getUserProfile()
  const userName = userProfile?.name || 'Designer'
  
  // Get today's entry and tasks
  const todayDate = getTodayDateString()
  const todayEntry = entries.find(entry => entry.date === todayDate)
  const todayTasks = todayEntry?.tasks || []
  
  // Get this week's entries and insights
  const thisWeekEntries = getCurrentWeekEntries(entries)
  const thisWeekTaskCount = getTotalTaskCount(thisWeekEntries)
  const mostEnergizingTaskType = getMostEnergizingTaskType(thisWeekEntries)

  // Generate personalized suggestions
  const suggestions = generateSuggestions(entries)

  // Get motivational quote
  const allTasks = thisWeekEntries.flatMap(entry => entry.tasks)
  const recentAvgEmotion = allTasks.length > 0
    ? allTasks.reduce((sum, task) => {
        if (task.emotions && task.emotions.length > 0) {
          return sum + (task.emotions.reduce((s, e) => s + e, 0) / task.emotions.length)
        }
        return sum + task.emotion
      }, 0) / allTasks.length
    : 6
  const motivationalQuote = getMotivationalQuote(recentAvgEmotion)

  return (
    <div className="min-h-screen flex flex-col justify-between bg-mono-50 screen-transition">
      <main className="p-6 pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-h2 font-heading text-mono-900">Hey {userName} 👋</h1>
          <button className="text-mono-500 hover:text-mono-700 transition-colors">
            <Settings size={24} />
          </button>
        </div>

        <p className="text-body text-mono-600 mb-6">Ready to reflect?</p>

        {/* Add Reflection Button */}
        <button
          onClick={onAddEntry}
          className="w-full bg-mono-900 text-mono-50 py-4 px-6 rounded-xl font-normal text-lg hover:bg-mono-800 active:scale-[0.98] transition-all duration-200 mb-10"
        >
          + Add Today's Reflection
        </button>

        {/* Motivational Quote */}
        {entries.length > 0 && (
          <div className="mt-6 bg-mono-100 p-4 rounded-xl border border-mono-200">
            <p className="text-body font-medium text-mono-800 text-center">
              {motivationalQuote}
            </p>
          </div>
        )}

        {/* Personalized Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-10">
            <h2 className="text-h3 font-heading text-mono-900 mb-4">For You 💫</h2>
            <SuggestionsCard suggestions={suggestions} maxDisplay={2} />
          </div>
        )}

        {/* Quick Insights */}
        <div className="mt-10 space-y-4">
          {mostEnergizingTaskType && (
            <div className="bg-mono-100 p-4 rounded-xl flex items-center gap-4 border border-mono-200">
              <span className="text-2xl">🎨</span>
              <p className="font-medium text-mono-800">
                You felt most energized working on <span className="font-bold">{mostEnergizingTaskType}</span>.
              </p>
            </div>
          )}
          
          {thisWeekTaskCount > 0 && (
            <div className="bg-mono-100 p-4 rounded-xl flex items-center gap-4 border border-mono-200">
              <span className="text-2xl">💡</span>
              <p className="font-medium text-mono-800">
                You completed <span className="font-bold">{thisWeekTaskCount} tasks</span> this week. Great progress!
              </p>
            </div>
          )}

          {todayTasks.length === 0 && (
            <div className="bg-mono-100 p-4 rounded-xl flex items-center gap-4 border border-mono-200">
              <span className="text-2xl">✨</span>
              <p className="font-medium text-mono-800">
                Ready to start your day? <span className="font-bold">Add your first reflection</span> above.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-mono-50/95 backdrop-blur-md border-t border-mono-200 z-50">
        <div className="max-w-md mx-auto flex justify-around py-3 px-2">
          <button className="flex flex-col items-center justify-center gap-1.5 text-mono-900 min-w-[64px] py-2">
            <Home size={28} fill="currentColor" />
            <p className="text-caption font-medium">Home</p>
          </button>
          <button 
            onClick={onAddEntry}
            className="flex flex-col items-center justify-center gap-1.5 text-mono-400 hover:text-mono-900 transition-colors min-w-[64px] py-2"
          >
            <Plus size={28} />
            <p className="text-caption font-medium">Add</p>
          </button>
          <button 
            onClick={onViewInsights}
            className="flex flex-col items-center justify-center gap-1.5 text-mono-400 hover:text-mono-900 transition-colors min-w-[64px] py-2"
          >
            <BarChart2 size={28} />
            <p className="text-caption font-medium">Overview</p>
          </button>
          <button 
            onClick={onViewEntries}
            className="flex flex-col items-center justify-center gap-1.5 text-mono-400 hover:text-mono-900 transition-colors min-w-[64px] py-2"
          >
            <Calendar size={28} />
            <p className="text-caption font-medium">History</p>
          </button>
        </div>
        <div className="h-safe bg-mono-50"></div>
      </footer>
    </div>
  )
}

export default Dashboard

