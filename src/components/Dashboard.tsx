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
  onViewSettings?: () => void
  isLoading?: boolean
}

const Dashboard: React.FC<DashboardProps> = ({ entries, onAddEntry, onViewEntries, onViewInsights, onViewSettings, isLoading = false }) => {
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
    <div className="min-h-screen flex flex-col bg-[#F5F6EB] screen-transition">
      <main className="flex-1 p-5 pb-32 overflow-y-auto max-w-md mx-auto w-full">
        {/* Greeting - Clean and Simple */}
        <div className="mb-6">
          <h1 className="text-[32px] leading-tight font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Hey Designer
          </h1>
          <p className="text-[16px] text-slate-700" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            How was your workday?
          </p>
        </div>

        {/* Big CTA Button at Top */}
        <button
          onClick={onAddEntry}
          className="w-full bg-[#000] text-white py-5 px-6 font-medium text-[17px] mb-6 hover:bg-slate-900 transition-all duration-200 active:scale-[0.98]"
        >
          + Capture the moment
        </button>


        {/* Energy or Emotion Trend Summary */}
        {thisWeekEntries.length > 0 && (() => {
          // Calculate most energizing task
          const allWeekTasks = thisWeekEntries.flatMap(entry => entry.tasks)
          const sortedByEmotion = [...allWeekTasks].sort((a, b) => {
            const aEmotion = a.emotions && a.emotions.length > 0 ? Math.max(...a.emotions) : a.emotion
            const bEmotion = b.emotions && b.emotions.length > 0 ? Math.max(...b.emotions) : b.emotion
            return bEmotion - aEmotion
          })
          
          const mostEnergizingTask = sortedByEmotion[0]
          const mostDrainingTask = sortedByEmotion[sortedByEmotion.length - 1]
          
          const mostEnergizingTaskEmotion = mostEnergizingTask?.emotions && mostEnergizingTask.emotions.length > 0 
            ? Math.max(...mostEnergizingTask.emotions) 
            : mostEnergizingTask?.emotion
          const mostDrainingTaskEmotion = mostDrainingTask?.emotions && mostDrainingTask.emotions.length > 0 
            ? Math.min(...mostDrainingTask.emotions) 
            : mostDrainingTask?.emotion

          const shouldShowBooster = mostEnergizingTaskEmotion && mostEnergizingTaskEmotion >= 4
          const shouldShowDraining = mostDrainingTaskEmotion && mostDrainingTaskEmotion <= 8 && allWeekTasks.length > 1
          
          if (!shouldShowBooster && !shouldShowDraining) return null
          
          return (
            <div className="space-y-4 mb-6">
              {/* Energy Booster - Bold Orange Card */}
              {shouldShowBooster && (
                <div 
                  className="bg-[#FF8C42] p-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
                  style={{ borderRadius: '0 48px 0 0', gap: '-2px' }}
                >
                  <div className="flex flex-col items-start gap-4 w-full">
                    <p className="text-[14px] font-bold text-slate-900">
                      What lifted you up this week?
                    </p>
                    
                    <p className="text-[24px] font-black text-slate-900 leading-tight capitalize">
                      {mostEnergizingTask.taskType.replace('-', ' ')}
                    </p>
                    
                    <p className="text-[12px] text-slate-800 font-medium">
                      Based on {thisWeekTaskCount} reflection{thisWeekTaskCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Draining Task - Light Gray Card */}
              {shouldShowDraining && (
                <div 
                  className="bg-[#E0E0E0] p-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
                  style={{ borderRadius: '0 48px 0 0', gap: '-2px' }}
                >
                  <div className="flex flex-col items-start gap-4 w-full">
                    <p className="text-[14px] font-bold text-slate-900">
                      What drained you:
                    </p>
                    
                    <p className="text-[24px] font-black text-slate-900 leading-tight capitalize">
                      {mostDrainingTask.description}
                    </p>
                    
                    <p className="text-[12px] text-slate-700 font-medium">
                      Based on {thisWeekTaskCount} reflection{thisWeekTaskCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* Inspirational Quote Card */}
        {(() => {
          const quotes = [
            'Every step counts, even the weird ones.',
            'Joy follows curiosity. Follow that spark.',
            'Progress, not perfection.',
            'Design is thinking made visual.',
            'The best work comes from what you love doing.',
          ]
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
          
          return (
            <div className="bg-white p-6 mb-6 border border-slate-200" style={{ borderRadius: '0 48px 0 0' }}>
              {/* Custom Illustration - Replace with your artwork */}
              <div className="h-48 mb-4 flex items-center justify-center overflow-hidden" style={{ borderRadius: '0 36px 0 0' }}>
                <img 
                  src="/illustrations/quote-illustration.svg" 
                  alt="Decorative illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <p className="text-[17px] text-slate-700 italic leading-relaxed text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                "{randomQuote}"
              </p>
            </div>
          )
        })()}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="relative flex items-end justify-around px-4 py-3">
          {/* Home */}
          <button className="flex flex-col items-center justify-center gap-1.5 text-slate-900 min-w-[64px] py-1">
            <img src="/icons/material-symbols_home-outline-rounded.svg" alt="" className="w-[26px] h-[26px]" />
            <p className="text-[11px] font-medium">Home</p>
          </button>

          {/* Overview */}
          <button 
            onClick={onViewInsights}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_overview-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-medium">Overview</p>
          </button>

          {/* Add Button - Center & Elevated */}
          <button
            onClick={onAddEntry}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="bg-slate-900 rounded-[18px] px-6 py-3 shadow-xl hover:bg-slate-800 active:scale-95 transition-all">
              <Plus size={28} strokeWidth={2.5} className="text-white" />
            </div>
          </button>

          {/* History */}
          <button 
            onClick={onViewEntries}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/ic_round-history.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-medium">History</p>
          </button>

          {/* Setting */}
          <button 
            onClick={onViewSettings}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/uil_setting.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-medium">Setting</p>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard

