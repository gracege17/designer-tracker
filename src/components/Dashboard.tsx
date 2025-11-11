import React, { useState, useEffect } from 'react'
import BottomNav from './BottomNav'
import { Entry, EmotionLevel } from '../types'
import { getTodayDateString } from '../utils/dataHelpers'
import { UserProfileStorage } from '../utils/storage'
import { generateDailySummary } from '../utils/aiSummaryService'
import { calculateTodayEmotionBreakdown } from '../utils/emotionBreakdownService'
import { analyzeTodayChallenges } from '../utils/challengeAnalysisService'
import { calculateDailyColor } from '../utils/emotionColorBlender'
import HelpfulResourcesCard from './HelpfulResourcesCard'
import { EMOTIONS } from '../types'
import namer from 'color-namer'
import SectionLabel from './SectionLabel'

interface DashboardProps {
  entries: Entry[]
  onAddEntry: () => void
  onViewEntries: () => void
  onViewInsights: () => void
  onViewSettings?: () => void
  isLoading?: boolean
}

const Dashboard: React.FC<DashboardProps> = ({ entries, onAddEntry, onViewEntries, onViewInsights, onViewSettings }) => {
  // Theme
  
  // AI Summary State
  const [dailySummary, setDailySummary] = useState<string>('')
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  // Emotion Breakdown State
  const [emotionBreakdown, setEmotionBreakdown] = useState<any>(null)

  // Get user profile
  const userProfile = UserProfileStorage.getUserProfile()
  const userName = userProfile?.name || 'Designer'
  
  // Get today's entry and tasks
  const todayDate = getTodayDateString()
  const todayEntry = entries.find(entry => entry.date === todayDate)
  const todayTasks = todayEntry?.tasks || []

  // Get weekly emotional calendar data (Monday to Sunday of current week)
  const getWeeklyEmotionalData = () => {
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] // Always Monday to Sunday
    const calendarData = []
    const today = new Date()
    
    // Find the Monday of the current week
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // If Sunday, go back 6 days, otherwise go back (dayOfWeek - 1) days
    const monday = new Date(today)
    monday.setDate(today.getDate() - daysFromMonday)
    
    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      const dayEntry = entries.find(entry => entry.date === dateString)
      
      if (dayEntry && dayEntry.tasks.length > 0) {
        // Get the first emotion from the first task (consistent with EntryList display)
        const firstTask = dayEntry.tasks[0]
        const emotionLevel = firstTask.emotions && firstTask.emotions.length > 0 
          ? firstTask.emotions[0] 
          : firstTask.emotion
        const emoji = EMOTIONS[emotionLevel]?.emoji || '😐'
        
        // Still calculate average for tooltip/stats
        const avgEmotion = dayEntry.tasks.reduce((sum, task) => sum + task.emotion, 0) / dayEntry.tasks.length
        
        calendarData.push({
          label: dayLabels[i],
          emoji: emoji,
          hasData: true,
          avgEmotion: avgEmotion,
          taskCount: dayEntry.tasks.length,
          date: date.getDate(),
          dateString: dateString,
          entry: dayEntry
        })
      } else {
        calendarData.push({
          label: dayLabels[i],
          emoji: '⚪',
          hasData: false,
          avgEmotion: 0,
          taskCount: 0,
          date: date.getDate(),
          dateString: dateString,
          entry: null
        })
      }
    }
    
    return calendarData
  }

  const weeklyData = getWeeklyEmotionalData()

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
        setDailySummary("Add your first task to see today's summary.")
      }
    }

    loadDailySummary()
  }, [todayEntry])

  // Calculate emotion breakdown
  useEffect(() => {
    const breakdown = calculateTodayEmotionBreakdown(todayEntry)
    setEmotionBreakdown(breakdown)
  }, [todayEntry])

  return (
    <div className="min-h-screen flex flex-col bg-black screen-transition">
      <main className="flex-1 p-5 pb-32 overflow-y-auto max-w-md mx-auto w-full">
        {/* Greeting - Clean and Simple */}
        <div className="mb-6">
          <h1 className="text-[32px] leading-tight font-bold text-[#E6E1E5] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Hey {userName}
          </h1>
          <p className="text-[16px] text-[#CAC4D0]" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
            What did you work on today?
          </p>
        </div>

        {/* Today's Summary Card */}
        <div 
          className="mb-6 bg-white/[0.04]" 
          style={{ 
            borderRadius: '16px'
          }}
        >
          {/* Header with Task Count */}
          <div 
            className="flex items-center justify-between"
            style={{
              padding: '18px 22px'
            }}
          >
            <div className="flex-1 pr-4">
              <SectionLabel className="mb-4">
                Today's Summary
              </SectionLabel>
              
              {/* Summary Text */}
              {isLoadingSummary ? (
                <p className="text-[16px] font-normal text-[#E6E1E5] leading-relaxed italic animate-pulse">
                  Analyzing your day...
                </p>
              ) : (
                <p className="text-[16px] font-normal text-[#E6E1E5] leading-relaxed">
                  {dailySummary}
                </p>
              )}
            </div>
            
            {/* Task Count */}
            <div className="flex flex-col items-center justify-center flex-shrink-0">
              <div className="text-[36px] font-bold text-white leading-none">
                {todayTasks.length}
              </div>
              <div className="text-[14px] font-normal text-white leading-none mt-2">
                Tasks
              </div>
            </div>
          </div>
        </div>

        {/* Today's Mood and Color Grid */}
        {todayTasks.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Today's Mood Card */}
            {(() => {
              // Get most common emotion
              const emotionCounts = todayTasks.reduce((acc, task) => {
                const emotion = task.emotion
                acc[emotion] = (acc[emotion] || 0) + 1
                return acc
              }, {} as Record<number, number>)
              
              const mostCommonEmotion = Object.entries(emotionCounts)
                .sort(([, a], [, b]) => b - a)[0]?.[0]
              
              const emotionData = mostCommonEmotion ? EMOTIONS[Number(mostCommonEmotion) as EmotionLevel] : EMOTIONS[8]
              
              return (
                <div className="p-6 bg-white/[0.04] flex flex-col items-center justify-center min-h-[180px]" style={{ borderRadius: '16px' }}>
                  <p className="text-[14px] font-normal text-[#938F99] mb-4">
                    Today's Mood
                  </p>
                  
                  {/* Emotion Icon */}
                  <div className="mb-3">
                    <img 
                      src={emotionData.iconPath} 
                      alt={emotionData.label}
                      className="w-16 h-16"
                    />
                  </div>
                  
                  {/* Emotion Label */}
                  <p className="text-[18px] font-semibold text-white">
                    {emotionData.label}
                  </p>
                </div>
              )
            })()}
            
            {/* Today's Color Card */}
            {(() => {
              const dailyColor = calculateDailyColor(todayEntry)
              
              // Get human-readable color name using color-namer
              const colorResult = namer(dailyColor)
              // Use pantone for more sophisticated names, fallback to basic
              const colorName = colorResult.pantone?.[0]?.name || colorResult.basic?.[0]?.name || 'Neutral'
              
              // Capitalize each word for better display
              const formattedColorName = colorName
                .split(' ')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
              
              return (
                <div className="p-6 bg-white/[0.04] flex flex-col items-center justify-center min-h-[180px]" style={{ borderRadius: '16px' }}>
                  <p className="text-[14px] font-normal text-[#938F99] mb-4">
                    Today's Color
                  </p>
                  
                  {/* Color Flower */}
                  <div className="mb-3">
                    <svg 
                      width="64" 
                      height="64" 
                      viewBox="0 0 35 35" 
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }}
                    >
                      <defs>
                        <clipPath id="flowerClipSmall">
                          <path d="M11.8284 11.3138C10.2663 9.75168 10.2663 7.21902 11.8284 5.65692C14.9526 2.53273 20.0179 2.53273 23.1421 5.65692C24.7042 7.21899 24.7042 9.75171 23.1421 11.3138L17.4853 16.9706L11.8284 11.3138Z" />
                          <path d="M23.1423 23.6569C24.7044 25.219 24.7044 27.7517 23.1423 29.3138C20.0181 32.438 14.9528 32.438 11.8286 29.3138C10.2665 27.7517 10.2665 25.219 11.8286 23.6569L17.4854 18.0001L23.1423 23.6569Z" />
                          <path d="M23.596 11.7492C25.1416 10.1707 27.6741 10.144 29.2526 11.6896C32.4095 14.7807 32.4628 19.8458 29.3717 23.0027C27.8262 24.5811 25.2936 24.6078 23.7152 23.0622L17.9991 17.4653L23.596 11.7492Z" />
                          <path d="M11.3727 23.2215C9.82715 24.8 7.29463 24.8267 5.71617 23.2811C2.55925 20.19 2.50593 15.1249 5.59706 11.968C7.14259 10.3896 9.67517 10.3629 11.2536 11.9085L16.9697 17.5054L11.3727 23.2215Z" />
                        </clipPath>
                      </defs>
                      
                      <g clipPath="url(#flowerClipSmall)">
                        <rect
                          x="0"
                          y="0"
                          width="35"
                          height="35"
                          fill={dailyColor}
                          className="transition-all duration-500"
                        />
                      </g>
                    </svg>
                  </div>
                  
                  {/* Color Name */}
                  <p className="text-[18px] font-semibold text-white text-center">
                    {formattedColorName}
                  </p>
                </div>
              )
            })()}
          </div>
        )}

        {/* Today's Top Challenges - Personalized Based on Emotions */}
        <HelpfulResourcesCard 
          challenges={analyzeTodayChallenges(todayEntry)}
        />

        {/* Weekly Emotional Calendar Overview */}
        <div className="mb-6">
          {/* Weekly View - Emojis with day labels */}
          <div>
            {/* Week day headers (M T W T F S S) */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayName, idx) => (
                <div key={idx} className="text-center text-sm font-medium text-[#938F99]">
                  {dayName}
                </div>
              ))}
            </div>
              
            {/* Week emojis */}
            <div className="grid grid-cols-7 gap-2">
              {weeklyData.map((day, index) => {
                // Get emoji based on emotion
                const getEmotion = () => {
                  if (!day.hasData) return { emoji: '⚪', label: 'No data', iconPath: undefined }
                  const firstTask = day.entry?.tasks[0]
                  if (!firstTask) return { emoji: '⚪', label: 'No data', iconPath: undefined }
                  
                  const emotionLevel = firstTask.emotions && firstTask.emotions.length > 0 
                    ? firstTask.emotions[0] 
                    : firstTask.emotion
                  
                  return EMOTIONS[emotionLevel] || { emoji: '😐', label: 'Neutral', iconPath: undefined }
                }
                
                const emotion = getEmotion()
                
                return (
                  <div 
                    key={index} 
                    className="flex flex-col items-center gap-1"
                  >
                    <div 
                      className={`transition-all ${day.hasData ? 'cursor-pointer hover:scale-110' : 'opacity-30'}`}
                    >
                      {emotion.iconPath ? (
                        <img 
                          src={emotion.iconPath} 
                          alt={emotion.label}
                          className="w-8 h-8"
                          style={{ filter: 'brightness(1.3) contrast(1.1)' }}
                        />
                      ) : (
                        <span className="text-3xl">{emotion.emoji}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-[#E6E1E5]">
                      {day.date}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

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
            <div className="bg-white/[0.04] p-6 mb-6" style={{ borderRadius: '4px 47px 4px 4px' }}>
              {/* Custom Illustration */}
              <div className="h-48 mb-4 flex items-center justify-center overflow-hidden" style={{ borderRadius: '0 36px 0 0' }}>
                <img 
                  src="/illustrations/guy_desktop.jpg" 
                  alt="Decorative illustration" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <p className="text-[17px] text-[#E6E1E5] italic leading-relaxed text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                "{randomQuote}"
              </p>
            </div>
          )
        })()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="home"
        onNavigateHome={() => {}} // Dashboard is already the home page
        onNavigateInsights={onViewInsights}
        onNavigateAdd={onAddEntry}
        onNavigateHistory={onViewEntries}
        onNavigateSettings={onViewSettings || (() => {})}
      />
    </div>
  )
}

export default Dashboard

