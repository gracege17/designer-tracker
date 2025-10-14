import React, { useState, useRef, useEffect } from 'react'
import { Palette, ArrowRight, Plus, X, Send } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import { PROJECT_COLORS } from '../types'

interface OnboardingFirstProjectProps {
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

const OnboardingFirstProject: React.FC<OnboardingFirstProjectProps> = ({ onComplete, onSkip }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: 'Got any projects in motion?\nYou can jot down a few now or add them later. No rush.'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false)
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

      setProjects(prev => [...prev, ...newProjects])
      
      // Add AI confirmation message
      setMessages(prev => [...prev, {
        type: 'ai',
        content: `Awesome — I've saved your ${newProjects.length > 1 ? 'projects' : 'project'}:`,
        projects: newProjects
      }])

      // Add instruction message
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'ai',
          content: 'Type "Done" or "Great" when you\'re ready to move on. 🙌'
        }])
        setWaitingForConfirmation(true)
      }, 500)
    } else {
      // Couldn't parse projects
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Hmm, I didn\'t catch any project names. Try something like "Website redesign, Mobile app" or type "Skip" if you\'d like to add them later.'
      }])
    }

    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6EB]">
      {/* Progress Indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 bg-[#FFD678]" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-[#FFD678]" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-[#FFD678]" style={{ borderRadius: '0 8px 0 0' }}></div>
          <div className="h-2 flex-1 bg-slate-200" style={{ borderRadius: '0 8px 0 0' }}></div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto px-6 py-8 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${message.type === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} px-5 py-4 shadow-sm`}
                 style={{ borderRadius: message.type === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0' }}>
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
        <div className="flex items-center gap-3 bg-white p-2 shadow-sm" style={{ borderRadius: '24px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your projects or 'skip'..."
            className="flex-1 px-4 py-3 bg-transparent text-slate-900 text-[15px] outline-none placeholder:text-slate-400"
            autoFocus
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`p-3 transition-all ${
              inputValue.trim()
                ? 'text-slate-900 hover:bg-slate-100 active:scale-95'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            style={{ borderRadius: '50%' }}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingFirstProject

