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

    // Step 4: Build challenges from top matches
    // Option 2: Show top matches even if score is low (always show something)
    const topMatches = matches.slice(0, Math.min(3, matches.length))

    if (topMatches.length === 0) {
      // Option 3: Fall back to rule-based if no matches at all
      console.log('No semantic matches found, falling back to rule-based')
      return analyzeTodayChallenges(todayEntry)
    }

    const challenges: Challenge[] = []
    topMatches.forEach((match, index) => {
      const template = CHALLENGE_RECOMMENDATIONS.find(t => t.id === match.id)
      if (template) {
        challenges.push(
          buildChallengeFromTemplate(template, index + 1, {
            empathy: match.reasoning || template.summary
          })
        )
      }
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
  if (import.meta.env.DEV) {
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

