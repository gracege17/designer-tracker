/**
 * Integration Test for Today's Color Feature
 * 
 * Tests the REAL color blending functions used in production.
 * No mocks - testing actual implementation end-to-end.
 * 
 * Run: npx tsx test-color-blending.ts
 */

import { Entry, EmotionLevel, EMOTIONS } from './src/types'
import { 
  calculateDailyColor, 
  calculateColorProportions, 
  getColorFamilyBreakdown 
} from './src/utils/emotionColorBlender'
import namer from 'color-namer'

// Helper to create mock entry
const createMockEntry = (tasks: Array<{ description: string; emotion: EmotionLevel }>): Entry => {
  return {
    id: 'test-entry',
    date: new Date().toISOString().split('T')[0],
    tasks: tasks.map((task, i) => ({
      id: `task-${i}`,
      projectId: 'project-1',
      description: task.description,
      taskType: 'visual-design' as const,
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

// Test scenarios
const scenarios = {
  'Pure Single Emotion': {
    entry: createMockEntry([
      { description: 'Task 1', emotion: getEmotionIdByLabel('Anxious') },
      { description: 'Task 2', emotion: getEmotionIdByLabel('Anxious') },
      { description: 'Task 3', emotion: getEmotionIdByLabel('Anxious') }
    ]),
    description: '3 tasks, all "Anxious" (Purple family)',
    expected: {
      dominant: 'Purple',
      percentage: 100
    }
  },

  'Even Split': {
    entry: createMockEntry([
      { description: 'Task 1', emotion: getEmotionIdByLabel('Anxious') },
      { description: 'Task 2', emotion: getEmotionIdByLabel('Anxious') },
      { description: 'Task 3', emotion: getEmotionIdByLabel('Tired') },
      { description: 'Task 4', emotion: getEmotionIdByLabel('Tired') }
    ]),
    description: '2 "Anxious" (Purple), 2 "Tired" (Gray-Blue)',
    expected: {
      families: ['Purple', 'Gray-Blue'],
      split: '50/50'
    }
  },

  'Dominant Emotion': {
    entry: createMockEntry([
      { description: 'Task 1', emotion: getEmotionIdByLabel('Energized') },
      { description: 'Task 2', emotion: getEmotionIdByLabel('Energized') },
      { description: 'Task 3', emotion: getEmotionIdByLabel('Energized') },
      { description: 'Task 4', emotion: getEmotionIdByLabel('Sad') }
    ]),
    description: '3 "Energized" (Red/Pink), 1 "Sad" (Gray-Blue)',
    expected: {
      dominant: 'Red/Pink',
      percentage: 75
    }
  },

  'Complex Multi-Emotion': {
    entry: createMockEntry([
      { description: 'Task 1', emotion: getEmotionIdByLabel('Happy') },      // Golden Yellow
      { description: 'Task 2', emotion: getEmotionIdByLabel('Anxious') },    // Purple
      { description: 'Task 3', emotion: getEmotionIdByLabel('Tired') },      // Gray-Blue
      { description: 'Task 4', emotion: getEmotionIdByLabel('Excited') },    // Red/Pink
      { description: 'Task 5', emotion: getEmotionIdByLabel('Anxious') }     // Purple
    ]),
    description: '5 tasks across 4 different color families',
    expected: {
      families: ['Golden Yellow', 'Purple', 'Gray-Blue', 'Red/Pink'],
      complex: true
    }
  },

  'All Happy (Golden Yellow)': {
    entry: createMockEntry([
      { description: 'Task 1', emotion: getEmotionIdByLabel('Happy') },
      { description: 'Task 2', emotion: getEmotionIdByLabel('Satisfied') },
      { description: 'Task 3', emotion: getEmotionIdByLabel('Calm') }
    ]),
    description: '3 tasks, all Golden Yellow family emotions',
    expected: {
      dominant: 'Golden Yellow',
      percentage: 100
    }
  },

  'Energy vs Exhaustion': {
    entry: createMockEntry([
      { description: 'Task 1', emotion: getEmotionIdByLabel('Energized') },
      { description: 'Task 2', emotion: getEmotionIdByLabel('Drained') }
    ]),
    description: 'High energy vs exhaustion (Red/Pink vs Gray-Blue)',
    expected: {
      families: ['Red/Pink', 'Gray-Blue'],
      split: '50/50'
    }
  },

  'Edge Case: Empty Entry': {
    entry: undefined,
    description: 'No entry provided',
    expected: {
      default: true,
      color: '#E3E3E3' // Light gray
    }
  },

  'Edge Case: Single Task': {
    entry: createMockEntry([
      { description: 'Only task', emotion: getEmotionIdByLabel('Frustrated') }
    ]),
    description: 'Just one task with "Frustrated" emotion',
    expected: {
      dominant: 'Purple',
      percentage: 100
    }
  },

  'Edge Case: All Neutral': {
    entry: createMockEntry([
      { description: 'Task 1', emotion: getEmotionIdByLabel('Neutral') },
      { description: 'Task 2', emotion: getEmotionIdByLabel('Normal') }
    ]),
    description: 'All neutral emotions',
    expected: {
      dominant: 'Light Gray',
      percentage: 100
    }
  }
}

// Helper to convert hex to RGB for display
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return 'Invalid'
  return `(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
}

// Run test for a specific scenario or all
async function runTest(scenarioName?: string, verbose: boolean = false) {
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
    
    if (scenario.entry) {
      console.log(`   Tasks: ${scenario.entry.tasks.length}`)
      if (verbose) {
        scenario.entry.tasks.forEach((task, i) => {
          const emotionData = EMOTIONS[task.emotion]
          console.log(`     ${i + 1}. ${task.description} - ${emotionData?.label || 'Unknown'}`)
        })
      }
    }

    // Calculate color
    const dailyColor = calculateDailyColor(scenario.entry)
    const breakdown = getColorFamilyBreakdown(scenario.entry)
    
    // Get color name
    const colorResult = namer(dailyColor)
    const colorName = colorResult.pantone?.[0]?.name || colorResult.basic?.[0]?.name || 'Neutral'
    const formattedColorName = colorName
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    console.log('\n🎨 Color Calculation:')
    if (breakdown.length > 0) {
      breakdown.forEach(family => {
        console.log(`   ${family.familyName}: ${family.percentage}`)
      })
    } else {
      console.log('   (No tasks - default color)')
    }

    console.log('\n✅ Result:')
    console.log(`   Hex: ${dailyColor}`)
    console.log(`   RGB: ${hexToRgb(dailyColor)}`)
    console.log(`   Name: "${formattedColorName}"`)

    if (verbose) {
      console.log('\n🔍 Detailed Breakdown:')
      console.log(`   Pantone name: ${colorResult.pantone?.[0]?.name || 'N/A'}`)
      console.log(`   Basic name: ${colorResult.basic?.[0]?.name || 'N/A'}`)
      console.log(`   NTC name: ${colorResult.ntc?.[0]?.name || 'N/A'}`)
    }

    // Wait a bit between tests
    if (Object.keys(scenariosToRun).length > 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
}

// Parse command line args
const args = process.argv.slice(2)
const verbose = args.includes('--verbose') || args.includes('-v')
const scenarioArg = args.find(arg => !arg.startsWith('-'))

if (args.includes('--help') || args.includes('-h')) {
  console.log('\n📖 Integration Test for Today\'s Color Feature')
  console.log('=' .repeat(60))
  console.log('\n🎯 This test:')
  console.log('   - Tests REAL production color blending code')
  console.log('   - No mocks - end-to-end pipeline validation')
  console.log('   - No API calls - pure mathematical calculations')
  console.log('   - Instant execution - runs in milliseconds\n')
  console.log('Usage:')
  console.log('  npx tsx test-color-blending.ts [scenario-name] [--verbose]\n')
  console.log('Flags:')
  console.log('  --verbose, -v    Show detailed color information')
  console.log('  --help, -h       Show this help message\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-color-blending.ts')
  console.log('  npx tsx test-color-blending.ts "Pure Single Emotion"')
  console.log('  npx tsx test-color-blending.ts "Complex Multi-Emotion" --verbose\n')
} else {
  console.log('\n🚀 Today\'s Color Integration Test')
  console.log('=' .repeat(60))
  console.log('🎨 Testing real production color blending functions')
  console.log('⚡ No API calls - instant execution')
  console.log('=' .repeat(60))
  
  runTest(scenarioArg, verbose).catch(console.error)
}

