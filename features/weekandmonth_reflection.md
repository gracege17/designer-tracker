# Week/Month Reflection Feature

## What It Does

The "Week's Reflection" or "Month's Reflection" feature analyzes the user's logged tasks and emotions over a selected time period and generates a personalized, empathetic summary that acknowledges their efforts, emotional patterns, and provides gentle encouragement.

**Visual Display:**
- Shows in the Insights screen at the top
- Displays as a card with rounded corners (8px)
- Title changes based on selected time range: "Week's Reflection" or "Month's Reflection"
- Shows 1-2 sentences of reflective text
- Gray subtitle text on dark background

## User-Facing Behavior

1. **User navigates to Insights screen**
2. **Selects time range** (Week or Month tabs)
3. **App analyzes all tasks** from that period
4. **Counts total tasks** logged
5. **Calculates emotion breakdown** (calm, happy, excited, frustrated, anxious percentages)
6. **Generates personalized reflection text** based on patterns
7. **Updates in real-time** when switching between week/month

**Example Flow:**
```
User selects "Week" tab:
- 12 tasks logged this week
- Emotions: 40% excited, 30% happy, 20% calm, 10% frustrated
- Reflection: "You completed 12 tasks this week with a strong 
               sense of excited. You're finding your rhythm 
               beautifully."
```

## Technical Implementation

### Core Logic Location
- **Main component**: `src/components/InsightsScreen.tsx` (lines 398-426)
- **Insight generation**: `src/utils/weeklyInsightsService.ts` → `generateWeeklyInsights()`
- **Emotion breakdown**: `src/utils/emotionBreakdownService.ts` → `getEmotionBreakdown()`
- **Data source**: Filtered entries for selected time range

### How It Works (Step-by-Step)

#### 1. Filter Entries by Time Range

**Based on selected tab** (Week or Month):
- Gets current entries for that time period
- `currentEntries` = Array of Entry objects

#### 2. Calculate Emotion Breakdown

**Function**: `getEmotionBreakdown(entries)`

```typescript
// Flattens all tasks from all entries
const allTasks = entries.flatMap(entry => entry.tasks)

// Counts each emotion family
emotionCounts = {
  calm: number,      // Percentage (0-1)
  happy: number,
  excited: number,
  frustrated: number,
  anxious: number
}
```

**Emotion Family Mapping:**
- Maps all 16 emotions into 5 broad categories
- Calculates percentage of tasks in each category
- Returns proportional breakdown

#### 3. Count Total Tasks

```typescript
const taskCount = filteredEntries.reduce((sum, entry) => 
  sum + entry.tasks.length, 0
)
```

Simply sums up all tasks across all entries in the time range.

#### 4. Generate Insight Text

**Function**: `generateWeeklyInsights(input)`

**Input:**
```typescript
{
  taskCount: 12,
  emotionBreakdown: {
    calm: 0.2,
    happy: 0.3,
    excited: 0.4,
    frustrated: 0.1,
    anxious: 0.0
  },
  timeRange: 'week'
}
```

**Logic Patterns** (Rule-based):

**Pattern 1: Very low activity (1-5 tasks)**
- Positive tone: "Sometimes slow weeks are exactly what we need to recharge."
- Challenging tone: "That takes real strength."

**Pattern 2: Light-moderate activity (6-15 tasks)**
- Strong dominant emotion (>50%): "...with a strong sense of [emotion]."
- Balanced emotions: "...with [emotion] and [emotion]. That's balance in action."

**Pattern 3: Moderate-high activity (16-30 tasks)**
- Excited dominant: "You powered through...with vibrant energy!"
- Happy dominant: "...felt genuinely happy through it. This is your sweet spot."
- Calm dominant: "...with remarkable calm and focus. That's mastery showing up."

**Pattern 4: High activity (31-50 tasks)**
- Positive: "You're operating at a high level with positive energy."
- Challenging: "That kind of dedication is remarkable—but don't forget to rest."

**Pattern 5: Very high activity (50+ tasks)**
- Positive: "You're in powerful creative flow. Just remember: rest is part of the rhythm too."
- Challenging: "Please take a moment to acknowledge how much strength that took."

#### 5. Display Reflection Card

**UI Structure:**
```jsx
<Card className="mb-4 p-[20px]" style={{ borderRadius: '8px' }}>
  <div className="flex flex-col gap-3">
    <h2 className="text-[20px] font-bold text-[#E6E1E5]">
      {selectedTimeRange === 'week' ? "Week's Reflection" : "Month's Reflection"}
    </h2>
    <p className="text-[14px] text-[#938F99] leading-relaxed">
      {insights}
    </p>
  </div>
</Card>
```

