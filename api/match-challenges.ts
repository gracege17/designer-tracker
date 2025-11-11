import { VercelRequest, VercelResponse } from '@vercel/node'

interface ChallengeCandidate {
  id: string
  title: string
  summary: string
  aliases: string[]
  triggerExamples: string[]
}

interface MatchRequest {
  userInput: {
    tasks: string[]
    feelings: string[]
  }
  candidateChallenges: ChallengeCandidate[]
}

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
    const body = request.body as MatchRequest
    const { userInput, candidateChallenges } = body

    if (!userInput || !candidateChallenges) {
      return response.status(400).json({ error: 'Missing required fields' })
    }

    // Prepare prompt for GPT
    const userText = [
      ...userInput.tasks.map(t => `Task: "${t}"`),
      ...userInput.feelings.map(f => `Feeling: ${f}`)
    ].join('\n')

    const challengeList = candidateChallenges.map((c, i) => 
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
2. Score each challenge on relevance (0-100)
3. Consider aliases and trigger examples to improve matching
4. Return the top 3 most relevant challenges with reasoning

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

Focus on genuine semantic relevance. A score of 60+ means good match, 80+ means strong match.`

    // TODO: Replace with actual OpenAI API call
    // For now, return a simulated response
    const matches: MatchResult[] = candidateChallenges.slice(0, 3).map((challenge, i) => ({
      id: challenge.id,
      score: 70 - (i * 10),
      reasoning: `Simulated match based on emotion and task context`
    }))

    return response.status(200).json({ matches })

  } catch (error) {
    console.error('Error matching challenges:', error)
    return response.status(500).json({ 
      error: 'Failed to match challenges',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

