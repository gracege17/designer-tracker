# Testing Guide for recommendations.json

## Quick Start

Run the test suite to verify the recommendations.json structure:

```bash
node public/data/test-recommendations.cjs
```

## Test Results

✅ **All tests passed!**

### Summary Statistics
- **Emotional States**: 5 (balanced, struggling, energized, tired, curious)
- **Total Resources**: 60 (3 per category × 4 categories × 5 states)
- **Inspirational Quotes**: 10
- **Task Type Categories**: 4 (ui_design, research, prototyping, collaboration)
- **File Size**: ~20KB

### Resource Distribution
Each emotional state contains:
- **Tools**: 3 resources
- **Read**: 3 resources  
- **Podcast**: 3 resources
- **Video**: 3 resources

**Total per state**: 12 resources

## Testing in the App

### 1. Test with Balanced State
```typescript
// User with positive, calm emotions
const emotions = { calm: 0.4, happy: 0.3, excited: 0.2, frustrated: 0.1, anxious: 0.0 }
// Expected: Resources from "balanced" state
```

### 2. Test with Struggling State
```typescript
// User with high stress/frustration
const emotions = { calm: 0.1, happy: 0.1, excited: 0.0, frustrated: 0.5, anxious: 0.3 }
// Expected: Resources from "struggling" state
```

### 3. Test with Energized State
```typescript
// User with high energy and 3+ tasks
const emotions = { calm: 0.2, happy: 0.3, excited: 0.4, frustrated: 0.1, anxious: 0.0 }
const taskCount = 5
// Expected: Resources from "energized" state
```

### 4. Test with Tired State
```typescript
// User with low energy or minimal activity
const emotions = { calm: 0.3, happy: 0.1, excited: 0.0, frustrated: 0.2, anxious: 0.4 }
const taskCount = 1
// Expected: Resources from "tired" state
```

### 5. Test with Curious State
```typescript
// User with exploratory, curious emotions
const emotions = { calm: 0.2, happy: 0.3, excited: 0.4, frustrated: 0.1, anxious: 0.0 }
// Expected: Resources from "curious" state
```

## Integration Steps

### Step 1: Import the JSON
```typescript
import recommendations from '../public/data/recommendations.json'
```

### Step 2: Update helpfulResourcesService.ts
Replace the `PLACEHOLDER_RESOURCES` constant with data from recommendations.json:

```typescript
import recommendations from '../../public/data/recommendations.json'

export function getHelpfulResources(
  emotionBreakdown?: EmotionBreakdown,
  taskCount?: number
): HelpfulResource[] {
  const state = determineEmotionalState(emotionBreakdown, taskCount)
  const stateResources = recommendations.emotionalStates[state]
  
  return [
    stateResources.tools[0],
    stateResources.read[0],
    stateResources.podcast[0],
    stateResources.video[0]
  ]
}
```

### Step 3: Test in Browser
1. Open the app
2. Add tasks with different emotions
3. Check the "What Might Help Today" section
4. Verify resources match your emotional state

## Manual Testing Checklist

- [ ] Resources load correctly for balanced state
- [ ] Resources load correctly for struggling state
- [ ] Resources load correctly for energized state
- [ ] Resources load correctly for tired state
- [ ] Resources load correctly for curious state
- [ ] All resource titles display properly
- [ ] All resource descriptions are readable
- [ ] Resource icons match categories (tools/read/podcast/video)
- [ ] No duplicate resources shown
- [ ] URLs are valid (when clicked)

## Debugging

### Common Issues

**Issue**: Resources not loading
- Check browser console for JSON parse errors
- Verify file path is correct
- Ensure JSON is valid (run test-recommendations.cjs)

**Issue**: Wrong resources for emotional state
- Check emotion breakdown calculation
- Verify state determination logic
- Log the emotional state being selected

**Issue**: Missing icons
- Verify icon paths in `/public/icons/50px-icons/`
- Check icon filenames match: tool.png, read.png, podcast.png, video.png

## Adding More Test Data

To add more resources to recommendations.json:

1. Choose emotional state (balanced/struggling/energized/tired/curious)
2. Choose category (tools/read/podcast/video)
3. Add resource with unique ID:
```json
{
  "id": "tools-balanced-4",
  "category": "tools",
  "title": "Resource Name – Source",
  "description": "One sentence description.",
  "url": "https://example.com"
}
```
4. Run test: `node public/data/test-recommendations.cjs`
5. Verify unique IDs and structure

## Performance Notes

- JSON file size: ~20KB (very lightweight)
- Load time: < 1ms (synchronous import)
- No API calls required
- No external dependencies
- Works offline

## Next Steps

1. ✅ Test recommendations.json structure (DONE)
2. ⏳ Integrate with helpfulResourcesService.ts
3. ⏳ Test in browser with different emotional states
4. ⏳ Verify icons display correctly
5. ⏳ Add click tracking (optional)
6. ⏳ Consider AI-powered recommendations (future)

---

**Last Updated**: October 30, 2025  
**Status**: ✅ Ready for integration

