# Helpful Resources Feature

## Overview

The "What Might Help Today" section provides 4 curated resources (Tools, Read, Podcast, Video) tailored to the user's emotional state and daily challenges.

**Status**: ✅ Static implementation complete, ready for AI integration

## Architecture

### Components

1. **`HelpfulResourcesCard.tsx`** - React component that displays the resources
2. **`helpfulResourcesService.ts`** - Service that provides resource recommendations
3. **Dashboard integration** - Displays the card on the homepage

### Data Flow

```
User's emotional data → helpfulResourcesService → Resource recommendations → HelpfulResourcesCard → UI
```

## Current Implementation (Static)

### Resource Structure

```typescript
interface HelpfulResource {
  id: string
  category: 'tools' | 'read' | 'podcast' | 'video'
  icon?: string
  title: string        // e.g., "Why You Don't Have to Be Productive Every Day" – TEDx Talk
  description: string  // e.g., "A short reminder to slow down and recharge."
  url?: string         // For future: clickable links
}
```

### Pattern Matching Logic

The service uses simple pattern matching based on:

1. **Emotional breakdown** (calm, happy, excited, frustrated, anxious)
2. **Task count** (activity level)
3. **Calculated scores**:
   - `positiveScore` = calm + happy + excited
   - `negativeScore` = frustrated + anxious
   - `energyLevel` = excited × 1.5 + happy × 1.2 + calm × 0.8
   - `stressLevel` = frustrated × 1.5 + anxious × 1.3

### Resource Categories

**1. Balanced** (positive emotions, good energy)
- Tools: Productivity tips
- Read: Creative flow books
- Podcast: Designer communication
- Video: Productivity mindset

**2. Struggling** (high frustration/anxiety)
- Tools: Reset checklists
- Read: Overcoming creative blocks
- Podcast: Managing stress
- Video: Growth through struggle

**3. Energized** (high excitement, multiple tasks)
- Tools: Design system organizers
- Read: Creative flow science
- Podcast: Scaling impact
- Video: Creative energy

**4. Tired** (low energy, few tasks)
- Tools: Meditation apps
- Read: Rest as growth
- Podcast: Avoiding burnout
- Video: Science of rest

**5. Default** (fallback)
- General helpful resources

## Usage

### In Dashboard Component

```tsx
import { getHelpfulResources } from '../utils/helpfulResourcesService'
import HelpfulResourcesCard from './HelpfulResourcesCard'

// Inside component:
{emotionBreakdown && (
  <HelpfulResourcesCard 
    resources={getHelpfulResources(
      emotionBreakdown.breakdown,
      emotionBreakdown.totalTasks
    )}
  />
)}
```

### Customizing Title/Subtitle

```tsx
<HelpfulResourcesCard 
  resources={resources}
  title="What Might Help Today"
  subtitle="Rest is also growth. Here's something gentle to recharge your energy."
/>
```

## UI Design

### Card Structure

```
┌─────────────────────────────────────────────┐
│  What Might Help Today                      │
│  Rest is also growth. Here's something...   │
│                                             │
│  🔧  Title of resource                      │
│  Tools  Description of resource             │
│                                             │
│  📖  Title of resource                      │
│  Read  Description of resource              │
│                                             │
│  🎙️  Title of resource                      │
│  Podcast  Description of resource           │
│                                             │
│  ▶️  Title of resource                      │
│  Video  Description of resource             │
└─────────────────────────────────────────────┘
```

### Styling

- **Background**: `bg-white/[0.04]` (glass effect)
- **Border radius**: `16px 16px 0 0` (rounded top)
- **Title**: 24px bold white
- **Subtitle**: 14px #938F99
- **Resource cards**: Interactive hover states
- **Icons**: 24px, #EC5429 (primary orange)
- **Category labels**: 11px #938F99

## Future AI Integration

### Step 1: Enable OpenAI API

