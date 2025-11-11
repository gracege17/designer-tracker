import { VercelRequest, VercelResponse } from '@vercel/node'
import { matchChallengesWithOpenAI, ChallengeMatchRequest } from '../src/utils/openaiChallengeMatching'

interface MatchResult {
  id: string
  score: number
  reasoning: string
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = request.body as ChallengeMatchRequest

    if (!body.userInput || !body.candidateChallenges) {
      return response.status(400).json({ error: 'Missing required fields' })
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ No OPENAI_API_KEY found, falling back to simulated matching')
      const matches: MatchResult[] = body.candidateChallenges.slice(0, 3).map((challenge, i) => ({
        id: challenge.id,
        score: 70 - (i * 10),
        reasoning: `[SIMULATED] Match based on emotion and task context`
      }))
      return response.status(200).json({ matches })
    }

    // Call shared matching function
    const result = await matchChallengesWithOpenAI(
      body,
      process.env.OPENAI_API_KEY,
      process.env.OPENAI_MODEL || 'gpt-4o'
    )

    return response.status(200).json(result)

  } catch (error) {
    console.error('❌ Error matching challenges:', error)
    return response.status(500).json({ 
      error: 'Failed to match challenges',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

