/**
 * Example Usage of recommendations.json
 * 
 * This file demonstrates how to integrate the recommendations.json data
 * with the existing helpfulResourcesService and resourceRecommendationService
 */

import recommendations from './recommendations.json'

// Type definitions matching the JSON structure
type ResourceCategory = 'tools' | 'read' | 'podcast' | 'video'
type EmotionalState = 'balanced' | 'struggling' | 'energized' | 'tired' | 'curious'

interface Resource {
  id: string
  category: ResourceCategory
  title: string
  description: string
  url: string
}

interface EmotionBreakdown {
  calm: number
  happy: number
  excited: number
  frustrated: number
  anxious: number
}

// ============================================================================
// Example 1: Get Resources by Emotional State
// ============================================================================

/**
 * Determine emotional state from emotion breakdown percentages
 */
function determineEmotionalState(
  emotionBreakdown: EmotionBreakdown,
  taskCount: number
): EmotionalState {
  const { calm, happy, excited, frustrated, anxious } = emotionBreakdown
  
  const positiveScore = calm + happy + excited
  const negativeScore = frustrated + anxious
  const energyLevel = excited * 1.5 + happy * 1.2 + calm * 0.8
  const stressLevel = frustrated * 1.5 + anxious * 1.3

  // Pattern matching
  if (stressLevel > 0.5) {
    return 'struggling'
  } else if (energyLevel > 0.7 && taskCount >= 3) {
    return 'energized'
  } else if (energyLevel < 0.3 || taskCount <= 1) {
    return 'tired'
  } else if (excited > 0.3 && (happy > 0.2 || calm > 0.2)) {
    return 'curious'
  } else {
    return 'balanced'
  }
}

/**
 * Get 4 resources (one per category) based on emotional state
 */
function getResourcesForState(state: EmotionalState): Resource[] {
  const stateResources = recommendations.emotionalStates[state]
  
  // Get one resource from each category
  return [
    stateResources.tools[0],
    stateResources.read[0],
    stateResources.podcast[0],
    stateResources.video[0]
  ]
}

// Example usage
const exampleEmotions: EmotionBreakdown = {
  calm: 0.3,
  happy: 0.4,
  excited: 0.2,
  frustrated: 0.1,
  anxious: 0.0
}

const state = determineEmotionalState(exampleEmotions, 4)
console.log('Emotional State:', state) // "balanced" or "energized"

const resources = getResourcesForState(state)
console.log('Recommended Resources:', resources)

// ============================================================================
// Example 2: Get Random Resources by State and Category
// ============================================================================

/**
 * Get a random resource of specific category for given emotional state
 */
function getRandomResource(
  state: EmotionalState,
  category: ResourceCategory
): Resource {
  const stateResources = recommendations.emotionalStates[state]
  const categoryResources = stateResources[category]
  
  const randomIndex = Math.floor(Math.random() * categoryResources.length)
  return categoryResources[randomIndex]
}

// Example usage
const randomTool = getRandomResource('energized', 'tools')
console.log('Random Tool:', randomTool)

// ============================================================================
// Example 3: Get Inspirational Quote
// ============================================================================

/**
 * Get a random inspirational quote
 */
function getRandomQuote(category?: string) {
  let quotes = recommendations.quotes
  
  if (category) {
    quotes = quotes.filter(q => q.category === category)
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length)
  return quotes[randomIndex]
}

// Example usage
const inspirationQuote = getRandomQuote('inspiration')
console.log('Quote:', inspirationQuote.text)
console.log('Author:', inspirationQuote.author)

// ============================================================================
// Example 4: Get Resources by Task Type
// ============================================================================

/**
 * Get resources relevant to specific task types
 */
function getTaskTypeResources(taskType: string) {
  const taskTypeKey = taskType.toLowerCase().replace(' ', '_')
  return recommendations.taskTypeResources[taskTypeKey] || []
}

// Example usage
const uiResources = getTaskTypeResources('ui_design')
console.log('UI Design Resources:', uiResources)

// ============================================================================
// Example 5: Integration with HelpfulResourcesCard Component
// ============================================================================

/**
 * Format resources for the HelpfulResourcesCard component
 */
function formatForHelpfulResourcesCard(
  emotionBreakdown: EmotionBreakdown,
  taskCount: number
) {
  const state = determineEmotionalState(emotionBreakdown, taskCount)
  const stateResources = recommendations.emotionalStates[state]
  
  return {
    title: `What Might Help Today`,
    subtitle: getStateMessage(state),
    resources: [
      {
        ...stateResources.tools[0],
        icon: '/icons/50px-icons/tool.png'
      },
      {
        ...stateResources.read[0],
        icon: '/icons/50px-icons/read.png'
      },
      {
        ...stateResources.podcast[0],
        icon: '/icons/50px-icons/podcast.png'
      },
      {
        ...stateResources.video[0],
        icon: '/icons/50px-icons/video.png'
      }
    ]
  }
}

function getStateMessage(state: EmotionalState): string {
  const messages = {
    balanced: 'You\'re in a good flow—here\'s something to keep it going.',
    struggling: 'It\'s okay to feel stuck. These might help.',
    energized: 'You\'re on fire! Channel that energy here.',
    tired: 'Take it easy. Rest is part of the process.',
    curious: 'Explore something new and spark fresh ideas.'
  }
  return messages[state]
}

// Example usage
const cardData = formatForHelpfulResourcesCard(exampleEmotions, 4)
console.log('Card Data:', cardData)

// ============================================================================
// Example 6: Get Multiple Random Resources (Avoid Duplicates)
// ============================================================================

/**
 * Get N random resources from a specific state without duplicates
 */
function getRandomResources(
  state: EmotionalState,
  count: number = 4
): Resource[] {
  const stateResources = recommendations.emotionalStates[state]
  
  // Collect all resources
  const allResources = [
    ...stateResources.tools,
    ...stateResources.read,
    ...stateResources.podcast,
    ...stateResources.video
  ]
  
  // Shuffle and take N resources
  const shuffled = allResources.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Example usage
const randomResources = getRandomResources('energized', 3)
console.log('Random Resources:', randomResources)

// ============================================================================
// Example 7: Search Resources by Keyword
// ============================================================================

/**
 * Search for resources by keyword in title or description
 */
function searchResources(keyword: string): Resource[] {
  const allStates = Object.values(recommendations.emotionalStates)
  const allResources: Resource[] = []
  
  allStates.forEach(state => {
    allResources.push(
      ...state.tools,
      ...state.read,
      ...state.podcast,
      ...state.video
    )
  })
  
  const lowerKeyword = keyword.toLowerCase()
  return allResources.filter(resource =>
    resource.title.toLowerCase().includes(lowerKeyword) ||
    resource.description.toLowerCase().includes(lowerKeyword)
  )
}

// Example usage
const designSystemResources = searchResources('design system')
console.log('Design System Resources:', designSystemResources)

// ============================================================================
// Export for use in other files
// ============================================================================

export {
  determineEmotionalState,
  getResourcesForState,
  getRandomResource,
  getRandomQuote,
  getTaskTypeResources,
  formatForHelpfulResourcesCard,
  getRandomResources,
  searchResources
}

