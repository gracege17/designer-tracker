import { Entry, EmotionLevel } from '../src/types'

/**
 * Mock Entries for Testing Insights Screen
 * 
 * Provides 10 days of entry data with proper Task structure
 * to populate the emotional cards and insights.
 */

// Helper to map mood names to EmotionLevel numbers
const moodToEmotion: Record<string, EmotionLevel> = {
  'Happy': 1,
  'Sad': 5,
  'Anxious': 6,
  'Excited': 3,
  'Frustrated': 4,
  'Tired': 12,
  'Energized': 10,
  'Drained': 15,
  'Satisfied': 8,
  'Proud': 11,
  'Neutral': 2,
  'Surprised': 13,
  'Annoyed': 14,
  'Nostalgic': 9,
  'Calm': 1,
  'Normal': 2,
  'Meaningful': 11,
  'Curious': 3
}

export const mockEntries: Entry[] = [
  // Today - 2025-11-03
  {
    id: 'entry-2025-11-03',
    date: '2025-11-03',
    tasks: [
      {
        id: 'task-1103-1',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Implemented smart summary tags feature',
        taskType: 'visual-design',
        emotion: 10, // Energized
        emotions: [10],
        notes: 'Really proud of this feature!'
      },
      {
        id: 'task-1103-2',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Team collaboration meeting for new sprint',
        taskType: 'meetings',
        emotion: 3, // Excited
        emotions: [3],
        notes: 'Great energy from the team'
      },
      {
        id: 'task-1103-3',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Morning routine planning session',
        taskType: 'documentation',
        emotion: 11, // Proud/Meaningful
        emotions: [11],
        notes: 'Felt organized and ready'
      }
    ],
    createdAt: new Date('2025-11-03T09:00:00'),
    updatedAt: new Date('2025-11-03T17:00:00')
  },

  // 2025-11-02
  {
    id: 'entry-2025-11-02',
    date: '2025-11-02',
    tasks: [
      {
        id: 'task-1102-1',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Styled emotion selection page with new colors',
        taskType: 'visual-design',
        emotion: 3, // Excited
        emotions: [3],
        notes: 'Visual design is coming together nicely'
      },
      {
        id: 'task-1102-2',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Debugging analytics chart rendering issue',
        taskType: 'prototyping',
        emotion: 4, // Frustrated
        emotions: [4],
        notes: 'Took longer than expected'
      },
      {
        id: 'task-1102-3',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Refined mood emoji mapping system',
        taskType: 'design-system',
        emotion: 8, // Satisfied
        emotions: [8],
        notes: 'Happy with the final result'
      }
    ],
    createdAt: new Date('2025-11-02T09:00:00'),
    updatedAt: new Date('2025-11-02T18:00:00')
  },

  // 2025-11-01
  {
    id: 'entry-2025-11-01',
    date: '2025-11-01',
    tasks: [
      {
        id: 'task-1101-1',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Added insights export feature for stakeholders',
        taskType: 'prototyping',
        emotion: 11, // Proud/Meaningful
        emotions: [11],
        notes: 'Team really needed this'
      },
      {
        id: 'task-1101-2',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Tested mood color blending algorithm',
        taskType: 'prototyping',
        emotion: 3, // Curious/Excited
        emotions: [3],
        notes: 'Exploring new approaches'
      },
      {
        id: 'task-1101-3',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Created AI summary prompt templates',
        taskType: 'documentation',
        emotion: 10, // Energized
        emotions: [10],
        notes: 'Good morning focus session'
      }
    ],
    createdAt: new Date('2025-11-01T09:00:00'),
    updatedAt: new Date('2025-11-01T17:30:00')
  },

  // 2025-10-31
  {
    id: 'entry-2025-10-31',
    date: '2025-10-31',
    tasks: [
      {
        id: 'task-1031-1',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Implemented complex onboarding logic',
        taskType: 'prototyping',
        emotion: 15, // Drained
        emotions: [15],
        notes: 'Very draining task'
      },
      {
        id: 'task-1031-2',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Sketched radar chart layout variations',
        taskType: 'wireframing',
        emotion: 11, // Proud
        emotions: [11],
        notes: 'Came up with great ideas'
      },
      {
        id: 'task-1031-3',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Tested emoji touch interactions on mobile',
        taskType: 'user-testing',
        emotion: 9, // Nostalgic
        emotions: [9],
        notes: 'Reminded me of past projects'
      }
    ],
    createdAt: new Date('2025-10-31T09:00:00'),
    updatedAt: new Date('2025-10-31T18:00:00')
  },

  // 2025-10-30
  {
    id: 'entry-2025-10-30',
    date: '2025-10-30',
    tasks: [
      {
        id: 'task-1030-1',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Updated UI components library with new patterns',
        taskType: 'design-system',
        emotion: 2, // Neutral
        emotions: [2],
        notes: 'Standard maintenance work'
      },
      {
        id: 'task-1030-2',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Improved mobile card scaling and responsiveness',
        taskType: 'visual-design',
        emotion: 12, // Tired
        emotions: [12],
        notes: 'Low energy today'
      },
      {
        id: 'task-1030-3',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Documented component behavior and API',
        taskType: 'documentation',
        emotion: 3, // Curious
        emotions: [3],
        notes: 'Learning as I document'
      }
    ],
    createdAt: new Date('2025-10-30T09:00:00'),
    updatedAt: new Date('2025-10-30T17:00:00')
  },

  // 2025-10-29
  {
    id: 'entry-2025-10-29',
    date: '2025-10-29',
    tasks: [
      {
        id: 'task-1029-1',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Connected data model to UI components',
        taskType: 'prototyping',
        emotion: 13, // Surprised
        emotions: [13],
        notes: 'Worked better than expected!'
      },
      {
        id: 'task-1029-2',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Organized task breakdown for sprint planning',
        taskType: 'meetings',
        emotion: 10, // Energized
        emotions: [10],
        notes: 'Good structure for the week'
      },
      {
        id: 'task-1029-3',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Setup daily reflection flow and prompts',
        taskType: 'user-research',
        emotion: 11, // Meaningful
        emotions: [11],
        notes: 'This will really help users'
      }
    ],
    createdAt: new Date('2025-10-29T09:00:00'),
    updatedAt: new Date('2025-10-29T18:00:00')
  },

  // 2025-10-28
  {
    id: 'entry-2025-10-28',
    date: '2025-10-28',
    tasks: [
      {
        id: 'task-1028-1',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Added smooth petal animation effects',
        taskType: 'visual-design',
        emotion: 3, // Excited
        emotions: [3],
        notes: 'Love working on animations!'
      },
      {
        id: 'task-1028-2',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Built project overview widget with stats',
        taskType: 'prototyping',
        emotion: 11, // Meaningful
        emotions: [11],
        notes: 'Key feature for users'
      },
      {
        id: 'task-1028-3',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Styled insights table layout repeatedly',
        taskType: 'visual-design',
        emotion: 14, // Annoyed
        emotions: [14],
        notes: 'Too many revision requests'
      }
    ],
    createdAt: new Date('2025-10-28T09:00:00'),
    updatedAt: new Date('2025-10-28T19:00:00')
  },

  // 2025-10-27
  {
    id: 'entry-2025-10-27',
    date: '2025-10-27',
    tasks: [
      {
        id: 'task-1027-1',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Improved flower grow animation logic',
        taskType: 'prototyping',
        emotion: 8, // Satisfied
        emotions: [8],
        notes: 'Finally got it smooth'
      },
      {
        id: 'task-1027-2',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Created tag selector design patterns',
        taskType: 'design-system',
        emotion: 3, // Curious
        emotions: [3],
        notes: 'Exploring different approaches'
      },
      {
        id: 'task-1027-3',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Tested night mode contrast ratios',
        taskType: 'user-testing',
        emotion: 12, // Tired
        emotions: [12],
        notes: 'Late night testing session'
      }
    ],
    createdAt: new Date('2025-10-27T09:00:00'),
    updatedAt: new Date('2025-10-27T22:00:00')
  },

  // 2025-10-26
  {
    id: 'entry-2025-10-26',
    date: '2025-10-26',
    tasks: [
      {
        id: 'task-1026-1',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Defined KPIs and success metrics',
        taskType: 'user-research',
        emotion: 10, // Energized
        emotions: [10],
        notes: 'Productive morning session'
      },
      {
        id: 'task-1026-2',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Integrated emotion timeline visualization',
        taskType: 'prototyping',
        emotion: 5, // Sad
        emotions: [5],
        notes: 'Struggling with implementation'
      },
      {
        id: 'task-1026-3',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Designed comprehensive mood icon panel',
        taskType: 'visual-design',
        emotion: 6, // Anxious
        emotions: [6],
        notes: 'Worried about deadline'
      }
    ],
    createdAt: new Date('2025-10-26T09:00:00'),
    updatedAt: new Date('2025-10-26T18:30:00')
  },

  // 2025-10-25
  {
    id: 'entry-2025-10-25',
    date: '2025-10-25',
    tasks: [
      {
        id: 'task-1025-1',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Optimized component render performance',
        taskType: 'prototyping',
        emotion: 2, // Neutral
        emotions: [2],
        notes: 'Technical improvement work'
      },
      {
        id: 'task-1025-2',
        projectId: 'proj-emotion-tracker',
        projectName: 'Emotion Tracker App',
        description: 'Explored animation timing and easing',
        taskType: 'visual-design',
        emotion: 3, // Excited
        emotions: [3],
        notes: 'Fun experimentation!'
      },
      {
        id: 'task-1025-3',
        projectId: 'proj-designer-dashboard',
        projectName: 'Designer Dashboard',
        description: 'Cleaned up dashboard layout structure',
        taskType: 'visual-design',
        emotion: 11, // Meaningful
        emotions: [11],
        notes: 'Much cleaner now'
      }
    ],
    createdAt: new Date('2025-10-25T09:00:00'),
    updatedAt: new Date('2025-10-25T17:00:00')
  }
]

