import { VercelRequest, VercelResponse } from '@vercel/node'
import { generateSummaryWithOpenAI, SummaryRequest } from '../src/utils/openaiSummaryGeneration'

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

    // Call shared summary generation function
    const result = await generateSummaryWithOpenAI(
      body,
      process.env.OPENAI_API_KEY,
      process.env.OPENAI_MODEL || 'gpt-4o'
    )

    return response.status(200).json(result)

  } catch (error) {
    console.error('❌ Error generating daily summary:', error)
    return response.status(500).json({ 
      error: 'Failed to generate summary',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
