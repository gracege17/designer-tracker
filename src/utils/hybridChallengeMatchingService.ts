/**
 * Hybrid Challenge Matching Service
 * 
 * Uses emotion tags as a rough filter, then calls GPT to semantically match
 * user input (task description + feeling) against challenge templates.
 */

import { Entry, EMOTIONS } from '../types'
import { CHALLENGE_RECOMMENDATIONS, ChallengeRecommendationTemplate } from '../data/challengeRecommendations'
import { Challenge, buildChallengeFromTemplate, analyzeTodayChallenges } from './challengeAnalysisService'

interface MatchResult {
  challenge: ChallengeRecommendationTemplate
  score: number
  reasoning: string
}

interface GPTMatchRequest {
  userInput: {
    tasks: string[]
    feelings: string[]
  }
  candidateChallenges: Array<{
    id: string
    title: string
    summary: string
    aliases: string[]
    triggerExamples: string[]
  }>
}

interface GPTMatchResponse {
  matches: Array<{
    id: string
    score: number // 0-100
    reasoning: string
  }>
}

// Negative emotion labels that should trigger challenge matching
const NEGATIVE_EMOTIONS = ['Drained', 'Frustrated', 'Overwhelmed', 'Sad', 'Disappointed', 'Anxious', 'Tired', 'Annoyed']

/**
 * Score a task based on description keywords for challenge relevance
 */
function scoreTaskForChallenge(task: { description: string; notes?: string }): number {
  const text = `${task.description} ${task.notes ?? ''}`.toLowerCase()

  // High priority triggers (80-85)
  if (text.includes('no progress') || text.includes('stuck')) return 80
  if (text.includes('avoid') || text.includes("can't start") || text.includes('blocked')) return 80
  if (text.includes('deadline') || text.includes('pressure') || text.includes('stressed')) return 85

  // Medium priority triggers (65-75)
  if (text.includes('hard to control') || text.includes('overwhelmed')) return 70
  if (text.includes('confused') || text.includes('unclear') || text.includes('frustrated')) return 65
  if (text.includes('feedback') || text.includes('critique') || text.includes('rejected')) return 70
  if (text.includes('lost') || text.includes('too much') || text.includes('not sure')) return 65

  // Low priority (40-50)
  if (text.includes('difficult') || text.includes('challenging')) return 50
  
  return 40 // fallback score
}

/**
 * Match today's input to relevant challenges using hybrid approach
 */
