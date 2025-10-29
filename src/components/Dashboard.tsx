import React, { useState, useEffect } from 'react'
import BottomNav from './BottomNav'
import { Entry } from '../types'
import { getTodayDateString } from '../utils/dataHelpers'
import { UserProfileStorage } from '../utils/storage'
import { generateDailySummary } from '../utils/aiSummaryService'
import { calculateTodayEmotionBreakdown } from '../utils/emotionBreakdownService'
import { getHelpfulResources } from '../utils/helpfulResourcesService'
import { calculateDailyColor } from '../utils/emotionColorBlender'
import HelpfulResourcesCard from './HelpfulResourcesCard'

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

        {/* Today's Summary Card - Combined with Emotional Flow */}
        <div 
          className="p-6 mb-6 bg-white/[0.04]" 
          style={{ 
            borderRadius: '16px'
          }}
        >
          <div className="flex items-center justify-between gap-6">
            {/* Left Section: Task Count and Summary */}
            <div className="flex-1">
              <p className="text-[12px] font-normal text-[#CAC4D0] mb-4">
                Today's Summary
              </p>
              
              {/* Task Count */}
              <div className="mb-4 flex items-baseline gap-2">
                <div className="text-[32px] font-bold text-white leading-none">
                  {todayTasks.length}
                </div>
                <div className="text-[14px] font-normal text-white">
                  Tasks
                </div>
              </div>
              
              {/* Summary Text */}
              {isLoadingSummary ? (
                <p className="text-[16px] font-normal text-[#CAC4D0] leading-snug italic animate-pulse">
                  Analyzing your day...
                </p>
              ) : (
                <p className="text-[16px] font-normal text-[#CAC4D0] leading-snug">
                  {dailySummary}
                </p>
              )}
            </div>

            {/* Right Section: Flower-Shaped Emotional Indicator */}
            {todayTasks.length > 0 && (() => {
              const dailyColor = calculateDailyColor(todayEntry)
              
              return (
                <svg 
                  width="35" 
                  height="128" 
                  viewBox="0 0 35 128" 
                  className="flex-shrink-0"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }}
                >
                  <defs>
                    {/* Define the flower shape as a clip path */}
                    <clipPath id="flowerClip">
                      <path d="M11.8284 11.3138C10.2663 9.75168 10.2663 7.21902 11.8284 5.65692C14.9526 2.53273 20.0179 2.53273 23.1421 5.65692C24.7042 7.21899 24.7042 9.75171 23.1421 11.3138L17.4853 16.9706L11.8284 11.3138Z" />
                      <path d="M23.1423 23.6569C24.7044 25.219 24.7044 27.7517 23.1423 29.3138C20.0181 32.438 14.9528 32.438 11.8286 29.3138C10.2665 27.7517 10.2665 25.219 11.8286 23.6569L17.4854 18.0001L23.1423 23.6569Z" />
                      <path d="M23.596 11.7492C25.1416 10.1707 27.6741 10.144 29.2526 11.6896C32.4095 14.7807 32.4628 19.8458 29.3717 23.0027C27.8262 24.5811 25.2936 24.6078 23.7152 23.0622L17.9991 17.4653L23.596 11.7492Z" />
                      <path d="M11.3727 23.2215C9.82715 24.8 7.29463 24.8267 5.71617 23.2811C2.55925 20.19 2.50593 15.1249 5.59706 11.968C7.14259 10.3896 9.67517 10.3629 11.2536 11.9085L16.9697 17.5054L11.3727 23.2215Z" />
                    </clipPath>
                  </defs>
                  
                  {/* Render single blended color with flower clip path */}
                  <g clipPath="url(#flowerClip)">
                    <rect
                      x="0"
                      y="0"
                      width="35"
                      height="128"
                      fill={dailyColor}
                      className="transition-all duration-500"
                    />
                  </g>
                </svg>
              )
            })()}
          </div>
        </div>

        {/* 5 Days Challenge Section */}
        <div 
          className="w-full bg-white/[0.04] mb-6"
          style={{ 
            borderRadius: '16px',
            padding: '20px 16px'
          }}
        >
          {/* Challenge Title - Following Card Design System */}
          <p className="text-[11px] sm:text-[12px] font-normal text-[#CAC4D0] mb-1.5 sm:mb-2" style={{ letterSpacing: '0.1em' }}>
            5 DAYS CHALLENGE
          </p>
          
          {/* Challenge Subtitle */}
          <p className="text-[15px] sm:text-[18px] font-medium text-white leading-snug mb-4 sm:mb-6">
            One day at a time, one step closer to a better you
          </p>
          
          {/* Challenge Days Grid - Responsive */}
          <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-start">
            {/* Day 1 - Logo (shows when user logged task today) */}
            <div 
              className="flex items-center justify-center relative overflow-hidden flex-shrink-0"
              style={{
                width: '48px',
                height: '48px',
                aspectRatio: '1/1',
                backgroundImage: 'url("/icons/bg-sm/black cube.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              {todayTasks.length > 0 ? (
                <img 
                  src="/icons/32px-png/32px-logo.png" 
                  alt="Day 1 Complete" 
                  className="w-6 h-6 sm:w-7 sm:h-7 relative z-10"
                />
              ) : (
                <span className="text-[26px] sm:text-[28px] font-normal text-white relative z-10">1</span>
              )}
            </div>
            
            {/* Days 2-5 - Numbers */}
            {[2, 3, 4, 5].map((day) => (
              <div 
                key={day}
                className="flex items-center justify-center relative overflow-hidden flex-shrink-0"
                style={{
                  width: '48px',
                  height: '48px',
                  aspectRatio: '1/1',
                  backgroundImage: 'url("/icons/bg-sm/black cube.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              >
                <span className="text-[26px] sm:text-[28px] font-normal text-white relative z-10">
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Helpful Resources Section - AI-Ready */}
        {emotionBreakdown && (
          <HelpfulResourcesCard 
            resources={getHelpfulResources(
              emotionBreakdown.breakdown,
              emotionBreakdown.totalTasks
            )}
          />
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

