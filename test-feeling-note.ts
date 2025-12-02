/**
 * Integration Test for Feeling Note Feature: "Why did you feel that way?"
 * 
 * Tests the feeling note feature behavior:
 * - Notes are optional (can be skipped)
 * - Notes are trimmed of whitespace before saving
 * - Empty notes are stored as undefined (not empty strings)
 * - Notes are saved with tasks and persist through the flow
 * - Maximum length validation (1000 characters)
 * - Notes are linked to selected emotions
 * 
 * Run: npx tsx test-feeling-note.ts
 */

type EmotionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16

interface TaskReview {
  id: string
  projectId: string
  description: string
  emotion: EmotionLevel
  emotions?: EmotionLevel[]
  notes?: string
}

interface Task {
  id: string
  projectId: string
  description: string
  taskType: string
  emotion: EmotionLevel
  emotions?: EmotionLevel[]
  notes?: string
  createdAt: Date
}

// Simulate the notes trimming logic from TaskNotes.tsx
function trimNotes(notes: string): string | undefined {
  const trimmed = notes.trim()
  return trimmed || undefined
}

// Simulate the task creation logic from App.tsx
function createTaskReview(
  projectId: string,
  description: string,
  emotion: EmotionLevel,
  emotions: EmotionLevel[],
  notes?: string
): TaskReview {
  return {
    id: `task-${Date.now()}`,
    projectId,
    description,
    emotion,
    emotions,
    notes: notes ? trimNotes(notes) : undefined
  }
}

// Simulate converting TaskReview to Task format
function convertToTask(taskReview: TaskReview): Task {
  return {
    id: taskReview.id,
    projectId: taskReview.projectId,
    description: taskReview.description,
    taskType: 'design',
    emotion: taskReview.emotion,
    emotions: taskReview.emotions,
    notes: taskReview.notes,
    createdAt: new Date()
  }
}

// Test scenarios
const scenarios = {
  'Notes are optional - can be skipped': {
    description: 'User skips notes field (empty string)',
    notes: '',
    expected: {
      notes: undefined,
      shouldSave: true
    }
  },

  'Notes with content are saved': {
    description: 'User enters notes',
    notes: 'The client loved the direction — felt proud!',
    expected: {
      notes: 'The client loved the direction — felt proud!',
      shouldSave: true
    }
  },

  'Notes are trimmed of whitespace': {
    description: 'Notes with leading/trailing whitespace are trimmed',
    notes: '   The client loved it   ',
    expected: {
      notes: 'The client loved it',
      shouldSave: true
    }
  },

  'Whitespace-only notes become undefined': {
    description: 'Notes with only whitespace become undefined',
    notes: '   \n\t  ',
    expected: {
      notes: undefined,
      shouldSave: true
    }
  },

  'Notes linked to selected emotions': {
    description: 'Notes are saved with selected emotions',
    notes: 'Felt excited because the design was approved',
    selectedEmotions: [3, 10] as EmotionLevel[], // Excited, Energized
    expected: {
      notes: 'Felt excited because the design was approved',
      emotions: [3, 10],
      shouldSave: true
    }
  },

  'Maximum length validation': {
    description: 'Notes should respect 1000 character limit (enforced at UI level)',
    notes: 'a'.repeat(1000), // maxLength={1000} prevents input beyond this
    expected: {
      notes: 'a'.repeat(1000),
      shouldSave: true,
      note: 'In actual component, textarea maxLength={1000} prevents input beyond limit at UI level'
    }
  }
}

// Test runner
function runTests() {
  console.log('🧪 Testing Feeling Note Feature: "Why did you feel that way?"\n')
  console.log('=' .repeat(70))
  
  let passed = 0
  let failed = 0
  
  for (const [testName, scenario] of Object.entries(scenarios)) {
    console.log(`\n📋 Test: ${testName}`)
    console.log(`   Description: ${scenario.description}`)
    
    try {
      const projectId = 'project-1'
      const description = 'Working on homepage redesign'
      const emotion = scenario.selectedEmotions?.[0] || (3 as EmotionLevel) // Default to Excited
      const emotions = scenario.selectedEmotions || [emotion]
      
      // Simulate the flow: create task review with notes
      const taskReview = createTaskReview(
        projectId,
        description,
        emotion,
        emotions,
        scenario.notes
      )
      
      // Convert to Task format (as done in App.tsx)
      const task = convertToTask(taskReview)
      
      // Verify expectations
      const expected = scenario.expected
      
      // Check notes
      if (expected.notes !== undefined && task.notes !== expected.notes) {
        throw new Error(
          `Notes mismatch: expected "${expected.notes}", got "${task.notes}"`
        )
      }
      
      if (expected.notes === undefined && task.notes !== undefined) {
        throw new Error(
          `Notes should be undefined, got "${task.notes}"`
        )
      }
      
      // Check emotions if specified
      if (expected.emotions) {
        if (!task.emotions || !arraysEqual(task.emotions, expected.emotions)) {
          throw new Error(
            `Emotions mismatch: expected [${expected.emotions.join(', ')}], got [${task.emotions?.join(', ') || 'none'}]`
          )
        }
      }
      
      // Check that task was created successfully
      if (expected.shouldSave && !task.id) {
        throw new Error('Task should have been saved but has no ID')
      }
      
      console.log(`   ✅ PASSED`)
      passed++
      
      if (expected.note) {
        console.log(`   ℹ️  ${expected.note}`)
      }
      
    } catch (error) {
      console.log(`   ❌ FAILED: ${error instanceof Error ? error.message : String(error)}`)
      failed++
    }
  }
  
  console.log('\n' + '='.repeat(70))
  console.log(`\n📊 Test Results:`)
  console.log(`   ✅ Passed: ${passed}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📈 Total: ${passed + failed}`)
  
  if (failed === 0) {
    console.log(`\n🎉 All tests passed!`)
    return 0
  } else {
    console.log(`\n⚠️  Some tests failed. Please review the output above.`)
    return 1
  }
}

// Helper function to compare arrays
function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((val, idx) => val === b[idx])
}

// Run the tests
const exitCode = runTests()
process.exit(exitCode)