## Example Reflections

### High Energy Week (Excited Dominant)
**Input:** 20 tasks, 60% excited, 30% happy, 10% calm
```
"You powered through 20 tasks this week with vibrant energy! 
Your excitement is contagious."
```

### Challenging Week (Frustrated Dominant)
**Input:** 18 tasks, 55% frustrated, 25% anxious, 20% calm
```
"You tackled 18 tasks this week while managing frustration. 
That's not easy—give yourself credit."
```

### Balanced Week
**Input:** 12 tasks, 40% calm, 30% happy, 20% excited, 10% frustrated
```
"This week brought 12 tasks, and you navigated them with calm 
and happy. That's balance in action."
```

### Slow Week (Positive)
**Input:** 3 tasks, 60% calm, 40% happy
```
"You logged 3 tasks this week. Sometimes slow weeks are 
exactly what we need to recharge."
```

### Very High Activity (Positive)
**Input:** 55 tasks, 70% excited, 20% happy, 10% calm
```
"55 tasks this week—wow! You're in powerful creative flow. 
Just remember: rest is part of the rhythm too."
```

## Key Files

1. **`src/components/InsightsScreen.tsx`** (lines 105-121, 400-412)
   - useEffect for loading AI insights
   - Renders reflection card
   - Filters entries by time range

2. **`src/utils/weeklyInsightsService.ts`**
   - `generateWeeklyInsights()` - Rule-based logic
   - `generateWeeklyInsightsWithAI()` - AI version ⭐ ACTIVE!
   - Pattern matching (low/medium/high activity)

3. **`api/generate-weekly-insights.ts`** ⭐ NEW!
   - Vercel serverless endpoint
   - Calls OpenAI GPT for reflections
   - Falls back if no API key

4. **`src/utils/emotionBreakdownService.ts`**
   - `getEmotionBreakdown()` - Emotion analysis
   - Maps 16 emotions → 5 categories
   - Calculates percentages

## Edge Cases

- **No tasks in period**: Shows "You haven't logged any tasks [period] yet..."
- **1 task**: Generates reflection for single task
- **50+ tasks**: Special high-activity reflection with rest reminder
- **All positive emotions**: Positive tone reflection
- **All negative emotions**: Supportive, acknowledging tone
- **Mixed emotions**: Balanced reflection mentioning dominant + secondary
- **Switching between week/month**: Reflection updates instantly with new data

## Performance

- ⚡ **Fast computation** - Simple counting and conditional logic
- 📊 **Emotion breakdown**: O(n) where n = total tasks
- 🔍 **Pattern matching**: O(1) constant time
- 💾 **No storage needed** - Computed on-the-fly from entries
- 🔄 **Updates automatically** - Recalculates when time range changes

## Tone and Language

**Characteristics:**
- 🤝 **Empathetic** - Acknowledges both positive and challenging emotions
- 💬 **Conversational** - Natural, supportive language
- 🎯 **Specific** - Mentions actual task counts and dominant emotions
- ✨ **Encouraging** - Always includes positive affirmation
- 🧘 **Gentle reminders** - Suggests rest for high activity

**Never:**
- ❌ Judgmental or prescriptive
- ❌ Generic/templated feeling
- ❌ Overly clinical or analytical

## AI-Powered Insights

### Current Status: ✅ IMPLEMENTED!

AI-powered reflections are fully implemented and active!

**Current state:**
- ✅ API endpoint created: `api/generate-weekly-insights.ts`
- ✅ Function active: `generateWeeklyInsightsWithAI()`
- ✅ InsightsScreen uses AI version
- ✅ Falls back to rule-based if no API key
- ✅ Ready to use - just add API key!

**Architecture:**
- Follows same pattern as `generate-daily-summary.ts`
- Self-contained API endpoint (Vercel compatible)
- Graceful fallback to rule-based logic
- Client calls API, API calls OpenAI

### How It Works:

**Without API Key (Current Default):**
- Uses rule-based `generateWeeklyInsights()`
- Fast, reliable, no costs
- Pattern-based reflections

**With API Key (OpenAI Enabled):**
- Calls `generateWeeklyInsightsWithAI()`
- → Calls `/api/generate-weekly-insights`
- → API calls OpenAI GPT
- → Returns personalized reflection

