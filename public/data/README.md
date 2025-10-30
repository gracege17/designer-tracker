# Recommendations Data

This directory contains test data for the Designer Tracker app's resource recommendation system.

## Files

### `recommendations.json`

A comprehensive database of curated resources for designers based on their emotional state and work patterns.

## Structure

### Emotional States

The JSON file organizes resources by 5 emotional states:

1. **balanced** - For users feeling calm and centered
2. **struggling** - For users feeling frustrated or anxious
3. **energized** - For users feeling excited and productive
4. **tired** - For users feeling low energy or exhausted
5. **curious** - For users feeling exploratory and innovative

### Resource Categories

Each emotional state includes 4 types of resources:

- **tools** - Apps, plugins, templates, and software
- **read** - Books, articles, and written content
- **podcast** - Audio content and conversations
- **video** - Video tutorials, talks, and courses

### Resource Object Structure

```json
{
  "id": "unique-id",
  "category": "tools|read|podcast|video",
  "title": "Resource Title with Author/Source",
  "description": "One-sentence description of what it offers",
  "url": "https://example.com"
}
```

## Usage Examples

### 1. Get Resources by Emotional State

```typescript
import recommendations from './public/data/recommendations.json'

// Get all resources for energized users
const energizedResources = recommendations.emotionalStates.energized

// Get specific category
const tools = recommendations.emotionalStates.energized.tools
const podcasts = recommendations.emotionalStates.struggling.podcast
```

### 2. Random Resource Selection

```typescript
// Pick one random tool for balanced state
const balancedTools = recommendations.emotionalStates.balanced.tools
const randomTool = balancedTools[Math.floor(Math.random() * balancedTools.length)]
```

### 3. Get All Resources of One Category

```typescript
// Get all podcast recommendations across all emotional states
const allPodcasts = Object.values(recommendations.emotionalStates)
  .flatMap(state => state.podcast)
```

### 4. Access Inspirational Quotes

```typescript
// Get random quote
const quotes = recommendations.quotes
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

// Filter quotes by category
const inspirationQuotes = quotes.filter(q => q.category === 'inspiration')
```

### 5. Get Resources by Task Type

```typescript
// Get resources specific to task types
const uiDesignResources = recommendations.taskTypeResources.ui_design
const researchResources = recommendations.taskTypeResources.research
```

## Integration with Services

### HelpfulResourcesService

```typescript
import { HelpfulResource } from '../utils/helpfulResourcesService'
import recommendations from '../public/data/recommendations.json'

function getHelpfulResources(emotionState: string): HelpfulResource[] {
  const stateResources = recommendations.emotionalStates[emotionState]
  
  return [
    stateResources.tools[0],
    stateResources.read[0],
    stateResources.podcast[0],
    stateResources.video[0]
  ]
}
```

### ResourceRecommendationService

```typescript
import recommendations from '../public/data/recommendations.json'

function getResourceRecommendation(emotionState: string, preferredType: string) {
  const stateResources = recommendations.emotionalStates[emotionState]
  const resources = stateResources[preferredType]
  
  return resources[Math.floor(Math.random() * resources.length)]
}
```

## Testing Scenarios

### Scenario 1: New User (No Data)
- Show resources from "balanced" state
- Display a welcome quote

### Scenario 2: Productive Day (3+ tasks, positive emotions)
- Show resources from "energized" state
- Focus on tools and learning

### Scenario 3: Challenging Day (frustrated/anxious emotions)
- Show resources from "struggling" state
- Focus on support and encouragement

### Scenario 4: Low Energy Day (tired/drained emotions)
- Show resources from "tired" state
- Focus on rest and recovery

### Scenario 5: Exploratory Day (curious/surprised emotions)
- Show resources from "curious" state
- Focus on experimentation and learning

## Adding New Resources

To add new resources:

1. Choose the appropriate emotional state
2. Choose the resource category (tools/read/podcast/video)
3. Follow the structure:
   ```json
   {
     "id": "category-state-number",
     "category": "tools",
     "title": "Resource Name – Source/Author",
     "description": "Brief one-sentence description.",
     "url": "https://actual-url.com"
   }
   ```

## Resource Guidelines

- **Titles**: Include source/author (e.g., "Design Better – InVision")
- **Descriptions**: One sentence, actionable, clear benefit
- **URLs**: Use real URLs when possible, placeholder "#" for test data
- **Quality**: Prioritize well-known, trusted sources
- **Diversity**: Mix free and premium resources
- **Relevance**: Match content to emotional state

## Future Enhancements

- Add resource ratings/popularity
- Track which resources users click
- A/B test different recommendation strategies
- Add resource tags (beginner/advanced, quick/deep)
- Include estimated time to consume (5min, 1hr, etc.)
- Add language support for international resources

## License

All resources listed are property of their respective creators. This database is for testing and educational purposes.

