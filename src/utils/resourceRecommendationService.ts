import { Entry, EMOTIONS } from '../types'

interface ResourceRecommendation {
  quote?: string
  resourceType: 'quote' | 'video' | 'article' | 'book'
  resourceTitle: string
  url: string
  description?: string
}

// Curated resource database
const RESOURCE_DATABASE: ResourceRecommendation[] = [
  // High Energy Resources
  {
    resourceType: 'video',
    resourceTitle: 'The Power of Creative Flow',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Learn how to maintain and channel your creative energy'
  },
  {
    resourceType: 'article',
    resourceTitle: 'Sustaining Creative Momentum',
    url: 'https://medium.com/@designer/sustaining-creative-momentum',
    description: 'Tips for keeping your creative flow going'
  },
  {
    resourceType: 'quote',
    resourceTitle: 'Inspiration Quote',
    url: '#',
    quote: '"Creativity is intelligence having fun." - Albert Einstein'
  },

  // Low Energy / Challenging Day Resources
  {
    resourceType: 'video',
    resourceTitle: 'Overcoming Creative Blocks',
    url: 'https://www.youtube.com/watch?v=creative-blocks',
    description: 'Strategies for breaking through creative barriers'
  },
  {
    resourceType: 'article',
    resourceTitle: 'When Design Work Feels Heavy',
    url: 'https://designer.blog/when-design-work-feels-heavy',
    description: 'Navigating difficult design challenges'
  },
  {
    resourceType: 'quote',
    resourceTitle: 'Encouragement Quote',
    url: '#',
    quote: '"The only way to do great work is to love what you do." - Steve Jobs'
  },

  // Mixed/Neutral Day Resources
  {
    resourceType: 'video',
    resourceTitle: 'Finding Balance in Design Work',
    url: 'https://www.youtube.com/watch?v=design-balance',
    description: 'Balancing different types of design tasks'
  },
  {
    resourceType: 'article',
    resourceTitle: 'The Designer\'s Daily Practice',
    url: 'https://designer.blog/daily-practice',
    description: 'Building consistent creative habits'
  },
  {
    resourceType: 'quote',
    resourceTitle: 'Wisdom Quote',
    url: '#',
    quote: '"Progress, not perfection." - Unknown'
  },

  // Meaningful Work Resources
  {
    resourceType: 'video',
    resourceTitle: 'Design with Purpose',
    url: 'https://www.youtube.com/watch?v=design-purpose',
    description: 'Creating meaningful design solutions'
  },
  {
    resourceType: 'article',
    resourceTitle: 'Impact-Driven Design',
    url: 'https://designer.blog/impact-driven-design',
    description: 'How to create designs that matter'
  },
  {
    resourceType: 'quote',
    resourceTitle: 'Purpose Quote',
    url: '#',
    quote: '"Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs'
  },

  // Technical/Problem-Solving Resources
  {
    resourceType: 'video',
    resourceTitle: 'Systematic Problem Solving',
    url: 'https://www.youtube.com/watch?v=problem-solving',
    description: 'Approaching design problems methodically'
  },
  {
    resourceType: 'article',
    resourceTitle: 'Debugging Design Systems',
    url: 'https://designer.blog/debugging-design-systems',
    description: 'Troubleshooting design challenges'
  },
  {
    resourceType: 'quote',
    resourceTitle: 'Problem-Solving Quote',
    url: '#',
    quote: '"Every problem is a gift - without problems we would not grow." - Anthony Robbins'
  },

  // Exploration/Innovation Resources
  {
    resourceType: 'video',
    resourceTitle: 'Design Experimentation',
    url: 'https://www.youtube.com/watch?v=design-experiments',
    description: 'The art of design experimentation'
  },
  {
    resourceType: 'article',
    resourceTitle: 'Innovation in Design',
    url: 'https://designer.blog/innovation-in-design',
    description: 'Pushing creative boundaries'
  },
  {
    resourceType: 'quote',
    resourceTitle: 'Innovation Quote',
    url: '#',
    quote: '"Innovation distinguishes between a leader and a follower." - Steve Jobs'
  },

  // General Well-being Resources
  {
    resourceType: 'video',
    resourceTitle: 'Designer Self-Care',
    url: 'https://www.youtube.com/watch?v=designer-self-care',
    description: 'Taking care of yourself as a creative professional'
  },
  {
    resourceType: 'article',
    resourceTitle: 'Avoiding Designer Burnout',
    url: 'https://designer.blog/avoiding-burnout',
    description: 'Maintaining long-term creative health'
  },
  {
    resourceType: 'quote',
    resourceTitle: 'Well-being Quote',
    url: '#',
    quote: '"Rest when you\'re weary. Refresh and renew yourself, your body, your mind, your spirit." - Ralph Marston'
  }
]

