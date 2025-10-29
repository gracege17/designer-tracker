import React, { useState, useEffect } from 'react'
import BottomNav from './BottomNav'
import { Entry } from '../types'
import { getTodayDateString } from '../utils/dataHelpers'
import { UserProfileStorage } from '../utils/storage'
import { generateDailySummary } from '../utils/aiSummaryService'
import { calculateTodayEmotionBreakdown } from '../utils/emotionBreakdownService'
import { getHelpfulResources } from '../utils/helpfulResourcesService'
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
              <div className="mb-4">
                <div className="text-[56px] font-bold text-white leading-none">
                  {todayTasks.length}
                </div>
                <div className="text-[20px] font-normal text-white">
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

            {/* Right Section: Emotional Color Bars */}
            {emotionBreakdown && emotionBreakdown.totalTasks > 0 && (
              <div className="flex items-end gap-1.5 h-32">
                {Object.entries(emotionBreakdown.breakdown)
                  .filter(([_, count]: [string, any]) => count > 0)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .slice(0, 4) // Show top 4 emotions
                  .map(([emotionLabel, count]: [string, any], index) => {
                    // Map emotion label to color
                    const emotionColorMap: Record<string, string> = {
                      'Happy': '#4CAF50',
                      'Calm': '#2196F3',
                      'Excited': '#FF9800',
                      'Frustrated': '#F44336',
                      'Sad': '#9C27B0',
                      'Anxious': '#FF5722',
                      'Surprised': '#FFEB3B',
                      'Neutral': '#9E9E9E',
                      'Nostalgic': '#795548',
                      'Energized': '#FFC107',
                      'Normal': '#607D8B',
                      'Tired': '#3F51B5',
                      'Satisfied': '#8BC34A',
                      'Annoyed': '#E91E63',
                      'Drained': '#673AB7',
                      'Proud': '#00BCD4'
                    }
                    const color = emotionColorMap[emotionLabel] || '#666666'
                    
                    // Calculate bar height based on count (max 128px)
                    const maxCount = Math.max(...Object.values(emotionBreakdown.breakdown) as number[])
                    const heightPercentage = (count as number) / maxCount
                    const minHeight = 40 // Minimum height in pixels
                    const maxHeight = 128 // Maximum height in pixels
                    const barHeight = minHeight + (heightPercentage * (maxHeight - minHeight))
                    
                    return (
                      <div
                        key={emotionLabel}
                        className="w-8 transition-all duration-300 rounded-full"
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor: color,
                          opacity: 1 - (index * 0.1) // Slight fade for visual hierarchy
                        }}
                      />
                    )
                  })}
              </div>
            )}
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

