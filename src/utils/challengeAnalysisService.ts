/**
 * Challenge Analysis Service
 * 
 * Analyzes user's daily logs, emotions, and tasks to identify their top challenges
 * and provide personalized coping suggestions.
 */

import { Entry, EmotionLevel, EMOTIONS } from '../types'

export interface ChallengeSuggestion {
  type: 'tool' | 'podcast' | 'book' | 'resource'
  title: string
  desc: string
  url?: string
}

export interface Challenge {
  rank: number
  title: string
  empathy: string
  suggestions: ChallengeSuggestion[]
}

/**
 * Analyze today's entries and generate personalized challenges
 */
export function analyzeTodayChallenges(todayEntry?: Entry): Challenge[] {
  if (!todayEntry || !todayEntry.tasks || todayEntry.tasks.length === 0) {
    return getDefaultChallenges()
  }

  const tasks = todayEntry.tasks
  const challenges: Challenge[] = []

  // Analyze emotions
  const emotionCounts: Record<number, number> = {}
  tasks.forEach(task => {
    const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
    emotions.forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
    })
  })

  // Identify dominant negative emotions
  const anxiousCount = (emotionCounts[6] || 0) // Anxious
  const frustratedCount = (emotionCounts[4] || 0) // Frustrated
  const drainedCount = (emotionCounts[15] || 0) // Drained
  const tiredCount = (emotionCounts[12] || 0) // Tired
  const annoyedCount = (emotionCounts[14] || 0) // Annoyed
  const sadCount = (emotionCounts[5] || 0) // Sad

  // Challenge 1: Anxiety/Stress related
  if (anxiousCount > 0 || frustratedCount > 0) {
    challenges.push({
      rank: 1,
      title: "I'm feeling anxious about work deadlines",
      empathy: "You're not alone — deadline pressure can feel overwhelming. It's okay to feel this way.",
      suggestions: [
        {
          type: 'tool',
          title: 'Notion Template: Daily Reset Checklist',
          desc: 'A simple way to reset when things feel overwhelming.',
          url: 'https://notion.so/templates/daily-reset'
        },
        {
          type: 'podcast',
          title: 'Managing Design Stress – Design Better Podcast',
          desc: 'How to handle pressure without burning out.',
          url: 'https://www.designbetter.co/podcast/stress'
        },
        {
          type: 'book',
          title: 'The Obstacle Is the Way – Ryan Holiday',
          desc: 'Turn challenges into opportunities for growth.'
        }
      ]
    })
  }

  // Challenge 2: Energy/Motivation issues
  if (drainedCount > 0 || tiredCount > 0) {
    challenges.push({
      rank: challenges.length + 1,
      title: "I'm feeling drained and low on energy",
      empathy: "Rest is productive too. Your body and mind are telling you what they need.",
      suggestions: [
        {
          type: 'tool',
          title: 'Calm App – 5-Minute Designer Recharge',
          desc: 'Quick meditation for creative professionals.',
          url: 'https://www.calm.com/designer-recharge'
        },
        {
          type: 'podcast',
          title: 'Avoiding Designer Burnout – Design Details',
          desc: 'Recognizing and preventing creative exhaustion.',
          url: 'https://designdetails.fm/burnout'
        },
        {
          type: 'book',
          title: 'Rest Is Also Growth – Designer\'s Guide to Self-Care',
          desc: 'Why resting is productive work.'
        }
      ]
    })
  }

  // Challenge 3: Frustration/Creative blocks
  if (annoyedCount > 0 || sadCount > 0) {
    challenges.push({
      rank: challenges.length + 1,
      title: "I'm stuck and feeling frustrated with my work",
      empathy: "Creative blocks happen to everyone. This feeling is temporary, and you'll find your way through.",
      suggestions: [
        {
          type: 'book',
          title: 'Overcoming Creative Blocks – Austin Kleon',
          desc: 'Practical strategies for getting unstuck.',
          url: 'https://austinkleon.com/creative-blocks'
        },
        {
          type: 'tool',
          title: 'Notion Creative Research Template',
          desc: 'Organize your design inspiration and explorations.',
          url: 'https://notion.so/templates/creative-research'
        },
        {
          type: 'podcast',
          title: 'When Projects Go Wrong – 99% Invisible',
          desc: 'Learning from design challenges and failures.',
          url: 'https://99percentinvisible.org'
        }
      ]
    })
  }

  // If mostly positive emotions, provide growth-oriented challenges
  const excitedCount = (emotionCounts[3] || 0) // Excited
  const happyCount = (emotionCounts[1] || 0) // Happy
  const energizedCount = (emotionCounts[10] || 0) // Energized
  const positiveTotal = excitedCount + happyCount + energizedCount

  if (positiveTotal > anxiousCount + frustratedCount + drainedCount && challenges.length < 3) {
    challenges.push({
      rank: challenges.length + 1,
      title: "I want to channel this energy into growth",
      empathy: "You're in a great flow! This is the perfect time to amplify your creative work.",
      suggestions: [
        {
          type: 'book',
          title: 'Creative Flow – Mihaly Csikszentmihalyi',
          desc: 'The science behind your creative momentum.',
          url: 'https://www.goodreads.com/book/show/flow'
        },
        {
          type: 'tool',
          title: 'Figma Plugin: Design Systems Organizer',
          desc: 'Channel your energy into building better systems.',
          url: 'https://www.figma.com/community/plugin/design-systems'
        },
        {
          type: 'podcast',
          title: 'Scaling Your Design Impact – High Resolution',
          desc: 'How to amplify your creative work.',
          url: 'https://www.highresolution.design/scaling-impact'
        }
      ]
    })
  }

  // If we still need more challenges, add a general one
  if (challenges.length < 3) {
    challenges.push({
      rank: challenges.length + 1,
      title: "I'm juggling multiple tasks and feeling scattered",
      empathy: "Multitasking is hard, especially in creative work. It's okay to slow down and focus.",
      suggestions: [
        {
          type: 'tool',
          title: 'Notion Minimal Task Template',
          desc: 'Simplify your to-do list when energy is low.',
          url: 'https://notion.so/templates/minimal-tasks'
        },
        {
          type: 'book',
          title: 'Make Time – Jake Knapp',
          desc: 'Focus on what matters every day.',
          url: 'https://maketime.blog'
        },
        {
          type: 'podcast',
          title: 'Finding Balance in Design Work – Design Better',
          desc: 'Balancing different types of design tasks.',
          url: 'https://www.designbetter.co/podcast/balance'
        }
      ]
    })
  }

  // Return top 3 challenges
  return challenges.slice(0, 3)
}