### How to Enable AI Reflections:

**Step 1: Add OpenAI API Key to Vercel**
```bash
vercel env add OPENAI_API_KEY
# Enter: sk-your-key-here
```

**Step 2: Deploy**
```bash
vercel --prod
```

**That's it!** Your app will now use GPT to generate weekly/monthly reflections.

### Benefits of AI Reflections:

- ✨ **More personalized** - Understands nuanced emotional patterns
- 🎯 **Context-aware** - References specific emotion combinations
- 💬 **Natural variety** - Different phrasing each week/month
- 🤝 **Deeper empathy** - More authentic, supportive language
- 📊 **Pattern recognition** - Spots trends rule-based logic might miss

### GPT Prompt (Already Written):

```
"You are a compassionate design coach reviewing a designer's [week/month].

Emotional breakdown:
- Calm: X%
- Happy: X%
- Excited: X%
- Frustrated: X%
- Anxious: X%

Tasks completed: X

Write a 1-2 sentence reflection. Be warm, specific, and 
encouraging. Acknowledge their efforts and emotions authentically."
```

**Temperature**: 0.7 (creative but consistent)  
**Max tokens**: 80 (keeps reflections concise)  
**Model**: gpt-4 (or gpt-4o)

### Cost Estimate:

**Per reflection:**
- GPT-4o: ~$0.001-0.002
- GPT-4o-mini: ~$0.0001-0.0002

**Monthly usage** (viewing insights 10x/month):
- GPT-4o: ~$0.02/month
- GPT-4o-mini: ~$0.002/month

Very affordable for significantly better reflections!

## Integration Testing

### Test Strategy

Integration tests verify the reflection generation logic works correctly:

1. **Task Count Patterns** - Correct reflection for different activity levels
2. **Emotion Analysis** - Positive vs challenging tone detection
3. **Dominant Emotion** - Mentions correct primary emotion
4. **Time Range** - Adapts language for week vs month
5. **Edge Cases** - Empty period, single task, extreme activity

### Test Scenarios

**Scenario 1: High Energy Week**
- Input: 20 tasks, 60% excited, 30% happy, 10% calm
- Expected: "...powered through...with vibrant energy!"

**Scenario 2: Challenging Week**
- Input: 18 tasks, 55% frustrated, 25% anxious
- Expected: "...while managing frustration. That's not easy—give yourself credit."

**Scenario 3: Balanced Week**
- Input: 12 tasks, 40% calm, 30% happy, 20% excited
- Expected: "...navigated them with calm and happy. That's balance in action."

**Scenario 4: Slow Week (Positive)**
- Input: 3 tasks, 60% calm, 40% happy
- Expected: "Sometimes slow weeks are exactly what we need to recharge."

**Scenario 5: Very High Activity**
- Input: 55 tasks, 70% excited
- Expected: "...You're in powerful creative flow. Just remember: rest is part of the rhythm too."

**Scenario 6: Empty Week**
- Input: 0 tasks
- Expected: "You haven't logged any tasks this week yet..."

**Scenario 7: Month vs Week Language**
- Input: Same data, different timeRange
- Expected: "this week" vs "this month" in text

### Running Integration Tests

```bash
# Run all reflection generation tests
npx tsx test-weekly-reflection.ts

# Run specific scenario
npx tsx test-weekly-reflection.ts "High Energy Week"
npx tsx test-weekly-reflection.ts "Challenging Week"

# Show help
npx tsx test-weekly-reflection.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual `generateWeeklyInsights()` function  
✅ **No mocks** - Tests complete reflection generation  
✅ **Pattern matching** - Validates task count ranges  
✅ **Emotion tone** - Confirms positive vs challenging detection  
✅ **Dominant emotion** - Verifies correct emotion mentioned  
✅ **Time range** - Tests week vs month language  
✅ **Edge cases** - Empty, low, very high activity

### Test Output Example

```
============================================================
Testing: High Energy Week
============================================================

📝 Input:
   Time range: week
   Tasks: 20
   Emotion breakdown:
     Excited: 60%
     Happy: 30%
     Calm: 10%

📊 Analysis:
   Overall tone: positive
   Dominant emotion: excited
   Activity level: moderate-high (16-30 tasks)

✅ Result:
   Reflection: "You powered through 20 tasks this week with 
                vibrant energy! Your excitement is contagious."
   Character count: 85
   Mentions dominant emotion: YES ✅
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Rule-based logic only
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **100% deterministic** - Same input = same output

