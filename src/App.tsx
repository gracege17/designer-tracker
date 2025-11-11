import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import AddEntryForm from './components/AddEntryForm'
import EntryList from './components/EntryList'
import EntryDetail from './components/EntryDetail'
import ProjectSelection from './components/ProjectSelectionImproved'
import AddProject from './components/AddProject'
import TaskEntry from './components/TaskEntryImproved'
import EmotionSelection from './components/EmotionSelectionImproved'
import TaskNotes from './components/TaskNotes'
import ReviewReflection from './components/ReviewReflection'
import InsightsScreen from './components/InsightsScreen'
import EditTask from './components/EditTask'
import Settings from './components/Settings'
import OverallFeeling from './components/OverallFeeling'
import EmotionDetailPage from './components/EmotionDetailPage'
import OnboardingAuth from './components/OnboardingAuth'
import OnboardingUserInfo, { UserProfileData } from './components/OnboardingUserInfo'
import OnboardingFirstProject from './components/OnboardingFirstProject'
import OnboardingFirstEntry from './components/OnboardingFirstEntry'
import OnboardingLearningPreference from './components/OnboardingLearningPreference'
import LoadingScreen from './components/LoadingScreen'
import { SuccessToast, Confetti } from './components/SuccessToast'
import { Entry, Project, TaskType, EmotionLevel, Task } from './types'
import { EntryStorage, ProjectStorage, OnboardingStorage, UserProfileStorage } from './utils/storage'
import { createTodayEntry, getTodayDateString, generateId } from './utils/dataHelpers'
import { clearAICache } from './utils/aiInsightsService'
// Note: mock data removed – app now runs entirely on real user input

type ViewType = 'onboardingAuth' | 'onboardingUserInfo' | 'onboardingLearningPreference' | 'onboardingFirstProject' | 'onboardingFirstEntry' | 'dashboard' | 'overallFeeling' | 'projectSelection' | 'addProject' | 'taskEntry' | 'emotionSelection' | 'taskNotes' | 'reviewReflection' | 'insights' | 'addForm' | 'entryList' | 'entryDetail' | 'editTask' | 'settings' | 'emotionDetail'

type EmotionType = 'energized' | 'drained' | 'meaningful' | 'curious'

interface TaskReview {
  id: string
  projectId: string
  description: string
  emotion: EmotionLevel
  emotions?: EmotionLevel[]
  notes?: string
}