/**
 * Default challenges when no data is available
 */
function getDefaultChallenges(): Challenge[] {
  return [
    {
      rank: 1,
      title: "Starting the day with intention",
      empathy: "Every designer faces this — the blank canvas of a new day can feel daunting.",
      suggestions: [
        {
          type: 'tool',
          title: 'Notion Daily Reflection Template',
          desc: 'Track your creative progress and maintain balance.',
          url: 'https://notion.so/templates/daily-reflection'
        },
        {
          type: 'book',
          title: 'The Art of Rest – Alex Pang',
          desc: 'How rest restores focus and creativity.',
          url: 'https://www.goodreads.com/book/show/the-art-of-rest'
        },
        {
          type: 'podcast',
          title: 'Design Better Podcast – InVision',
          desc: 'Stories from the world\'s best designers.',
          url: 'https://www.designbetter.co/podcast'
        }
      ]
    },
    {
      rank: 2,
      title: "Maintaining creative energy throughout the day",
      empathy: "Creative work takes real energy. It's normal to feel drained as the day goes on.",
      suggestions: [
        {
          type: 'tool',
          title: 'Forest App – Focus Timer',
          desc: 'Stay focused with gamified productivity.',
          url: 'https://www.forestapp.cc'
        },
        {
          type: 'podcast',
          title: 'High Resolution – Bobby Ghoshal',
          desc: 'Conversations about design, business, and creativity.',
          url: 'https://www.highresolution.design'
        },
        {
          type: 'book',
          title: 'Atomic Habits – James Clear',
          desc: 'Build better creative habits one small step at a time.',
          url: 'https://jamesclear.com/atomic-habits'
        }
      ]
    },
    {
      rank: 3,
      title: "Balancing feedback and staying confident",
      empathy: "Design feedback can be tough. Your work matters, and so does your creative voice.",
      suggestions: [
        {
          type: 'book',
          title: 'Show Your Work! – Austin Kleon',
          desc: 'Learn to share your creative process and build confidence.',
          url: 'https://austinkleon.com/show-your-work'
        },
        {
          type: 'tool',
          title: 'Loom',
          desc: 'Record a quick video walkthrough of your design to communicate intent clearly.',
          url: 'https://loom.com'
        },
        {
          type: 'podcast',
          title: 'Dealing with Design Feedback – Design Details',
          desc: 'Navigating critique and maintaining confidence.',
          url: 'https://designdetails.fm/feedback'
        }
      ]
    }
  ]
}

/**
 * FUTURE: AI-powered challenge analysis
 * 
 * This function will use AI to analyze task descriptions, notes, and emotional patterns
 * to generate highly personalized challenges and suggestions.
 */
/*
export async function analyzeChallengesWithAI(todayEntry: Entry): Promise<Challenge[]> {
  const prompt = `Analyze this designer's workday and identify their top 3 challenges:

Tasks logged today: ${todayEntry.tasks.length}
Emotions: ${todayEntry.tasks.map(t => EMOTIONS[t.emotion].label).join(', ')}
Task descriptions: ${todayEntry.tasks.map(t => t.description).join('; ')}

Return 3 challenges in JSON format with:
- rank (1-3)
- title (first-person, user-style phrasing)
- empathy (gentle 1-2 sentence validation)
- suggestions (2-3 items with type: tool/podcast/book, title, desc, optional url)`

  // Call OpenAI API here
  // Return parsed challenges
}
*/

