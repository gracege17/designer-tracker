# Emotional Details Page Feature

## What It Does

The "Emotional Details" page shows a deep dive into a specific emotion category when a user clicks on one of the emotional cards (Energized, Drained, Meaningful, Curious). It displays personalized insights, top keyword triggers, and a chronological list of all related tasks from the current week.

**Visual Display:**
- Full-screen dedicated page
- Emotion name as large title (32px)
- Task count subtitle ("X tasks this week" or "X tasks this month")
- Insight card with contextual reflection
- Top Triggers section with keyword badges
- Related Tasks list with dates
- **Dynamic header** - Shows week range ("Nov 10 - Nov 16") or month ("November 2025") based on what user selected on Insights page
- Back button to return to Insights

## User-Facing Behavior

1. **User selects time range on Insights screen** (Week or Month tab)
2. **User clicks emotional card** (e.g., "Energized" card showing "Team collaboration")
3. **App navigates to detail page** for that emotion with selected time range
4. **Shows all tasks from that period** (week or month) that match that emotion category
5. **Displays insight pattern** - contextual reflection about when/how this emotion appears
6. **Shows top 3 triggers** - keywords extracted from task descriptions
7. **Lists all related tasks** - chronological with dates ("Today", "Yesterday", "Nov 10")
8. **User can click back** to return to Insights screen

**Example Flow (Week View):**
```
User on Insights → Week tab → Clicks "Energized" card

Detail Page Shows:
├── Header: "Nov 10 - Nov 16"
├── Title: "Energized"
├── Subtitle: "5 tasks this week"
├── Insight: "You tend to feel energized when working on Homepage Redesign..."
├── Top Triggers: ["Team collaboration", "Creative exploration", "Feature completion"]
└── Related Tasks:
    - "Morning team standup" (Today)
    - "Design review with stakeholders" (Yesterday)
    - "Collaborative brainstorming" (Nov 10)
```

**Example Flow (Month View):**
```
User on Insights → Month tab → Clicks "Drained" card

Detail Page Shows:
├── Header: "November 2025"
├── Title: "Drained"
├── Subtitle: "12 tasks this month"
├── Insight: "Energy tends to dip during complex tasks and extended work sessions..."
├── Top Triggers: ["Technical challenges", "Evening wrap-up", "Schedule alignment"]
└── Related Tasks: (All tasks from November with Drained/Tired/Frustrated emotions)
```

## The 4 Emotion Detail Pages

### 1. Energized (Red/Pink)
**Emotions:** Energized (10), Excited (3), Happy (1)  
**Color:** `#FF2D55`  
**Reflection Question:** "What energizes you most about your creative work?"  
**Insight Pattern:** Focuses on project context and social/team patterns

### 2. Drained (Gray)
**Emotions:** Drained (15), Tired (12), Frustrated (4)  
**Color:** `#938F99`  
**Reflection Question:** "What patterns do you notice when you feel drained?"  
**Insight Pattern:** Focuses on extended sessions, suggests breaks

### 3. Meaningful (Golden Yellow)
**Emotions:** Proud (11), Satisfied (8), Surprised (13)  
**Color:** `#F4C95D`  
**Reflection Question:** "What makes your work feel most meaningful to you?"  
**Insight Pattern:** Focuses on accomplishments and helping others

### 4. Curious (Purple)
**Emotions:** Excited (3), Nostalgic (9), Neutral (2)  
**Color:** `#AF52DE`  
**Reflection Question:** "What sparks your curiosity in design?"  
**Insight Pattern:** Focuses on exploration and learning

## Technical Implementation

### Core Logic Location
- **Component**: `src/components/EmotionDetailPage.tsx`
- **Props**: Receives `timeRange` from Insights screen ('week' or 'month')
- **AI insight generation**: `api/generate-emotion-insight.ts` ⭐ ACTIVE!
- **Keyword extraction (fallback)**: `src/utils/smartSummaryService.ts` → `generateSummaryTags()`
- **Week filtering**: `src/utils/dataHelpers.ts` → `getCurrentWeekEntries()`
- **Month filtering**: Inline logic in component
- **Data source**: Current week's or month's entries filtered by emotion category

