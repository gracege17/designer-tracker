import { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

interface TaskData {
  description: string
  emotion: number
  taskType?: string
}

interface KeywordsRequest {
  tasks: TaskData[]
  emotionCategory: 'energized' | 'drained' | 'meaningful' | 'curious'
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = request.body as KeywordsRequest

    if (!body.tasks || !body.emotionCategory) {
      return response.status(400).json({ error: 'Missing required fields' })
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ No OPENAI_API_KEY found, use pattern-based extraction in client')
      return response.status(503).json({ 
        error: 'No API key configured',
        usePatternBased: true 
      })
    }

    const { tasks, emotionCategory } = body

    if (tasks.length === 0) {
      return response.status(200).json({ keywords: [] })
    }

    // Call OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const taskList = tasks.map((task, i) => 
      `${i + 1}. "${task.description}"`
    ).join('\n')

    const categoryContext = {
      energized: 'tasks that gave energy, excitement, or satisfaction',
      drained: 'tasks that were draining, tiring, or frustrating',
      meaningful: 'tasks that felt meaningful, purposeful, or calm',
      curious: 'tasks that sparked curiosity, passion, or surprise'
    }

    const prompt = `You are analyzing a designer's ${categoryContext[emotionCategory]}.

Tasks:
${taskList}

Extract 1-3 SHORT thematic keywords or phrases (2-3 words each, max 25 characters) that capture what these tasks were about. Focus on actionable themes, not just descriptions.

Good examples:
- "Team collaboration"
- "Creative exploration"
- "Technical challenges"
- "Feature completion"

Bad examples:
- "Working on stuff" (too vague)
- "Designing the new homepage layout for mobile" (too long)

Return ONLY a JSON array of 1-3 keywords, ordered by importance:
["keyword1", "keyword2", "keyword3"]

Keep each keyword under 25 characters and specific to what the designer actually worked on.`

    console.log('🤖 Calling OpenAI API for emotion keywords...')
    console.log(`   Emotion category: ${emotionCategory}`)
    console.log(`   Tasks to analyze: ${tasks.length}`)
    
    const startTime = Date.now()
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a design coach helping extract meaningful themes from work. Return only valid JSON arrays of keywords.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 100,
      response_format: { type: 'json_object' }
    })

    const duration = Date.now() - startTime
    const responseText = completion.choices[0]?.message?.content
    
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(responseText)
    const keywords = Array.isArray(parsed) ? parsed : (parsed.keywords || [])

    console.log(`✅ OpenAI generated keywords in ${duration}ms`)
    console.log(`   Keywords: ${keywords.join(', ')}`)
    console.log(`   Tokens used: ${completion.usage?.total_tokens || 'unknown'}`)
    
    return response.status(200).json({ keywords })

  } catch (error) {
    console.error('❌ Error generating emotion keywords:', error)
    return response.status(500).json({ 
      error: 'Failed to generate keywords',
      message: error instanceof Error ? error.message : 'Unknown error',
      usePatternBased: true
    })
  }
}

