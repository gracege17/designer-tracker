import React, { useState, useEffect } from 'react'
import { ChevronRight, Home, Plus, BarChart2, Calendar, Search, Settings } from 'lucide-react'
import { Entry } from '../types'
import { ProjectStorage } from '../utils/storage'
import { DateUtils } from '../utils/dateUtils'

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
    <div className="flex h-full min-h-screen w-full flex-col bg-[#FFF9F8] text-slate-800 screen-transition">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#FFF9F8] border-b border-slate-200 p-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-[24px] font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>Reflections</h1>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Search size={24} className="text-slate-900" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 max-w-md mx-auto w-full">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h3 className="text-xl font-semibold text-slate-900 mb-2 text-center">
              No reflections yet
            </h3>
            <p className="text-slate-600 text-center">
              Start tracking your design work to see your history here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([monthKey, monthEntries]) => (
              <div key={monthKey}>
                {/* Month Header with Dropdown */}
                <button 
                  onClick={() => toggleMonth(monthKey)}
                  className="flex items-center justify-between w-full py-3 mb-3"
                >
                  <h3 className="text-[16px] font-bold text-slate-900">
                    {monthKey}
                  </h3>
                  <ChevronRight 
                    size={20} 
                    className={`text-slate-900 transition-transform duration-200 ${
                      expandedMonths[monthKey] ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                
                {/* Entries for this month */}
                {expandedMonths[monthKey] && (
                  <div className="space-y-3">
                  {monthEntries.map((entry) => {
                    const date = DateUtils.parseLocalDate(entry.date)
                    const dayNumber = date.getDate()
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                    
                    return (
                      <div 
                        key={entry.id}
                        onClick={() => onViewEntry(entry)}
                        className="flex cursor-pointer items-stretch bg-white transition-all border border-slate-200 overflow-hidden"
                      >
                        {/* Date Box - Full Height */}
                        <div className="flex-shrink-0 bg-[#000] w-[70px] flex flex-col items-center justify-center text-white py-5">
                          <p className="text-[36px] font-black leading-none mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {dayNumber}
                          </p>
                          <p className="text-[13px] font-medium">
                            {dayName}
                          </p>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 py-4 px-5">
                          {entry.tasks.slice(0, 3).map((task, index) => (
                            <p 
                              key={index} 
                              className="truncate text-[14px] font-bold text-slate-900 mb-1"
                              style={{ lineHeight: '1.5' }}
                            >
                              {task.description}
                            </p>
                          ))}
                          {entry.tasks.length > 3 && (
                            <p className="text-[14px] font-bold text-slate-900">
                              ...
                            </p>
                          )}
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
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="relative flex items-end justify-around px-4 py-3">
          {/* Home */}
          <button 
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_home-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-medium">Home</p>
          </button>

          {/* Overview */}
          <button 
            onClick={onNavigateInsights}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_overview-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-medium">Overview</p>
          </button>

          {/* Add Button - Center & Elevated */}
          <button
            onClick={onNavigateAdd}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="bg-slate-900 rounded-[18px] px-6 py-3 shadow-xl hover:bg-slate-800 active:scale-95 transition-all">
              <Plus size={28} strokeWidth={2.5} className="text-white" />
            </div>
          </button>

          {/* History */}
          <button className="flex flex-col items-center justify-center gap-1.5 text-slate-900 min-w-[64px] py-1">
            <img src="/icons/ic_round-history.svg" alt="" className="w-[26px] h-[26px]" />
            <p className="text-[11px] font-medium">History</p>
          </button>

          {/* Setting */}
          <button 
            onClick={onNavigateSettings}
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

export default EntryList
