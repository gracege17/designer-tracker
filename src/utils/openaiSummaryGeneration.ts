/**
 * OpenAI Summary Generation Service
 * 
 * Shared logic for generating daily summaries using OpenAI.
 * Used by both Vercel API and tests.
 */

import OpenAI from 'openai'

export interface TaskData {
  description: string
  emotion: number
  emoji: string
  taskType: string
}

export interface SummaryRequest {
  tasks: TaskData[]
  date: string
}

export interface SummaryResponse {
  summary: string
}

/**
 * Generate daily summary using OpenAI
 */
export async function generateSummaryWithOpenAI(
  request: SummaryRequest,
  apiKey: string,
  model: string = 'gpt-4o'
): Promise<SummaryResponse> {
  const openai = new OpenAI({ apiKey })

  const { tasks } = request

  if (!tasks || tasks.length === 0) {
    return {
      summary: "Ready to capture today's design journey? Add your first task to get a personalized summary!"
    }
  }

  // Prepare the task list for the prompt
  const taskList = tasks.map(task => 
    `- "${task.description}" (${task.emoji})`
  ).join('\n')

  const prompt = `You are a supportive design coach.

The user just finished their daily log of tasks and emotions. Summarize the main emotional and task theme of their day in one short sentence that feels personal and encouraging.

Example input:
Tasks: 
- "Redesigned hero section" (😊)
- "Fixed icon alignment issue" (😐)
- "Presented design to client" (😫)

Output:
"You were most energized during visual exploration, even though alignment issues caused some fatigue. Great progress!"

Now analyze this day:
Tasks:
${taskList}

Provide a supportive, encouraging summary in one sentence:`

  console.log('🤖 Calling OpenAI API for daily summary...')
  console.log(`   Model: ${model}`)
  console.log(`   Tasks to analyze: ${tasks.length}`)
  
  const startTime = Date.now()
  
  const completion = await openai.chat.completions.create({
    model,
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
  
  return { summary }
}