### How It Works (Step-by-Step)

#### 1. Filter Entries by Time Range

**Week mode:**
```typescript
if (timeRange === 'week') {
  return getCurrentWeekEntries(entries) // Sunday-Saturday
}
```

**Month mode:**
```typescript
if (timeRange === 'month') {
  // Filter to current month
  return entries.filter(entry => {
    const entryDate = new Date(entry.date)
    return entryDate.getMonth() === currentMonth
  })
}
```

**Result**: Only entries from selected time period (week or month)

#### 2. Filter Tasks by Emotion Category

**For each emotion category, filter tasks:**
```typescript
const matchingTasks = entry.tasks.filter(task => {
  const emotions = task.emotions || [task.emotion]
  return emotions.some(e => config.emotions.includes(e))
})
```

**Example for "Energized":**
```
config.emotions = [10, 3, 1]  // Energized, Excited, Happy

Task 1: emotion = 10 (Energized) → ✅ Matches
Task 2: emotion = 4 (Frustrated) → ❌ Doesn't match
Task 3: emotion = 3 (Excited) → ✅ Matches
```

**Result**: Array of tasks that felt "energized"

#### 3. Extract Top 3 Triggers (Keywords)

**Function**: `generateSummaryTags(tasks)`

```typescript
const topReasonTags = generateSummaryTags(relevantTasks).slice(0, 3)
```

**Process:**
1. Takes all task descriptions
2. Matches against 30+ theme patterns
3. Counts frequency of each theme
4. Returns top 3 most common themes

**Example:**
```
Tasks:
- "Morning team standup"
- "Team design review"  
- "Collaborative workshop"
- "Finished homepage design"
- "Completed user flow"

Keywords extracted:
1. "Team collaboration" (3 matches)
2. "Feature completion" (2 matches)
3. "Morning routines" (1 match)
```

#### 4. Generate Contextual Insight

**Function**: `insightPattern` (useMemo)

**Analyzes patterns:**
- Project frequency (which project appears most)
- Time of day patterns (morning/afternoon/evening keywords)

**Generates emotion-specific insights:**

**Energized:**
```
"You tend to feel energized when working on [Top Project]. 
These moments often involve team collaboration and social interaction."
```

**Drained:**
```
"Energy tends to dip during complex tasks and extended work sessions. 
Consider scheduling breaks to maintain your creative energy."
```

**Meaningful:**
```
"Meaningful moments cluster around accomplishments and helping others. 
[Top Project] consistently gives you a sense of purpose."
```

**Curious:**
```
"Your curiosity sparks during exploration and learning. 
New challenges and creative problem-solving keep you engaged."
```

#### 5. Display Page Structure

**Header:**
- Back button (top-left)
- Week range (top-right): "Nov 10 - Nov 16"

**Content:**

**Section 1: Summary Header**
```
Energized
5 tasks this week
```

**Section 2: Insight Card**
```
✨ Insight
[Contextual insight text based on patterns]
```

**Section 3: Top Triggers** (if tasks exist)
```
TOP TRIGGERS
[Team collaboration] [Creative exploration] [Feature completion]
```
Badges with neutral tone, medium size

**Section 4: Related Tasks** (if tasks exist)
```
RELATED TASKS
Morning team standup                Today
Team design review                  Yesterday
Collaborative brainstorming         Nov 10
Shipped new feature                 Nov 9
Team workshop                       Nov 8
```

Each task shows description and relative date

**Empty State** (if no tasks):
```
📝
No energized moments yet
Start logging your tasks to track when you feel energized
```

## Example Insights by Emotion

