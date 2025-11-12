import { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

interface TaskData {
  description: string
  emotion: number
  emoji: string
  taskType: string
}

interface SummaryRequest {
  tasks: TaskData[]
  date: string
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const rawBody = request.body
    const body: SummaryRequest =
      typeof rawBody === 'string'
        ? JSON.parse(rawBody)
        : (rawBody as SummaryRequest | undefined) ?? { tasks: [], date: '' }

    if (!body.tasks || body.tasks.length === 0) {
      return response.status(200).json({
        summary: "Ready to capture today's design journey? Add your first task to get a personalized summary!"
      })
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ No OPENAI_API_KEY found, falling back to rule-based summary')
      
      // Rule-based fallback
      const avgEmotion = body.tasks.reduce((sum, task) => sum + task.emotion, 0) / body.tasks.length
      const highEmotionTasks = body.tasks.filter(task => task.emotion >= 10)
      const lowEmotionTasks = body.tasks.filter(task => task.emotion <= 5)
      
      let summary = ""
      
      if (avgEmotion >= 10) {
        if (highEmotionTasks.length > 0) {
          const taskTypes = [...new Set(highEmotionTasks.map(t => t.taskType))]
          summary = `You were absolutely energized today, especially during ${taskTypes.join(' and ')} work. Your creative flow was unstoppable!`
        } else {
          summary = "You had an incredibly energizing day! Your creative flow was strong and you tackled exciting challenges with enthusiasm."
        }
      } else if (avgEmotion >= 7) {
        summary = "You had a solid, productive day with good momentum. You balanced different types of work effectively and made steady progress."
      } else if (avgEmotion >= 4) {
        if (lowEmotionTasks.length > 0) {
          summary = "You worked through some challenging tasks today, but every step forward counts. You're building resilience and growing stronger."
        } else {
          summary = "You had a mixed day with ups and downs. Remember that both the highs and lows are part of your creative journey."
        }
      } else {
        summary = "You pushed through some tough moments today. Remember that difficult days often lead to the biggest breakthroughs and growth."
      }
      
      return response.status(200).json({ summary })
    }

    // Call OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const taskList = body.tasks.map(task => 
      `- "${task.description}" (${task.emoji})`
    ).join('\n')

    const prompt = `You are a supportive design coach.

The user just finished their daily log of tasks and emotions. Summarize the main emotional and task theme of their day in ONE SHORT sentence (max 120 characters) that feels personal and encouraging.

IMPORTANT: Keep it under 120 characters so it displays nicely in 3 lines on mobile.

Example input:
Tasks: 
- "Redesigned hero section" (😊)
- "Fixed icon alignment issue" (😐)
- "Presented design to client" (😫)

Good output (93 chars):
"You tackled diverse tasks with resilience, balancing creativity and precision beautifully."

Bad output (too long):
"Your creativity shone brightly through your emoji design, even as you tackled the challenges of prototyping with determination—keep pushing forward!"

Now analyze this day:
Tasks:
${taskList}

Provide a supportive, encouraging summary in one SHORT sentence (max 120 characters):`

    console.log('🤖 Calling OpenAI API for daily summary...')
    console.log(`   Model: ${process.env.OPENAI_MODEL || 'gpt-4o'}`)
    console.log(`   Tasks to analyze: ${body.tasks.length}`)
    
    const startTime = Date.now()
    
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive design coach who helps designers reflect on their day. Keep summaries to one sentence, personal, and encouraging.'
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
    const summary = completion.choices[0]?.message?.content?.trim()
    
    if (!summary) {
      throw new Error('No response from OpenAI')
    }

    console.log(`✅ OpenAI generated summary in ${duration}ms`)
    console.log(`   Summary: "${summary}"`)
    console.log(`   Tokens used: ${completion.usage?.total_tokens || 'unknown'}`)
    
    return response.status(200).json({ summary })

  } catch (error) {
    console.error('❌ Error generating daily summary:', error)
    return response.status(500).json({ 
      error: 'Failed to generate summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
