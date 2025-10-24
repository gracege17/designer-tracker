/**
 * Helpful Resources Service
 * 
 * This service provides curated resources (Tools, Read, Podcast, Video) to help users
 * based on their emotional state and daily challenges.
 * 
 * FUTURE AI INTEGRATION:
 * - Replace `getHelpfulResources()` with AI-generated recommendations
 * - Use GPT to analyze user's emotions, tasks, and challenges
 * - Generate personalized resource suggestions dynamically
 */

export type ResourceCategory = 'tools' | 'read' | 'podcast' | 'video'

export interface HelpfulResource {
  id: string
  category: ResourceCategory
  icon?: string // Optional emoji or icon name
  title: string
  description: string
  url?: string // For future: clickable links
}

/**
 * Static placeholder data
 * 
 * TODO (Future AI Integration):
 * - Generate these dynamically based on user's:
 *   - Today's emotion breakdown (calm, happy, frustrated, anxious, excited)
 *   - Recent challenges or reflections
 *   - Task types and patterns
 *   - Time of day / energy levels
 */
const PLACEHOLDER_RESOURCES: Record<string, HelpfulResource[]> = {
  // For users feeling calm/balanced
  balanced: [
    {
      id: 'tools-1',
      category: 'tools',
      icon: '🔧',
      title: '"Why You Don\'t Have to Be Productive Every Day" – TEDx Talk',
      description: 'A short reminder to slow down and recharge.'
    },
    {
      id: 'read-1',
      category: 'read',
      icon: '📖',
      title: '"The Art of Rest" – Alex Pang',
      description: 'How rest restores focus and creativity.'
    },
    {
      id: 'podcast-1',
      category: 'podcast',
      icon: '🎙️',
      title: '"How Designers Communicate Better with Engineers" – Lenny\'s Podcast',
      description: 'Simple ways to bridge creative and technical thinking.'
    },
    {
      id: 'video-1',
      category: 'video',
      icon: '▶️',
      title: '"Why You Don\'t Have to Be Productive Every Day" – TEDx Talk',
      description: 'A quick talk on slowing down with intention.'
    }
  ],

  // For users feeling frustrated/anxious
  struggling: [
    {
      id: 'tools-2',
      category: 'tools',
      icon: '🔧',
      title: 'Notion Template: Daily Reset Checklist',
      description: 'A simple way to reset when things feel overwhelming.'
    },
    {
      id: 'read-2',
      category: 'read',
      icon: '📖',
      title: '"Overcoming Creative Blocks" – Austin Kleon',
      description: 'Practical strategies for getting unstuck.'
    },
    {
      id: 'podcast-2',
      category: 'podcast',
      icon: '🎙️',
      title: '"Managing Design Stress" – Design Better Podcast',
      description: 'How to handle pressure without burning out.'
    },
    {
      id: 'video-2',
      category: 'video',
      icon: '▶️',
      title: '"When Design Feels Hard" – TEDx Talk',
      description: 'A reminder that struggle leads to growth.'
    }
  ],

  // For users feeling excited/energized
  energized: [
    {
      id: 'tools-3',
      category: 'tools',
      icon: '🔧',
      title: 'Figma Plugin: Design Systems Organizer',
      description: 'Channel your energy into building better systems.'
    },
    {
      id: 'read-3',
      category: 'read',
      icon: '📖',
      title: '"Creative Flow" – Mihaly Csikszentmihalyi',
      description: 'The science behind your creative momentum.'
    },
    {
      id: 'podcast-3',
      category: 'podcast',
      icon: '🎙️',
      title: '"Scaling Your Design Impact" – High Resolution',
      description: 'How to amplify your creative work.'
    },
    {
      id: 'video-3',
      category: 'video',
      icon: '▶️',
      title: '"The Power of Creative Energy" – TEDx',
      description: 'Sustaining momentum in creative work.'
    }
  ],

  // For users feeling tired/low energy
  tired: [
    {
      id: 'tools-4',
      category: 'tools',
      icon: '🔧',
      title: 'Calm App: 5-Minute Designer Recharge',
      description: 'Quick meditation for creative professionals.'
    },
    {
      id: 'read-4',
      category: 'read',
      icon: '📖',
      title: '"Rest is also growth" – Designer\'s Guide to Self-Care',
      description: 'Why resting is productive work.'
    },
    {
      id: 'podcast-4',
      category: 'podcast',
      icon: '🎙️',
      title: '"Avoiding Designer Burnout" – Design Details',
      description: 'Recognizing and preventing creative exhaustion.'
    },
    {
      id: 'video-4',
      category: 'video',
      icon: '▶️',
      title: '"The Science of Rest" – TED Talk',
      description: 'How intentional rest boosts creativity.'
    }
  ],

  // Default fallback
  default: [
    {
      id: 'tools-default',
      category: 'tools',
      icon: '🔧',
      title: '"Why You Don\'t Have to Be Productive Every Day" – TEDx Talk',
      description: 'A short reminder to slow down and recharge.'
    },
    {
      id: 'read-default',
      category: 'read',
      icon: '📖',
      title: '"The Art of Rest" – Alex Pang',
      description: 'How rest restores focus and creativity.'
    },
    {
      id: 'podcast-default',
      category: 'podcast',
      icon: '🎙️',
      title: '"How Designers Communicate Better with Engineers" – Lenny\'s Podcast',
      description: 'Simple ways to bridge creative and technical thinking.'
    },
    {
      id: 'video-default',
      category: 'video',
      icon: '▶️',
      title: '"Why You Don\'t Have to Be Productive Every Day" – TEDx Talk',
      description: 'A quick talk on slowing down with intention.'
    }
  ]
}

