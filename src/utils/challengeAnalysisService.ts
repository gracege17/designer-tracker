/**
 * Challenge Analysis Service
 * 
 * Analyzes user's daily logs, emotions, and tasks to identify their top challenges
 * and provide personalized coping suggestions.
 */

import { Entry, EmotionLevel, EMOTIONS } from '../types'
import {
  CHALLENGE_RECOMMENDATIONS,
  ChallengeRecommendationTemplate,
} from '../data/challengeRecommendations'

export interface ChallengeSuggestion {
  type: 'tool' | 'podcast' | 'book' | 'resource' | 'insight' | 'action'
  title: string
  desc: string
  url?: string
}

export interface Challenge {
  rank: number
  title: string
  empathy: string
  suggestions: ChallengeSuggestion[]
  meta?: ChallengeMeta
}

export interface ChallengeMeta {
  id?: string
  summary?: string
  insight?: string
  emotionTags?: string[]
  topicTags?: string[]
  growthGoalTags?: string[]
  responseMode?: string
  notes?: string
  source?: 'emotion-analysis' | 'library'
}

const TEMPLATE_LOOKUP = new Map<string, ChallengeRecommendationTemplate>(
  CHALLENGE_RECOMMENDATIONS.map(template => [template.id, template])
)

interface BuildChallengeOptions {
  title?: string
  empathy?: string
  source?: ChallengeMeta['source']
}

