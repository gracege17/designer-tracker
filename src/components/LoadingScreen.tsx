import React from 'react'
import { Sparkles } from 'lucide-react'

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background-light to-blue-50">
      {/* Logo/Icon */}
      <div className="relative mb-8">
        {/* Pulsing outer ring */}
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
        
        {/* Main icon container */}
        <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
          <Sparkles size={48} className="text-slate-900 animate-pulse" />
        </div>
        
        {/* Rotating ring */}
        <div className="absolute -inset-2 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>

      {/* App Name */}
      <h1 className="text-2xl font-bold text-slate-900 mb-2 animate-fade-in">
        Designer's Life Tracker
      </h1>
      
      {/* Loading text */}
      <p className="text-slate-600 animate-fade-in-delay">
        Loading your reflections...
      </p>

      {/* Loading dots */}
      <div className="flex items-center gap-2 mt-6">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Version or tagline */}
      <p className="absolute bottom-8 text-xs text-slate-400">
        Track • Reflect • Grow
      </p>
    </div>
  )
}

export default LoadingScreen