function App() {
  // Check if user has completed onboarding
  const hasCompletedOnboarding = OnboardingStorage.isOnboardingCompleted()
  const initialView: ViewType = hasCompletedOnboarding ? 'dashboard' : 'onboardingAuth'
  
  const [currentView, setCurrentView] = useState<ViewType>(initialView)
  const [entries, setEntries] = useState<Entry[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskDescription, setTaskDescription] = useState('')
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionLevel[]>([])
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [collectedTasks, setCollectedTasks] = useState<TaskReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
  
  // Success toast state
  const [successToast, setSuccessToast] = useState({ show: false, message: '' })
  const [showConfetti, setShowConfetti] = useState(false)

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load existing data
        const loadedEntries = EntryStorage.loadEntries()
        const loadedProjects = ProjectStorage.loadProjects()
        
        // Create default project if none exist (and onboarding was skipped)
        let finalProjects = loadedProjects
        if (loadedProjects.length === 0 && hasCompletedOnboarding) {
          const defaultProject = ProjectStorage.createDefaultProject()
          finalProjects = [defaultProject]
        }
        
        // Check for orphaned tasks (tasks with invalid project IDs)
        const projectIds = new Set(finalProjects.map(p => p.id))
        const hasOrphanedTasks = loadedEntries.some(entry => 
          entry.tasks.some(task => !projectIds.has(task.projectId))
        )
        
        if (hasOrphanedTasks) {
          console.warn('⚠️ Found tasks with invalid project IDs. Cleaning up...')
          
          // Create a recovery project for orphaned tasks
          const recoveryProject: Project = {
            id: 'recovered-project',
            name: 'Recovered Projects',
            color: '#D1D5DB', // Gray
            createdAt: new Date()
          }
          
          // Check if recovery project already exists
          if (!projectIds.has('recovered-project')) {
            ProjectStorage.saveProject(recoveryProject)
            finalProjects.push(recoveryProject)
          }
          
          // Fix orphaned tasks
          const cleanedEntries = loadedEntries.map(entry => ({
            ...entry,
            tasks: entry.tasks.map(task => {
              if (!projectIds.has(task.projectId)) {
                console.warn(`Fixing task "${task.description}" with invalid projectId: ${task.projectId}`)
                return { ...task, projectId: 'recovered-project' }
              }
              return task
            })
          }))
          
          // Save cleaned entries
          cleanedEntries.forEach(entry => EntryStorage.saveEntry(entry))
          
          setEntries(cleanedEntries)
        } else {
          setEntries(loadedEntries)
        }
        
        // Persist the latest project list so validation checks succeed
        ProjectStorage.saveProjects(finalProjects)
        setProjects(finalProjects)
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing app:', error)
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  // Helper function to show success toast
  const showSuccess = (message: string, withConfetti = false) => {
    setSuccessToast({ show: true, message })
    if (withConfetti) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }

  const handleStartAddEntry = () => {
    // Check if user has already logged something today
    const todayDate = getTodayDateString()
    const todayEntry = entries.find(entry => entry.date === todayDate)
    
    // If they already have tasks today, skip OverallFeeling and go straight to project selection
    if (todayEntry && todayEntry.tasks.length > 0) {
      setCurrentView('projectSelection')
    } else {
      setCurrentView('overallFeeling')
    }
  }

  const handleOverallFeelingComplete = () => {
    setCurrentView('projectSelection')
  }

  const handleProjectsSelected = (projectIds: string[]) => {
    setSelectedProjectIds(projectIds)
    setCurrentProjectIndex(0) // Start with first project
    setCurrentView('taskEntry')
  }

  const handleTaskDescriptionNext = (description: string) => {
    setTaskDescription(description)
    setCurrentView('emotionSelection')
  }

  const handleEmotionNext = (emotions: EmotionLevel[]) => {
    setSelectedEmotions(emotions)
    setCurrentView('taskNotes')
  }

  const handleAddAnotherTask = (notes?: string) => {
    // Save current task to collected tasks
    if (selectedEmotions.length > 0 && taskDescription && selectedProjectIds[currentProjectIndex]) {
      const newTask: TaskReview = {
        id: generateId(),
        projectId: selectedProjectIds[currentProjectIndex],
        description: taskDescription,
        emotion: selectedEmotions[0], // Use first emotion for backward compatibility
        emotions: selectedEmotions, // Store all emotions
        notes
      }
      console.log('💾 Saving task:', newTask.description, 'Previous count:', collectedTasks.length)
      setCollectedTasks(prev => {
        const updated = [...prev, newTask]
        console.log('📊 New total count:', updated.length)
        return updated
      })
      
      // Reset for next task
      setTaskDescription('')
      setSelectedEmotions([])
      setCurrentView('taskEntry')
    }
  }

  const handleNextProject = (notes?: string) => {
    // Save current task first
    if (selectedEmotions.length > 0 && taskDescription && selectedProjectIds[currentProjectIndex]) {
      const newTask: TaskReview = {
        id: generateId(),
        projectId: selectedProjectIds[currentProjectIndex],
        description: taskDescription,
        emotion: selectedEmotions[0],
        emotions: selectedEmotions,
        notes
      }
      setCollectedTasks(prev => [...prev, newTask])
    }

    // Move to next project in the list
    const nextIndex = currentProjectIndex + 1
    if (nextIndex < selectedProjectIds.length) {
      setCurrentProjectIndex(nextIndex)
      setTaskDescription('')
      setSelectedEmotions([])
      setCurrentView('taskEntry')
    } else {
      // All projects done, go to review
      setCurrentView('reviewReflection')
    }
  }

  const handleDoneReflecting = (notes?: string) => {
    // Save current task first
    if (selectedEmotions.length > 0 && taskDescription && selectedProjectIds[currentProjectIndex]) {
      const newTask: TaskReview = {
        id: generateId(),
        projectId: selectedProjectIds[currentProjectIndex],
        description: taskDescription,
        emotion: selectedEmotions[0],
        emotions: selectedEmotions,
        notes
      }
      setCollectedTasks(prev => [...prev, newTask])
    }
    
    // Go to review page
    setCurrentView('reviewReflection')
  }

  const handleProjectAdded = (newProject: Project) => {
    setProjects(prev => [...prev, newProject])
    showSuccess(`Project "${newProject.name}" created!`)
    setCurrentView('projectSelection')
  }

  const refreshProjects = () => {
    const updatedProjects = ProjectStorage.loadProjects()
    setProjects(updatedProjects)
  }

  const handleEditTask = (taskId: string) => {
    // Find task to edit from collected tasks
    const taskToEdit = collectedTasks.find(t => t.id === taskId)
    if (taskToEdit) {
      // Convert TaskReview to Task format for editing
      const task: Task = {
        id: taskToEdit.id,
        projectId: taskToEdit.projectId,
        description: taskToEdit.description,
        taskType: 'design' as TaskType, // Default task type
        emotion: taskToEdit.emotion,
        emotions: taskToEdit.emotions,
        notes: taskToEdit.notes,
        createdAt: new Date()
      }
      setEditingTask(task)
      setCurrentView('editTask')
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setCollectedTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleSaveReflection = () => {
    try {
      // Get today's date
      const todayDate = getTodayDateString()
      
      // Check if entry exists for today
      const existingEntry = EntryStorage.getEntryByDate(todayDate)
      
      // Convert collected tasks to proper Task format
      const newTasks: Task[] = collectedTasks.map(task => ({
        id: task.id,
        projectId: task.projectId,
        description: task.description,
        taskType: 'design' as TaskType, // Default task type
        emotion: (typeof task.emotion === 'string' ? parseInt(task.emotion, 10) : task.emotion) as EmotionLevel,
        emotions: task.emotions ? task.emotions.map(e => (typeof e === 'string' ? parseInt(e, 10) : e) as EmotionLevel) : undefined, // Ensure numbers
        notes: task.notes,
        createdAt: new Date()
      }))
      
      if (existingEntry) {
        // Add tasks to existing entry
        const updatedEntry: Entry = {
          ...existingEntry,
          tasks: [...existingEntry.tasks, ...newTasks],
          updatedAt: new Date()
        }
        
        EntryStorage.saveEntry(updatedEntry)
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e))
      } else {
        // Create new entry
        const newEntry: Entry = {
          id: generateId(),
          date: todayDate,
          tasks: newTasks,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        EntryStorage.saveEntry(newEntry)
        setEntries(prev => [...prev, newEntry])
      }
      
      // Reset all state
      setSelectedProjectIds([])
      setTaskDescription('')
      setSelectedEmotions([])
      setCurrentProjectIndex(0)
      setCollectedTasks([])
      
      // Clear AI cache to trigger regeneration of insights
      clearAICache()
      
      // Show success celebration
      showSuccess('Reflection saved! Great work today! 🎉', true)
      
      // Go back to dashboard
      setCurrentView('dashboard')
    } catch (error) {
      console.error('Error saving reflection:', error)
      alert('Failed to save reflection. Please try again.')
    }
  }

  const handleAddEntry = (entryData: {
    project: string
    taskName: string
    taskType: TaskType
    emotion: EmotionLevel
    notes?: string
  }) => {
    try {
      // Find or create project
      let projectId = projects.find(p => p.name === entryData.project)?.id
      
      if (!projectId) {
        // Create new project if it doesn't exist
        const newProject: Project = {
          id: `project-${Date.now()}`,
          name: entryData.project,
          color: '#FFD678', // Default warm yellow
          createdAt: new Date()
        }
        ProjectStorage.saveProject(newProject)
        setProjects(prev => [...prev, newProject])
        projectId = newProject.id
      }

      // Use the emotion level directly from the form
      const emotionLevel = entryData.emotion

      // Check if entry exists for today
      const todayDate = getTodayDateString()
      const existingEntry = EntryStorage.getEntryByDate(todayDate)

      if (existingEntry) {
        // Add task to existing entry
        const newTask = {
          id: `task-${Date.now()}`,
          projectId: projectId,
          description: entryData.taskName,
          taskType: entryData.taskType,
          emotion: emotionLevel,
          notes: entryData.notes,
          createdAt: new Date()
        }

        const updatedEntry = {
          ...existingEntry,
          tasks: [...existingEntry.tasks, newTask],
          updatedAt: new Date()
        }

        EntryStorage.saveEntry(updatedEntry)
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e))
      } else {
        // Create new entry
        const newEntry = createTodayEntry(
          projectId,
          entryData.taskName,
          entryData.taskType,
          emotionLevel,
          entryData.notes
        )

        EntryStorage.saveEntry(newEntry)
        setEntries(prev => [...prev, newEntry])
      }

      setCurrentView('dashboard')
    } catch (error) {
      console.error('Error adding entry:', error)
    }
  }

  const handleViewEntry = (entry: Entry) => {
    setSelectedEntry(entry)
    setCurrentView('entryDetail')
  }

  const handleViewEmotionDetail = (emotion: EmotionType) => {
    setSelectedEmotion(emotion)
    setCurrentView('emotionDetail')
  }

  const handleEditEntryTask = (taskId: string) => {
    if (!selectedEntry) return
    
    const taskToEdit = selectedEntry.tasks.find(t => t.id === taskId)
    if (taskToEdit) {
      setEditingTask(taskToEdit)
      setCurrentView('editTask')
    }
  }

  const handleSaveEditedTask = (updatedTask: Task) => {
    try {
      if (selectedEntry) {
        // Editing a saved entry task
        const updatedTasks = selectedEntry.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
        
        const updatedEntry: Entry = {
          ...selectedEntry,
          tasks: updatedTasks,
          updatedAt: new Date()
        }
        
        // Save to storage
        EntryStorage.saveEntry(updatedEntry)
        
        // Update state
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e))
        setSelectedEntry(updatedEntry)
        setEditingTask(null)
        
        // Show success
        showSuccess('Task updated successfully!')
        
        setCurrentView('entryDetail')
      } else {
        // Editing a collected task (during review)
        const updatedCollectedTasks = collectedTasks.map(task => 
          task.id === updatedTask.id 
            ? {
                ...task,
                description: updatedTask.description,
                emotion: updatedTask.emotion,
                emotions: updatedTask.emotions,
                notes: updatedTask.notes
              }
            : task
        )
        
        setCollectedTasks(updatedCollectedTasks)
        setEditingTask(null)
        
        // Show success
        showSuccess('Task updated successfully!')
        
        setCurrentView('reviewReflection')
      }
    } catch (error) {
      console.error('Error saving edited task:', error)
      alert('Failed to save changes. Please try again.')
    }
  }

  const handleCancelEditTask = () => {
    setEditingTask(null)
    // Go back to the appropriate view
    if (selectedEntry) {
      setCurrentView('entryDetail')
    } else {
      setCurrentView('reviewReflection')
    }
  }

  const handleDeleteEntryTask = (taskId: string) => {
    if (!selectedEntry) return
    
    try {
      // Remove task from the entry
      const updatedTasks = selectedEntry.tasks.filter(task => task.id !== taskId)
      
      if (updatedTasks.length === 0) {
        // If no tasks left, delete the entire entry
        EntryStorage.deleteEntry(selectedEntry.id)
        setEntries(prev => prev.filter(e => e.id !== selectedEntry.id))
        setCurrentView('entryList')
      } else {
        // Update entry with remaining tasks
        const updatedEntry = {
          ...selectedEntry,
          tasks: updatedTasks,
          updatedAt: new Date()
        }
        
        EntryStorage.saveEntry(updatedEntry)
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e))
        setSelectedEntry(updatedEntry) // Update the selected entry to reflect changes
        
        // Show success
        showSuccess('Task deleted')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // Onboarding handlers
  const handleAuthMethod = (method: 'google' | 'facebook' | 'email') => {
    // Mock authentication - in production, this would call actual auth services
    console.log(`Mock authentication with: ${method}`)
    // Store auth method for later
    localStorage.setItem('designer_tracker_auth_method', method)
    setCurrentView('onboardingUserInfo')
  }

  const handleUserInfoComplete = (userData: UserProfileData) => {
    // Save user profile
    const authMethod = localStorage.getItem('designer_tracker_auth_method') as any || 'guest'
    const fullUserData = {
      ...userData,
      authMethod
    }
    UserProfileStorage.saveUserProfile(fullUserData)
    setUserProfile(userData)
    setCurrentView('onboardingLearningPreference')
  }

  const handleLearningPreferenceComplete = (preferences: string[]) => {
    UserProfileStorage.updateUserProfile({ learningPreferences: preferences })
    setUserProfile(prev => prev ? { ...prev, learningPreferences: preferences } : prev)
    setCurrentView('onboardingFirstProject')
  }

  const handleOnboardingProjectComplete = (projectsData: Array<{ name: string; color: string }>) => {
    // Create all projects
    const newProjects: Project[] = projectsData.map(projectData => ({
      id: generateId(),
      name: projectData.name,
      color: projectData.color,
      createdAt: new Date()
    }))
    
    // Save all projects
    newProjects.forEach(project => ProjectStorage.saveProject(project))
    setProjects(newProjects)
    setCurrentView('onboardingFirstEntry')
  }

  const handleOnboardingSkip = () => {
    // Create default project if skipped
    const defaultProject = ProjectStorage.createDefaultProject()
    setProjects([defaultProject])
    setCurrentView('onboardingFirstEntry')
  }

  const handleOnboardingStartEntry = () => {
    // Mark onboarding as complete and start first entry
    OnboardingStorage.markOnboardingCompleted()
    setCurrentView('projectSelection')
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'onboardingAuth':
        return (
          <OnboardingAuth
            onContinueWithGoogle={() => handleAuthMethod('google')}
            onContinueWithFacebook={() => handleAuthMethod('facebook')}
            onContinueWithEmail={() => handleAuthMethod('email')}
          />
        )
      case 'onboardingUserInfo':
        return (
          <OnboardingUserInfo
            onComplete={handleUserInfoComplete}
          />
        )
      case 'onboardingLearningPreference':
        return (
          <OnboardingLearningPreference
            onComplete={handleLearningPreferenceComplete}
            onBack={() => setCurrentView('onboardingUserInfo')}
          />
        )
      case 'onboardingFirstProject':
        return (
          <OnboardingFirstProject
            userName={userProfile?.name || 'there'}
            onComplete={handleOnboardingProjectComplete}
            onSkip={handleOnboardingSkip}
          />
        )
      case 'onboardingFirstEntry':
        return (
          <OnboardingFirstEntry
            onStartEntry={handleOnboardingStartEntry}
          />
        )
      case 'overallFeeling':
        return (
          <OverallFeeling
            onComplete={handleOverallFeelingComplete}
            onBack={() => setCurrentView('dashboard')}
          />
        )
      case 'projectSelection':
        return (
          <ProjectSelection
            projects={projects}
            initialSelectedProjects={selectedProjectIds}
            onProjectsSelected={handleProjectsSelected}
            onBack={() => setCurrentView('overallFeeling')}
            onProjectDeleted={refreshProjects}
          />
        )
      case 'addProject':
        return (
          <AddProject
            onProjectAdded={handleProjectAdded}
            onBack={() => setCurrentView('projectSelection')}
          />
        )
      case 'taskEntry':
        return (
          <TaskEntry
            selectedProjectIds={[selectedProjectIds[currentProjectIndex]]}
            initialTaskDescription={taskDescription}
            onNext={handleTaskDescriptionNext}
            onBack={() => setCurrentView('projectSelection')}
          />
        )
      case 'emotionSelection':
        return (
          <EmotionSelection
            selectedProjectIds={[selectedProjectIds[currentProjectIndex]]}
            initialTaskDescription={taskDescription}
            initialEmotion={selectedEmotions}
            onNext={handleEmotionNext}
            onBack={() => {
              console.log('Going back from emotionSelection to taskEntry')
              setCurrentView('taskEntry')
            }}
          />
        )
      case 'taskNotes':
        const isLastProject = currentProjectIndex === selectedProjectIds.length - 1
        return (
          <TaskNotes
            selectedProjectIds={[selectedProjectIds[currentProjectIndex]]}
            onAddAnotherTask={handleAddAnotherTask}
            onNextProject={handleNextProject}
            onDoneReflecting={handleDoneReflecting}
            onBack={() => setCurrentView('emotionSelection')}
            isLastProject={isLastProject}
          />
        )
      case 'reviewReflection':
        return (
          <ReviewReflection
            tasks={collectedTasks}
            onBack={() => setCurrentView('taskNotes')}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onSaveReflection={handleSaveReflection}
          />
        )
      case 'addForm':
        return (
          <AddEntryForm 
            onSubmit={handleAddEntry}
            onCancel={() => setCurrentView('reviewReflection')}
            selectedProjectIds={selectedProjectIds}
            initialTaskDescription={taskDescription}
            initialEmotion={selectedEmotions[0] || 1}
          />
        )
      case 'insights':
        return (
          <InsightsScreen
            entries={entries}
            onNavigateHome={() => setCurrentView('dashboard')}
            onNavigateAdd={handleStartAddEntry}
            onNavigateHistory={() => setCurrentView('entryList')}
            onNavigateSettings={() => setCurrentView('settings')}
            onViewEntry={handleViewEntry}
            onEmotionClick={handleViewEmotionDetail}
          />
        )
      case 'emotionDetail':
        return selectedEmotion ? (
          <EmotionDetailPage
            emotion={selectedEmotion}
            entries={entries}
            onBack={() => setCurrentView('insights')}
            onNavigateHome={() => setCurrentView('dashboard')}
            onNavigateAdd={handleStartAddEntry}
            onNavigateHistory={() => setCurrentView('entryList')}
            onNavigateSettings={() => setCurrentView('settings')}
          />
        ) : null
      case 'entryList':
        return (
          <EntryList 
            entries={entries}
            onNavigateHome={() => setCurrentView('dashboard')}
            onNavigateAdd={handleStartAddEntry}
            onNavigateInsights={() => setCurrentView('insights')}
            onNavigateSettings={() => setCurrentView('settings')}
            onViewEntry={handleViewEntry}
          />
        )
      case 'entryDetail':
        return selectedEntry ? (
          <EntryDetail
            entry={selectedEntry}
            onBack={() => setCurrentView('entryList')}
            onEditTask={handleEditEntryTask}
            onDeleteTask={handleDeleteEntryTask}
            onNavigateHome={() => setCurrentView('dashboard')}
            onNavigateAdd={handleStartAddEntry}
            onNavigateInsights={() => setCurrentView('insights')}
            onNavigateHistory={() => setCurrentView('entryList')}
            onNavigateSettings={() => setCurrentView('settings')}
          />
        ) : (
          <div className="flex items-center justify-center h-screen bg-background-light">
            <p className="text-slate-600">Entry not found</p>
          </div>
        )
      case 'editTask':
        return editingTask ? (
          <EditTask
            task={editingTask}
            entryDate={selectedEntry?.date || getTodayDateString()}
            onSave={handleSaveEditedTask}
            onCancel={handleCancelEditTask}
          />
        ) : (
          <div className="flex items-center justify-center h-screen bg-background-light">
            <p className="text-slate-600">Task not found</p>
          </div>
        )
      case 'settings':
        return (
          <Settings
            onBack={() => setCurrentView('dashboard')}
            onNavigateHome={() => setCurrentView('dashboard')}
            onNavigateAdd={handleStartAddEntry}
            onNavigateInsights={() => setCurrentView('insights')}
            onNavigateHistory={() => setCurrentView('entryList')}
          />
        )
      default:
        return (
          <Dashboard 
            entries={entries}
            onAddEntry={handleStartAddEntry}
            onViewEntries={() => setCurrentView('entryList')}
            onViewInsights={() => setCurrentView('insights')}
            onViewSettings={() => setCurrentView('settings')}
            isLoading={isLoading}
          />
        )
    }
  }

  return (
    <div className="app-container">
      {renderCurrentView()}
      
      {/* Success toast and confetti */}
      <SuccessToast 
        message={successToast.message}
        show={successToast.show}
        onHide={() => setSuccessToast({ show: false, message: '' })}
      />
      <Confetti trigger={showConfetti} />
    </div>
  )
}

export default App

