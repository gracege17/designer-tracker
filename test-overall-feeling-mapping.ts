/**
 * Integration Test for Overall Feeling Slider Mapping
 * 
 * Tests the REAL emoji/label mapping functions used in production.
 * No mocks - testing actual implementation end-to-end.
 * 
 * Run: npx tsx test-overall-feeling-mapping.ts
 */

import { 
  getEmojiFromOverallFeeling, 
  getIconPathFromOverallFeeling,
  getLabelFromOverallFeeling 
} from './src/utils/overallFeelingMapper'

// Expected mappings (from OverallFeeling.tsx and overallFeelingMapper.ts)
const EXPECTED_MAPPINGS = [
  { range: '0-10', values: [0, 5, 10], emoji: '😠', label: 'Very Unpleasant', icon: '/icons/32px-png/32px-Frustrated.png' },
  { range: '11-20', values: [11, 15, 20], emoji: '😢', label: 'Unpleasant', icon: '/icons/32px-png/32px-Sad.png' },
  { range: '21-30', values: [21, 25, 30], emoji: '😫', label: 'Somewhat Low', icon: '/icons/32px-png/32px-Drained.png' },
  { range: '31-40', values: [31, 35, 40], emoji: '😐', label: 'Neutral', icon: '/icons/32px-png/32px-Neutral.png' },
  { range: '41-50', values: [41, 45, 50], emoji: '😊', label: 'Okay', icon: '/icons/32px-png/32px-Satisfied.png' },
  { range: '51-60', values: [51, 55, 60], emoji: '😀', label: 'Pleasant', icon: '/icons/32px-png/32px-Happy.png' },
  { range: '61-70', values: [61, 65, 70], emoji: '😍', label: 'Good', icon: '/icons/32px-png/32px-Proud.png' },
  { range: '71-80', values: [71, 75, 80], emoji: '🤩', label: 'Great', icon: '/icons/32px-png/32px-Excited.png' },
  { range: '81-90', values: [81, 85, 90], emoji: '⚡', label: 'Energized', icon: '/icons/32px-png/32px-Energized.png' },
  { range: '91-100', values: [91, 95, 100], emoji: '😌', label: 'Very Pleasant', icon: '/icons/32px-png/32px-joy.png' }
]

// Test scenarios
const scenarios = {
  'Very Low Values (0-20)': {
    values: [0, 5, 10, 15, 20],
    description: 'Testing very low slider values',
    expectedEmojis: ['😠', '😠', '😠', '😢', '😢']
  },

  'Low-Medium Values (21-40)': {
    values: [21, 25, 30, 35, 40],
    description: 'Testing low-medium slider values',
    expectedEmojis: ['😫', '😫', '😫', '😐', '😐']
  },

  'Medium Values (41-60)': {
    values: [41, 45, 50, 55, 60],
    description: 'Testing medium slider values',
    expectedEmojis: ['😊', '😊', '😊', '😀', '😀']
  },

  'High Values (61-80)': {
    values: [61, 65, 70, 75, 80],
    description: 'Testing high slider values',
    expectedEmojis: ['😍', '😍', '😍', '🤩', '🤩']
  },

  'Very High Values (81-100)': {
    values: [81, 85, 90, 95, 100],
    description: 'Testing very high slider values',
    expectedEmojis: ['⚡', '⚡', '⚡', '😌', '😌']
  },

  'Boundary Testing': {
    values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    description: 'Testing exact boundary values',
    expectedEmojis: ['😠', '😢', '😫', '😐', '😊', '😀', '😍', '🤩', '⚡', '😌']
  },

  'All Ranges': {
    values: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95],
    description: 'One value from each of the 10 ranges',
    expectedEmojis: ['😠', '😢', '😫', '😐', '😊', '😀', '😍', '🤩', '⚡', '😌']
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

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0

  for (const [name, scenario] of Object.entries(scenariosToRun)) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${name}`)
    console.log(`${'='.repeat(60)}\n`)

    console.log(`📝 Scenario: ${scenario.description}`)
    console.log(`   Testing ${scenario.values.length} slider values\n`)

    console.log('🎨 Slider Mapping Results:\n')

    scenario.values.forEach((value, index) => {
      totalTests++
      
      const emoji = getEmojiFromOverallFeeling(value)
      const label = getLabelFromOverallFeeling(value)
      const iconPath = getIconPathFromOverallFeeling(value)
      
      const expectedEmoji = scenario.expectedEmojis[index]
      const passed = emoji === expectedEmoji
      
      if (passed) {
        passedTests++
      } else {
        failedTests++
      }
      
      console.log(`   Value ${value} → ${emoji} "${label}"`)
      console.log(`      Icon: ${iconPath}`)
      
      if (!passed) {
        console.log(`      ❌ Expected: ${expectedEmoji}`)
      } else {
        console.log(`      ✅`)
      }
      console.log('')
    })

    console.log('✅ Scenario Result:')
    const scenarioPassed = scenario.values.every((val, idx) => 
      getEmojiFromOverallFeeling(val) === scenario.expectedEmojis[idx]
    )
    console.log(`   ${scenarioPassed ? '✅ All mappings correct' : '❌ Some mappings failed'}`)

    // Wait between tests
    if (Object.keys(scenariosToRun).length > 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Summary')
  console.log('='.repeat(60))
  console.log(`Total tests: ${totalTests}`)
  console.log(`Passed: ${passedTests} ✅`)
  console.log(`Failed: ${failedTests} ❌`)
  console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
  console.log('='.repeat(60) + '\n')
}

// Parse command line args
const args = process.argv.slice(2)
const scenarioArg = args.find(arg => !arg.startsWith('-'))

if (args.includes('--help') || args.includes('-h')) {
  console.log('\n📖 Integration Test for Overall Feeling Slider Mapping')
  console.log('=' .repeat(60))
  console.log('\n🎯 This test:')
  console.log('   - Tests REAL production slider mapping code')
  console.log('   - No mocks - validates actual overallFeelingMapper.ts')
  console.log('   - No API calls - pure mapping logic')
  console.log('   - Instant execution - runs in milliseconds\n')
  console.log('Usage:')
  console.log('  npx tsx test-overall-feeling-mapping.ts [scenario-name]\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-overall-feeling-mapping.ts')
  console.log('  npx tsx test-overall-feeling-mapping.ts "All Ranges"')
  console.log('  npx tsx test-overall-feeling-mapping.ts "Boundary Testing"\n')
} else {
  console.log('\n🚀 Overall Feeling Slider Mapping Test')
  console.log('=' .repeat(60))
  console.log('🎨 Testing real production emoji mapping functions')
  console.log('⚡ No API calls - instant execution')
  console.log('=' .repeat(60))
  
  runTest(scenarioArg).catch(console.error)
}