/**
 * Get helpful resources based on user's emotional state
 * 
 * CURRENT: Uses simple pattern matching on emotion breakdown
 * FUTURE: Replace with AI-generated recommendations via GPT API
 * 
 * @param emotionBreakdown - Today's emotion data (calm, happy, excited, frustrated, anxious)
 * @param taskCount - Number of tasks logged today
 * @returns Array of 4 helpful resources (one per category)
 */
export function getHelpfulResources(
  emotionBreakdown?: {
    calm: number
    happy: number
    excited: number
    frustrated: number
    anxious: number
  },
  taskCount?: number
): HelpfulResource[] {
  // If no data, return default resources
  if (!emotionBreakdown) {
    return PLACEHOLDER_RESOURCES.default
  }

  // Determine dominant emotional state
  const { calm, happy, excited, frustrated, anxious } = emotionBreakdown
  
  // Calculate scores
  const positiveScore = calm + happy + excited
  const negativeScore = frustrated + anxious
  const energyLevel = excited * 1.5 + happy * 1.2 + calm * 0.8
  const stressLevel = frustrated * 1.5 + anxious * 1.3

  // Pattern matching logic (will be replaced by AI)
  let resourceKey = 'default'

  if (stressLevel > 0.5) {
    // High stress/frustration
    resourceKey = 'struggling'
  } else if (energyLevel > 0.7 && taskCount && taskCount >= 3) {
    // High energy and productive
    resourceKey = 'energized'
  } else if (energyLevel < 0.3 || (taskCount && taskCount <= 1)) {
    // Low energy or minimal activity
    resourceKey = 'tired'
  } else if (positiveScore > negativeScore) {
    // Generally balanced/positive
    resourceKey = 'balanced'
  }

  return PLACEHOLDER_RESOURCES[resourceKey] || PLACEHOLDER_RESOURCES.default
}

/**
 * FUTURE: AI-powered resource generation
 * 
 * Uncomment and implement when ready to integrate OpenAI or similar AI service
 */
/*
export async function getHelpfulResourcesWithAI(
  emotionBreakdown: {
    calm: number
    happy: number
    excited: number
    frustrated: number
    anxious: number
  },
  taskCount: number,
  recentReflections?: string[]
): Promise<HelpfulResource[]> {
  const prompt = `You are a compassionate design coach. Based on today's data, recommend 4 resources to help:

Emotions today:
- Calm: ${(emotionBreakdown.calm * 100).toFixed(0)}%
- Happy: ${(emotionBreakdown.happy * 100).toFixed(0)}%
- Excited: ${(emotionBreakdown.excited * 100).toFixed(0)}%
- Frustrated: ${(emotionBreakdown.frustrated * 100).toFixed(0)}%
- Anxious: ${(emotionBreakdown.anxious * 100).toFixed(0)}%

Tasks completed: ${taskCount}

Generate 4 resources in this JSON format:
[
  {
    "category": "tools",
    "title": "...",
    "description": "..."
  },
  {
    "category": "read",
    "title": "...",
    "description": "..."
  },
  {
    "category": "podcast",
    "title": "...",
    "description": "..."
  },
  {
    "category": "video",
    "title": "...",
    "description": "..."
  }
]

Make titles specific (include author/source). Keep descriptions short (1 sentence).`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    })

    const data = await response.json()
    const resources = JSON.parse(data.choices[0].message.content)
    
    return resources.map((r: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      ...r
    }))
  } catch (error) {
    console.error('AI resource generation failed:', error)
    return getHelpfulResources(emotionBreakdown, taskCount)
  }
}
*/

