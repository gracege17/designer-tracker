import React, { useState } from 'react'
import { CaretLeft, DownloadSimple, Trash, EnvelopeSimple, HouseSimple, Plus, ChartBar, Notepad, GearSix } from 'phosphor-react'
import BottomNav from './BottomNav'
import { UserProfileStorage, EntryStorage, ProjectStorage } from '../utils/storage'

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

  const handleDeleteAllData = () => {
    const confirm1 = window.confirm('Delete everything? You can\'t undo this.')
    if (!confirm1) return
    
    const confirm2 = window.confirm('Last chance. Your reflections will be gone forever. Really delete?')
    if (!confirm2) return
    
    try {
      EntryStorage.clearEntries()
      ProjectStorage.clearProjects()
      alert('All data has been deleted.')
      window.location.reload()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete data. Please try again.')
    }
  }

  const handleCheckDataIntegrity = () => {
    try {
      const entries = EntryStorage.loadEntries()
      const projects = ProjectStorage.loadProjects()
      const projectIds = new Set(projects.map(p => p.id))
      
      // Find orphaned tasks
      const orphanedTasks: Array<{entryDate: string, taskDescription: string, invalidProjectId: string}> = []
      entries.forEach(entry => {
        entry.tasks.forEach(task => {
          if (!projectIds.has(task.projectId)) {
            orphanedTasks.push({
              entryDate: entry.date,
              taskDescription: task.description,
              invalidProjectId: task.projectId
            })
          }
        })
      })
      
      if (orphanedTasks.length === 0) {
        alert('✅ Data integrity check passed!\n\nAll tasks have valid project references.')
      } else {
        const message = `⚠️ Found ${orphanedTasks.length} task(s) with invalid project references:\n\n` +
          orphanedTasks.slice(0, 5).map(t => `• ${t.taskDescription} (${t.entryDate})`).join('\n') +
          (orphanedTasks.length > 5 ? `\n... and ${orphanedTasks.length - 5} more` : '') +
          '\n\nThis usually happens when projects are deleted but tasks remain.\n\nWould you like to fix this automatically? We\'ll move these tasks to a "Recovered Projects" folder.'
        
        if (window.confirm(message)) {
          // Create recovery project
          const recoveryProject = {
            id: 'recovered-project',
            name: 'Recovered Projects',
            color: '#D1D5DB',
            createdAt: new Date()
          }
          
          if (!projectIds.has('recovered-project')) {
            ProjectStorage.saveProject(recoveryProject)
          }
          
          // Fix orphaned tasks
          const cleanedEntries = entries.map(entry => ({
            ...entry,
            tasks: entry.tasks.map(task => {
              if (!projectIds.has(task.projectId)) {
                return { ...task, projectId: 'recovered-project' }
              }
              return task
            })
          }))
          
          // Save cleaned entries
          cleanedEntries.forEach(entry => EntryStorage.saveEntries(cleanedEntries))
          
          alert('✅ Data has been repaired!\n\nAll orphaned tasks have been moved to "Recovered Projects".')
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Data integrity check failed:', error)
      alert('❌ Failed to check data integrity. Please try again.')
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
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/[0.04] rounded-full transition-all duration-200 active:scale-95 -ml-2"
          >
            <CaretLeft size={24} weight="bold" className="text-[#E6E1E5]" />
          </button>
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
          <div className="p-4 bg-white/[0.04] rounded-xl">
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
          </div>
        </section>

        {/* Account Section */}
        <section>
          <h3 className="text-xs uppercase text-[#A6A6A6] mb-3 tracking-wide">ACCOUNT</h3>
          <div className="p-4 bg-white/[0.04] rounded-xl">
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
          </div>
        </section>

        {/* Data Control Section */}
        <section>
          <h3 className="text-xs uppercase text-[#A6A6A6] mb-3 tracking-wide">DATA CONTROL</h3>
          <div className="space-y-3">
            {/* Export Data */}
            <button
              onClick={handleExportData}
              className="w-full p-4 bg-white/[0.04] rounded-xl text-left transition-all active:scale-[0.98] hover:bg-white/[0.06]"
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
            </button>

            {/* Check Data Integrity */}
            <button
              onClick={handleCheckDataIntegrity}
              className="w-full p-4 bg-white/[0.04] rounded-xl text-left transition-all active:scale-[0.98] hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <GearSix size={20} weight="regular" className="text-[#AF52DE]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Check for Issues</p>
                  <p className="text-xs text-[#938F99]">Scan and fix any broken links</p>
                </div>
              </div>
            </button>

            {/* Delete All Data */}
            <button
              onClick={handleDeleteAllData}
              className="w-full p-4 bg-white/[0.04] rounded-xl text-left transition-all active:scale-[0.98] hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
                  <Trash size={20} weight="regular" className="text-[#FF6B6B]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#FF6B6B]">Delete All Data</p>
                  <p className="text-xs text-[#938F99]">Removes everything permanently</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Feedback Section */}
        <section>
          <h3 className="text-xs uppercase text-[#A6A6A6] mb-3 tracking-wide">FEEDBACK</h3>
          <button
            onClick={handleSendFeedback}
            className="w-full p-4 bg-white/[0.04] rounded-xl text-left transition-all active:scale-[0.98] hover:bg-white/[0.06]"
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
          </button>
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

