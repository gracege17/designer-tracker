/**
 * Smart Summary Service
 * 
 * Generates concise summary tags from task descriptions
 * to represent the core reasons behind emotional states.
 */

interface Task {
  description: string
  taskType?: string
  projectId?: string
}

/**
 * Generate 3 smart summary tags from task descriptions
 * 
 * Analyzes tasks and extracts key themes like:
 * - "Morning routines"
 * - "Team accomplishments"
 * - "Social moments"
 * 
 * @param tasks - Array of tasks with descriptions
 * @returns Array of 3 summary tags
 */
export function generateSummaryTags(tasks: Task[]): string[] {
  if (tasks.length === 0) {
    return []
  }

  // Pattern matching keywords for common themes
  const themePatterns = {
    // Time-based
    'Morning routines': /morning|breakfast|start|began|early/i,
    'Evening wrap-up': /evening|night|end of day|wrap|close/i,
    'Schedule alignment': /schedule|time|adjust|calendar|meeting time/i,
    
    // Social/Team
    'Team collaboration': /team|together|collaborative|group work/i,
    'Social moments': /meetup|social|gathering|chat|coffee|lunch/i,
    'Team sharing': /shared|presented|showed|demo/i,
    'Peer feedback': /feedback|review|critique|input from/i,
    
    // Work patterns
    'Deep focus': /focused|concentrate|deep work|flow/i,
    'Quick iterations': /iteration|quick|rapid|fast/i,
    'Problem solving': /debug|fix|solve|troubleshoot|figure out/i,
    'Creative exploration': /explore|experiment|try|sketch|brainstorm/i,
    
    // Project types
    'Design refinement': /refine|polish|detail|improve design/i,
    'User research': /research|user|interview|testing/i,
    'Prototyping': /prototype|mock|wireframe/i,
    'Documentation': /document|write|note|spec/i,
    
    // Accomplishments
    'Feature completion': /completed|finished|done|shipped/i,
    'Milestone reached': /milestone|achievement|reached|accomplished/i,
    'Progress made': /progress|moved forward|advanced/i,
    
    // Challenges
    'Technical challenges': /technical|code|development|bug/i,
    'Design decisions': /decide|choice|direction|approach/i,
    'Clarifying scope': /scope|clarify|define|understand/i,
    
    // Communication
    'Stakeholder sync': /stakeholder|client|manager|leadership/i,
    'Cross-team alignment': /cross-team|align|coordinate|sync/i,
    'Presentation prep': /presentation|present|pitch|slides/i,
    
    // Personal
    'Learning new skills': /learn|study|tutorial|course/i,
    'Organizing workflow': /organize|clean|setup|structure/i,
    'Planning ahead': /plan|roadmap|strategy|future/i
  }

  // Collect all task descriptions
  const allText = tasks.map(t => t.description).join(' ')
  
  // Find matching themes
  const matchedThemes: { theme: string; count: number }[] = []
  
  Object.entries(themePatterns).forEach(([theme, pattern]) => {
    const matches = allText.match(new RegExp(pattern, 'gi'))
    if (matches) {
      matchedThemes.push({ theme, count: matches.length })
    }
  })
  
  // Sort by count and take top 3
  matchedThemes.sort((a, b) => b.count - a.count)
  const topThemes = matchedThemes.slice(0, 3).map(t => t.theme)
  
  // If we found themes, return them
  if (topThemes.length >= 3) {
    return topThemes
  }
  
  // Fallback: Generate generic tags based on task content
  return generateFallbackTags(tasks, topThemes)
}

/**
 * Generate fallback tags when pattern matching doesn't find enough themes
 */