const buildChallengeFromTemplate = (
  template: ChallengeRecommendationTemplate,
  rank: number,
  options: BuildChallengeOptions = {}
): Challenge => {
  const title = options.title ?? template.title
  const empathy = options.empathy ?? template.summary

  const suggestions: ChallengeSuggestion[] = [
    {
      type: 'insight',
      title: 'Insight',
      desc: template.insight,
    },
    ...template.actions.map(action => ({
      type: action.type ?? 'action',
      title: action.title,
      desc: action.description,
      url: action.url,
    })),
  ]

  return {
    rank,
    title,
    empathy,
    suggestions,
    meta: {
      id: template.id,
      summary: template.summary,
      insight: template.insight,
      emotionTags: template.emotionTags,
      topicTags: template.topicTags,
      growthGoalTags: template.growthGoalTags,
      responseMode: template.responseMode,
      notes: template.notes,
      source: options.source ?? 'library',
    },
  }
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

  let nextRank = 1

  const pushFromTemplate = (templateId: string, options: BuildChallengeOptions = {}) => {
    if (nextRank > 3) return false
    const template = TEMPLATE_LOOKUP.get(templateId)
    if (!template) return false

    challenges.push(buildChallengeFromTemplate(template, nextRank, options))
    nextRank += 1
    return true
  }

  const pushManual = (title: string, empathy: string, suggestions: ChallengeSuggestion[]) => {
    if (nextRank > 3) {
      return
    }

    challenges.push({
      rank: nextRank,
      title,
      empathy,
      suggestions,
      meta: { source: 'emotion-analysis' },
    })
    nextRank += 1
  }

  const stressLoad = anxiousCount + frustratedCount
  if (stressLoad > 0 && nextRank <= 3) {
    const stressTitle =
      stressLoad > 1 ? 'Feeling pressure across your work today' : 'Feeling pressure from today’s work'
    const stressSummary = `You tagged ${stressLoad} task${stressLoad === 1 ? '' : 's'} with anxious or frustrated energy. Let’s turn that pressure into a plan.`

    const added = pushFromTemplate('deadline-pressure-stress', {
      title: stressTitle,
      empathy: stressSummary,
    })

    if (!added) {
      pushManual('Stressed about deadlines', 'Break it down. One milestone at a time.', [
        {
          type: 'tool',
          title: 'Notion Template: Daily Reset Checklist',
          desc: 'A simple way to reset when things feel overwhelming.',
          url: 'https://notion.so/templates/daily-reset',
        },
        {
          type: 'podcast',
          title: 'Managing Design Stress – Design Better Podcast',
          desc: 'How to handle pressure without burning out.',
          url: 'https://www.designbetter.co/podcast/stress',
        },
        {
          type: 'book',
          title: 'The Obstacle Is the Way – Ryan Holiday',
          desc: 'Turn challenges into opportunities for growth.',
        },
      ])
    }
  }

  const energyLoad = drainedCount + tiredCount
  if (energyLoad > 0 && nextRank <= 3) {
    const energyTitle =
      energyLoad > 1 ? 'Energy dipped multiple times today' : 'Energy dipped today'
    const energySummary = `Energy flagged during ${energyLoad} task${energyLoad === 1 ? '' : 's'}. Let’s protect your focus and build in rest.`

    const added = pushFromTemplate('low-energy-recovery', {
      title: energyTitle,
      empathy: energySummary,
    })

    if (!added) {
      pushManual("Drained and low energy", "Recharge, don't push through. Take breaks every 90 minutes.", [
        {
          type: 'tool',
          title: 'Calm App – 5-Minute Designer Recharge',
          desc: 'Quick meditation for creative professionals.',
          url: 'https://www.calm.com/designer-recharge',
        },
        {
          type: 'podcast',
          title: 'Avoiding Designer Burnout – Design Details',
          desc: 'Recognizing and preventing creative exhaustion.',
          url: 'https://designdetails.fm/burnout',
        },
        {
          type: 'book',
          title: "Rest Is Also Growth – Designer's Guide to Self-Care",
          desc: 'Why resting is productive work.',
        },
      ])
    }
  }

  const frustrationLoad = annoyedCount + sadCount
  if (frustrationLoad > 0 && nextRank <= 3) {
    const frustrationTitle =
      frustrationLoad > 1 ? 'Creative momentum stalled across tasks' : 'Creative momentum stalled'
    const frustrationSummary = `You marked ${frustrationLoad} task${frustrationLoad === 1 ? '' : 's'} with stuck or frustrated energy. Let’s get you moving again.`

    const added = pushFromTemplate('creative-block-frustration', {
      title: frustrationTitle,
      empathy: frustrationSummary,
    })

    if (!added) {
      pushManual('Stuck and frustrated', 'Step away from the screen. Walk, sketch, talk it through.', [
        {
          type: 'book',
          title: 'Overcoming Creative Blocks – Austin Kleon',
          desc: 'Practical strategies for getting unstuck.',
          url: 'https://austinkleon.com/creative-blocks',
        },
        {
          type: 'tool',
          title: 'Notion Creative Research Template',
          desc: 'Organize your design inspiration and explorations.',
          url: 'https://notion.so/templates/creative-research',
        },
        {
          type: 'podcast',
          title: 'When Projects Go Wrong – 99% Invisible',
          desc: 'Learning from design challenges and failures.',
          url: 'https://99percentinvisible.org',
        },
      ])
    }
  }

  // If mostly positive emotions, provide growth-oriented challenges
  const excitedCount = (emotionCounts[3] || 0) // Excited
  const happyCount = (emotionCounts[1] || 0) // Happy
  const energizedCount = (emotionCounts[10] || 0) // Energized
  const positiveTotal = excitedCount + happyCount + energizedCount

  if (
    positiveTotal > anxiousCount + frustratedCount + drainedCount &&
    nextRank <= 3
  ) {
    const momentumSummary = `You logged ${positiveTotal} task${positiveTotal === 1 ? '' : 's'} with energized or joyful emotions. Momentum is here—aim it where it matters.`
    const added = pushFromTemplate('creative-flow-momentum', {
      title: 'Channel your creative momentum',
      empathy: momentumSummary,
    })

    if (!added) {
      pushManual("Riding creative momentum", "You're in flow. Tackle your hardest task now.", [
        {
          type: 'book',
          title: 'Creative Flow – Mihaly Csikszentmihalyi',
          desc: 'The science behind your creative momentum.',
          url: 'https://www.goodreads.com/book/show/flow',
        },
        {
          type: 'tool',
          title: 'Figma Plugin: Design Systems Organizer',
          desc: 'Channel your energy into building better systems.',
          url: 'https://www.figma.com/community/plugin/design-systems',
        },
        {
          type: 'podcast',
          title: 'Scaling Your Design Impact – High Resolution',
          desc: 'How to amplify your creative work.',
          url: 'https://www.highresolution.design/scaling-impact',
        },
      ])
    }
  }

  // If we still need more challenges, add a general one
  if (nextRank <= 3) {
    const focusSummary = 'One task at a time. That’s how creative flow begins.'
    const added = pushFromTemplate('general-overwhelm-focus', {
      title: 'Scattered across too many tasks',
      empathy: focusSummary,
    })

    if (!added) {
      pushManual('Scattered across too many tasks', focusSummary, [
        {
          type: 'tool',
          title: 'Notion Minimal Task Template',
          desc: 'Simplify your to-do list when energy is low.',
          url: 'https://notion.so/templates/minimal-tasks',
        },
        {
          type: 'book',
          title: 'Make Time – Jake Knapp',
          desc: 'Focus on what matters every day.',
          url: 'https://maketime.blog',
        },
        {
          type: 'podcast',
          title: 'Finding Balance in Design Work – Design Better',
          desc: 'Balancing different types of design tasks.',
          url: 'https://www.designbetter.co/podcast/balance',
        },
      ])
    }
  }

  const defaultFallbacks = getDefaultChallenges()
  while (challenges.length < 3 && defaultFallbacks.length > 0) {
    const nextDefault = defaultFallbacks.shift()
    if (!nextDefault) {
      break
    }

    challenges.push({
      ...nextDefault,
      rank: challenges.length + 1,
      meta: { source: nextDefault.meta?.source ?? 'emotion-analysis' },
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
      title: "Hard to start the day",
      empathy: "Start with a 5-minute warm-up. Momentum builds from there.",
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
      ],
      meta: { source: 'emotion-analysis' }
    },
    {
      rank: 2,
      title: "Energy drops after lunch",
      empathy: "Save lighter tasks for afternoon. Organize, review, admin.",
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
      ],
      meta: { source: 'emotion-analysis' }
    },
    {
      rank: 3,
      title: "Self-doubt after feedback",
      empathy: "Feedback is data, not judgment. Filter signal from noise.",
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
      ],
      meta: { source: 'emotion-analysis' }
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

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'has',
  'have',
  'i',
  'in',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'our',
  'my',
  'so',
  'that',
  'the',
  'their',
  'this',
  'to',
  'was',
  'we',
  'what',
  'with',
  'you',
  'your',
])

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenize = (text: string): string[] =>
  normalize(text)
    .split(' ')
    .filter(token => token.length > 1 && !STOP_WORDS.has(token))