### Energized Insight
**Input:** 5 tasks, top project = "Homepage Redesign", morning keywords detected
```
"Energized feelings emerged most often in the morning, 
especially after physical activity or productive starts to 
your day."
```

### Drained Insight
**Input:** 4 tasks, extended sessions detected
```
"Energy tends to dip during complex tasks and extended work 
sessions. Consider scheduling breaks to maintain your 
creative energy."
```

### Meaningful Insight
**Input:** 6 tasks, top project = "Design System", accomplishment patterns
```
"Meaningful moments cluster around accomplishments and helping 
others. Design System consistently gives you a sense of purpose."
```

### Curious Insight
**Input:** 3 tasks, exploration patterns
```
"Your curiosity sparks during exploration and learning. 
New challenges and creative problem-solving keep you engaged."
```

## Key Files

1. **`src/components/EmotionDetailPage.tsx`**
   - Complete detail page component
   - Receives `timeRange` prop ('week' or 'month')
   - useEffect for loading AI triggers and insight
   - Dynamic filtering based on time range
   - Emotion categorization logic
   - Task filtering and display

2. **`api/generate-emotion-insight.ts`** ⭐ NEW!
   - Vercel serverless endpoint
   - Calls OpenAI GPT for both triggers AND insight
   - Single API call for complete emotion analysis
   - Falls back if no API key

3. **`src/utils/smartSummaryService.ts`**
   - `generateSummaryTags()` - Pattern-based keyword extraction (fallback)
   - `areTagsMeaningful()` - Detects generic keywords
   - 30+ theme patterns

4. **`src/utils/dataHelpers.ts`**
   - `getCurrentWeekEntries()` - Week filtering
   - Date range utilities

5. **`src/App.tsx`**
   - Stores `selectedTimeRange` state
   - Passes time range to EmotionDetailPage
   - Routes to detail page when emotion card clicked

6. **`src/components/InsightsScreen.tsx`**
   - Passes `selectedTimeRange` to `onEmotionClick`
   - Ensures detail page gets correct time range

## Loading States

**While AI is generating:**
- Insight shows: "Analyzing patterns..."
- Triggers show: Loading state
- Page is still interactive, just content pending

**After AI loads:**
- Insight updates to AI-generated text
- Triggers populate with keywords
- If keywords are too generic: Shows help message instead

## Edge Cases

- **No tasks for emotion in period**: Shows empty state ("No [emotion] moments this week/month")
- **AI API failure**: Falls back to pattern-based triggers and rule-based insight
- **Single task**: Shows 1 trigger, 1 task in list
- **All tasks same day**: All show "Today"
- **Tasks without project**: Shows "Unknown Project"
- **No matching patterns**: Shows fallback keywords
- **Generic task descriptions** (e.g., "Today task", "Work stuff"): Shows helpful message instead of meaningless keywords
  - Message: "Not enough detail to identify patterns. Try using more descriptive task names like 'Design homepage hero section' instead of 'Today task'."
  - Top Triggers section still appears but with guidance text
- **Tasks with notes**: Notes not displayed in list (description only)
- **Multiple emotions per task**: Task appears if ANY emotion matches category
- **Switching week/month on Insights**: Detail page data updates to match when reopened
- **Month with 0 tasks**: Shows empty state for entire month

## Visual Design

### Header
- Sticky position (stays on top when scrolling)
- Semi-transparent background with backdrop blur
- Border: White 10% opacity

### Summary Header
- Title: Playfair Display (implied), 32px, bold
- Color: White
- Subtitle: 14px, gray

### Insight Card
- Background: White 4% opacity
- Padding: 20px
- Border radius: 8px
- Title: "✨ Insight" (20px, bold)
- Text: 14px, gray, relaxed leading

### Top Triggers
- Section label: 12px, semibold, gray, uppercase, wide tracking
- Badges: Neutral tone, medium size
- Layout: Flex wrap with 8px gap

