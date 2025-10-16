import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Task {
  description: string;
  projectName: string;
  emotions: number[];
}

interface InsightCard {
  type: 'passion' | 'energy' | 'drained' | 'meaningful';
  insight: string;
  tasks: string[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tasks } = req.body as { tasks: Task[] };

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ error: 'No tasks provided' });
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Prepare task data for AI
    const taskSummary = tasks.map(t => ({
      task: t.description,
      project: t.projectName,
      emotions: t.emotions
    }));

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `You are a reflective design journal AI that helps designers understand their work patterns and emotional responses.

Your task is to analyze a designer's weekly tasks and emotions, then create four insightful summaries.

Emotion Scale Reference:
- 1: Happy, 2: Calm, 3: Excited, 4: Frustrated, 5: Sad, 6: Anxious
- 7: Surprised, 8: Neutral, 9: Nostalgic, 10: Energized, 11: Normal, 12: Tired
- 13: Satisfied, 14: Annoyed, 15: Drained, 16: Proud

Create four cards with this format:
1. What Lit You Up (emotions: 3-Excited, 7-Surprised, 10-Energized, 16-Proud)
2. What Gave You a Boost (emotions: 1-Happy, 3-Excited, 10-Energized, 13-Satisfied, 16-Proud)
3. What Drained Your Energy (emotions: 5-Sad, 6-Anxious, 8-Neutral, 12-Tired, 14-Annoyed, 15-Drained)
4. What Felt Fulfilling (emotions: 2-Calm, 9-Nostalgic, 11-Normal, 13-Satisfied)

Each card should have:
- A SHORT, punchy insight sentence (10-12 words max). Examples:
  * "Creative and expressive work fuels your momentum."
  * "Open-ended thinking lights up your process."
  * "Tedious execution drains your creative energy."
- 1-3 specific task examples from the data

Tone: Casual, direct, supportive — like a creative friend who gets you.
Focus on actionable patterns, not vague descriptions.
Keep insights brief, concrete, and energizing.

Return ONLY valid JSON in this format:
{
  "passion": {
    "insight": "One sentence about their passion pattern",
    "tasks": ["Task 1", "Task 2"]
  },
  "energy": {
    "insight": "One sentence about their energy pattern",
    "tasks": ["Task 1", "Task 2"]
  },
  "drained": {
    "insight": "One sentence about what drains them",
    "tasks": ["Task 1", "Task 2"]
  },
  "meaningful": {
    "insight": "One sentence about meaningful work",
    "tasks": ["Task 1", "Task 2"]
  }
}`
          },
          {
            role: 'user',
            content: `Analyze these tasks from this week and create four reflective insight cards:\n\n${JSON.stringify(taskSummary, null, 2)}`
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to generate insights',
        details: errorData 
      });
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0].message.content;

    // Parse AI response
    let insights;
    try {
      insights = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      return res.status(500).json({ 
        error: 'Invalid AI response format',
        rawResponse: aiResponse 
      });
    }

    // Return the insights
    return res.status(200).json({
      success: true,
      insights,
      tasksAnalyzed: tasks.length
    });

  } catch (error) {
    console.error('Error generating insights:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

