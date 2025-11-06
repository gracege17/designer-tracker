import React, { useState, useEffect } from 'react'
import { CaretRight, HouseSimple, Plus, ChartBar, Notepad, MagnifyingGlass, GearSix } from 'phosphor-react'
import BottomNav from './BottomNav'
import { Entry } from '../types'
import { ProjectStorage } from '../utils/storage'
import { DateUtils } from '../utils/dateUtils'
import ButtonIcon from './ButtonIcon'
import LabelUppercase from './LabelUppercase'

interface EntryListProps {
  entries: Entry[]
  onNavigateHome: () => void
  onNavigateAdd: () => void
  onNavigateInsights: () => void
  onNavigateSettings?: () => void
  onViewEntry: (entry: Entry) => void
}

const EntryList: React.FC<EntryListProps> = ({ 
  entries, 
  onNavigateHome, 
  onNavigateAdd, 
  onNavigateInsights,
  onNavigateSettings,
  onViewEntry
}) => {
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  // Sort entries by date (newest first)
  const sortedEntries = entries.sort((a, b) => b.date.localeCompare(a.date))

  // Group entries by month
  const groupEntriesByMonth = (entries: Entry[]) => {
    const grouped: Record<string, Entry[]> = {}
    
    entries.forEach(entry => {
      const date = DateUtils.parseLocalDate(entry.date)
      const monthKey = `${date.toLocaleString('en-US', { month: 'short' })}, ${date.getFullYear()}`
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = []
      }
      grouped[monthKey].push(entry)
    })
    
    return grouped
  }

  const groupedEntries = groupEntriesByMonth(sortedEntries)

  // Initialize all months as expanded
  useEffect(() => {
    const allMonths = Object.keys(groupedEntries).reduce((acc, month) => {
      acc[month] = true
      return acc
    }, {} as Record<string, boolean>)
    setExpandedMonths(allMonths)
  }, [])

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }))
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col bg-black text-[#E6E1E5] screen-transition">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black border-b border-[#49454F]/30 p-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-[28px] font-bold text-[#E6E1E5]" style={{ fontFamily: 'Playfair Display, serif' }}>Reflections</h1>
          <ButtonIcon className="hover:bg-white/[0.08] rounded-full opacity-100">
            <MagnifyingGlass size={24} weight="light" className="text-[#E6E1E5]" />
          </ButtonIcon>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 max-w-md mx-auto w-full">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h3 className="text-xl font-semibold text-[#E6E1E5] mb-2 text-center">
              No reflections yet
            </h3>
            <p className="text-[#CAC4D0] text-center">
              Start tracking your work to see your history here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([monthKey, monthEntries]) => (
              <div key={monthKey}>
                {/* Month Header with Dropdown */}
                <button 
                  onClick={() => toggleMonth(monthKey)}
                  className="flex items-center justify-between w-full py-3 mb-4"
                >
                  <h3 className="text-[18px] font-bold text-[#E6E1E5] tracking-wide">
                    {monthKey}
                  </h3>
                  <CaretRight 
                    size={20} 
                    weight="bold" 
                    className={`text-[#938F99] transition-transform duration-200 ${
                      expandedMonths[monthKey] ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                
                {/* Entries for this month */}
                {expandedMonths[monthKey] && (
                  <div className="space-y-4">
                  {monthEntries.map((entry) => {
                    const date = DateUtils.parseLocalDate(entry.date)
                    const dayNumber = date.getDate()
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
                    
                    return (
                      <div 
                        key={entry.id}
                        onClick={() => onViewEntry(entry)}
                        className="flex cursor-pointer gap-4 transition-all hover:opacity-80"
                      >
                        {/* Date Section - Square Left Side */}
                        <div className="flex-shrink-0 w-[48px] h-[48px] flex flex-col items-center justify-center bg-[#1C1B1F] rounded">
                          <LabelUppercase className="text-[#79747E] mb-0.5">
                            {dayName}
                          </LabelUppercase>
                          <p className="text-[24px] font-medium leading-none text-white">
                            {dayNumber}
                          </p>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 min-w-0 pb-1">
                          {/* Task Content */}
                          <div className="space-y-2">
                            {entry.tasks.slice(0, 3).map((task, index) => (
                              <p 
                                key={index} 
                                className="text-[15px] font-normal text-white leading-relaxed"
                                style={{ 
                                  lineHeight: '1.6',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                {task.description}
                              </p>
                            ))}
                            {entry.tasks.length > 3 && (
                              <p className="text-[14px] text-[#938F99] italic">
                                +{entry.tasks.length - 3} more task{entry.tasks.length - 3 !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="history"
        onNavigateHome={onNavigateHome}
        onNavigateInsights={onNavigateInsights}
        onNavigateAdd={onNavigateAdd}
        onNavigateHistory={() => {}}
        onNavigateSettings={onNavigateSettings || (() => {})}
      />
    </div>
  )
}

export default EntryList
