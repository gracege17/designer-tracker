/**
 * OpenAI Challenge Matching Service
 * 
 * Core logic for matching user input to challenge templates using OpenAI.
 * Used by both Vercel API and integration tests.
 */

import OpenAI from 'openai'
import { Entry, EMOTIONS } from '../types'
import { CHALLENGE_RECOMMENDATIONS, ChallengeRecommendationTemplate } from '../data/challengeRecommendations'

export interface ChallengeMatchRequest {
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

export interface ChallengeMatchResult {
  id: string
  score: number
  reasoning: string
}

export interface ChallengeMatchResponse {
  matches: ChallengeMatchResult[]
}

/**
 * Call OpenAI to semantically match challenges
 */
export async function matchChallengesWithOpenAI(
  request: ChallengeMatchRequest,
  apiKey: string,
  model: string = 'gpt-4o'
): Promise<ChallengeMatchResponse> {
  const openai = new OpenAI({ apiKey })

  // Prepare prompt for GPT
  const userText = [
    ...request.userInput.tasks.map(t => `Task: "${t}"`),
    ...request.userInput.feelings.map(f => `Feeling: ${f}`)
  ].join('\n')

  const challengeList = request.candidateChallenges.map((c, i) => 
    `${i + 1}. ID: ${c.id}
   Title: ${c.title}
   Summary: ${c.summary}
   Aliases: ${c.aliases.join(', ')}
   Trigger examples: ${c.triggerExamples.join(', ')}`
  ).join('\n\n')

  const prompt = `You are an expert at understanding designer emotions and challenges.

User's daily input:
${userText}

Available challenges to match against:
${challengeList}

Your task:
1. Analyze the semantic meaning behind the user's task descriptions and feelings
2. Pay close attention to CONTEXT - "too many bugs" is different from "too many tasks"
3. Consider the specific domain (debugging, design work, meetings, etc.)
4. Score each challenge on relevance (0-100) based on actual context, not just keywords
5. Consider aliases and trigger examples to improve matching
6. Return ONLY challenges that are truly relevant (score >= 65)
7. Do NOT force 3 matches - return only genuinely relevant ones (could be 0, 1, 2, or 3)

IMPORTANT: Understand context carefully:
- "too many bugs" or "debugging" with frustration → Technical/debugging challenge, NOT "too many tasks"
- "too many tasks" or "scattered work" → Scattered tasks challenge
- Match based on actual meaning, not just keyword overlap

Return JSON format:
{
  "matches": [
    {
      "id": "challenge-id",
      "score": 85,
      "reasoning": "User mentioned feeling lost with too much complexity, which strongly aligns with..."
    }
  ]
}

Focus on genuine semantic relevance. Only include matches with score >= 65. A score of 65+ means good match, 80+ means strong match. If no challenges are truly relevant (all scores < 65), return an empty matches array.`

  console.log('🤖 Calling OpenAI API for challenge matching...')
  
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert at semantic matching and understanding designer challenges. Always return valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  const responseText = completion.choices[0]?.message?.content
  if (!responseText) {
    throw new Error('No response from OpenAI')
  }

  const parsed = JSON.parse(responseText)
  console.log(`✅ OpenAI returned ${parsed.matches?.length || 0} matches`)
  
  return {
    matches: parsed.matches || []
  }
}

/**
 * Helper: Convert Entry to ChallengeMatchRequest
 */
export function entryToChallengeMatchRequest(entry: Entry): ChallengeMatchRequest {
  const taskDescriptions = entry.tasks.map(task => task.description)
  const feelings = entry.tasks.flatMap(task => {
    const emotions = task.emotions && task.emotions.length > 0 ? task.emotions : [task.emotion]
    return emotions.map(emotion => EMOTIONS[emotion]?.label || 'Neutral')
  })

  // Use top 20 candidates to keep prompt manageable
  const candidateChallenges = CHALLENGE_RECOMMENDATIONS.slice(0, 20).map(c => ({
    id: c.id,
    title: c.title,
    summary: c.summary,
    aliases: c.aliases || [],
    triggerExamples: c.triggerExamples || []
  }))

  return {
    userInput: {
      tasks: taskDescriptions,
      feelings: feelings
    },
    candidateChallenges
  }
}

