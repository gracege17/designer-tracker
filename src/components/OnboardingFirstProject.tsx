import React, { useState, useRef, useEffect } from 'react'
import { PaperPlaneRight } from 'phosphor-react'
import ButtonIcon from './ButtonIcon'
import ButtonText from './ButtonText'
import { PROJECT_COLORS } from '../types'

interface OnboardingFirstProjectProps {
  userName: string
  onComplete: (projects: Array<{ name: string; color: string }>) => void
  onSkip: () => void
}

interface Project {
  name: string
  color: string
}

interface ChatMessage {
  type: 'ai' | 'user'
  content: string
  projects?: Project[]
}

const OnboardingFirstProject: React.FC<OnboardingFirstProjectProps> = ({ userName, onComplete, onSkip }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: `What did you work on?\n\nList projects however it's easiest:\n• One per line\n• Separate with commas\n• Or use "and"\n\nTap Skip if you'd rather add them later.`
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [pendingProjects, setPendingProjects] = useState<Project[]>([])
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false)
  const [waitingForProjectConfirmation, setWaitingForProjectConfirmation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const parseProjects = (input: string): string[] => {
    // Split by common separators: commas, 'and', newlines
    const projectNames = input
      .split(/,|\band\b|\n/gi)
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => {
        // Capitalize first letter
        return p.charAt(0).toUpperCase() + p.slice(1)
      })
    
    return projectNames
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userInput = inputValue.trim()

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: userInput
    }])

    // Check if user is confirming projects
    if (waitingForProjectConfirmation) {
      if (userInput.toLowerCase() === 'yes' || userInput.toLowerCase() === 'correct' || userInput.toLowerCase() === 'good') {
        // User confirmed, save the projects
        setProjects(prev => [...prev, ...pendingProjects])
        setPendingProjects([])
        setWaitingForProjectConfirmation(false)
        
        setMessages(prev => [...prev, {
          type: 'ai',
          content: `Perfect! I've saved your ${pendingProjects.length > 1 ? 'projects' : 'project'}. 🎉`
        }])

        // Add instruction message
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'ai',
            content: 'Type "Done" or "Great" when you\'re ready to move on. 🙌'
          }])
          setWaitingForConfirmation(true)
        }, 500)
        
        setInputValue('')
        return
      } else {
        // User wants to re-type, reset and parse again
        setWaitingForProjectConfirmation(false)
        setPendingProjects([])
        
        // Parse the new input as a correction
        const projectNames = parseProjects(userInput)
        
        if (projectNames.length > 0) {
          const newProjects: Project[] = projectNames.map((name, index) => ({
            name,
            color: PROJECT_COLORS[(projects.length + index) % PROJECT_COLORS.length]
          }))

          setPendingProjects(newProjects)
          
          // Show parsed projects for confirmation
          setMessages(prev => [...prev, {
            type: 'ai',
            content: `I see you mentioned:`,
            projects: newProjects
          }])

          setTimeout(() => {
            setMessages(prev => [...prev, {
              type: 'ai',
              content: 'Does this look right?\nReply "yes" to continue, or re-type to fix.'
            }])
            setWaitingForProjectConfirmation(true)
          }, 500)
        } else {
          setMessages(prev => [...prev, {
            type: 'ai',
            content: 'Hmm, I didn\'t catch any project names. Try listing them clearly, like "NetSave 2, K12 visual UI" or type "Skip".'
          }])
        }
        
        setInputValue('')
        return
      }
    }

    // Check if user wants to finish
    if (waitingForConfirmation && (userInput.toLowerCase() === 'done' || userInput.toLowerCase() === 'great')) {
      if (projects.length > 0) {
        onComplete(projects)
      } else {
        onSkip()
      }
      return
    }

    // Check if user wants to skip
    if (userInput.toLowerCase() === 'skip' || userInput.toLowerCase() === 'later' || userInput.toLowerCase() === 'no') {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'No worries! You can add projects anytime later. 👍'
      }])
      setTimeout(() => {
        onSkip()
      }, 1500)
      setInputValue('')
      return
    }

    // Parse project names
    const projectNames = parseProjects(userInput)
    
    if (projectNames.length > 0) {
      const newProjects: Project[] = projectNames.map((name, index) => ({
        name,
        color: PROJECT_COLORS[(projects.length + index) % PROJECT_COLORS.length]
      }))

      setPendingProjects(newProjects)
      
      // Show parsed projects for confirmation
      setMessages(prev => [...prev, {
        type: 'ai',
        content: `I see you mentioned:`,
        projects: newProjects
      }])

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: 'Does this look right?\nReply "yes" to continue, or re-type to fix.'
        }])
        setWaitingForProjectConfirmation(true)
      }, 500)
    } else {
      // Couldn't parse projects
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Hmm, I didn\'t catch any project names. Try something like: \'NetSave 2, K12 visual UI\' or type \'skip\'.'
      }])
    }

    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSendMessage()
    }
  }

  const handleSkipClick = () => {
    setMessages(prev => [
      ...prev,
      {
        type: 'ai',
        content: 'No worries! You can add projects anytime later. 👍'
      }
    ])
    setTimeout(() => {
      onSkip()
    }, 600)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto px-6 py-8 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-5 py-4 shadow-[0_16px_44px_rgba(0,0,0,0.35)] border ${
                message.type === 'user'
                  ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] border-[var(--md-sys-color-primary)]'
                  : 'bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] border-white/5'
              }`}
              style={{ borderRadius: message.type === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0' }}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-line">
                {message.content}
              </p>
              {message.projects && message.projects.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {message.projects.map((project, idx) => (
                    <li key={idx} className="text-[15px] font-medium">
                      • {project.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 pb-8">
        <div className="mb-3 flex justify-end">
          <ButtonText type="button" onClick={handleSkipClick}>
            Skip for now
          </ButtonText>
        </div>
        <div className="flex items-center gap-3 bg-[var(--md-sys-color-surface-container-high)] border border-white/10 p-2 shadow-[0_18px_44px_rgba(0,0,0,0.35)]" style={{ borderRadius: '24px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your projects or 'skip'..."
            className="flex-1 px-4 py-3 bg-transparent text-[var(--md-sys-color-on-surface)] text-[15px] outline-none placeholder:text-[var(--md-sys-color-on-surface-variant)]"
            autoFocus
          />
          <ButtonIcon
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`p-3 rounded-full ${
              inputValue.trim()
                ? 'text-[var(--md-sys-color-on-surface)] hover:bg-white/10 active:scale-95 opacity-100'
                : 'text-white/30 cursor-not-allowed opacity-40'
            }`}
            aria-label="Send message"
          >
            <PaperPlaneRight size={20} weight="bold" />
          </ButtonIcon>
        </div>
      </div>
    </div>
  )
}

export default OnboardingFirstProject

