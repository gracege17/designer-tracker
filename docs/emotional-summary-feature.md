# Emotional Summary Feature

## Overview

The Emotional Summary feature provides AI-generated, contextual summaries of the user's emotional state based on their task logs and emotion breakdown data.

## Implementation

### Service: `emotionalSummaryService.ts`

Located at: `src/utils/emotionalSummaryService.ts`

#### Function: `generateEmotionalSummary()`

Generates human-readable emotional summaries using intelligent pattern matching.

**Input:**
```typescript
{
  breakdown: {
    calm: number,      // 0.0 - 1.0
    happy: number,
    excited: number,
    frustrated: number,
    anxious: number
  },
  taskCount: number    // Total tasks logged today
}
```

**Output:**
```typescript
string  // 1-2 sentence contextual summary
```

### Integration in Dashboard

The summary appears in the **Emotional Highlights** card on the homepage, below the title.

```tsx
<p className="text-[14px] font-normal text-[#938F99] leading-relaxed">
  {generateEmotionalSummary({
    breakdown: emotionBreakdown.breakdown,
    taskCount: emotionBreakdown.totalTasks
  })}
</p>
```

## Summary Logic

The service uses **pattern matching** based on:

1. **Task count** (activity level)
2. **Dominant emotions** (top 1-2 emotions)
3. **Overall emotional tone** (positive vs. challenging)

### Pattern Categories

#### 1. Very Low Activity (0-2 tasks)

**Examples:**
- "You logged 1 task today and felt mostly calm. A gentle start to the day."
- "You haven't logged any tasks yet today. How are you feeling?"
- "You logged 2 tasks today but felt frustrated. Remember to be kind to yourself."

#### 2. Moderate Activity (3-5 tasks)

**Examples:**
- "You felt mostly happy today with moments of calm. You're finding your rhythm."
- "You navigated 4 tasks today while feeling anxious. That takes courage."
- "Today felt challenging with 5 tasks. The frustration is real, but you're making progress."

#### 3. High Activity (6+ tasks)

**Examples:**
- "You powered through 8 tasks with excitement and energy today! You're on fire."
- "You completed 6 tasks today and felt genuinely happy. That's the sweet spot."
- "You pushed through 7 tasks despite feeling frustrated. That's resilience. Take a break if you need it."

#### 4. Balanced Emotions

**Examples:**
- "You experienced a mix of emotions today—calm, happy, anxious. That's the full spectrum of being human."

## Tone & Voice

The summaries follow these principles:

✅ **Empathetic** - Validates feelings without judgment  
✅ **Specific** - Mentions actual emotions and task counts  
✅ **Encouraging** - Offers gentle support and celebration  
✅ **Authentic** - Acknowledges both positive and challenging states  
✅ **Concise** - 1-2 sentences maximum  

### Voice Guidelines

**When user is thriving:**
- Celebrate their momentum
- Acknowledge their flow state
- Encourage them to keep it up

**When user is struggling:**
- Validate their emotions
- Acknowledge their courage/resilience
- Offer gentle reminders for self-care

**When emotions are mixed:**
- Normalize the complexity
- Frame it as part of being human

## Example Outputs by Scenario

### Scenario 1: New User (1 task, mostly calm)
```
"You logged 1 task today and felt mostly calm. A gentle start to the day."
```

### Scenario 2: Productive & Happy (6 tasks, 60% happy, 30% calm)
```
"You completed 6 tasks today and felt genuinely happy. That's the sweet spot."
```

### Scenario 3: Struggling (4 tasks, 50% frustrated, 30% anxious)
```
"Today felt challenging with 4 tasks. The frustration is real, but you're making progress."
```

### Scenario 4: High Energy (10 tasks, 70% excited)
```
"You powered through 10 tasks with excitement and energy today! You're on fire."
```

### Scenario 5: Mixed Emotions (5 tasks, balanced)
```
"You experienced a mix of emotions today—calm, happy, anxious. That's the full spectrum of being human."
```

## Optional: OpenAI Integration

For more dynamic, personalized summaries, you can use the OpenAI API.

### Setup

1. **Get API Key**: Sign up at [OpenAI](https://platform.openai.com/)
2. **Add to Environment**: Create `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Uncomment the function** in `emotionalSummaryService.ts`:
   ```typescript
   export async function generateEmotionalSummaryWithAI(input: EmotionSummaryInput): Promise<string>
   ```

4. **Update Dashboard** to use async version:
   ```tsx
   const [emotionalSummary, setEmotionalSummary] = useState('')
   
   useEffect(() => {
     if (emotionBreakdown) {
       generateEmotionalSummaryWithAI({
         breakdown: emotionBreakdown.breakdown,
         taskCount: emotionBreakdown.totalTasks
       }).then(setEmotionalSummary)
     }
   }, [emotionBreakdown])
   
   // Then in JSX:
   <p>{emotionalSummary}</p>
   ```

### OpenAI Prompt Template

```
You are a compassionate emotional wellness coach. Based on the following emotion data from a designer's day, generate a short, empathetic summary (1-2 sentences max):

Task count: X
Emotions breakdown:
- Calm: X%
- Happy: X%
- Excited: X%
- Frustrated: X%
- Anxious: X%

Write in a warm, supportive tone. Be specific about the emotions but keep it concise.
```

### Cost Considerations

- **GPT-4**: ~$0.03 per request (60 tokens)
- **GPT-3.5-turbo**: ~$0.0001 per request (much cheaper)
- **Recommendation**: Start with deterministic summaries (free), add AI later if needed

## Testing

Test with various emotion patterns:

```typescript
// Test Case 1: High positive emotions
generateEmotionalSummary({
  breakdown: { calm: 0.3, happy: 0.6, excited: 0.1, frustrated: 0, anxious: 0 },
  taskCount: 5
})

// Test Case 2: High frustration
generateEmotionalSummary({
  breakdown: { calm: 0.1, happy: 0, excited: 0, frustrated: 0.7, anxious: 0.2 },
  taskCount: 3
})

// Test Case 3: No tasks
generateEmotionalSummary({
  breakdown: { calm: 0, happy: 0, excited: 0, frustrated: 0, anxious: 0 },
  taskCount: 0
})

// Test Case 4: Balanced emotions
generateEmotionalSummary({
  breakdown: { calm: 0.25, happy: 0.25, excited: 0.2, frustrated: 0.15, anxious: 0.15 },
  taskCount: 8
})
```

## Benefits

✅ **Instant feedback** - Users see their emotional state summarized clearly  
✅ **Encouragement** - Supportive messages boost morale  
✅ **Self-awareness** - Helps users recognize patterns  
✅ **Empathy** - Makes the app feel more human and caring  
✅ **No API costs** - Deterministic approach is free and fast  

## Future Enhancements

- [ ] Personalization based on user history
- [ ] Compare today vs. yesterday/last week
- [ ] Suggest specific actions based on emotional state
- [ ] Multi-language support
- [ ] Voice/tone customization (coach vs. friend vs. therapist)
- [ ] Weekly/monthly emotional summaries

---

**Last Updated**: October 2025  
**Component**: `src/components/Dashboard.tsx`  
**Service**: `src/utils/emotionalSummaryService.ts`