function generateFallbackTags(tasks: Task[], existingTags: string[]): string[] {
  const tags = [...existingTags]
  
  // Analyze task types if available
  const taskTypes = tasks.map(t => t.taskType).filter(Boolean)
  if (taskTypes.length > 0) {
    // Group similar task types
    if (taskTypes.some(t => t?.includes('Design'))) {
      tags.push('Design work')
    }
    if (taskTypes.some(t => t?.includes('Development'))) {
      tags.push('Development tasks')
    }
    if (taskTypes.some(t => t?.includes('Research'))) {
      tags.push('Research activities')
    }
  }
  
  // Analyze description words
  const words = tasks
    .flatMap(t => t.description.toLowerCase().split(/\s+/))
    .filter(w => w.length > 4) // Filter meaningful words
  
  const wordFreq: Record<string, number> = {}
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  // Get most common meaningful words
  const commonWords = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([word]) => word)
  
  // Create generic tags from common words
  if (tags.length < 3 && commonWords.length > 0) {
    commonWords.forEach(word => {
      if (tags.length < 3) {
        tags.push(`${word.charAt(0).toUpperCase()}${word.slice(1)} activities`)
      }
    })
  }
  
  // Final fallback: generic descriptions
  while (tags.length < 3) {
    const fallbacks = [
      'Daily tasks',
      'Work activities',
      'Project updates'
    ]
    tags.push(fallbacks[tags.length] || 'General work')
  }
  
  return tags.slice(0, 3)
}

/**
 * Check if generated tags are too generic/meaningless
 */
export function areTagsMeaningful(tags: string[]): boolean {
  if (tags.length === 0) return false
  
  // Generic patterns that indicate lack of meaningful data
  const genericPatterns = [
    /activities$/i,        // "Today activities", "Work activities"
    /^daily tasks$/i,      // "Daily tasks"
    /^work$/i,            // Just "Work"
    /^general work$/i,    // "General work"
    /^project updates$/i  // "Project updates"
  ]
  
  // If all tags match generic patterns, they're not meaningful
  const allGeneric = tags.every(tag => 
    genericPatterns.some(pattern => pattern.test(tag))
  )
  
  return !allGeneric
}

/**
 * AI-powered summary tag generation
 * 
 * Calls Vercel API endpoint which uses OpenAI GPT for keyword extraction
 */
export async function generateSummaryTagsWithAI(
  tasks: Task[],
  emotionCategory: 'energized' | 'drained' | 'meaningful' | 'curious'
): Promise<string[]> {
  if (tasks.length === 0) {
    return []
  }

  // Check if we're in development mode
  const isDev = typeof window !== 'undefined' && import.meta.env.MODE !== 'production'
  
  if (isDev) {
    return generateSummaryTags(tasks)
  }

  try {
    const response = await fetch('/api/generate-emotion-keywords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: tasks.map(t => ({
          description: t.description,
          emotion: 0, // Not needed for AI analysis
          taskType: t.taskType
        })),
        emotionCategory
      })
    })

    if (!response.ok) {
      throw new Error('API call failed')
    }

    const data = await response.json()
    
    if (data.usePatternBased) {
      // API said to use pattern-based (no API key configured)
      return generateSummaryTags(tasks)
    }
    
    return data.keywords || generateSummaryTags(tasks)
  } catch (error) {
    console.error('AI keyword generation failed:', error)
    return generateSummaryTags(tasks)
  }
}

/**
 * Generate summary tag for a single task (for quick preview)
 */
export function generateSingleTag(taskDescription: string): string {
  const themePatterns: Record<string, RegExp> = {
    'Team moment': /team|together|collaborative|meeting/i,
    'Social': /meetup|social|chat|coffee/i,
    'Focus work': /focused|concentrate|deep/i,
    'Problem solved': /fix|solve|debug/i,
    'Creative': /create|design|sketch|brainstorm/i,
    'Research': /research|study|learn/i,
    'Progress': /completed|finished|done/i,
    'Planning': /plan|organize|schedule/i
  }
  
  for (const [tag, pattern] of Object.entries(themePatterns)) {
    if (pattern.test(taskDescription)) {
      return tag
    }
  }
  
  // Fallback: extract first meaningful word
  const words = taskDescription.split(/\s+/).filter(w => w.length > 4)
  return words[0] ? `${words[0].charAt(0).toUpperCase()}${words[0].slice(1)}` : 'Work'
}

