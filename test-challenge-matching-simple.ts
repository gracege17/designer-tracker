/**
 * Simple Integration Test - Direct OpenAI API Call
 * 
 * This test calls the shared OpenAI matching function.
 * Tests the same logic as production, but bypasses Vercel API layer.
 * 
 * Setup:
 * 1. Create .env file with: OPENAI_API_KEY=your-key-here
 * 2. Run: npx tsx test-challenge-matching-simple.ts
 */

import 'dotenv/config'
import { Entry, EmotionLevel, EMOTIONS } from './src/types'
import { CHALLENGE_RECOMMENDATIONS } from './src/data/challengeRecommendations'
import { matchChallengesWithOpenAI, entryToChallengeMatchRequest } from './src/utils/openaiChallengeMatching'

// Note: The shared function is also used by tests, but Vercel API has its own 
// self-contained implementation to avoid import issues in serverless environment

// Create mock entry data
const createMockEntry = (tasks: Array<{description: string, emotion: EmotionLevel, notes?: string}>): Entry => {
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
      notes: task.notes,
      createdAt: new Date()
    })),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// Test scenarios
const scenarios = {
  'Deadline Pressure': createMockEntry([
    { description: 'Working on homepage redesign', emotion: 6, notes: 'Feeling stressed about the deadline pressure' }
  ]),
  
  'Stuck on Problem': createMockEntry([
    { description: 'Trying to design the checkout flow', emotion: 4, notes: 'Feeling stuck and no progress today' }
  ]),
  
  'Cursor/Tool Frustration': createMockEntry([
    { description: 'Building component library with Cursor', emotion: 4, notes: 'Hard to control Cursor, keeps giving wrong results' }
  ]),
  
  'General Overwhelm': createMockEntry([
    { description: 'Working on 5 different tasks today', emotion: 15 },
    { description: 'Design system cleanup', emotion: 15 },
    { description: 'Stakeholder meetings', emotion: 12 }
  ]),
  
  'Creative Block': createMockEntry([
    { description: 'Homepage hero section design', emotion: 4, notes: 'Feeling frustrated, creative block' }
  ]),

  'AI Anxiety': createMockEntry([
    { description: 'Learning new AI design tools', emotion: 6, notes: 'Worried AI will replace designers' }
  ])
}

/**
 * Test the real matching function (same one used in production!)
 */
async function testMatchChallenges(entry: Entry) {
  const request = entryToChallengeMatchRequest(entry)
  
  const result = await matchChallengesWithOpenAI(
    request,
    process.env.OPENAI_API_KEY!,
    process.env.OPENAI_MODEL || 'gpt-4o'
  )
  
  return result.matches
}

// Run test for a specific scenario or all
async function runTest(scenarioName?: string) {
  // Check API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n❌ Error: No OPENAI_API_KEY found!')
    console.error('\nPlease create a .env file with:')
    console.error('  OPENAI_API_KEY=sk-your-key-here\n')
    process.exit(1)
  }

  if (scenarioName && scenarios[scenarioName as keyof typeof scenarios]) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${scenarioName}`)
    console.log(`${'='.repeat(60)}\n`)
    
    const entry = scenarios[scenarioName as keyof typeof scenarios]
    console.log('📝 Entry data:')
    entry.tasks.forEach(task => {
      console.log(`  - ${task.description}`)
      if (task.notes) console.log(`    Notes: ${task.notes}`)
      console.log(`    Emotion: ${task.emotion} (${EMOTIONS[task.emotion]?.label})`)
    })
    
    console.log('\n⏳ Matching challenges with OpenAI...\n')
    const matches = await testMatchChallenges(entry)
    
    console.log(`\n✅ Found ${matches.length} challenge(s):\n`)
    matches.forEach((match: any, i: number) => {
      const template = CHALLENGE_RECOMMENDATIONS.find(t => t.id === match.id)
      console.log(`${i + 1}. ${template?.title || match.id}`)
      console.log(`   Score: ${match.score}`)
      console.log(`   Reasoning: ${match.reasoning}`)
      console.log('')
    })
  } else {
    // Run all scenarios
    for (const [name, entry] of Object.entries(scenarios)) {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`Testing: ${name}`)
      console.log(`${'='.repeat(60)}\n`)
      
      console.log('📝 Entry data:')
      entry.tasks.forEach(task => {
        console.log(`  - ${task.description}`)
        if (task.notes) console.log(`    Notes: ${task.notes}`)
        console.log(`    Emotion: ${task.emotion} (${EMOTIONS[task.emotion]?.label})`)
      })
      
      console.log('\n⏳ Matching challenges with OpenAI...\n')
      const matches = await testMatchChallenges(entry)
      
      console.log(`✅ Found ${matches.length} challenge(s):\n`)
      matches.forEach((match: any, i: number) => {
        const template = CHALLENGE_RECOMMENDATIONS.find(t => t.id === match.id)
        console.log(`${i + 1}. ${template?.title || match.id} (Score: ${match.score})`)
        console.log(`   ${match.reasoning.substring(0, 100)}...`)
        console.log('')
      })
      
      // Wait a bit between tests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

// Parse command line args
const scenarioArg = process.argv[2]

if (scenarioArg === '--help' || scenarioArg === '-h') {
  console.log('\n📖 Simple Integration Test (Direct OpenAI)')
  console.log('=' .repeat(60))
  console.log('\n🎯 This test:')
  console.log('   - Calls the REAL production matching function')
  console.log('   - No code duplication - tests actual implementation')
  console.log('   - No Vercel/web server needed for testing\n')
  console.log('Setup:')
  console.log('   1. Create .env file with OPENAI_API_KEY=your-key')
  console.log('   2. Run: npx tsx test-challenge-matching-simple.ts\n')
  console.log('Usage:')
  console.log('  npx tsx test-challenge-matching-simple.ts [scenario-name]\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-challenge-matching-simple.ts')
  console.log('  npx tsx test-challenge-matching-simple.ts "Deadline Pressure"')
  console.log('  npx tsx test-challenge-matching-simple.ts "Cursor/Tool Frustration"\n')
} else {
  console.log('\n🚀 Simple Integration Test (Direct OpenAI)')
  console.log('=' .repeat(60))
  console.log(`🤖 Model: ${process.env.OPENAI_MODEL || 'gpt-4o'}`)
  console.log('=' .repeat(60))
  
  runTest(scenarioArg).catch(console.error)
}