export const getResourceRecommendation = async (entries: Entry[]): Promise<ResourceRecommendation> => {
  if (entries.length === 0) {
    // Default recommendation for new users
    return {
      resourceType: 'quote',
      resourceTitle: 'Welcome Quote',
      url: '#',
      quote: '"Every expert was once a beginner. Every pro was once an amateur." - Robin Sharma'
    }
  }

  try {
    // Analyze recent entries (last 7 days)
    const recentEntries = entries.slice(-7)
    const allTasks = recentEntries.flatMap(entry => entry.tasks)
    
    if (allTasks.length === 0) {
      return RESOURCE_DATABASE[0] // Default high energy resource
    }

    // Calculate average emotion and task patterns
    const avgEmotion = allTasks.reduce((sum, task) => {
      const emotion = task.emotions && task.emotions.length > 0 
        ? task.emotions[0] 
        : task.emotion
      return sum + emotion
    }, 0) / allTasks.length

    // Analyze task types
    const taskTypes = allTasks.map(task => task.taskType)
    const hasVisualWork = taskTypes.some(type => ['UI Design', 'Visual Design', 'Branding'].includes(type))
    const hasTechnicalWork = taskTypes.some(type => ['Development', 'Prototyping', 'Testing'].includes(type))
    const hasResearchWork = taskTypes.some(type => ['Research', 'User Testing', 'Analysis'].includes(type))

    // Determine recommendation category based on patterns
    let categoryResources: ResourceRecommendation[] = []

    if (avgEmotion >= 10) {
      // High energy - sustain momentum
      categoryResources = RESOURCE_DATABASE.filter(r => 
        r.resourceTitle.includes('Creative Flow') || 
        r.resourceTitle.includes('Momentum') ||
        r.resourceTitle.includes('Creativity')
      )
    } else if (avgEmotion <= 5) {
      // Low energy - encouragement and problem-solving
      categoryResources = RESOURCE_DATABASE.filter(r => 
        r.resourceTitle.includes('Blocks') || 
        r.resourceTitle.includes('Heavy') ||
        r.resourceTitle.includes('Problem') ||
        r.resourceTitle.includes('Burnout')
      )
    } else if (hasTechnicalWork && avgEmotion < 8) {
      // Technical challenges
      categoryResources = RESOURCE_DATABASE.filter(r => 
        r.resourceTitle.includes('Problem') || 
        r.resourceTitle.includes('Systematic') ||
        r.resourceTitle.includes('Debugging')
      )
    } else if (hasResearchWork) {
      // Research and analysis work
      categoryResources = RESOURCE_DATABASE.filter(r => 
        r.resourceTitle.includes('Purpose') || 
        r.resourceTitle.includes('Impact') ||
        r.resourceTitle.includes('Meaningful')
      )
    } else if (hasVisualWork && avgEmotion >= 7) {
      // Creative visual work
      categoryResources = RESOURCE_DATABASE.filter(r => 
        r.resourceTitle.includes('Experimentation') || 
        r.resourceTitle.includes('Innovation') ||
        r.resourceTitle.includes('Creative')
      )
    } else {
      // Mixed day - general well-being
      categoryResources = RESOURCE_DATABASE.filter(r => 
        r.resourceTitle.includes('Balance') || 
        r.resourceTitle.includes('Practice') ||
        r.resourceTitle.includes('Self-Care')
      )
    }

    // If no specific category matches, use general resources
    if (categoryResources.length === 0) {
      categoryResources = RESOURCE_DATABASE.filter(r => 
        r.resourceTitle.includes('Balance') || 
        r.resourceTitle.includes('Practice')
      )
    }

    // Return a random resource from the appropriate category
    const randomIndex = Math.floor(Math.random() * categoryResources.length)
    return categoryResources[randomIndex]

  } catch (error) {
    console.error('Error generating resource recommendation:', error)
    // Fallback to a general encouraging resource
    return {
      resourceType: 'quote',
      resourceTitle: 'Encouragement Quote',
      url: '#',
      quote: '"The only way to do great work is to love what you do." - Steve Jobs'
    }
  }
}
