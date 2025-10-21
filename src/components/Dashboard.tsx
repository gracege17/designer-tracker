import React, { useState, useEffect } from 'react'
import { Plus, Settings, Home, PlusCircle, BarChart2, Calendar } from 'lucide-react'
import { Entry, EMOTIONS, EmotionLevel } from '../types'
import { DateUtils } from '../utils/dateUtils'
import { getTodayDateString, getCurrentWeekEntries, getTotalTaskCount, getMostEnergizingTaskType } from '../utils/dataHelpers'
import { ProjectStorage, UserProfileStorage } from '../utils/storage'
import { generateSuggestions, getMotivationalQuote } from '../utils/suggestionEngine'
import { generateDailySummary } from '../utils/aiSummaryService'
import { getResourceRecommendation } from '../utils/resourceRecommendationService'
import { calculateTodayEmotionBreakdown } from '../utils/emotionBreakdownService'
import EmotionalRadarChart from './EmotionalRadarChart'
import SuggestionsCard from './SuggestionsCard'
import { useTheme } from '../context/ThemeContext'

interface DashboardProps {
  entries: Entry[]
  onAddEntry: () => void
  onViewEntries: () => void
  onViewInsights: () => void
  onViewSettings?: () => void
  isLoading?: boolean
}

const Dashboard: React.FC<DashboardProps> = ({ entries, onAddEntry, onViewEntries, onViewInsights, onViewSettings, isLoading = false }) => {
  // Theme
  const { theme } = useTheme()
  
  // AI Summary State
  const [dailySummary, setDailySummary] = useState<string>('')
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  // Resource Recommendation State
  const [resourceRecommendation, setResourceRecommendation] = useState<{
    quote?: string
    resourceType: 'quote' | 'video' | 'article' | 'book'
    resourceTitle: string
    url: string
    description?: string
  } | null>(null)
  const [isLoadingResource, setIsLoadingResource] = useState(false)

  // Emotion Breakdown State
  const [emotionBreakdown, setEmotionBreakdown] = useState<any>(null)

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

  // Load daily summary
  useEffect(() => {
    const loadDailySummary = async () => {
      if (todayEntry && todayEntry.tasks.length > 0) {
        setIsLoadingSummary(true)
        try {
          const summary = await generateDailySummary(todayEntry)
          setDailySummary(summary)
        } catch (error) {
          console.error('Failed to load daily summary:', error)
          setDailySummary("You had a productive day with a mix of creative and technical work. Keep up the great momentum!")
        } finally {
          setIsLoadingSummary(false)
        }
      } else {
        setDailySummary("Ready to capture today's design journey? Add your first task to get a personalized summary!")
      }
    }

    loadDailySummary()
  }, [todayEntry])

  // Load resource recommendation
  useEffect(() => {
    const loadResourceRecommendation = async () => {
      setIsLoadingResource(true)
      try {
        const recommendation = await getResourceRecommendation(entries)
        setResourceRecommendation(recommendation)
      } catch (error) {
        console.error('Failed to load resource recommendation:', error)
        setResourceRecommendation({
          resourceType: 'quote',
          resourceTitle: 'Encouragement Quote',
          url: '#',
          quote: '"The only way to do great work is to love what you do." - Steve Jobs'
        })
      } finally {
        setIsLoadingResource(false)
      }
    }

    loadResourceRecommendation()
  }, [entries])

  // Calculate emotion breakdown
  useEffect(() => {
    const breakdown = calculateTodayEmotionBreakdown(todayEntry)
    setEmotionBreakdown(breakdown)
  }, [todayEntry])

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F8] dark:bg-[#1C1B1F] screen-transition">
      <main className="flex-1 p-5 pb-32 overflow-y-auto max-w-md mx-auto w-full">
        {/* Greeting - Clean and Simple */}
        <div className="mb-6">
          <h1 className="text-[32px] leading-tight font-bold text-slate-900 dark:text-[#E6E1E5] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Hey {userName}
          </h1>
          <p className="text-[16px] text-slate-700 dark:text-[#CAC4D0]" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            What did you work on today?
          </p>
        </div>

        {/* AI Daily Summary Card */}
        <div 
          className="p-4 mb-6 transition-all active:scale-[0.99] flex items-start self-stretch w-full cursor-pointer" 
          style={{ 
            borderRadius: '0 48px 0 0',
            background: theme === 'dark'
              ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%), linear-gradient(132deg, #A1C4FD 0%, #C2E9FB 103.78%)'
              : 'linear-gradient(132deg, #A1C4FD 0%, #C2E9FB 103.78%)'
          }}
        >
          <div className="flex flex-col items-start gap-3 w-full">
            <p className="text-[12px] font-normal text-slate-900 dark:text-white">
              Today's Summary
            </p>
            
            {isLoadingSummary ? (
              <p className="text-[16px] font-medium text-slate-700 dark:text-slate-200 leading-snug italic animate-pulse">
                Analyzing your day...
              </p>
            ) : (
              <p className="text-[18px] font-medium text-slate-900 dark:text-white leading-snug">
                {dailySummary}
              </p>
            )}
            
            {todayEntry && todayEntry.tasks.length > 0 && (
              <p className="text-[13px] font-normal text-slate-900 dark:text-slate-200 opacity-70">
                Based on {todayEntry.tasks.length} task{todayEntry.tasks.length !== 1 ? 's' : ''} logged today
              </p>
            )}
          </div>
        </div>

        {/* Emotional Radar Chart Card */}
        {emotionBreakdown && (
          <div 
            className="p-4 mb-6 transition-all active:scale-[0.99] flex flex-col items-center self-stretch w-full" 
            style={{ 
              borderRadius: '0 48px 0 0',
              background: theme === 'dark'
                ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%), linear-gradient(132deg, #E3E3E3 0%, #A69FAE 103.78%)'
                : 'linear-gradient(132deg, #E3E3E3 0%, #A69FAE 103.78%)'
            }}
          >
            <div className="flex flex-col items-start gap-3 w-full mb-4">
              <p className="text-[12px] font-normal text-slate-900 dark:text-white">
                Today's Emotional Flow
              </p>
              <p className="text-[16px] font-medium text-slate-900 dark:text-white leading-snug">
                How you felt across different moments
              </p>
            </div>
            
            <div className="w-full h-64">
              <EmotionalRadarChart emotionData={emotionBreakdown} />
            </div>
            
            {emotionBreakdown.totalTasks > 0 && (
              <p className="text-[13px] font-normal text-slate-900 dark:text-slate-200 opacity-70 mt-2">
                Based on {emotionBreakdown.totalTasks} task{emotionBreakdown.totalTasks !== 1 ? 's' : ''} logged today
              </p>
            )}
          </div>
        )}

        {/* Resource Recommendation Card */}
        {resourceRecommendation && (
          <div 
            className="p-4 mb-6 transition-all active:scale-[0.99] flex items-start self-stretch w-full cursor-pointer" 
            style={{ 
              borderRadius: '0 48px 0 0',
              background: theme === 'dark'
                ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%), linear-gradient(132deg, #FFD3A5 0%, #FD6585 103.78%)'
                : 'linear-gradient(132deg, #FFD3A5 0%, #FD6585 103.78%)'
            }}
            onClick={() => {
              if (resourceRecommendation.url && resourceRecommendation.url !== '#') {
                window.open(resourceRecommendation.url, '_blank')
              }
            }}
          >
            <div className="flex flex-col items-start gap-3 w-full">
              <p className="text-[12px] font-normal text-slate-900 dark:text-white">
                Resource Recommendation
              </p>
              
              {isLoadingResource ? (
                <p className="text-[16px] font-medium text-slate-700 dark:text-slate-200 leading-snug italic animate-pulse">
                  Finding the perfect resource...
                </p>
              ) : (
                <>
                  {resourceRecommendation.quote ? (
                    <div className="w-full">
                      <p className="text-[18px] font-medium text-slate-900 dark:text-white leading-snug italic mb-2">
                        "{resourceRecommendation.quote}"
                      </p>
                      <p className="text-[14px] font-normal text-slate-900 dark:text-slate-200 opacity-80">
                        {resourceRecommendation.resourceTitle}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <p className="text-[18px] font-medium text-slate-900 dark:text-white leading-snug mb-2">
                        {resourceRecommendation.resourceTitle}
                      </p>
                      {resourceRecommendation.description && (
                        <p className="text-[14px] font-normal text-slate-900 dark:text-slate-200 opacity-80 mb-2">
                          {resourceRecommendation.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-1 rounded-full">
                          {resourceRecommendation.resourceType.toUpperCase()}
                        </span>
                        {resourceRecommendation.url !== '#' && (
                          <span className="text-[12px] font-normal text-slate-900 dark:text-slate-200 opacity-70">
                            Tap to open
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

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
            <div className="bg-white dark:bg-[#2B2930] p-6 mb-6 border border-slate-200 dark:border-[#49454F]" style={{ borderRadius: '0 48px 0 0' }}>
              {/* Custom Illustration */}
              <div className="h-48 mb-4 flex items-center justify-center overflow-hidden" style={{ borderRadius: '0 36px 0 0' }}>
                <img 
                  src="https://cdn.midjourney.com/b0df52e3-5e6e-42d5-9597-331f1a2ed698/0_3.png" 
                  alt="Decorative illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <p className="text-[17px] text-slate-700 dark:text-[#E6E1E5] italic leading-relaxed text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                "{randomQuote}"
              </p>
            </div>
          )
        })()}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#211F26] border-t border-slate-200 dark:border-[#49454F] z-50">
        <div className="relative flex items-end justify-around px-4 py-3">
          {/* Home */}
          <button className="flex flex-col items-center justify-center gap-1.5 text-slate-900 dark:text-[#E6E1E5] min-w-[64px] py-1">
            <img src="/icons/material-symbols_home-outline-rounded.svg" alt="" className="w-[26px] h-[26px] dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Home</p>
          </button>

          {/* Overview */}
          <button 
            onClick={onViewInsights}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_overview-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Overview</p>
          </button>

          {/* Add Button - Center & Elevated */}
          <button
            onClick={onAddEntry}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="bg-[#F37E58] rounded-[18px] px-6 py-3 shadow-xl hover:bg-[#E66A44] dark:hover:bg-[#AF4336] active:scale-95 transition-all">
              <Plus size={28} strokeWidth={2.5} className="text-white" />
            </div>
          </button>

          {/* History */}
          <button 
            onClick={onViewEntries}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/ic_round-history.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">History</p>
          </button>

          {/* Setting */}
          <button 
            onClick={onViewSettings}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/uil_setting.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Settings</p>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard

