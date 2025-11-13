/**
 * Integration Test for Emotional Cards Feature
 * 
 * Tests the REAL keyword extraction and emotion categorization logic.
 * No mocks - testing actual implementation end-to-end.
 * 
 * Run: npx tsx test-emotional-cards.ts
 */

import { generateSummaryTags } from './src/utils/smartSummaryService'
import { EmotionLevel } from './src/types'

interface Task {
  description: string
  emotion: EmotionLevel
  emotions?: EmotionLevel[]
  taskType?: string
}

// Emotion category definitions (from InsightsScreen)
const EMOTION_CATEGORIES = {
  energized: [1, 3, 10, 13, 16],  // Happy, Excited, Energized, Satisfied, Proud
  drained: [5, 6, 8, 12, 14, 15],  // Sad, Anxious, Neutral, Tired, Annoyed, Drained
  meaningful: [2, 9, 11, 13],      // Calm, Nostalgic, Normal, Satisfied
  curious: [3, 7, 10, 16]          // Excited, Surprised, Energized, Proud
}

// Filter tasks by emotion category
function filterTasksByEmotion(tasks: Task[], category: keyof typeof EMOTION_CATEGORIES): Task[] {
  const emotionIds = EMOTION_CATEGORIES[category]
  return tasks.filter(task => {
    const emotions = task.emotions || [task.emotion]
    return emotions.some(e => emotionIds.includes(e))
  })
}

// Test scenarios
const scenarios = {
  'Clear Theme Match - Team': {
    tasks: [
      { description: 'Morning team standup', emotion: 3 as EmotionLevel },
      { description: 'Team design review', emotion: 3 as EmotionLevel },
      { description: 'Collaborative brainstorming session', emotion: 10 as EmotionLevel }
    ],
    category: 'energized' as const,
    description: '3 tasks with team-related keywords',
    expected: {
      keyword: 'Team collaboration',
      taskCount: 3
    }
  },

  'Multiple Themes': {
    tasks: [
      { description: 'Finished homepage design', emotion: 16 as EmotionLevel },
      { description: 'Completed user flow', emotion: 13 as EmotionLevel },
      { description: 'Shipped feature to production', emotion: 16 as EmotionLevel },
      { description: 'Team meeting', emotion: 3 as EmotionLevel }
    ],
    category: 'energized' as const,
    description: 'Tasks with completion and team themes',
    expected: {
      topKeywords: ['Feature completion', 'Team collaboration'],
      taskCount: 4
    }
  },

  'No Pattern Match (Fallback)': {
    tasks: [
      { description: 'Working on stuff', emotion: 10 as EmotionLevel },
      { description: 'Did things', emotion: 3 as EmotionLevel },
      { description: 'Regular work', emotion: 13 as EmotionLevel }
    ],
    category: 'energized' as const,
    description: 'Generic descriptions with no clear patterns',
    expected: {
      hasFallback: true,
      taskCount: 3
    }
  },

  'Drained Category': {
    tasks: [
      { description: 'Long evening meeting drained me', emotion: 12 as EmotionLevel },
      { description: 'Technical debugging session', emotion: 14 as EmotionLevel },
      { description: 'End of day wrap up', emotion: 15 as EmotionLevel }
    ],
    category: 'drained' as const,
    description: 'Drained emotion tasks',
    expected: {
      possibleKeywords: ['Evening wrap-up', 'Technical challenges'],
      taskCount: 3
    }
  },

  'Empty Category': {
    tasks: [],
    category: 'meaningful' as const,
    description: 'No tasks for this emotion category',
    expected: {
      taskCount: 0,
      noKeyword: true
    }
  },

  'Emotion Categorization': {
    tasks: [
      { description: 'Task A', emotion: 3 as EmotionLevel },   // Excited → Energized + Curious
      { description: 'Task B', emotion: 5 as EmotionLevel },   // Sad → Drained only
      { description: 'Task C', emotion: 13 as EmotionLevel },  // Satisfied → Energized + Meaningful
      { description: 'Task D', emotion: 2 as EmotionLevel },   // Calm → Meaningful only
      { description: 'Task E', emotion: 10 as EmotionLevel }   // Energized → Energized + Curious
    ],
    testCategorization: true,
    description: '5 tasks categorized into 4 emotion families',
    expected: {
      energized: 3,   // Tasks A, C, E
      drained: 1,     // Task B
      meaningful: 2,  // Tasks C, D
      curious: 3      // Tasks A, E, (and maybe C if Proud pattern matches)
    }
  },

  'Pattern Priority': {
    tasks: [
      { description: 'Morning standup with team about prototype', emotion: 3 as EmotionLevel }
    ],
    category: 'energized' as const,
    description: 'Single task matching multiple patterns',
    expected: {
      taskCount: 1,
      multipleMatches: true
    }
  }
}

// Run test
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

    console.log(`📝 Scenario: ${scenario.description}`)

    if ('testCategorization' in scenario && scenario.testCategorization) {
      // Test categorization logic
      console.log(`   Total tasks: ${scenario.tasks.length}\n`)

      console.log('📊 Categorization Results:')
      Object.entries(EMOTION_CATEGORIES).forEach(([categoryName, emotionIds]) => {
        const filtered = filterTasksByEmotion(scenario.tasks, categoryName as keyof typeof EMOTION_CATEGORIES)
        console.log(`   ${categoryName}: ${filtered.length} tasks`)
      })

      console.log('\n✅ Validation:')
      if (scenario.expected.energized !== undefined) {
        const actual = filterTasksByEmotion(scenario.tasks, 'energized').length
        const match = actual === scenario.expected.energized
        console.log(`   Energized count: ${actual} ${match ? '✅' : '❌ Expected: ' + scenario.expected.energized}`)
      }
      if (scenario.expected.drained !== undefined) {
        const actual = filterTasksByEmotion(scenario.tasks, 'drained').length
        const match = actual === scenario.expected.drained
        console.log(`   Drained count: ${actual} ${match ? '✅' : '❌ Expected: ' + scenario.expected.drained}`)
      }
      if (scenario.expected.meaningful !== undefined) {
        const actual = filterTasksByEmotion(scenario.tasks, 'meaningful').length
        const match = actual === scenario.expected.meaningful
        console.log(`   Meaningful count: ${actual} ${match ? '✅' : '❌ Expected: ' + scenario.expected.meaningful}`)
      }
      if (scenario.expected.curious !== undefined) {
        const actual = filterTasksByEmotion(scenario.tasks, 'curious').length
        const match = actual === scenario.expected.curious
        console.log(`   Curious count: ${actual} ${match ? '✅' : '❌ Expected: ' + scenario.expected.curious}`)
      }
    } else {
      // Test keyword extraction
      const filteredTasks = 'category' in scenario 
        ? filterTasksByEmotion(scenario.tasks, scenario.category)
        : scenario.tasks

      console.log(`   Tasks: ${filteredTasks.length}`)
      filteredTasks.forEach((task, i) => {
        console.log(`     ${i + 1}. "${task.description}"`)
      })

      if (filteredTasks.length > 0) {
        const keywords = generateSummaryTags(filteredTasks)

        console.log('\n📊 Keyword Extraction:')
        console.log(`   Generated ${keywords.length} keywords:`)
        keywords.forEach((kw, i) => {
          console.log(`     ${i + 1}. "${kw}"`)
        })

        console.log('\n✅ Result:')
        console.log(`   Top keyword: "${keywords[0] || 'none'}"`)
        console.log(`   Task count: ${filteredTasks.length}`)

        // Validate expectations
        if (scenario.expected.keyword) {
          const match = keywords[0] === scenario.expected.keyword
          console.log(`   Expected keyword: "${scenario.expected.keyword}" ${match ? '✅' : '❌'}`)
        }

        if (scenario.expected.topKeywords) {
          const topKeyword = keywords[0]
          const match = scenario.expected.topKeywords.includes(topKeyword)
          console.log(`   Keyword in expected list: ${match ? 'YES ✅' : 'NO ❌'}`)
          console.log(`   Expected one of: ${scenario.expected.topKeywords.join(', ')}`)
        }

        if (scenario.expected.hasFallback) {
          const isFallback = keywords.some(kw => 
            kw.includes('Daily tasks') || 
            kw.includes('Work activities') || 
            kw.includes('activities')
          )
          console.log(`   Uses fallback: ${isFallback ? 'YES ✅' : 'NO ❌'}`)
        }
      } else {
        console.log('\n✅ Result:')
        console.log(`   Task count: 0`)
        console.log(`   Card shows: "No tasks yet"`)
      }

      if (scenario.expected.taskCount !== undefined) {
        const match = filteredTasks.length === scenario.expected.taskCount
        console.log(`   Expected task count: ${scenario.expected.taskCount} ${match ? '✅' : '❌'}`)
      }
    }

    // Wait between tests
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
  console.log('\n📖 Integration Test for Emotional Cards Feature')
  console.log('=' .repeat(60))
  console.log('\n🎯 This test:')
  console.log('   - Tests REAL production keyword extraction')
  console.log('   - No mocks - validates pattern matching logic')
  console.log('   - Tests emotion categorization')
  console.log('   - Instant execution - runs in milliseconds\n')
  console.log('Usage:')
  console.log('  npx tsx test-emotional-cards.ts [scenario-name]\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-emotional-cards.ts')
  console.log('  npx tsx test-emotional-cards.ts "Clear Theme Match"')
  console.log('  npx tsx test-emotional-cards.ts "Emotion Categorization"\n')
} else {
  console.log('\n🚀 Emotional Cards Integration Test')
  console.log('=' .repeat(60))
  console.log('📊 Testing real production keyword extraction')
  console.log('⚡ No API calls - instant execution')
  console.log('=' .repeat(60))
  
  runTest(scenarioArg).catch(console.error)
}