export async function matchChallengesToInput(todayEntry?: Entry): Promise<Challenge[]> {
  if (!todayEntry || !todayEntry.tasks || todayEntry.tasks.length === 0) {
    return []
  }

  // Step 1: Extract user input
  const taskDescriptions = todayEntry.tasks.map(task => task.description)
  const feelings = todayEntry.tasks.flatMap(task => {
    const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
    return emotions.map(emotion => EMOTIONS[emotion]?.label || 'Neutral')
  })

  // Step 1.5: Check for negative tasks and score them
  const negativeTasks = todayEntry.tasks.filter(task => {
    const taskEmotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
    const emotionLabels = taskEmotions.map(emotion => EMOTIONS[emotion]?.label || 'Neutral')
    return emotionLabels.some(label => NEGATIVE_EMOTIONS.includes(label))
  })

  if (negativeTasks.length > 0) {
    const scoredTasks = negativeTasks.map(task => ({
      task,
      score: scoreTaskForChallenge(task),
      text: `${task.description} ${task.notes ?? ''}`.toLowerCase()
    }))

    const topScored = scoredTasks.filter(s => s.score >= 60).sort((a, b) => b.score - a.score)

    if (topScored.length > 0) {
      console.log('Using scored challenge match from negative task:', topScored[0].score)
      
      // Match the task text to the best challenge template (search ALL templates)
      const taskText = topScored[0].text
      const matchedTemplate = findBestTemplateForTask(taskText, CHALLENGE_RECOMMENDATIONS)
      
      if (matchedTemplate) {
        console.log('Matched template:', matchedTemplate.id, matchedTemplate.title)
        return [buildChallengeFromTemplate(matchedTemplate, 1, {
          empathy: `You mentioned: "${topScored[0].task.description}". ${matchedTemplate.summary}`
        })]
      }
      
      // Fallback to rule-based
      console.log('No template match found, using rule-based')
      return analyzeTodayChallenges(todayEntry)
    }
  }

  // Step 2: Emotion-based rough filter
  const emotionCounts: Record<string, number> = {}
  feelings.forEach(feeling => {
    emotionCounts[feeling] = (emotionCounts[feeling] || 0) + 1
  })

  // Map common emotion labels to filter tags
  const negativeEmotions = ['Anxious', 'Frustrated', 'Drained', 'Tired', 'Annoyed', 'Sad', 'Overwhelmed']
  const hasNegativeEmotions = negativeEmotions.some(emotion => emotionCounts[emotion] > 0)

  // Filter candidates by emotion relevance (keep all if no strong negative signal)
  let candidateChallenges = CHALLENGE_RECOMMENDATIONS
  if (hasNegativeEmotions) {
    candidateChallenges = CHALLENGE_RECOMMENDATIONS.filter(template => {
      // Keep if any emotion tag matches or if it's a general challenge
      return template.emotionTags.some(tag => 
        negativeEmotions.some(negEmotion => 
          tag.toLowerCase().includes(negEmotion.toLowerCase()) ||
          negEmotion.toLowerCase().includes(tag.toLowerCase())
        )
      ) || template.id.includes('scattered') || template.id.includes('start-day')
    })
  }

  // If filter is too aggressive, keep at least top 10
  if (candidateChallenges.length < 10) {
    candidateChallenges = CHALLENGE_RECOMMENDATIONS.slice(0, 10)
  }

  // Step 3: Call GPT for semantic matching
  try {
    const matches = await callGPTForMatching({
      userInput: {
        tasks: taskDescriptions,
        feelings: feelings
      },
      candidateChallenges: candidateChallenges.map(template => ({
        id: template.id,
        title: template.title,
        summary: template.summary,
        aliases: template.aliases || [],
        triggerExamples: template.triggerExamples || []
      }))
    })

    // Step 4: Filter matches by relevance threshold, then take top matches
    // Only show challenges with score >= 65 (good match threshold)
    // Lowered from 70 to ensure we show relevant matches while still filtering weak ones
    const RELEVANCE_THRESHOLD = 65
    const relevantMatches = matches.filter(match => match.score >= RELEVANCE_THRESHOLD)
    
    // Take up to 3 of the most relevant matches (not forced to show 3)
    const topMatches = relevantMatches.slice(0, Math.min(3, relevantMatches.length))

    if (topMatches.length === 0) {
      // No relevant matches found - fall back to rule-based matching
      console.log(`No matches above relevance threshold (${RELEVANCE_THRESHOLD}), falling back to rule-based`)
      return analyzeTodayChallenges(todayEntry)
    }

    const challenges: Challenge[] = []
    topMatches.forEach((match, index) => {
      challenges.push(
        buildChallengeFromTemplate(match.challenge, index + 1, {
          empathy: match.reasoning || match.challenge.summary
        })
      )
    })

    return challenges

  } catch (error) {
    console.error('GPT matching failed, falling back to rule-based:', error)
    // Option 3: Always fall back to rule-based on error
    return analyzeTodayChallenges(todayEntry)
  }
}

/**
 * Call GPT API to semantically match user input to challenges
 */
async function callGPTForMatching(request: GPTMatchRequest): Promise<MatchResult[]> {
  // In development, simulate GPT with keyword matching
  // Check if we're in development mode (no API available)
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  if (isDev) {
    return simulateGPTMatching(request)
  }

  // Production: call actual GPT API
  try {
    const response = await fetch('/api/match-challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error('GPT API call failed')
    }

    const data: GPTMatchResponse = await response.json()
    
    return data.matches.map(match => {
      const template = CHALLENGE_RECOMMENDATIONS.find(t => t.id === match.id)!
      return {
        challenge: template,
        score: match.score,
        reasoning: match.reasoning
      }
    })
  } catch (error) {
    console.error('Error calling GPT API:', error)
    return simulateGPTMatching(request)
  }
}