### Related Tasks
- Section label: Same as Top Triggers
- Each task: 15px white text + 13px gray date
- Layout: Space between (description left, date right)
- Spacing: 12px between tasks

## Performance

- ⚡ **Fast filtering** - O(n) where n = week's tasks
- 🔍 **Week calculation**: Computed once (useMemo)
- 📊 **Keyword extraction**: Runs once on mount (useMemo)
- 💾 **No storage** - All computed from entries
- 🔄 **Updates on prop change** - Automatic recalculation

## Navigation Flow

**Entry:**
- User clicks emotion card on Insights screen
- App calls `onEmotionClick('energized')`
- Routes to EmotionDetailPage

**Exit:**
- User clicks back button → Returns to Insights
- User clicks bottom nav → Navigates to that section

## AI-Powered Insights and Triggers

### Current Status: ✅ IMPLEMENTED!

Both the insight text and top triggers are now AI-generated!

**Current state:**
- ✅ API endpoint created: `api/generate-emotion-insight.ts`
- ✅ Single API call generates both triggers AND insight
- ✅ Falls back to pattern-based if no API key
- ✅ Ready to use - just add API key!

**Architecture:**
- Follows same pattern as other AI features
- One API call per emotion detail page load
- Self-contained Vercel endpoint
- Graceful fallback to rule-based logic

### How It Works:

**Without API Key (Current Default):**
- Uses pattern-based `generateSummaryTags()` for triggers
- Uses rule-based `insightPattern` logic
- Fast, reliable, no costs

**With API Key (OpenAI Enabled):**
- Calls `/api/generate-emotion-insight`
- → API analyzes tasks and generates:
  - **Triggers**: 1-3 contextual keywords
  - **Insight**: 1-2 sentences of pattern analysis
- → Returns personalized, context-aware content

### Benefits of AI Insights:

- ✨ **More personalized** - References specific task patterns
- 🎯 **Better context** - Understands project and timing patterns
- 💬 **Natural language** - More fluid, less template-like
- 🤝 **Adaptive** - Works with any task style
- 📊 **Holistic analysis** - Generates triggers AND insight together

### GPT Prompt:

```
"Analyze these tasks that made the designer feel [emotion].

Generate:
1. 1-3 SHORT thematic keywords (max 25 chars each)
2. 1-2 sentences of insight about when/how this emotion appears

Be warm, specific, and encouraging."
```

**Temperature**: 0.6 (balanced)  
**Max tokens**: 150  
**Response format**: JSON with `triggers` array and `insight` string

### How to Enable:

```bash
# Add API key to Vercel (if not already there)
vercel env add OPENAI_API_KEY

# Deploy
git push origin main
```

**Same API key enables ALL AI features!** 🎉

## Date Formatting

**Smart relative dates:**
- If today: "Today"
- If yesterday: "Yesterday"
- Otherwise: "Nov 10" (Month Day format)

**Date range** (header):

**Week mode:**
- "Nov 10 - Nov 16" (Sunday to Saturday)
- Shows current week range

**Month mode:**
- "November 2025" (Month Year)
- Shows current month name and year

**Behavior:**
- Matches the time range selected on Insights page
- If user selected "Week" tab → Detail page shows week data
- If user selected "Month" tab → Detail page shows month data

## Integration Testing

### Test Strategy

Integration tests verify the emotion detail page logic works correctly:

1. **Task Filtering** - Correct tasks filtered by emotion category
2. **Week Filtering** - Only shows current week's tasks
3. **Keyword Extraction** - Top 3 triggers extracted correctly
4. **Insight Generation** - Contextual insights generated
5. **Task Counting** - Accurate counts
6. **Empty State** - Handles no matching tasks
7. **Date Formatting** - Relative dates (Today, Yesterday, etc.)

### Test Scenarios

**Scenario 1: Energized Category with Tasks**
- Input: 5 meaningful tasks with Energized/Excited/Happy emotions
- Expected: 5 tasks shown, top 3 meaningful triggers, energized insight