1. Get API key from [OpenAI](https://platform.openai.com/)
2. Add to `.env`:
   ```
   OPENAI_API_KEY=your_key_here
   ```

### Step 2: Uncomment AI Function

In `helpfulResourcesService.ts`, uncomment:

```typescript
export async function getHelpfulResourcesWithAI(
  emotionBreakdown: { ... },
  taskCount: number,
  recentReflections?: string[]
): Promise<HelpfulResource[]>
```

### Step 3: Update Dashboard

```tsx
const [resources, setResources] = useState<HelpfulResource[]>([])
const [isLoadingResources, setIsLoadingResources] = useState(false)

useEffect(() => {
  if (emotionBreakdown) {
    setIsLoadingResources(true)
    getHelpfulResourcesWithAI(
      emotionBreakdown.breakdown,
      emotionBreakdown.totalTasks,
      recentReflections
    )
    .then(setResources)
    .finally(() => setIsLoadingResources(false))
  }
}, [emotionBreakdown])

// Then in JSX:
<HelpfulResourcesCard resources={resources} />
```

### AI Prompt Strategy

The AI receives:
- **Emotion breakdown** (percentages)
- **Task count**
- **Recent reflections** (optional)

And generates 4 personalized resources:
- Specific titles with author/source
- Contextual descriptions (1 sentence)
- Relevant to current emotional state

### Example AI Output

**Input**: 50% frustrated, 30% anxious, 3 tasks

**AI Output**:
```json
[
  {
    "category": "tools",
    "title": "Headspace: 3-Minute Stress Reset",
    "description": "Quick breathing exercise for when frustration peaks."
  },
  {
    "category": "read",
    "title": "\"When Things Go Wrong\" – Sarah Drasner",
    "description": "How senior designers handle setbacks with grace."
  },
  {
    "category": "podcast",
    "title": "\"Navigating Design Challenges\" – Design Details",
    "description": "Real stories of overcoming tough project moments."
  },
  {
    "category": "video",
    "title": "\"The Gift of Frustration\" – TEDx Talk",
    "description": "Why difficult moments lead to creative breakthroughs."
  }
]
```

## Benefits

### Current (Static Implementation)
✅ **Fast** - Instant recommendations, no API calls  
✅ **Free** - No API costs  
✅ **Reliable** - Always works offline  
✅ **Contextual** - Adapts to 5 emotional states  
✅ **Modular** - Easy to swap with AI later  

### Future (AI-Powered)
🔮 **Hyper-personalized** - Unique recommendations each time  
🔮 **Context-aware** - Considers recent reflections and patterns  
🔮 **Dynamic** - Generates new resources based on trends  
🔮 **Learning** - Gets better with more user data  
🔮 **Specific** - Real book/podcast/video titles  

## Testing Scenarios

### Test Case 1: Frustrated User
```typescript
getHelpfulResources({
  calm: 0.1,
  happy: 0,
  excited: 0,
  frustrated: 0.7,
  anxious: 0.2
}, 3)

// Expected: "struggling" resources
// - Reset checklists
// - Overcoming blocks
// - Managing stress
// - Growth through struggle
```

### Test Case 2: Energized User
```typescript
getHelpfulResources({
  calm: 0.2,
  happy: 0.3,
  excited: 0.5,
  frustrated: 0,
  anxious: 0
}, 8)

// Expected: "energized" resources
// - Design system tools
// - Creative flow books
// - Scaling impact podcasts
// - Creative energy videos
```

### Test Case 3: Tired User
```typescript
getHelpfulResources({
  calm: 0.3,
  happy: 0.1,
  excited: 0,
  frustrated: 0.1,
  anxious: 0.05
}, 1)

// Expected: "tired" resources
// - Meditation apps
// - Rest as growth
// - Avoiding burnout
// - Science of rest
```

### Test Case 4: No Data
```typescript
getHelpfulResources(undefined, undefined)

// Expected: "default" resources
// - General productivity tips
// - Art of rest
// - Designer communication
// - Productivity mindset
```

## Customization

### Adding New Resource Sets

Edit `PLACEHOLDER_RESOURCES` in `helpfulResourcesService.ts`:

```typescript
const PLACEHOLDER_RESOURCES = {
  // Add new category
  motivated: [
    {
      id: 'tools-motivated',
      category: 'tools',
      title: 'Your custom resource',
      description: 'Your description'
    },
    // ... 3 more resources
  ]
}
```

### Modifying Pattern Matching

Edit the logic in `getHelpfulResources()`:

```typescript
// Add custom conditions
if (excited > 0.6 && frustrated < 0.2) {
  resourceKey = 'motivated'
}
```

### Changing Icons

In `HelpfulResourcesCard.tsx`, modify `getCategoryIcon()`:

```typescript
case 'tools':
  return <YourCustomIcon {...iconProps} />
```

## Files Modified

- ✅ `src/utils/helpfulResourcesService.ts` (new)
- ✅ `src/components/HelpfulResourcesCard.tsx` (new)
- ✅ `src/components/Dashboard.tsx` (integrated)
- ✅ `docs/helpful-resources-feature.md` (this file)

---

**Status**: Production ready with static data  
**Next Step**: Optional AI integration when ready  
**Last Updated**: October 2025

