/**
 * Integration Test for Challenge Matching Service
 * 
 * This test calls the REAL OpenAI API through your Vercel endpoint.
 * 
 * Setup:
 * 1. Create .env file with: OPENAI_API_KEY=your-key-here
 * 2. Run: npx tsx test-challenge-matching.ts
 * 
 * This will hit your deployed API or local dev server.
 */

import 'dotenv/config'
import { matchChallengesToInput } from './src/utils/hybridChallengeMatchingService'
import { Entry, EmotionLevel } from './src/types'

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

// Configuration
const USE_REAL_API = process.env.USE_REAL_API !== 'false' // default to true
const API_URL = process.env.API_URL || 'https://designer-tracker.vercel.app' // or your deployed URL

// Override fetch globally for Node.js to point to real API
if (USE_REAL_API && typeof global !== 'undefined') {
  const originalFetch = global.fetch
  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Convert relative URLs to absolute
    const url = typeof input === 'string' && input.startsWith('/') 
      ? `${API_URL}${input}`
      : input
    
    console.log(`🌐 Calling: ${url}`)
    return originalFetch(url, init)
  } as typeof fetch
}

// Run test for a specific scenario or all
async function runTest(scenarioName?: string) {
  if (scenarioName && scenarios[scenarioName as keyof typeof scenarios]) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${scenarioName}`)
    console.log(`${'='.repeat(60)}\n`)
    
    const entry = scenarios[scenarioName as keyof typeof scenarios]
    console.log('📝 Entry data:')
    entry.tasks.forEach(task => {
      console.log(`  - ${task.description}`)
      if (task.notes) console.log(`    Notes: ${task.notes}`)
      console.log(`    Emotion: ${task.emotion}`)
    })
    
    console.log('\n⏳ Matching challenges...\n')
    const challenges = await matchChallengesToInput(entry)
    
    console.log(`\n✅ Found ${challenges.length} challenge(s):\n`)
    challenges.forEach((challenge, i) => {
      console.log(`${i + 1}. ${challenge.title}`)
      console.log(`   ${challenge.empathy}`)
      console.log(`   Actions: ${challenge.actions.length}`)
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
        console.log(`    Emotion: ${task.emotion}`)
      })
      
      console.log('\n⏳ Matching challenges...\n')
      const challenges = await matchChallengesToInput(entry)
      
      console.log(`✅ Found ${challenges.length} challenge(s):\n`)
      challenges.forEach((challenge, i) => {
        console.log(`${i + 1}. ${challenge.title}`)
        console.log(`   ${challenge.empathy.substring(0, 100)}...`)
        console.log('')
      })
      
      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
}

// Parse command line args
const scenarioArg = process.argv[2]

if (scenarioArg === '--help' || scenarioArg === '-h') {
  console.log('\n📖 Integration Test for Challenge Matching')
  console.log('=' .repeat(60))
  console.log('\n🎯 This is a TRUE INTEGRATION TEST:')
  console.log('   - Calls your deployed Vercel API')
  console.log('   - API calls real OpenAI GPT API')
  console.log('   - No mocks or simulations\n')
  console.log('Setup:')
  console.log('   1. Set OPENAI_API_KEY in Vercel environment variables')
  console.log('   2. Deploy your app to Vercel (or run locally)')
  console.log('   3. Run this test\n')
  console.log('Usage:')
  console.log('  npx tsx test-challenge-matching.ts [scenario-name]\n')
  console.log('Environment Variables:')
  console.log('  API_URL - Your deployed URL (default: https://designer-tracker.vercel.app)')
  console.log('  USE_REAL_API - Set to "false" to use local simulation\n')
  console.log('Available scenarios:')
  Object.keys(scenarios).forEach(name => console.log(`  - "${name}"`))
  console.log('\nExamples:')
  console.log('  npx tsx test-challenge-matching.ts')
  console.log('  npx tsx test-challenge-matching.ts "Deadline Pressure"')
  console.log('  API_URL=http://localhost:3000 npx tsx test-challenge-matching.ts')
  console.log('  USE_REAL_API=false npx tsx test-challenge-matching.ts\n')
} else {
  console.log('\n🚀 Integration Test Mode')
  console.log('=' .repeat(60))
  console.log(`📡 API URL: ${API_URL}`)
  console.log(`🤖 Using real API: ${USE_REAL_API ? 'YES ✅' : 'NO (simulated)'}`)
  console.log('=' .repeat(60))
  
  runTest(scenarioArg).catch(console.error)
}