const computeMatchScore = (inputTokens: Set<string>, template: ChallengeRecommendationTemplate): number => {
  let score = 0

  const titleTokens = tokenize(template.title)
  const summaryTokens = tokenize(template.summary)
  const aliasTokens = (template.aliases || []).flatMap(alias => tokenize(alias))
  const tagTokens = [
    ...(template.topicTags || []),
    ...(template.growthGoalTags || []),
    ...(template.emotionTags || []),
  ].flatMap(tag => tokenize(tag))

  const countMatches = (tokens: string[], weight: number) => {
    tokens.forEach(token => {
      if (inputTokens.has(token)) {
        score += weight
      }
    })
  }

  countMatches(titleTokens, 4)
  countMatches(aliasTokens, 4)
  countMatches(tagTokens, 2)
  countMatches(summaryTokens, 1)

  const normalizedInput = Array.from(inputTokens).join(' ')
  const normalizedTitle = normalize(template.title)

  if (normalizedTitle && normalizedInput && normalizedTitle.includes(normalizedInput)) {
    score += 8
  }

  template.aliases?.forEach(alias => {
    const normalizedAlias = normalize(alias)
    if (normalizedAlias && normalizedInput && normalizedAlias.includes(normalizedInput)) {
      score += 8
    }
  })

  return score
}

export function findChallengeRecommendationFromInput(rawInput: string): Challenge | null {
  if (!rawInput || !rawInput.trim()) {
    return null
  }

  const inputTokens = new Set(tokenize(rawInput))

  if (inputTokens.size === 0) {
    return null
  }

  let bestTemplate: ChallengeRecommendationTemplate | null = null
  let bestScore = 0

  CHALLENGE_RECOMMENDATIONS.forEach(template => {
    const score = computeMatchScore(inputTokens, template)
    if (score > bestScore) {
      bestScore = score
      bestTemplate = template
    }
  })

  if (!bestTemplate || bestScore === 0) {
    return null
  }

  const suggestions: ChallengeSuggestion[] = [
    {
      type: 'insight',
      title: 'Insight',
      desc: bestTemplate.insight,
    },
    ...bestTemplate.actions.map(action => ({
      type: action.type ?? 'action',
      title: action.title,
      desc: action.description,
    })),
  ]

  const challenge: Challenge = {
    rank: 1,
    title: bestTemplate.title,
    empathy: bestTemplate.summary,
    suggestions,
    meta: {
      id: bestTemplate.id,
      summary: bestTemplate.summary,
      insight: bestTemplate.insight,
      emotionTags: bestTemplate.emotionTags,
      topicTags: bestTemplate.topicTags,
      growthGoalTags: bestTemplate.growthGoalTags,
      responseMode: bestTemplate.responseMode,
      notes: bestTemplate.notes,
      source: 'library',
    },
  }

  return challenge
}

