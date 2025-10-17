import React, { useState } from 'react'
import { ArrowLeft, Download, Trash2, Mail, Moon, Sun, Home, Plus, BarChart2, Calendar, Settings as SettingsIcon } from 'lucide-react'
import { UserProfileStorage, EntryStorage, ProjectStorage } from '../utils/storage'
import { useTheme } from '../context/ThemeContext'

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
  const { theme, toggleTheme } = useTheme()
  const userProfile = UserProfileStorage.getUserProfile()
  const [name, setName] = useState(userProfile?.name || '')
  const [reminderTime, setReminderTime] = useState('19:00')
  const [isEditingName, setIsEditingName] = useState(false)
  
  const isDarkMode = theme === 'dark'

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
    <div className="min-h-screen flex flex-col bg-[#FFF9F8] dark:bg-[#1C1B1F]">
      {/* Header */}
      <header className="sticky top-0 bg-[#FFF9F8] dark:bg-[#1C1B1F] z-10 p-5 border-b border-slate-200 dark:border-[#49454F]">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <h1 className="text-[18px] font-bold text-slate-900 dark:text-[#E6E1E5]">
            Settings
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-6 pb-32 max-w-md mx-auto w-full overflow-y-auto">
        {/* Daily Reminder Section */}
        <div className="mb-8">
          <h2 className="text-[16px] font-bold text-slate-900 dark:text-[#E6E1E5] mb-4">Daily Reminder</h2>
          <div className="p-5 border-2 border-slate-200 dark:border-[#49454F] bg-white dark:bg-[#2B2930]" style={{ borderRadius: '0 24px 0 0' }}>
            <label className="block mb-3">
              <span className="text-[14px] font-medium text-slate-700 dark:text-[#CAC4D0] mb-2 block">
                Reminder Time
              </span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#211F26] border-2 border-slate-200 dark:border-[#49454F] text-slate-900 dark:text-[#E6E1E5] focus:outline-none focus:border-slate-400 dark:focus:border-[#D0BCFF]"
                style={{ borderRadius: '0 12px 0 0' }}
              />
            </label>
            <p className="text-[13px] text-slate-600 dark:text-[#938F99]">
              Remind me to reflect at {reminderTime}
            </p>
          </div>
        </div>

        {/* Account Section */}
        <div className="mb-8">
          <h2 className="text-[16px] font-bold text-slate-900 dark:text-[#E6E1E5] mb-4">Account</h2>
          <div className="p-5 border-2 border-slate-200 dark:border-[#49454F] bg-white dark:bg-[#2B2930]" style={{ borderRadius: '0 24px 0 0' }}>
            <label className="block">
              <span className="text-[14px] font-medium text-slate-700 dark:text-[#CAC4D0] mb-2 block">
                Your Name
              </span>
              {isEditingName ? (
                <div className="flex gap-2">
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
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#211F26] border-2 border-slate-200 dark:border-[#49454F] text-slate-900 dark:text-[#E6E1E5] focus:outline-none focus:border-slate-400 dark:focus:border-[#D0BCFF]"
                    style={{ borderRadius: '0 12px 0 0' }}
                  />
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  className="px-4 py-3 bg-slate-50 dark:bg-[#211F26] border-2 border-slate-200 dark:border-[#49454F] text-slate-900 dark:text-[#E6E1E5] cursor-pointer hover:bg-slate-100 dark:hover:bg-[#2B2930] transition-colors"
                  style={{ borderRadius: '0 12px 0 0' }}
                >
                  {name || 'Tap to set your name'}
                </div>
              )}
            </label>
            <p className="text-[13px] text-slate-600 dark:text-[#938F99] mt-3">
              Used for personalized greetings
            </p>
          </div>
        </div>

        {/* Data Control Section */}
        <div className="mb-8">
          <h2 className="text-[16px] font-bold text-slate-900 mb-4">Data Control</h2>
          
          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full p-5 mb-3 border-2 border-slate-200 text-left transition-all active:scale-[0.99]"
            style={{ borderRadius: '0 24px 0 0' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Download size={20} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-slate-900">Export data</p>
                  <p className="text-[13px] text-slate-600">Download as JSON</p>
                </div>
              </div>
            </div>
          </button>

          {/* Check Data Integrity */}
          <button
            onClick={handleCheckDataIntegrity}
            className="w-full p-5 mb-3 border-2 border-slate-200 text-left transition-all active:scale-[0.99]"
            style={{ borderRadius: '0 24px 0 0' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <SettingsIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-slate-900">Check for Issues</p>
                  <p className="text-[13px] text-slate-600">Scan and repair broken links</p>
                </div>
              </div>
            </div>
          </button>

          {/* Delete All Data */}
          <button
            onClick={handleDeleteAllData}
            className="w-full p-5 border-2 border-slate-200 text-left transition-all active:scale-[0.99]"
            style={{ borderRadius: '0 24px 0 0' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-red-600">Delete all my data</p>
                  <p className="text-[13px] text-slate-600">Permanently remove everything</p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* App Theme Section */}
        <div className="mb-8">
          <h2 className="text-[16px] font-bold text-slate-900 dark:text-[#E6E1E5] mb-4">App Theme</h2>
          <div className="p-5 border-2 border-slate-200 dark:border-[#49454F] bg-white dark:bg-[#2B2930]" style={{ borderRadius: '0 24px 0 0' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#211F26] flex items-center justify-center">
                  {isDarkMode ? <Moon size={20} className="text-slate-700 dark:text-[#D0BCFF]" /> : <Sun size={20} className="text-slate-700 dark:text-[#D0BCFF]" />}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-slate-900 dark:text-[#E6E1E5]">Dark Mode</p>
                  <p className="text-[13px] text-slate-600 dark:text-[#938F99]">{isDarkMode ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`
                  relative w-14 h-8 rounded-full transition-all cursor-pointer
                  ${isDarkMode ? 'bg-[#D0BCFF]' : 'bg-slate-300'}
                `}
              >
                <div className={`
                  absolute top-1 w-6 h-6 rounded-full transition-transform
                  ${isDarkMode ? 'bg-[#381E72] translate-x-7' : 'bg-white translate-x-1'}
                `}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mb-8">
          <button
            onClick={handleSendFeedback}
            className="w-full p-5 border-2 border-slate-200 text-left transition-all active:scale-[0.99]"
            style={{ borderRadius: '0 24px 0 0' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Mail size={20} className="text-slate-700" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-slate-900">Send Feedback</p>
                <p className="text-[13px] text-slate-600">Help us improve the app</p>
              </div>
            </div>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center py-8">
          <p className="text-[13px] text-slate-500">
            Designer's Life Tracker v1.0.0
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#211F26] border-t border-slate-200 dark:border-[#49454F] z-50">
        <div className="relative flex items-end justify-around px-4 py-3">
          {/* Home */}
          <button 
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_home-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Home</p>
          </button>

          {/* Overview */}
          <button 
            onClick={onNavigateInsights}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/material-symbols_overview-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Overview</p>
          </button>

          {/* Add Button - Center & Elevated */}
          <button
            onClick={onNavigateAdd}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className="bg-slate-900 dark:bg-[#D0BCFF] rounded-[18px] px-6 py-3 hover:bg-slate-800 dark:hover:bg-[#E8DEF8] active:scale-95 transition-all">
              <Plus size={28} strokeWidth={2.5} className="text-white dark:text-[#381E72]" />
            </div>
          </button>

          {/* History */}
          <button 
            onClick={onNavigateHistory}
            className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-[#938F99] hover:text-slate-900 dark:hover:text-[#E6E1E5] transition-colors min-w-[64px] py-1"
          >
            <img src="/icons/ic_round-history.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">History</p>
          </button>

          {/* Setting */}
          <button className="flex flex-col items-center justify-center gap-1.5 text-slate-900 dark:text-[#E6E1E5] min-w-[64px] py-1">
            <img src="/icons/uil_setting.svg" alt="" className="w-[26px] h-[26px] dark:invert dark:brightness-200" />
            <p className="text-[11px] font-medium">Settings</p>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Settings

