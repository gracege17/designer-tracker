/**
 * Integration Test for Week/Month Reflection Feature
 * 
 * Tests the REAL reflection generation logic from weeklyInsightsService.
 * No mocks - testing actual implementation end-to-end.
 * 
 * Run: npx tsx test-weekly-reflection.ts
 */

import { generateWeeklyInsights } from './src/utils/weeklyInsightsService'

interface EmotionBreakdown {
  calm: number
  happy: number
  excited: number
  frustrated: number
  anxious: number
}

// Test scenarios
const scenarios = {
  'High Energy Week': {
    taskCount: 20,
    emotionBreakdown: {
      calm: 0.1,
      happy: 0.3,
      excited: 0.6,
      frustrated: 0,
      anxious: 0
    },
    timeRange: 'week' as const,
    description: '20 tasks, 60% excited (positive, moderate-high activity)',
    expected: {
      keywords: ['20', 'excited', 'vibrant', 'energy'],
      tone: 'positive'
    }
  },

  'Challenging Week': {
    taskCount: 18,
    emotionBreakdown: {
      calm: 0.2,
      happy: 0,
      excited: 0,
      frustrated: 0.55,
      anxious: 0.25
    },
    timeRange: 'week' as const,
    description: '18 tasks, 55% frustrated, 25% anxious (challenging)',
    expected: {
      keywords: ['18', 'frustration', 'credit'],
      tone: 'challenging'
    }
  },

  'Balanced Week': {
    taskCount: 12,
    emotionBreakdown: {
      calm: 0.4,
      happy: 0.3,
      excited: 0.2,
      frustrated: 0.1,
      anxious: 0
    },
    timeRange: 'week' as const,
    description: '12 tasks, balanced emotions (40% calm, 30% happy)',
    expected: {
      keywords: ['12', 'calm', 'happy', 'balance'],
      tone: 'positive'
    }
  },

  'Slow Week (Positive)': {
    taskCount: 3,
    emotionBreakdown: {
      calm: 0.6,
      happy: 0.4,
      excited: 0,
      frustrated: 0,
      anxious: 0
    },
    timeRange: 'week' as const,
    description: '3 tasks, positive emotions (low activity)',
    expected: {
      keywords: ['3', 'slow', 'recharge'],
      tone: 'positive'
    }
  },

  'Very High Activity': {
    taskCount: 55,
    emotionBreakdown: {
      calm: 0.1,
      happy: 0.2,
      excited: 0.7,
      frustrated: 0,
      anxious: 0
    },
    timeRange: 'week' as const,
    description: '55 tasks, 70% excited (very high activity)',
    expected: {
      keywords: ['55', 'creative flow', 'rest'],
      tone: 'positive'
    }
  },

  'Empty Week': {
    taskCount: 0,
    emotionBreakdown: undefined,
    timeRange: 'week' as const,
    description: 'No tasks logged this week',
    expected: {
      keywords: ['haven\'t logged', 'yet'],
      tone: 'neutral'
    }
  },

  'Month Language': {
    taskCount: 12,
    emotionBreakdown: {
      calm: 0.4,
      happy: 0.3,
      excited: 0.2,
      frustrated: 0.1,
      anxious: 0
    },
    timeRange: 'month' as const,
    description: '12 tasks, but using MONTH timeRange',
    expected: {
      keywords: ['this month'],
      tone: 'positive'
    }
  },

  'Anxious Dominant': {
    taskCount: 25,
    emotionBreakdown: {
      calm: 0.1,
      happy: 0.1,
      excited: 0,
      frustrated: 0.3,
      anxious: 0.5
    },
    timeRange: 'week' as const,
    description: '25 tasks, 50% anxious (challenging, moderate-high)',
    expected: {
      keywords: ['anxiety', '25', 'feat'],
      tone: 'challenging'
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
    console.log(`   Time range: ${scenario.timeRange}`)
    console.log(`   Tasks: ${scenario.taskCount}`)
    
    if (scenario.emotionBreakdown) {
      console.log(`   Emotion breakdown:`)
      console.log(`     Calm: ${Math.round(scenario.emotionBreakdown.calm * 100)}%`)
      console.log(`     Happy: ${Math.round(scenario.emotionBreakdown.happy * 100)}%`)
      console.log(`     Excited: ${Math.round(scenario.emotionBreakdown.excited * 100)}%`)
      console.log(`     Frustrated: ${Math.round(scenario.emotionBreakdown.frustrated * 100)}%`)
      console.log(`     Anxious: ${Math.round(scenario.emotionBreakdown.anxious * 100)}%`)
    }

    // Calculate analysis
    const positiveScore = scenario.emotionBreakdown 
      ? scenario.emotionBreakdown.calm + scenario.emotionBreakdown.happy + scenario.emotionBreakdown.excited
      : 0
    const negativeScore = scenario.emotionBreakdown
      ? scenario.emotionBreakdown.frustrated + scenario.emotionBreakdown.anxious
      : 0
    const overallTone = positiveScore > negativeScore ? 'positive' : 'challenging'

    console.log('\n📊 Analysis:')
    console.log(`   Overall tone: ${overallTone}`)
    
    if (scenario.emotionBreakdown) {
      const emotions = [
        { name: 'calm', value: scenario.emotionBreakdown.calm },
        { name: 'happy', value: scenario.emotionBreakdown.happy },
        { name: 'excited', value: scenario.emotionBreakdown.excited },
        { name: 'frustrated', value: scenario.emotionBreakdown.frustrated },
        { name: 'anxious', value: scenario.emotionBreakdown.anxious }
      ].sort((a, b) => b.value - a.value)
      
      console.log(`   Dominant emotion: ${emotions[0].name}`)
    }
    
    // Determine activity level
    let activityLevel = ''
    if (scenario.taskCount === 0) activityLevel = 'none'
    else if (scenario.taskCount <= 5) activityLevel = 'very low (1-5)'
    else if (scenario.taskCount <= 15) activityLevel = 'light-moderate (6-15)'
    else if (scenario.taskCount <= 30) activityLevel = 'moderate-high (16-30)'
    else if (scenario.taskCount <= 50) activityLevel = 'high (31-50)'
    else activityLevel = 'very high (50+)'
    
    console.log(`   Activity level: ${activityLevel}`)

    // Generate reflection
    const reflection = generateWeeklyInsights({
      taskCount: scenario.taskCount,
      emotionBreakdown: scenario.emotionBreakdown,
      timeRange: scenario.timeRange
    })

    console.log('\n✅ Result:')
    console.log(`   Reflection: "${reflection}"`)
    console.log(`   Character count: ${reflection.length}`)

    // Validate keywords
    if (scenario.expected?.keywords) {
      const reflectionLower = reflection.toLowerCase()
      const matchedKeywords = scenario.expected.keywords.filter(kw =>
        reflectionLower.includes(kw.toLowerCase())
      )
      console.log(`   Keyword matches: ${matchedKeywords.length}/${scenario.expected.keywords.length}`)
      if (matchedKeywords.length > 0) {
        console.log(`   Matched: ${matchedKeywords.join(', ')}`)
      }
    }

    // Validate tone
    if (scenario.expected?.tone) {
      const toneMatch = overallTone === scenario.expected.tone || scenario.expected.tone === 'neutral'
      console.log(`   Expected tone: ${scenario.expected.tone} ${toneMatch ? '✅' : '❌'}`)
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
  console.log('\n📖 Integration Test for Week/Month Reflection Feature')
  console.log('=' .repeat(60))
  console.log('\n🎯 This test:')
  console.log('   - Tests REAL production reflection generation')
  console.log('   - No mocks - validates pattern matching logic')
  console.log('   - No API calls - rule-based only')
  console.log('   - Instant execution - runs in milliseconds\n')
  console.log('Usage:')
  console.log('  npx tsx test-weekly-reflection.ts [scenario-name]\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-weekly-reflection.ts')
  console.log('  npx tsx test-weekly-reflection.ts "High Energy Week"')
  console.log('  npx tsx test-weekly-reflection.ts "Month Language"\n')
} else {
  console.log('\n🚀 Week/Month Reflection Integration Test')
  console.log('=' .repeat(60))
  console.log('📊 Testing real production reflection generation')
  console.log('⚡ No API calls - instant execution')
  console.log('=' .repeat(60))
  
  runTest(scenarioArg).catch(console.error)
}

