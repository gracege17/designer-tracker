/**
 * OpenAI API Connection Test
 * 
 * Simple test to verify your OpenAI API key works.
 * 
 * Setup:
 * 1. Create .env file with: OPENAI_API_KEY=your-key-here
 * 2. Run: npx tsx test-openai-connection.ts
 */

import 'dotenv/config'
import OpenAI from 'openai'

async function testOpenAIConnection() {
  console.log('\n🔑 OpenAI API Connection Test')
  console.log('=' .repeat(60))

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n❌ Error: No OPENAI_API_KEY found!')
    console.error('\nPlease create a .env file with:')
    console.error('  OPENAI_API_KEY=sk-your-key-here\n')
    process.exit(1)
  }

  console.log('✅ API key found')
  console.log(`   Length: ${process.env.OPENAI_API_KEY.length} characters`)
  console.log(`   Starts with: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`)

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const model = process.env.OPENAI_MODEL || 'gpt-4o'
  console.log(`\n🤖 Testing with model: ${model}`)

  try {
    console.log('\n⏳ Making test API call...')
    console.log('   Prompt: "Say hello in one sentence"')

    const startTime = Date.now()
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Keep responses brief.'
        },
        {
          role: 'user',
          content: 'Say hello in one sentence.'
        }
      ],
      max_tokens: 50,
      temperature: 0.7
    })

    const endTime = Date.now()
    const duration = endTime - startTime

    const response = completion.choices[0]?.message?.content

    console.log('\n✅ SUCCESS! OpenAI API is working!\n')
    console.log('📊 Response Details:')
    console.log(`   Response: "${response}"`)
    console.log(`   Model used: ${completion.model}`)
    console.log(`   Tokens used: ${completion.usage?.total_tokens || 'unknown'}`)
    console.log(`   Response time: ${duration}ms`)
    console.log(`   Request ID: ${completion.id}`)

    console.log('\n🎉 Your OpenAI API key is valid and working!')
    console.log('=' .repeat(60))
    console.log('\nNext steps:')
    console.log('  1. Add OPENAI_API_KEY to Vercel environment variables')
    console.log('  2. Update api/generate-daily-summary.ts to use OpenAI')
    console.log('  3. Deploy to Vercel\n')

  } catch (error: any) {
    console.error('\n❌ ERROR: Failed to connect to OpenAI API\n')
    
    if (error.status === 401) {
      console.error('🔐 Authentication Error (401):')
      console.error('   Your API key is invalid or expired.')
      console.error('   Get a new key from: https://platform.openai.com/api-keys\n')
    } else if (error.status === 403) {
      console.error('🚫 Permission Error (403):')
      console.error(`   Your account doesn't have access to model: ${model}`)
      console.error('   Try a different model with OPENAI_MODEL=gpt-3.5-turbo\n')
    } else if (error.status === 429) {
      console.error('⏱️  Rate Limit Error (429):')
      console.error('   You\'ve exceeded your rate limit or quota.')
      console.error('   Check your usage: https://platform.openai.com/usage\n')
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Network Error:')
      console.error('   Cannot reach OpenAI servers. Check your internet connection.\n')
    } else {
      console.error('⚠️  Unknown Error:')
      console.error(`   Status: ${error.status || 'unknown'}`)
      console.error(`   Message: ${error.message || 'unknown'}`)
      console.error(`   Code: ${error.code || 'unknown'}\n`)
    }

    console.error('Full error details:')
    console.error(error)
    process.exit(1)
  }
}

// Parse command line args
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  console.log('\n📖 OpenAI API Connection Test')
  console.log('=' .repeat(60))
  console.log('\nTests your OpenAI API key by making a simple API call.')
  console.log('\nSetup:')
  console.log('  1. Get API key from: https://platform.openai.com/api-keys')
  console.log('  2. Create .env file:')
  console.log('     OPENAI_API_KEY=sk-your-key-here')
  console.log('     OPENAI_MODEL=gpt-4o  # optional\n')
  console.log('Usage:')
  console.log('  npx tsx test-openai-connection.ts\n')
  console.log('Examples:')
  console.log('  npx tsx test-openai-connection.ts')
  console.log('  OPENAI_MODEL=gpt-3.5-turbo npx tsx test-openai-connection.ts\n')
  process.exit(0)
}

testOpenAIConnection()

