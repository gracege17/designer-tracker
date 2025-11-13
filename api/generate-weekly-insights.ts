import { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

interface EmotionBreakdown {
  calm: number
  happy: number
  excited: number
  frustrated: number
  anxious: number
}

interface InsightsRequest {
  taskCount: number
  emotionBreakdown?: EmotionBreakdown
  timeRange: 'week' | 'month'
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = request.body as InsightsRequest

    if (body.taskCount === undefined || !body.timeRange) {
      return response.status(400).json({ error: 'Missing required fields' })
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ No OPENAI_API_KEY found, use rule-based generation in client')
      return response.status(503).json({ 
        error: 'No API key configured',
        useRuleBased: true 
      })
    }

    const { taskCount, emotionBreakdown, timeRange } = body
    const periodLabel = timeRange === 'week' ? 'week' : 'month'

    // Call OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const prompt = `You are a compassionate design coach reviewing a designer's ${periodLabel}.

Emotional breakdown:
- Calm: ${emotionBreakdown ? Math.round(emotionBreakdown.calm * 100) : 0}%
- Happy: ${emotionBreakdown ? Math.round(emotionBreakdown.happy * 100) : 0}%
- Excited: ${emotionBreakdown ? Math.round(emotionBreakdown.excited * 100) : 0}%
- Frustrated: ${emotionBreakdown ? Math.round(emotionBreakdown.frustrated * 100) : 0}%
- Anxious: ${emotionBreakdown ? Math.round(emotionBreakdown.anxious * 100) : 0}%

Tasks completed: ${taskCount}

Write a 1-2 sentence reflection on their ${periodLabel}. Be warm, specific, and encouraging. Acknowledge their efforts and emotions authentically. Keep it under 200 characters.`

    console.log('🤖 Calling OpenAI API for weekly insights...')
    console.log(`   Model: ${process.env.OPENAI_MODEL || 'gpt-4o'}`)
    console.log(`   Time range: ${timeRange}`)
    console.log(`   Tasks: ${taskCount}`)
    
    const startTime = Date.now()
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a compassionate design coach. Provide warm, authentic reflections. Keep responses concise (under 200 chars).'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    })

    const duration = Date.now() - startTime
    const reflection = completion.choices[0]?.message?.content?.trim()
    
    if (!reflection) {
      throw new Error('No response from OpenAI')
    }

    console.log(`✅ OpenAI generated reflection in ${duration}ms`)
    console.log(`   Reflection: "${reflection}"`)
    console.log(`   Tokens used: ${completion.usage?.total_tokens || 'unknown'}`)
    
    return response.status(200).json({ reflection })

  } catch (error) {
    console.error('❌ Error generating weekly insights:', error)
    return response.status(500).json({ 
      error: 'Failed to generate insights',
      message: error instanceof Error ? error.message : 'Unknown error',
      useRuleBased: true
    })
  }
}

