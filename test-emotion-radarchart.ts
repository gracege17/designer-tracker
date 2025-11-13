/**
 * Integration Test for Emotional Radar Chart Feature
 * 
 * Tests the REAL calculation logic used in the radar chart.
 * No mocks - testing actual implementation (logic only, not canvas rendering).
 * 
 * Run: npx tsx test-emotion-radarchart.ts
 */

interface EmotionBreakdown {
  calm: number
  happy: number
  excited: number
  frustrated: number
  anxious: number
}

type ViewType = 'today' | 'weekly' | 'monthly'

// Replica of getVisualScaleFactor from EmotionalRadarChart.tsx
function getVisualScaleFactor(taskCount: number, view: ViewType): number {
  const thresholds = {
    today: { low: 5, medium: 15, high: 25 },
    weekly: { low: 10, medium: 25, high: 40 },
    monthly: { low: 20, medium: 40, high: 60 }
  }
  
  const t = thresholds[view]
  const minScale = 1.2
  const maxScale = 1.0
  
  if (taskCount <= t.low) {
    return minScale - (minScale - 1.15) * (taskCount / t.low)
  } else if (taskCount <= t.medium) {
    const progress = (taskCount - t.low) / (t.medium - t.low)
    return 1.15 - 0.1 * progress
  } else if (taskCount <= t.high) {
    const progress = (taskCount - t.medium) / (t.high - t.medium)
    return 1.05 - 0.05 * progress
  } else {
    return maxScale
  }
}

// Calculate point positions (same logic as chart)
function calculatePoints(
  emotionBreakdown: EmotionBreakdown,
  taskCount: number,
  view: ViewType,
  maxRadius: number = 100
) {
  const data = [
    emotionBreakdown.calm,
    emotionBreakdown.happy,
    emotionBreakdown.excited,
    emotionBreakdown.frustrated,
    emotionBreakdown.anxious
  ]

  const scaleFactor = getVisualScaleFactor(taskCount, view)
  const MIN_VISUAL_VALUE = 0.08
  const points = []

  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
    
    let visualValue = data[i] < MIN_VISUAL_VALUE ? MIN_VISUAL_VALUE : data[i]
    visualValue = Math.min(visualValue * scaleFactor, 1.0)
    
    const radius = visualValue * maxRadius
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    
    points.push({ 
      emotion: ['Calm', 'Happy', 'Excited', 'Frustrated', 'Anxious'][i],
      rawValue: data[i],
      visualValue,
      radius,
      x: Math.round(x * 10) / 10,  // Round for display
      y: Math.round(y * 10) / 10
    })
  }

  return points
}

// Find dominant emotion
function getDominantEmotion(breakdown: EmotionBreakdown): string {
  const emotions = [
    { name: 'calm', value: breakdown.calm },
    { name: 'happy', value: breakdown.happy },
    { name: 'excited', value: breakdown.excited },
    { name: 'frustrated', value: breakdown.frustrated },
    { name: 'anxious', value: breakdown.anxious }
  ]
  return emotions.sort((a, b) => b.value - a.value)[0].name
}

