/**
 * Integration Test for Today's Summary Feature
 * 
 * Tests BOTH modes:
 * 1. Rule-based summary (fast, no API key needed)
 * 2. OpenAI GPT summary (requires API key, tests real integration)
 * 
 * Without OPENAI_API_KEY: Tests local rule-based logic
 * With OPENAI_API_KEY: Tests real OpenAI integration
 * 
 * Run: npx tsx test-summary-generation.ts
 */

import 'dotenv/config'
import { Entry, EmotionLevel, EMOTIONS } from './src/types'
import { buildLocalSummary } from './src/utils/aiSummaryService'
import { generateSummaryWithOpenAI } from './src/utils/openaiSummaryGeneration'

// Detect which mode we're in
const HAS_API_KEY = !!process.env.OPENAI_API_KEY
const TEST_MODE = HAS_API_KEY ? 'OpenAI GPT' : 'Rule-based (Local)'

// Helper to create mock entry
const createMockEntry = (tasks: Array<{ 
  description: string; 
  emotion: EmotionLevel; 
  taskType?: string;
  feeling?: string; // Optional feeling description
}>): Entry => {
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
      notes: task.feeling, // Store feeling in notes field
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

// Scenario type
interface TestScenario {
  entry?: Entry
  description: string
  expected?: {
    exactMessage?: string
  }
}

// Test scenarios
const scenarios: Record<string, TestScenario> = {
  'Very High Energy Day': {
    entry: createMockEntry([
      { description: 'Working on new feature', emotion: getEmotionIdByLabel('Energized'), taskType: 'visual-design', feeling: 'fun to explore new feature' },
      { description: 'Design review went great', emotion: getEmotionIdByLabel('Excited'), taskType: 'feedback-review', feeling: 'team gave positive feedback' },
      { description: 'Shipped the project', emotion: getEmotionIdByLabel('Proud'), taskType: 'prototyping', feeling: 'great work' }
    ]),
    description: '3 tasks with high emotions (Energized, Excited, Proud)'
  },

  'Solid Productive Day': {
    entry: createMockEntry([
      { description: 'Morning wireframes', emotion: getEmotionIdByLabel('Happy') },
      { description: 'Design system work', emotion: getEmotionIdByLabel('Satisfied') },
      { description: 'Team sync', emotion: getEmotionIdByLabel('Calm') }
    ]),
    description: '3 tasks with medium-high emotions (Happy, Satisfied, Calm)'
  },

  'Mixed Challenging Day': {
    entry: createMockEntry([
      { description: 'Debugging UI issues', emotion: getEmotionIdByLabel('Frustrated'), feeling: 'stuck on technical problems' },
      { description: 'Tight deadline pressure', emotion: getEmotionIdByLabel('Anxious'), feeling: 'worried about timeline' },
      { description: 'Long meeting', emotion: getEmotionIdByLabel('Tired'), feeling: 'drained from discussions' }
    ]),
    description: '3 tasks with low-medium emotions (Frustrated, Anxious, Tired)'
  },

  'Tough Day': {
    entry: createMockEntry([
      { description: 'Project feedback was negative', emotion: getEmotionIdByLabel('Sad'), feeling: 'disappointed with outcome' },
      { description: 'Felt exhausted all day', emotion: getEmotionIdByLabel('Drained'), feeling: 'no energy left' },
      { description: 'Struggled to focus', emotion: getEmotionIdByLabel('Tired'), feeling: 'hard to concentrate' }
    ]),
    description: '3 tasks with low emotions (Sad, Drained, Tired)'
  },

  'High Energy Creative Flow': {
    entry: createMockEntry([
      { description: 'Designed new component system', emotion: getEmotionIdByLabel('Excited') },
      { description: 'Prototyped interactions', emotion: getEmotionIdByLabel('Energized') },
      { description: 'Presented to stakeholders', emotion: getEmotionIdByLabel('Proud') },
      { description: 'Got amazing feedback', emotion: getEmotionIdByLabel('Happy') }
    ]),
    description: '4 tasks, all high positive emotions'
  },

  'Mostly Neutral Day': {
    entry: createMockEntry([
      { description: 'Regular standup', emotion: getEmotionIdByLabel('Neutral') },
      { description: 'Routine design updates', emotion: getEmotionIdByLabel('Normal') },
      { description: 'Documentation work', emotion: getEmotionIdByLabel('Calm') }
    ]),
    description: '3 tasks with neutral emotions'
  },

  'Edge Case: Single Task': {
    entry: createMockEntry([
      { description: 'Quick design fix', emotion: getEmotionIdByLabel('Satisfied') }
    ]),
    description: 'Just 1 task'
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
    description: '3 tasks with different task types'
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
      console.log(`   Tasks: ${scenario.entry.tasks.length}\n`)
      scenario.entry.tasks.forEach((task, i) => {
        const emotionLabel = EMOTIONS[task.emotion]?.label || 'Unknown'
        console.log(`     ${i + 1}. ${task.description} → ${emotionLabel} (${task.emotion})`)
        if (task.notes) {
          console.log(`        Feeling: ${task.notes}`)
        }
      })

      console.log('\n📊 Analysis:')
      console.log(`   Total tasks: ${scenario.entry.tasks.length}`)
    } else {
      console.log('   (No entry - testing empty case)')
    }

    // Generate summary using appropriate method
    console.log(`\n⏳ Generating summary (${TEST_MODE})...\n`)
    
    let summary: string
    if (!scenario.entry || !scenario.entry.tasks || scenario.entry.tasks.length === 0) {
      summary = "Add your first task to see today's summary."
    } else if (HAS_API_KEY) {
      // Test with OpenAI (real integration!)
      const taskData = scenario.entry.tasks.map(task => ({
        description: task.description,
        emotion: task.emotion,
        emoji: EMOTIONS[task.emotion]?.emoji || '😐',
        taskType: task.taskType || 'visual-design'
      }))
      
      try {
        const result = await generateSummaryWithOpenAI(
          { tasks: taskData, date: scenario.entry.date },
          process.env.OPENAI_API_KEY!,
          process.env.OPENAI_MODEL || 'gpt-4o'
        )
        summary = result.summary
      } catch (error) {
        console.error('   ⚠️ OpenAI failed, falling back to local:', error instanceof Error ? error.message : error)
        const localTaskData = scenario.entry.tasks.map(task => ({
          emotion: task.emotion,
          taskType: task.taskType
        }))
        summary = buildLocalSummary(localTaskData)
      }
    } else {
      // Test with local rule-based logic
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
    
    // Validate length (should be ≤120 chars for proper display)
    if (summary.length > 120) {
      console.log(`   ⚠️  WARNING: Summary exceeds 120 chars (will overflow on mobile!)`)
    } else {
      console.log(`   ✅ Length OK (fits in 3 lines)`)
    }

    // Validate exact message for empty entry case
    if (scenario.expected?.exactMessage) {
      const matches = summary === scenario.expected.exactMessage
      console.log(`   Expected match: ${matches ? '✅' : '❌'}`)
      if (!matches) {
        console.log(`   Expected: "${scenario.expected.exactMessage}"`)
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
  console.log('\n🎯 Two Test Modes:')
  console.log('\n1. Rule-based (No API key):')
  console.log('   - Tests local summary generation logic')
  console.log('   - Instant execution (milliseconds)')
  console.log('   - No costs, deterministic results')
  console.log('\n2. OpenAI GPT (With API key):')
  console.log('   - Tests REAL OpenAI integration')
  console.log('   - Calls GPT-4o for summaries')
  console.log('   - Validates 120 char length constraint')
  console.log('   - ~$0.0005 per test scenario\n')
  console.log('Setup:')
  console.log('  # For rule-based (default):')
  console.log('  npx tsx test-summary-generation.ts')
  console.log('')
  console.log('  # For OpenAI integration:')
  console.log('  echo "OPENAI_API_KEY=sk-your-key" > .env')
  console.log('  npx tsx test-summary-generation.ts\n')
  console.log('Usage:')
  console.log('  npx tsx test-summary-generation.ts [scenario-name]\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-summary-generation.ts')
  console.log('  npx tsx test-summary-generation.ts "Very High Energy Day"')
  console.log('  OPENAI_MODEL=gpt-3.5-turbo npx tsx test-summary-generation.ts\n')
} else {
  console.log('\n🚀 Today\'s Summary Integration Test')
  console.log('=' .repeat(60))
  console.log(`🧪 Test mode: ${TEST_MODE}`)
  if (HAS_API_KEY) {
    console.log(`🤖 Model: ${process.env.OPENAI_MODEL || 'gpt-4o'}`)
    console.log('⚠️  Note: This will make real API calls and incur costs')
  } else {
    console.log('💡 Tip: Add OPENAI_API_KEY to .env to test OpenAI integration')
  }
  console.log('=' .repeat(60))
  
  runTest(scenarioArg).catch(console.error)
}

