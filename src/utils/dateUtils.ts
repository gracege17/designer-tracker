export const DateUtils = {
  // Format date for display
  formatDate: (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  },

  // Format time for display
  formatTime: (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  },

  // Check if date is today
  isToday: (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  },

  // Check if a date string (YYYY-MM-DD format) is today
  isDateStringToday: (dateString: string): boolean => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  },

  // Check if date is this week
  isThisWeek: (date: Date): boolean => {
    const today = new Date()
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    
    return date >= weekStart && date <= weekEnd
  },

  // Get greeting based on time of day
  getGreeting: (): string => {
    const hour = new Date().getHours()
    
    if (hour < 12) return 'Good morning! ☀️'
    if (hour < 17) return 'Good afternoon! 🌤️'
    if (hour < 21) return 'Good evening! 🌅'
    return 'Working late! 🌙'
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return date.toLocaleDateString()
  }
}
