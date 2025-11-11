/**
 * Logging Utility
 * 
 * Centralized logging that can be easily toggled on/off
 * 
 * HOW TO TOGGLE LOGGING:
 * ----------------------
 * Change LOGGING_ENABLED below:
 *   - false = No logs (production)
 *   - true = All logs enabled (development/debugging)
 * 
 * Usage:
 *   logger.log('message')           // Regular log
 *   logger.group('title', () => {}) // Grouped logs
 *   logger.error('error')           // Always shows (even when disabled)
 */

// ⚙️ TOGGLE LOGGING HERE ⚙️
const LOGGING_ENABLED = false // Set to true to enable logs

export const logger = {
  /**
   * Log a grouped message with collapsible content
   */
  group: (label: string, fn: () => void) => {
    if (!LOGGING_ENABLED) return
    
    console.group(label)
    fn()
    console.groupEnd()
  },

  /**
   * Log a message
   */
  log: (...args: any[]) => {
    if (!LOGGING_ENABLED) return
    console.log(...args)
  },

  /**
   * Log a warning
   */
  warn: (...args: any[]) => {
    if (!LOGGING_ENABLED) return
    console.warn(...args)
  },

  /**
   * Log an error (always shows, even when logging disabled)
   */
  error: (...args: any[]) => {
    console.error(...args)
  }
}

