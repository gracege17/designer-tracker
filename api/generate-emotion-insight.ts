import { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

interface TaskData {
  description: string
  date: string
  projectName?: string
}

interface InsightRequest {
  tasks: TaskData[]
  emotionCategory: 'energized' | 'drained' | 'meaningful' | 'curious'
  timeRange: 'week' | 'month'
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = request.body as InsightRequest

    if (!body.tasks || !body.emotionCategory) {
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

    const { tasks, emotionCategory, timeRange } = body
    const periodLabel = timeRange === 'week' ? 'this week' : 'this month'

    if (tasks.length === 0) {
      return response.status(200).json({ 
        insight: `You haven't logged any ${emotionCategory} moments ${periodLabel} yet.`,
        triggers: []
      })
    }

    // Call OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const taskList = tasks.map((task, i) => 
      `${i + 1}. "${task.description}" (${task.projectName || 'Unknown Project'})`
    ).join('\n')

    const emotionContext = {
      energized: 'tasks that gave energy, excitement, or satisfaction',
      drained: 'tasks that were draining, tiring, or frustrating',
      meaningful: 'tasks that felt meaningful, purposeful, or calm',
      curious: 'tasks that sparked curiosity, passion, or surprise'
    }

    const prompt = `You are analyzing a designer's ${emotionContext[emotionCategory]} from ${periodLabel}.

Tasks:
${taskList}

Your job:
1. Generate 1-3 SHORT thematic keywords/triggers (2-3 words each, max 25 characters) that capture what these tasks were about
2. Write 1-2 sentences of insight about when/how this emotion appears for this designer

Return JSON:
{
  "triggers": ["keyword1", "keyword2", "keyword3"],
  "insight": "Your insight text here (1-2 sentences, warm and encouraging)"
}

Good trigger examples: "Team collaboration", "Creative exploration", "Technical challenges"
Bad triggers: "Working on stuff" (vague), "Designing the homepage layout" (too long)

For insight, be specific about patterns you notice, warm, and encouraging. Under 200 characters.`

    console.log('🤖 Calling OpenAI API for emotion insight...')
    console.log(`   Emotion category: ${emotionCategory}`)
    console.log(`   Time range: ${timeRange}`)
    console.log(`   Tasks to analyze: ${tasks.length}`)
    
    const startTime = Date.now()
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a compassionate design coach analyzing emotional patterns. Return valid JSON with triggers array and insight string.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 150,
      response_format: { type: 'json_object' }
    })

    const duration = Date.now() - startTime
    const responseText = completion.choices[0]?.message?.content
    
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(responseText)
    const triggers = Array.isArray(parsed.triggers) ? parsed.triggers : []
    const insight = parsed.insight || ''

    console.log(`✅ OpenAI generated insight in ${duration}ms`)
    console.log(`   Triggers: ${triggers.join(', ')}`)
    console.log(`   Insight: "${insight.substring(0, 80)}..."`)
    console.log(`   Tokens used: ${completion.usage?.total_tokens || 'unknown'}`)
    
    return response.status(200).json({ triggers, insight })

  } catch (error) {
    console.error('❌ Error generating emotion insight:', error)
    return response.status(500).json({ 
      error: 'Failed to generate insight',
      message: error instanceof Error ? error.message : 'Unknown error',
      useRuleBased: true
    })
  }
}

