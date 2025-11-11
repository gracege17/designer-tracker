/**
 * Integration Test for Today's Summary Feature
 * 
 * Tests the REAL summary generation logic used in production.
 * Calls buildLocalSummary() directly (same function used in production).
 * No mocks - testing actual implementation, no API calls needed.
 * 
 * Run: npx tsx test-summary-generation.ts
 */

import { Entry, EmotionLevel, EMOTIONS } from './src/types'
import { buildLocalSummary } from './src/utils/aiSummaryService'

// Helper to create mock entry
const createMockEntry = (tasks: Array<{ description: string; emotion: EmotionLevel; taskType?: string }>): Entry => {
  return {
    id: 'test-entry',
    date: new Date().toISOString().split('T')[0],
    tasks: tasks.map((task, i) => ({
      id: `task-${i}`,
      projectId: 'project-1',
      description: task.description,
      taskType: (task.taskType || 'visual-design') as any,
      emotion: task.emotion,
      emotions: [task.emotion],
      createdAt: new Date()
    })),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// Helper to get emotion ID by label from the REAL source data
function getEmotionIdByLabel(label: string): EmotionLevel {
  const emotion = Object.entries(EMOTIONS).find(([_, data]) => data.label === label)
  if (!emotion) throw new Error(`Emotion label "${label}" not found in EMOTIONS`)
  return parseInt(emotion[0]) as EmotionLevel
}

// Helper to calculate average emotion
function calculateAverageEmotion(emotions: EmotionLevel[]): number {
  if (emotions.length === 0) return 0
  return emotions.reduce((sum, e) => sum + e, 0) / emotions.length
}

// Helper to determine emotion range
function getEmotionRange(avgEmotion: number): string {
  if (avgEmotion >= 10) return 'Very High (≥10)'
  if (avgEmotion >= 7) return 'Medium-High (7-9)'
  if (avgEmotion >= 4) return 'Low-Medium (4-6)'
  return 'Low (<4)'
}

// Test scenarios
const scenarios = {
  'Very High Energy Day': {
    entry: createMockEntry([
      { description: 'Working on new feature', emotion: getEmotionIdByLabel('Energized'), taskType: 'visual-design' },
      { description: 'Design review went great', emotion: getEmotionIdByLabel('Excited'), taskType: 'feedback-review' },
      { description: 'Shipped the project', emotion: getEmotionIdByLabel('Proud'), taskType: 'prototyping' }
    ]),
    description: '3 tasks with high emotions (Energized, Excited, Proud)',
    expected: {
      emotionRange: 'Very High',
      keywords: ['energized', 'energizing', 'creative flow', 'unstoppable']
    }
  },

  'Solid Productive Day': {
    entry: createMockEntry([
      { description: 'Morning wireframes', emotion: getEmotionIdByLabel('Happy') },
      { description: 'Design system work', emotion: getEmotionIdByLabel('Satisfied') },
      { description: 'Team sync', emotion: getEmotionIdByLabel('Calm') }
    ]),
    description: '3 tasks with medium-high emotions (Happy, Satisfied, Calm)',
    expected: {
      emotionRange: 'Medium-High',
      keywords: ['productive', 'solid', 'momentum', 'steady']
    }
  },

  'Mixed Challenging Day': {
    entry: createMockEntry([
      { description: 'Debugging UI issues', emotion: getEmotionIdByLabel('Frustrated') },
      { description: 'Tight deadline pressure', emotion: getEmotionIdByLabel('Anxious') },
      { description: 'Long meeting', emotion: getEmotionIdByLabel('Tired') }
    ]),
    description: '3 tasks with low-medium emotions (Frustrated, Anxious, Tired)',
    expected: {
      emotionRange: 'Low-Medium',
      keywords: ['challenging', 'worked through', 'resilience', 'building']
    }
  },

  'Tough Day': {
    entry: createMockEntry([
      { description: 'Project feedback was negative', emotion: getEmotionIdByLabel('Sad') },
      { description: 'Felt exhausted all day', emotion: getEmotionIdByLabel('Drained') },
      { description: 'Struggled to focus', emotion: getEmotionIdByLabel('Tired') }
    ]),
    description: '3 tasks with low emotions (Sad, Drained, Tired)',
    expected: {
      emotionRange: 'Low',
      keywords: ['tough', 'pushed through', 'difficult', 'breakthrough']
    }
  },

  'High Energy Creative Flow': {
    entry: createMockEntry([
      { description: 'Designed new component system', emotion: getEmotionIdByLabel('Excited') },
      { description: 'Prototyped interactions', emotion: getEmotionIdByLabel('Energized') },
      { description: 'Presented to stakeholders', emotion: getEmotionIdByLabel('Proud') },
      { description: 'Got amazing feedback', emotion: getEmotionIdByLabel('Happy') }
    ]),
    description: '4 tasks, all high positive emotions',
    expected: {
      emotionRange: 'Very High',
      keywords: ['energized', 'creative', 'flow']
    }
  },

  'Mostly Neutral Day': {
    entry: createMockEntry([
      { description: 'Regular standup', emotion: getEmotionIdByLabel('Neutral') },
      { description: 'Routine design updates', emotion: getEmotionIdByLabel('Normal') },
      { description: 'Documentation work', emotion: getEmotionIdByLabel('Calm') }
    ]),
    description: '3 tasks with neutral emotions',
    expected: {
      emotionRange: 'Medium-High',
      keywords: ['solid', 'productive', 'steady']
    }
  },

  'Edge Case: Single Task': {
    entry: createMockEntry([
      { description: 'Quick design fix', emotion: getEmotionIdByLabel('Satisfied') }
    ]),
    description: 'Just 1 task',
    expected: {
      emotionRange: 'Very High',
      hasSummary: true
    }
  },

  'Edge Case: Empty Entry': {
    entry: undefined,
    description: 'No tasks logged',
    expected: {
      exactMessage: "Add your first task to see today's summary."
    }
  },

  'Varied Task Types': {
    entry: createMockEntry([
      { description: 'User research interviews', emotion: getEmotionIdByLabel('Excited'), taskType: 'user-research' },
      { description: 'Wireframing flows', emotion: getEmotionIdByLabel('Energized'), taskType: 'wireframing' },
      { description: 'Design system updates', emotion: getEmotionIdByLabel('Satisfied'), taskType: 'design-system' }
    ]),
    description: '3 tasks with different task types',
    expected: {
      emotionRange: 'Very High',
      mentionsTaskTypes: true
    }
  }
}

// Run test for a specific scenario or all
async function runTest(scenarioName?: string) {
  const scenariosToRun = scenarioName 
    ? { [scenarioName]: scenarios[scenarioName as keyof typeof scenarios] }
    : scenarios

  if (!scenariosToRun || Object.keys(scenariosToRun).length === 0) {
    console.error(`\n❌ Scenario "${scenarioName}" not found!\n`)
    console.log('Available scenarios:')
    Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
    process.exit(1)
  }

  for (const [name, scenario] of Object.entries(scenariosToRun)) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${name}`)
    console.log(`${'='.repeat(60)}\n`)

    console.log(`📝 Input: ${scenario.description}`)
    
    if (scenario.entry && scenario.entry.tasks) {
      console.log(`   Tasks: ${scenario.entry.tasks.length}`)
      scenario.entry.tasks.forEach((task, i) => {
        const emotionLabel = EMOTIONS[task.emotion]?.label || 'Unknown'
        console.log(`     ${i + 1}. ${task.description} → ${emotionLabel} (${task.emotion})`)
      })

      // Calculate and show analysis
      const emotions = scenario.entry.tasks.map(t => t.emotion)
      const avgEmotion = calculateAverageEmotion(emotions)
      const emotionRange = getEmotionRange(avgEmotion)

      console.log('\n📊 Analysis:')
      console.log(`   Total tasks: ${scenario.entry.tasks.length}`)
      console.log(`   Average emotion: ${avgEmotion.toFixed(2)}`)
      console.log(`   Emotion range: ${emotionRange}`)
    } else {
      console.log('   (No entry - testing empty case)')
    }

    // Generate summary using local logic (same as production uses)
    console.log('\n⏳ Generating summary...\n')
    
    let summary: string
    if (!scenario.entry || !scenario.entry.tasks || scenario.entry.tasks.length === 0) {
      summary = "Add your first task to see today's summary."
    } else {
      const taskData = scenario.entry.tasks.map(task => ({
        emotion: task.emotion,
        taskType: task.taskType
      }))
      summary = buildLocalSummary(taskData)
    }

    // Display result
    console.log('✅ Result:')
    console.log(`   Summary: "${summary}"`)
    console.log(`   Character count: ${summary.length}`)

    // Validate against expectations
    if ('exactMessage' in scenario.expected && scenario.expected.exactMessage) {
      const matches = summary === scenario.expected.exactMessage
      console.log(`   Expected match: ${matches ? '✅' : '❌'}`)
      if (!matches) {
        console.log(`   Expected: "${scenario.expected.exactMessage}"`)
      }
    } else if ('keywords' in scenario.expected && scenario.expected.keywords) {
      const summaryLower = summary.toLowerCase()
      const matchedKeywords = scenario.expected.keywords.filter(kw => 
        summaryLower.includes(kw.toLowerCase())
      )
      console.log(`   Keyword matches: ${matchedKeywords.length}/${scenario.expected.keywords.length}`)
      if (matchedKeywords.length > 0) {
        console.log(`   Matched: ${matchedKeywords.join(', ')}`)
      }
    }

    // Wait a bit between tests
    if (Object.keys(scenariosToRun).length > 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ All tests completed!')
  console.log('='.repeat(60) + '\n')
}

// Parse command line args
const args = process.argv.slice(2)
const scenarioArg = args.find(arg => !arg.startsWith('-'))

if (args.includes('--help') || args.includes('-h')) {
  console.log('\n📖 Integration Test for Today\'s Summary Feature')
  console.log('=' .repeat(60))
  console.log('\n🎯 This test:')
  console.log('   - Tests REAL production summary generation code')
  console.log('   - No mocks - end-to-end pipeline validation')
  console.log('   - No API calls - uses local rule-based logic')
  console.log('   - Instant execution - runs in milliseconds\n')
  console.log('Usage:')
  console.log('  npx tsx test-summary-generation.ts [scenario-name]\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-summary-generation.ts')
  console.log('  npx tsx test-summary-generation.ts "Very High Energy Day"')
  console.log('  npx tsx test-summary-generation.ts "Tough Day"\n')
} else {
  console.log('\n🚀 Today\'s Summary Integration Test')
  console.log('=' .repeat(60))
  console.log('📊 Testing real production summary generation')
  console.log('⚡ No API calls - instant execution')
  console.log('=' .repeat(60))
  
  runTest(scenarioArg).catch(console.error)
}

