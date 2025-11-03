import { Project } from '../src/types'

/**
 * Mock Projects for Testing
 * 
 * These projects are referenced in mockEntries.ts
 */

export const mockProjects: Project[] = [
  {
    id: 'proj-emotion-tracker',
    name: 'Emotion Tracker App',
    color: '#FF2D55', // Red/Pink - energizing color
    createdAt: new Date('2025-10-20T10:00:00')
  },
  {
    id: 'proj-designer-dashboard',
    name: 'Designer Dashboard',
    color: '#AF52DE', // Purple - curious/creative color
    createdAt: new Date('2025-10-20T10:05:00')
  }
]