/**
 * Find best template match for a given task text
 */
function findBestTemplateForTask(taskText: string, candidates: ChallengeRecommendationTemplate[]): ChallengeRecommendationTemplate | null {
  let bestMatch: ChallengeRecommendationTemplate | null = null
  let bestScore = 0
  const scores: Array<{ id: string; score: number; matches: string[] }> = []

  candidates.forEach(template => {
    let score = 0
    const matches: string[] = []

    // Check aliases (high priority)
    if (template.aliases) {
      template.aliases.forEach(alias => {
        if (taskText.includes(alias.toLowerCase())) {
          score += 50
          matches.push(`alias: ${alias}`)
        }
      })
    }

    // Check trigger examples (highest priority - these are most specific)
    if (template.triggerExamples) {
      template.triggerExamples.forEach(trigger => {
        if (taskText.includes(trigger.toLowerCase())) {
          // Give extra points for longer, more specific triggers
          const triggerBonus = trigger.length > 10 ? 60 : 45
          score += triggerBonus
          matches.push(`trigger: ${trigger}`)
        }
      })
    }

    // Check title keywords
    const titleWords = template.title.toLowerCase().split(' ')
    titleWords.forEach(word => {
      if (word.length > 4 && taskText.includes(word)) {
        score += 15
        matches.push(`title: ${word}`)
      }
    })

    // Check summary keywords
    const summaryWords = template.summary.toLowerCase().split(' ')
    const matchedWords = summaryWords.filter(word =>
      word.length > 5 && taskText.includes(word)
    )
    score += matchedWords.length * 5
    if (matchedWords.length > 0) {
      matches.push(`summary: ${matchedWords.length} words`)
    }

    scores.push({ id: template.id, score, matches })

    if (score > bestScore) {
      bestScore = score
      bestMatch = template
    }
  })

  // Debug logging
  const sortedScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 5)
  console.log('🔍 Template matching for task:', taskText)
  console.log('📊 Top 5 matches:', sortedScores)
  if (bestMatch && bestScore > 20) {
    console.log('✅ Selected:', (bestMatch as ChallengeRecommendationTemplate).id, 'with score:', bestScore)
  } else {
    console.log('❌ No match found (score too low or no matches)')
  }

  return bestScore > 20 ? bestMatch : null
}

/**
 * Simulate GPT matching with keyword scoring (fallback)
 */
function simulateGPTMatching(request: GPTMatchRequest): MatchResult[] {
  const userText = [
    ...request.userInput.tasks,
    ...request.userInput.feelings
  ].join(' ').toLowerCase()

  const results: MatchResult[] = request.candidateChallenges.map(candidate => {
    let score = 0
    let matchedTerms: string[] = []

    // Check title match
    if (userText.includes(candidate.title.toLowerCase())) {
      score += 40
      matchedTerms.push('title')
    }

    // Check aliases
    candidate.aliases.forEach(alias => {
      if (userText.includes(alias.toLowerCase())) {
        score += 30
        matchedTerms.push(`alias: ${alias}`)
      }
    })

    // Check trigger examples
    candidate.triggerExamples.forEach(example => {
      if (userText.includes(example.toLowerCase()) || example.toLowerCase().includes(userText.split(' ')[0])) {
        score += 25
        matchedTerms.push(`trigger: ${example}`)
      }
    })

    // Check summary keywords
    const summaryWords = candidate.summary.toLowerCase().split(' ')
    const userWords = userText.split(' ')
    const commonWords = summaryWords.filter(word => 
      word.length > 4 && userWords.includes(word)
    )
    if (commonWords.length > 0) {
      score += Math.min(20, commonWords.length * 5)
      matchedTerms.push(`keywords: ${commonWords.slice(0, 3).join(', ')}`)
    }

    const template = CHALLENGE_RECOMMENDATIONS.find(t => t.id === candidate.id)!
    return {
      challenge: template,
      score: Math.min(100, score),
      reasoning: matchedTerms.length > 0 
        ? `Matched on: ${matchedTerms.join(', ')}`
        : candidate.summary
    }
  })

  return results.sort((a, b) => b.score - a.score)
}

