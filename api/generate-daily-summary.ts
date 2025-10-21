import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    const { tasks, date }: SummaryRequest = await request.json()

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ 
        summary: "Ready to capture today's design journey? Add your first task to get a personalized summary!"
      })
    }

    // Prepare the prompt for the AI
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

    // For now, we'll use a simple rule-based approach
    // In production, you'd call OpenAI or another AI service here
    const avgEmotion = tasks.reduce((sum, task) => sum + task.emotion, 0) / tasks.length
    const highEmotionTasks = tasks.filter(task => task.emotion >= 10)
    const lowEmotionTasks = tasks.filter(task => task.emotion <= 5)
    
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

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating daily summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
