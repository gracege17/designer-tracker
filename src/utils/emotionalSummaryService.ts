/**
 * Emotional Summary Service
 * Generates human-readable summaries of emotional states based on breakdown data
 */

interface EmotionBreakdown {
  calm: number
  happy: number
  excited: number
  frustrated: number
  anxious: number
}

interface EmotionSummaryInput {
  breakdown: EmotionBreakdown
  taskCount: number
}

/**
 * Generate a friendly, contextual summary of today's emotional state
 */
export function generateEmotionalSummary(input: EmotionSummaryInput): string {
  const { breakdown, taskCount } = input
  
  // Special case: no tasks logged
  if (taskCount === 0) {
    return "You haven't logged any tasks yet today. How are you feeling?"
  }

  // Find top 2-3 emotions (threshold: > 0.15)
  const emotions = [
    { name: 'calm', value: breakdown.calm, label: 'calm', positivity: 'positive' },
    { name: 'happy', value: breakdown.happy, label: 'happy', positivity: 'positive' },
    { name: 'excited', value: breakdown.excited, label: 'excited', positivity: 'positive' },
    { name: 'frustrated', value: breakdown.frustrated, label: 'frustrated', positivity: 'negative' },
    { name: 'anxious', value: breakdown.anxious, label: 'anxious', positivity: 'negative' }
  ]

  // Sort by value descending
  const sortedEmotions = emotions.sort((a, b) => b.value - a.value)
  const dominant = sortedEmotions[0]
  const secondary = sortedEmotions[1]
  
  // Calculate overall emotional tone
  const positiveScore = breakdown.calm + breakdown.happy + breakdown.excited
  const negativeScore = breakdown.frustrated + breakdown.anxious
  const overallTone = positiveScore > negativeScore ? 'positive' : 'challenging'

  // Generate contextual summary based on patterns
  
  // Pattern 1: Very low activity (1-2 tasks)
  if (taskCount <= 2) {
    if (dominant.value < 0.3) {
      return `You logged ${taskCount} task${taskCount > 1 ? 's' : ''} today. Your energy feels scattered—take a moment to center yourself.`
    }
    if (dominant.positivity === 'positive') {
      return `You logged ${taskCount} task${taskCount > 1 ? 's' : ''} today and felt mostly ${dominant.label}. A gentle start to the day.`
    } else {
      return `You logged ${taskCount} task${taskCount > 1 ? 's' : ''} today but felt ${dominant.label}. Remember to be kind to yourself.`
    }
  }

  // Pattern 2: Moderate activity (3-5 tasks)
  if (taskCount <= 5) {
    if (overallTone === 'positive') {
      if (secondary.value > 0.2) {
        return `You felt mostly ${dominant.label} today with moments of ${secondary.label}. You're finding your rhythm.`
      }
      return `You felt ${dominant.label} as you worked through ${taskCount} tasks today. Keep this momentum going.`
    } else {
      if (breakdown.frustrated > 0.4) {
        return `Today felt challenging with ${taskCount} tasks. The frustration is real, but you're making progress.`
      }
      if (breakdown.anxious > 0.4) {
        return `You felt anxious while working on ${taskCount} tasks today. Take a deep breath—you're doing more than enough.`
      }
      return `You navigated ${taskCount} tasks today while feeling ${dominant.label}. That takes courage.`
    }
  }

  // Pattern 3: High activity (6+ tasks)
  if (taskCount >= 6) {
    if (overallTone === 'positive') {
      if (breakdown.excited > 0.5) {
        return `You powered through ${taskCount} tasks with excitement and energy today! You're on fire.`
      }
      if (breakdown.happy > 0.5) {
        return `You completed ${taskCount} tasks today and felt genuinely happy. That's the sweet spot.`
      }
      if (breakdown.calm > 0.5) {
        return `You moved through ${taskCount} tasks with calm and focus today. Beautiful flow state.`
      }
      return `You felt ${dominant.label} while completing ${taskCount} tasks. You're in a good rhythm.`
    } else {
      if (breakdown.frustrated > 0.5) {
        return `You pushed through ${taskCount} tasks despite feeling frustrated. That's resilience. Take a break if you need it.`
      }
      if (breakdown.anxious > 0.5) {
        return `You completed ${taskCount} tasks while managing anxiety. That takes real strength. Be proud of yourself.`
      }
      return `You worked through ${taskCount} tasks today while feeling ${dominant.label}. Remember to pause and breathe.`
    }
  }

  // Fallback: balanced emotions
  const significantEmotions = sortedEmotions.filter(e => e.value > 0.2).slice(0, 3)
  if (significantEmotions.length >= 2) {
    const emotionList = significantEmotions.map(e => e.label).join(', ')
    return `You experienced a mix of emotions today—${emotionList}. That's the full spectrum of being human.`
  }

  // Default fallback
  return `You completed ${taskCount} task${taskCount !== 1 ? 's' : ''} today and felt mostly ${dominant.label}.`
}

/**
 * Generate summary using OpenAI API (optional, requires API key)
 * Uncomment and configure if you want to use GPT for more dynamic summaries
 */
/*
export async function generateEmotionalSummaryWithAI(input: EmotionSummaryInput): Promise<string> {
  const { breakdown, taskCount } = input
  
  const prompt = `You are a compassionate emotional wellness coach. Based on the following emotion data from a designer's day, generate a short, empathetic summary (1-2 sentences max):

Task count: ${taskCount}
Emotions breakdown:
- Calm: ${(breakdown.calm * 100).toFixed(0)}%
- Happy: ${(breakdown.happy * 100).toFixed(0)}%
- Excited: ${(breakdown.excited * 100).toFixed(0)}%
- Frustrated: ${(breakdown.frustrated * 100).toFixed(0)}%
- Anxious: ${(breakdown.anxious * 100).toFixed(0)}%

Write in a warm, supportive tone. Be specific about the emotions but keep it concise. If they're struggling, offer gentle encouragement. If they're thriving, celebrate with them.

Summary:`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Add your API key
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate emotional wellness coach who writes brief, empathetic summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 60,
        temperature: 0.7
      })
    })

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating AI summary:', error)
    // Fallback to deterministic summary
    return generateEmotionalSummary(input)
  }
}
*/

