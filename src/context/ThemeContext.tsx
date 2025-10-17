import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'light'
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('designer-tracker-theme')
    return (saved as Theme) || 'light'
  })

  // Apply theme to document root and body for Material 3 styles
  useEffect(() => {
    const root = window.document.documentElement
    const body = window.document.body
    
    // Apply to both html and body for full Material 3 support
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    body.classList.remove('light', 'dark')
    body.classList.add(theme)
    
    localStorage.setItem('designer-tracker-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