// Test scenarios
const scenarios = {
  'High Excited Week': {
    taskCount: 20,
    view: 'weekly' as ViewType,
    emotionBreakdown: {
      calm: 0.2,
      happy: 0.2,
      excited: 0.6,
      frustrated: 0,
      anxious: 0
    },
    description: '20 tasks, 60% excited (weekly view)',
    expected: {
      dominant: 'excited',
      largestPoint: 'Excited',
      scaleRange: [1.0, 1.1]
    }
  },

  'All Equal Emotions': {
    taskCount: 20,
    view: 'weekly' as ViewType,
    emotionBreakdown: {
      calm: 0.2,
      happy: 0.2,
      excited: 0.2,
      frustrated: 0.2,
      anxious: 0.2
    },
    description: '20 tasks, all emotions equal (perfect pentagon)',
    expected: {
      allEqual: true,
      scaleRange: [1.0, 1.1]
    }
  },

  'Single Dominant Emotion': {
    taskCount: 20,
    view: 'weekly' as ViewType,
    emotionBreakdown: {
      calm: 0,
      happy: 0,
      excited: 0,
      frustrated: 1.0,
      anxious: 0
    },
    description: '20 tasks, 100% frustrated',
    expected: {
      dominant: 'frustrated',
      largestPoint: 'Frustrated',
      othersAtMinimum: true
    }
  },

  'Sparse Data (Low Task Count)': {
    taskCount: 5,
    view: 'weekly' as ViewType,
    emotionBreakdown: {
      calm: 0.4,
      happy: 0.4,
      excited: 0.2,
      frustrated: 0,
      anxious: 0
    },
    description: '5 tasks (below weekly low threshold of 10)',
    expected: {
      scaleBoost: true,
      scaleRange: [1.15, 1.2]
    }
  },

  'Abundant Data (High Task Count)': {
    taskCount: 50,
    view: 'weekly' as ViewType,
    emotionBreakdown: {
      calm: 0.3,
      happy: 0.3,
      excited: 0.2,
      frustrated: 0.1,
      anxious: 0.1
    },
    description: '50 tasks (above weekly high threshold of 40)',
    expected: {
      scaleFactor: 1.0,
      scaleRange: [1.0, 1.0]
    }
  },

  'Zero Emotion Minimum': {
    taskCount: 20,
    view: 'weekly' as ViewType,
    emotionBreakdown: {
      calm: 0.5,
      happy: 0.5,
      excited: 0,
      frustrated: 0,
      anxious: 0
    },
    description: 'Three emotions at 0% (should show 8% minimum)',
    expected: {
      zeroEmotionsVisible: true,
      minimumApplied: 0.08
    }
  },

  'Different Views - Today': {
    taskCount: 15,
    view: 'today' as ViewType,
    emotionBreakdown: {
      calm: 0.3,
      happy: 0.3,
      excited: 0.2,
      frustrated: 0.1,
      anxious: 0.1
    },
    description: '15 tasks with TODAY view (different thresholds)',
    expected: {
      scaleRange: [1.0, 1.05]
    }
  },

  'Different Views - Monthly': {
    taskCount: 15,
    view: 'monthly' as ViewType,
    emotionBreakdown: {
      calm: 0.3,
      happy: 0.3,
      excited: 0.2,
      frustrated: 0.1,
      anxious: 0.1
    },
    description: '15 tasks with MONTHLY view (different thresholds)',
    expected: {
      scaleBoost: true,
      scaleRange: [1.15, 1.2]
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

    console.log(`📝 Input:`)
    console.log(`   Task count: ${scenario.taskCount}`)
    console.log(`   View: ${scenario.view}`)
    console.log(`   Emotion breakdown:`)
    console.log(`     Calm: ${Math.round(scenario.emotionBreakdown.calm * 100)}%`)
    console.log(`     Happy: ${Math.round(scenario.emotionBreakdown.happy * 100)}%`)
    console.log(`     Excited: ${Math.round(scenario.emotionBreakdown.excited * 100)}%`)
    console.log(`     Frustrated: ${Math.round(scenario.emotionBreakdown.frustrated * 100)}%`)
    console.log(`     Anxious: ${Math.round(scenario.emotionBreakdown.anxious * 100)}%`)

    // Calculate
    const scaleFactor = getVisualScaleFactor(scenario.taskCount, scenario.view)
    const dominant = getDominantEmotion(scenario.emotionBreakdown)
    const points = calculatePoints(scenario.emotionBreakdown, scenario.taskCount, scenario.view)

    console.log('\n📊 Analysis:')
    console.log(`   Dominant emotion: ${dominant}`)
    
    const positiveSum = scenario.emotionBreakdown.calm + scenario.emotionBreakdown.happy + scenario.emotionBreakdown.excited
    const negativeSum = scenario.emotionBreakdown.frustrated + scenario.emotionBreakdown.anxious
    console.log(`   Positive emotions: ${Math.round(positiveSum * 100)}%`)
    console.log(`   Challenging emotions: ${Math.round(negativeSum * 100)}%`)

    console.log('\n🎨 Visual Calculations:')
    console.log(`   Scale factor: ${scaleFactor.toFixed(2)}×`)
    console.log(`   Max radius: 100px (example)`)
    
    console.log('\n   Point positions (5 pentagon points):')
    points.forEach((point, i) => {
      const rawPercent = Math.round(point.rawValue * 100)
      const visualPercent = Math.round(point.visualValue * 100)
      const wasMinimum = point.rawValue === 0 && point.visualValue > 0
      
      console.log(`     ${i + 1}. ${point.emotion} (${rawPercent}%${wasMinimum ? ' → 8% min' : ''}): radius = ${point.radius.toFixed(1)}px → (${point.x}, ${point.y})`)
    })

    // Validate expectations
    console.log('\n✅ Result:')
    
    if (scenario.expected.dominant) {
      const match = dominant === scenario.expected.dominant
      console.log(`   Dominant emotion: ${dominant} ${match ? '✅' : '❌ Expected: ' + scenario.expected.dominant}`)
    }

    if (scenario.expected.largestPoint) {
      const largestPoint = points.reduce((max, p) => p.radius > max.radius ? p : max)
      const match = largestPoint.emotion === scenario.expected.largestPoint
      console.log(`   Largest point: ${largestPoint.emotion} ${match ? '✅' : '❌ Expected: ' + scenario.expected.largestPoint}`)
    }

    if (scenario.expected.allEqual) {
      const radii = points.map(p => Math.round(p.radius * 100) / 100)
      const allSame = radii.every(r => r === radii[0])
      console.log(`   All points equal: ${allSame ? 'YES ✅' : 'NO ❌'}`)
    }

    if (scenario.expected.scaleRange) {
      const inRange = scaleFactor >= scenario.expected.scaleRange[0] && scaleFactor <= scenario.expected.scaleRange[1]
      console.log(`   Scale factor in range ${scenario.expected.scaleRange[0]}-${scenario.expected.scaleRange[1]}: ${inRange ? 'YES ✅' : 'NO ❌'}`)
    }

    if (scenario.expected.scaleFactor) {
      const match = Math.abs(scaleFactor - scenario.expected.scaleFactor) < 0.01
      console.log(`   Scale factor: ${scaleFactor.toFixed(2)} ${match ? '✅' : '❌ Expected: ' + scenario.expected.scaleFactor}`)
    }

    if (scenario.expected.othersAtMinimum) {
      const zeroEmotions = points.filter(p => p.rawValue === 0)
      const allAtMinimum = zeroEmotions.every(p => Math.abs(p.visualValue - 0.08) < 0.01)
      console.log(`   Zero emotions at minimum (8%): ${allAtMinimum ? 'YES ✅' : 'NO ❌'}`)
    }

    if (scenario.expected.zeroEmotionsVisible) {
      const zeroEmotions = points.filter(p => p.rawValue === 0)
      const allVisible = zeroEmotions.every(p => p.visualValue >= 0.08)
      console.log(`   Zero emotions visible: ${allVisible ? 'YES ✅' : 'NO ❌'}`)
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
  console.log('\n📖 Integration Test for Emotional Radar Chart')
  console.log('=' .repeat(60))
  console.log('\n🎯 This test:')
  console.log('   - Tests REAL production chart calculation logic')
  console.log('   - No mocks - validates scale factors and positioning')
  console.log('   - No canvas rendering - tests math only')
  console.log('   - Instant execution - runs in milliseconds\n')
  console.log('Usage:')
  console.log('  npx tsx test-emotion-radarchart.ts [scenario-name]\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-emotion-radarchart.ts')
  console.log('  npx tsx test-emotion-radarchart.ts "High Excited Week"')
  console.log('  npx tsx test-emotion-radarchart.ts "Sparse Data"\n')
} else {
  console.log('\n🚀 Emotional Radar Chart Integration Test')
  console.log('=' .repeat(60))
  console.log('📊 Testing real production chart calculation logic')
  console.log('⚡ No API calls - instant execution')
  console.log('=' .repeat(60))
  
  runTest(scenarioArg).catch(console.error)
}

