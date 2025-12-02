import { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

interface ChallengeCandidate {
  id: string
  title: string
  summary: string
  aliases: string[]
  triggerExamples: string[]
}

interface ChallengeMatchRequest {
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
    const body = request.body as ChallengeMatchRequest

    if (!body.userInput || !body.candidateChallenges) {
      return response.status(400).json({ error: 'Missing required fields' })
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ No OPENAI_API_KEY found, falling back to simulated matching')
      // Only return matches with score >= 65 (relevance threshold)
      const RELEVANCE_THRESHOLD = 65
      const matches: MatchResult[] = body.candidateChallenges
        .slice(0, 3)
        .map((challenge, i) => ({
          id: challenge.id,
          score: 75 - (i * 5), // Scores: 75, 70, 65 (all 3 pass threshold)
          reasoning: `[SIMULATED] Match based on emotion and task context`
        }))
        .filter(match => match.score >= RELEVANCE_THRESHOLD)
      return response.status(200).json({ matches })
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    // Prepare prompt for GPT
    const userText = [
      ...body.userInput.tasks.map(t => `Task: "${t}"`),
      ...body.userInput.feelings.map(f => `Feeling: ${f}`)
    ].join('\n')

    const challengeList = body.candidateChallenges.map((c, i) => 
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

    // Call OpenAI API
    console.log('🤖 Calling OpenAI API for challenge matching...')
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
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
    const matches: MatchResult[] = parsed.matches || []

    console.log(`✅ OpenAI returned ${matches.length} matches`)
    return response.status(200).json({ matches })

  } catch (error) {
    console.error('❌ Error matching challenges:', error)
    return response.status(500).json({ 
      error: 'Failed to match challenges',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