**Scenario 2: Drained Category**
- Input: 3 tasks with Drained/Tired/Frustrated emotions
- Expected: 3 tasks shown, drained-specific insight

**Scenario 3: Empty Category**
- Input: No tasks matching emotion category
- Expected: Empty state, "No [emotion] moments yet"

**Scenario 4: Single Task**
- Input: 1 task matching category
- Expected: 1 trigger, 1 task in list

**Scenario 5: Top Triggers Extraction**
- Input: Tasks with "team meeting", "team sync", "team review"
- Expected: "Team collaboration" as top trigger

**Scenario 6: Date Formatting**
- Input: Tasks from today, yesterday, and earlier this week
- Expected: "Today", "Yesterday", "Nov 10" format

**Scenario 7: Generic Task Descriptions ⭐ NEW!**
- Input: Vague descriptions ("Today task", "Work stuff", "Yesterday task")
- Expected: Shows helpful message guiding users to add more detail
- Message: "Not enough detail to identify patterns. Try using more descriptive task names..."

### Running Integration Tests

```bash
# Run all emotional details tests
npx tsx test-emotional-details.ts

# Run specific scenario
npx tsx test-emotional-details.ts "Energized Category"
npx tsx test-emotional-details.ts "Empty Category"

# Show help
npx tsx test-emotional-details.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual EmotionDetailPage logic  
✅ **No mocks** - Tests complete filtering and keyword extraction  
✅ **Emotion filtering** - Validates correct task categorization  
✅ **Week filtering** - Confirms only current week shown  
✅ **Keyword extraction** - Tests top 3 triggers  
✅ **Insight generation** - Validates contextual patterns  
✅ **Date formatting** - Confirms relative date logic  
✅ **Edge cases** - Empty, single task, multiple categories

### Test Output Example

```
============================================================
Testing: Energized Category with Tasks
============================================================

📝 Input:
   Time period: Current week (Nov 10 - Nov 16)
   Total entries: 5
   Emotion category: Energized

   Tasks with Energized/Excited/Happy emotions:
     1. "Morning team standup" - Excited (3) - Nov 10
     2. "Team design review" - Energized (10) - Nov 11
     3. "Collaborative workshop" - Excited (3) - Yesterday
     4. "Finished homepage" - Happy (1) - Yesterday
     5. "Shipped feature" - Energized (10) - Today

📊 Analysis:
   Tasks in category: 5
   Week range: Nov 10 - Nov 16

🎨 Extracted Data:
   Top 3 Triggers:
     1. "Team collaboration"
     2. "Feature completion"
     3. "Creative exploration"

   Insight Generated:
   "You tend to feel energized when working on Homepage Redesign. 
    These moments often involve team collaboration and social interaction."

✅ Result:
   Task count: 5 ✅
   Triggers extracted: 3 ✅
   Insight generated: YES ✅
   
   Date formatting:
     2025-11-09 → "Nov 9" ✅
     2025-11-11 → "Yesterday" ✅
     2025-11-12 → "Today" ✅
```

**Generic Descriptions Example:**
```
============================================================
Testing: Generic Task Descriptions
============================================================

📝 Scenario: Vague task descriptions (should show helpful message)
   Emotion category: Energized

📊 Data:
   Entries created: 1
   Week entries: 1
   Tasks in category: 3

   Task details:
     1. "Today task" - Today
     2. "Yesterday task" - Today
     3. "Work stuff" - Today

🎨 Extracted Data:
   Top 3 Triggers:
     1. "Today activities"
     2. "Yesterday activities"
     3. "Work activities"
   Keywords meaningful: NO ⚠️ (will show help message)

✅ Result:
   Task count: 3
   Triggers extracted: 3
   Keywords are meaningful: NO ✅
   Will show: "Not enough detail to identify patterns..." message
```

This helps users improve their task logging!

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pattern-based keyword extraction
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **Deterministic** - Same tasks = same triggers


