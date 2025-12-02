import React, { useState } from 'react'
import { CaretLeft, DownloadSimple, EnvelopeSimple, HouseSimple, Plus, ChartBar, Notepad } from 'phosphor-react'
import BottomNav from './BottomNav'
import { UserProfileStorage, EntryStorage, ProjectStorage } from '../utils/storage'
import ButtonIcon from './ButtonIcon'
import Card from './Card'

interface SettingsProps {
  onBack: () => void
  onNavigateHome: () => void
  onNavigateAdd: () => void
  onNavigateInsights: () => void
  onNavigateHistory: () => void
}

const Settings: React.FC<SettingsProps> = ({
  onBack,
  onNavigateHome,
  onNavigateAdd,
  onNavigateInsights,
  onNavigateHistory
}) => {
  const userProfile = UserProfileStorage.getUserProfile()
  const [name, setName] = useState(userProfile?.name || '')
  const [reminderTime, setReminderTime] = useState('19:00')
  const [isEditingName, setIsEditingName] = useState(false)

  const handleSaveName = () => {
    if (name.trim() && userProfile) {
      UserProfileStorage.saveUserProfile({
        ...userProfile,
        name: name.trim()
      })
      setIsEditingName(false)
    }
  }

  const handleExportData = () => {
    try {
      const entries = EntryStorage.loadEntries()
      const projects = ProjectStorage.loadProjects()
      const data = {
        entries,
        projects,
        userProfile,
        exportedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `designer-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      alert('Data exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const handleSendFeedback = () => {
    window.location.href = 'mailto:feedback@designertracker.app?subject=Designer Tracker Feedback'
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="sticky top-0 bg-black z-10 p-5 border-b border-[#49454F]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <ButtonIcon
            onClick={onBack}
            className="-ml-2 rounded-full hover:bg-white/[0.04] active:scale-95 opacity-100"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </ButtonIcon>
          <h1 className="text-[18px] font-bold text-[#E6E1E5]">
            Settings
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-6 pb-32 max-w-md mx-auto w-full overflow-y-auto space-y-8">
        {/* Daily Reminder Section */}
        <section>
          <h3 className="text-xs uppercase text-[#A6A6A6] mb-3 tracking-wide">DAILY REMINDER</h3>
          <Card className="space-y-3">
            <label className="block">
              <span className="text-sm text-white mb-2 block">
                Reminder Time
              </span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="bg-white/[0.06] rounded-md p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-[#EC5429]"
              />
            </label>
            <p className="text-xs text-[#938F99] mt-2">
              Evening reflection reminder at {reminderTime.replace(/^(\d{2}):(\d{2})$/, (_, h, m) => {
                const hour = parseInt(h);
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12;
                return `${displayHour}:${m} ${period}`;
              })} 🌙
            </p>
          </Card>
        </section>

        {/* Account Section */}
        <section>
          <h3 className="text-xs uppercase text-[#A6A6A6] mb-3 tracking-wide">ACCOUNT</h3>
          <Card className="space-y-3">
            <label className="block">
              <span className="text-sm text-white mb-2 block">
                Your Name
              </span>
              {isEditingName ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName()
                    if (e.key === 'Escape') {
                      setName(userProfile?.name || '')
                      setIsEditingName(false)
                    }
                  }}
                  autoFocus
                  className="bg-white/[0.06] rounded-md p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-[#EC5429]"
                />
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="bg-white/[0.06] rounded-md p-2 w-full text-white cursor-pointer hover:bg-white/[0.08] transition-colors"
                >
                  {name || 'Tap to set your name'}
                </div>
              )}
            </label>
            <p className="text-xs text-[#938F99] mt-2">
              Appears in your daily greeting ✨
            </p>
          </Card>
        </section>

        {/* Data Control Section */}
        <section>
          <h3 className="text-xs uppercase text-[#A6A6A6] mb-3 tracking-wide">DATA CONTROL</h3>
          <div className="space-y-3">
            {/* Export Data */}
            <Card
              as="button"
              type="button"
              onClick={handleExportData}
              className="w-full text-left active:scale-[0.98] hover:bg-white/[0.06] space-y-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <DownloadSimple size={20} weight="regular" className="text-[#CAC4D0]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Export Data</p>
                  <p className="text-xs text-[#938F99]">Save your reflections as backup</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Feedback Section */}
        <section>
          <h3 className="text-xs uppercase text-[#A6A6A6] mb-3 tracking-wide">FEEDBACK</h3>
          <Card
            as="button"
            type="button"
            onClick={handleSendFeedback}
            className="w-full text-left active:scale-[0.98] hover:bg-white/[0.06] space-y-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
                <EnvelopeSimple size={20} weight="regular" className="text-[#CAC4D0]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Send Feedback</p>
                <p className="text-xs text-[#938F99]">Share your thoughts with us 💭</p>
              </div>
            </div>
          </Card>
        </section>

        {/* App Version */}
        <div className="text-center py-8">
          <p className="text-xs text-[#938F99]">
            Designer's Life Tracker v1.0.0
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab="settings"
        onNavigateHome={onNavigateHome}
        onNavigateInsights={onNavigateInsights}
        onNavigateAdd={onNavigateAdd}
        onNavigateHistory={onNavigateHistory}
        onNavigateSettings={() => {}}
      />
    </div>
  )
}

export default Settings

