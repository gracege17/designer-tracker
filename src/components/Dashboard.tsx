import React from 'react'
import { Plus, Settings, Home, PlusCircle, BarChart2, Calendar } from 'lucide-react'
import { Entry, EMOTIONS, EmotionLevel } from '../types'
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


        {/* Insight Cards - Always Show */}
        {(() => {
          // Get all tasks from history
          const allTasks = entries.length > 0 ? entries.flatMap(entry => entry.tasks) : []
          
          // Helper function to get emotions array from task
          const getEmotions = (task: any) => {
            return task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
          }
          
          // Group tasks by project with emotion counts
          const projectEmotionMap = new Map<string, { projectId: string; emotions: EmotionLevel[] }>()
          
          allTasks.forEach(task => {
            const taskEmotions = getEmotions(task)
            const existing = projectEmotionMap.get(task.projectId)
            if (existing) {
              existing.emotions.push(...taskEmotions)
            } else {
              projectEmotionMap.set(task.projectId, {
                projectId: task.projectId,
                emotions: [...taskEmotions]
              })
            }
          })
          
          // 1. What gave you energy - Happy (1), Excited (3), Energized (10), Satisfied (13), Proud (16)
          const energyEmotions = [1, 3, 10, 13, 16]
          const energyProjects = Array.from(projectEmotionMap.values())
            .filter(p => p.emotions.some(e => energyEmotions.includes(e)))
            .sort((a, b) => {
              const aCount = a.emotions.filter(e => energyEmotions.includes(e)).length
              const bCount = b.emotions.filter(e => energyEmotions.includes(e)).length
              return bCount - aCount
            })
            .slice(0, 3)
          
          // 2. What drained you - Sad (5), Anxious (6), Neutral (8), Tired (12), Annoyed (14), Drained (15)
          const drainingEmotions = [5, 6, 8, 12, 14, 15]
          const drainingProjects = Array.from(projectEmotionMap.values())
            .filter(p => p.emotions.some(e => drainingEmotions.includes(e)))
            .sort((a, b) => {
              const aCount = a.emotions.filter(e => drainingEmotions.includes(e)).length
              const bCount = b.emotions.filter(e => drainingEmotions.includes(e)).length
              return bCount - aCount
            })
            .slice(0, 3)
          
          // 3. What felt meaningful - Calm (2), Nostalgic (9), Normal (11), Satisfied (13)
          const meaningfulEmotions = [2, 9, 11, 13]
          const meaningfulProjects = Array.from(projectEmotionMap.values())
            .filter(p => p.emotions.some(e => meaningfulEmotions.includes(e)))
            .sort((a, b) => {
              const aCount = a.emotions.filter(e => meaningfulEmotions.includes(e)).length
              const bCount = b.emotions.filter(e => meaningfulEmotions.includes(e)).length
              return bCount - aCount
            })
            .slice(0, 3)
          
          // 4. What sparked your passion - Excited (3), Surprised (7), Energized (10), Proud (16)
          const passionEmotions = [3, 7, 10, 16]
          const passionProjects = Array.from(projectEmotionMap.values())
            .filter(p => p.emotions.some(e => passionEmotions.includes(e)))
            .sort((a, b) => {
              const aCount = a.emotions.filter(e => passionEmotions.includes(e)).length
              const bCount = b.emotions.filter(e => passionEmotions.includes(e)).length
              return bCount - aCount
            })
            .slice(0, 3)
          
          return (
            <div className="space-y-4 mb-6">
              {/* 1. What Gave You Energy - Yellow/Orange Gradient */}
              <div 
                className="p-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
                style={{ 
                  borderRadius: '0 48px 0 0',
                  background: 'linear-gradient(132deg, #FFE27A 0%, #FF7B54 103.78%)'
                }}
              >
                <div className="flex flex-col items-start gap-3 w-full">
                  <p className="text-[12px] font-normal text-slate-900">
                    What Gave You Energy
                  </p>
                  
                  {energyProjects.length > 0 ? (
                    <>
                      <div className="space-y-1">
                        {energyProjects.map((proj, index) => {
                          const project = ProjectStorage.getProjectById(proj.projectId)
                          return (
                            <p key={index} className="text-[20px] font-black text-slate-900 leading-tight">
                              {project?.name || 'Unknown Project'}
                            </p>
                          )
                        })}
                      </div>
                      <p className="text-[14px] font-normal text-slate-900 opacity-70">
                        Projects that ignited excitement
                      </p>
                    </>
                  ) : (
                    <p className="text-[16px] font-medium text-slate-700 leading-snug italic">
                      Those moments that light you up — a flow state, a breakthrough, or just pure fun.
                    </p>
                  )}
                </div>
              </div>
              
              {/* 2. What Drained You - Light Gray Gradient */}
              <div 
                className="p-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
                style={{ 
                  borderRadius: '0 48px 0 0',
                  background: 'linear-gradient(132deg, #E3E3E3 0%, #A69FAE 103.78%)'
                }}
              >
                <div className="flex flex-col items-start gap-3 w-full">
                  <p className="text-[12px] font-normal text-slate-900">
                    What Drained You
                  </p>
                  
                  {drainingProjects.length > 0 ? (
                    <>
                      <div className="space-y-1">
                        {drainingProjects.map((proj, index) => {
                          const project = ProjectStorage.getProjectById(proj.projectId)
                          return (
                            <p key={index} className="text-[20px] font-black text-slate-900 leading-tight">
                              {project?.name || 'Unknown Project'}
                            </p>
                          )
                        })}
                      </div>
                      <p className="text-[14px] font-normal text-slate-900 opacity-70">
                        Projects that took your energy
                      </p>
                    </>
                  ) : (
                    <p className="text-[16px] font-medium text-slate-700 leading-snug italic">
                      The tasks that took your energy — tedious work, confusion, or feeling stuck.
                    </p>
                  )}
                </div>
              </div>
              
              {/* 3. What Felt Meaningful - Light Purple Gradient */}
              <div 
                className="p-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
                style={{ 
                  borderRadius: '0 48px 0 0',
                  background: 'linear-gradient(132deg, #C7D1FF 0%, #BC7AFF 103.78%)'
                }}
              >
                <div className="flex flex-col items-start gap-3 w-full">
                  <p className="text-[12px] font-normal text-slate-900">
                    What Felt Meaningful
                  </p>
                  
                  {meaningfulProjects.length > 0 ? (
                    <>
                      <div className="space-y-1">
                        {meaningfulProjects.map((proj, index) => {
                          const project = ProjectStorage.getProjectById(proj.projectId)
                          return (
                            <p key={index} className="text-[20px] font-black text-slate-900 leading-tight">
                              {project?.name || 'Unknown Project'}
                            </p>
                          )
                        })}
                      </div>
                      <p className="text-[14px] font-normal text-slate-900 opacity-70">
                        Projects with purposeful impact
                      </p>
                    </>
                  ) : (
                    <p className="text-[16px] font-medium text-slate-700 leading-snug italic">
                      Work that felt purposeful — making an impact, solving real problems, or growth.
                    </p>
                  )}
                </div>
              </div>
              
              {/* 4. What Sparked Passion - Orange Gradient */}
              <div 
                className="p-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
                style={{ 
                  borderRadius: '0 48px 0 0',
                  background: 'linear-gradient(180deg, #FA604D 0%, #F37E58 100%)'
                }}
              >
                <div className="flex flex-col items-start gap-3 w-full">
                  <p className="text-[12px] font-normal text-slate-900">
                    What Sparked Passion
                  </p>
                  
                  {passionProjects.length > 0 ? (
                    <>
                      <div className="space-y-1">
                        {passionProjects.map((proj, index) => {
                          const project = ProjectStorage.getProjectById(proj.projectId)
                          return (
                            <p key={index} className="text-[20px] font-black text-slate-900 leading-tight">
                              {project?.name || 'Unknown Project'}
                            </p>
                          )
                        })}
                      </div>
                      <p className="text-[14px] font-normal text-slate-900 opacity-70">
                        Projects that ignited excitement
                      </p>
                    </>
                  ) : (
                    <p className="text-[16px] font-medium text-slate-700 leading-snug italic">
                      Tasks that ignited your creativity — exploring ideas, experimenting, or discovering.
                    </p>
                  )}
                </div>
              </div>
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

