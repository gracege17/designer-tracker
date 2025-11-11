/**
 * Simple Integration Test - Direct OpenAI API Call
 * 
 * This test calls OpenAI directly from Node.js, no Vercel needed!
 * 
 * Setup:
 * 1. Create .env file with: OPENAI_API_KEY=your-key-here
 * 2. Run: npx tsx test-challenge-matching-simple.ts
 */

import 'dotenv/config'
import OpenAI from 'openai'
import { Entry, EmotionLevel, EMOTIONS } from './src/types'
import { CHALLENGE_RECOMMENDATIONS } from './src/data/challengeRecommendations'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

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
 * Call OpenAI directly to match challenges
 */
async function matchChallengesWithOpenAI(entry: Entry) {
  // Extract user input
  const taskDescriptions = entry.tasks.map(task => task.description)
  const feelings = entry.tasks.flatMap(task => {
    const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
    return emotions.map(emotion => EMOTIONS[emotion]?.label || 'Neutral')
  })

  const userText = [
    ...taskDescriptions.map(t => `Task: "${t}"`),
    ...feelings.map(f => `Feeling: ${f}`)
  ].join('\n')

  // Filter to top 20 candidate challenges (to keep prompt size manageable)
  const candidateChallenges = CHALLENGE_RECOMMENDATIONS.slice(0, 20)

  const challengeList = candidateChallenges.map((c, i) => 
    `${i + 1}. ID: ${c.id}
   Title: ${c.title}
   Summary: ${c.summary}
   Aliases: ${c.aliases?.join(', ') || 'none'}
   Trigger examples: ${c.triggerExamples?.join(', ') || 'none'}`
  ).join('\n\n')

  const prompt = `You are an expert at understanding designer emotions and challenges.

User's daily input:
${userText}

Available challenges to match against:
${challengeList}

Your task:
1. Analyze the semantic meaning behind the user's task descriptions and feelings
2. Score each challenge on relevance (0-100)
3. Consider aliases and trigger examples to improve matching
4. Return the top 3 most relevant challenges with reasoning

Return JSON format:
{
  "matches": [
    {
      "id": "challenge-id",
      "score": 85,
      "reasoning": "User mentioned feeling lost with too much complexity, which strongly aligns with..."
    }
  ]
}

Focus on genuine semantic relevance. A score of 60+ means good match, 80+ means strong match.`

  console.log('🤖 Calling OpenAI API...')
  
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert at semantic matching and understanding designer challenges. Always return valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  const responseText = completion.choices[0]?.message?.content
  if (!responseText) {
    throw new Error('No response from OpenAI')
  }

  const parsed = JSON.parse(responseText)
  return parsed.matches || []
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
    const matches = await matchChallengesWithOpenAI(entry)
    
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
      const matches = await matchChallengesWithOpenAI(entry)
      
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
  console.log('   - Calls OpenAI API directly from Node.js')
  console.log('   - No Vercel, no web server needed')
  console.log('   - Just challenge matching logic + OpenAI\n')
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

