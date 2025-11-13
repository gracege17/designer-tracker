## Emotional Cards Feature

## What It Does

The "Emotional Cards" feature displays 4 clickable cards on the Insights screen, each representing an emotion category. Each card shows a **keyword/theme** extracted from task descriptions and the **number of tasks** in that emotion category.

**Visual Display:**
- 2×2 grid of cards on Insights screen
- 4 emotion categories: Energized, Drained, Meaningful, Curious
- Each card shows:
  - Emotion name (small label at top)
  - Keyword/theme (large, bold, colored text in center)
  - Task count (small text at bottom)
- Color-coded text matching emotion family
- Clickable (leads to emotion detail page)
- Hover effect (slight scale down on click)

## The 4 Emotion Cards

### 1. Energized (Red/Pink)
**Emotions included:** Happy (1), Excited (3), Energized (10), Satisfied (13), Proud (16)  
**Color:** `#FF2D55` (red-pink)  
**Example keywords:** "Team collaboration", "Creative exploration", "Feature completion"

### 2. Drained (Gray)
**Emotions included:** Sad (5), Anxious (6), Neutral (8), Tired (12), Annoyed (14), Drained (15)  
**Color:** `#938F99` (gray)  
**Example keywords:** "Evening wrap-up", "Technical challenges", "Problem solving"

### 3. Meaningful (Golden Yellow)
**Emotions included:** Calm (2), Nostalgic (9), Normal (11), Satisfied (13)  
**Color:** `#F4C95D` (golden yellow)  
**Example keywords:** "Organizing workflow", "Deep focus", "Documentation"

### 4. Curious (Purple)
**Emotions included:** Excited (3), Surprised (7), Energized (10), Proud (16)  
**Color:** `#AF52DE` (purple)  
**Example keywords:** "Team collaboration", "Learning new skills", "Creative exploration"

## User-Facing Behavior

1. **User navigates to Insights screen**
2. **App analyzes all tasks** from selected time period (week/month)
3. **Groups tasks by emotion category** (which emotion they had)
4. **Extracts keywords** from task descriptions for each category
5. **Shows top keyword** for each emotion card
6. **Displays task count** for each category
7. **User can click card** to see all tasks in that emotion

**Example Flow:**
```
Week's tasks:
- "Team design review" (Excited) → Energized category
- "Prototyping new feature" (Energized) → Energized category  
- "Long meeting drained me" (Tired) → Drained category
- "Finished homepage" (Proud) → Curious category

Cards display:
Energized: "Team collaboration" (2 tasks)
Drained: "Evening wrap-up" (1 task)
Meaningful: "No tasks yet" (0 tasks)
Curious: "Creative exploration" (1 task)
```

## Technical Implementation

### Core Logic Location
- **Display**: `src/components/InsightsScreen.tsx` (lines 459-618)
- **Keyword extraction**: `src/utils/smartSummaryService.ts` → `generateSummaryTags()`
- **Emotion categorization**: Inline filtering in InsightsScreen
- **Data source**: All tasks from selected time period

### How It Works (Step-by-Step)

#### 1. Define Emotion Categories

**4 emotion families:**
```typescript
// Energized: Happy, Excited, Energized, Satisfied, Proud
const energyEmotions = [1, 3, 10, 13, 16]

// Drained: Sad, Anxious, Neutral, Tired, Annoyed, Drained
const drainingEmotions = [5, 6, 8, 12, 14, 15]

// Meaningful: Calm, Nostalgic, Normal, Satisfied
const meaningfulEmotions = [2, 9, 11, 13]

// Curious: Excited, Surprised, Energized, Proud
const passionEmotions = [3, 7, 10, 16]
```

**Note**: Some emotions appear in multiple categories (e.g., Satisfied in Energized + Meaningful)

#### 2. Filter Tasks by Emotion Category

```typescript
const allTasks = currentEntries.flatMap(entry => entry.tasks)

const energyTasks = allTasks.filter(task => {
  const emotions = task.emotions || [task.emotion]
  return emotions.some(e => energyEmotions.includes(e))
})

// Same for: drainingTasks, meaningfulTasks, passionTasks
```

**Logic:**
- Flattens all tasks from all entries in time range
- Checks if task's emotion(s) match category
- Supports multiple emotions per task
- Creates separate array for each category

#### 3. Extract Keywords from Tasks

**Function**: `generateSummaryTags(tasks)`

**Process:**
1. Combines all task descriptions into one string
2. Matches against 30+ theme patterns (regex)
3. Counts how many times each theme appears
4. Returns top 3 most frequent themes

**Example:**
```
Tasks:
- "Morning standup with team"
- "Team design review"  
- "Collaborative brainstorming"

Pattern matching:
"Team collaboration" matches 3 times → Top theme!

Returns: ["Team collaboration", ...]
```

**Theme Patterns** (30+ predefined):
- Time-based: "Morning routines", "Evening wrap-up"
- Social/Team: "Team collaboration", "Peer feedback"
- Work: "Deep focus", "Problem solving"
- Project: "Prototyping", "User research"
- Accomplishments: "Feature completion", "Milestone reached"
- Challenges: "Technical challenges", "Design decisions"
- Communication: "Stakeholder sync", "Cross-team alignment"
- Personal: "Learning new skills", "Organizing workflow"

#### 4. Display Cards in 2×2 Grid

**For each card:**
```jsx
<Card onClick={() => onEmotionClick('energized')}>
  <SectionLabel>Energized</SectionLabel>  {/* Top */}
  
  {energyTasks.length > 0 ? (
    <p className="text-[20px] font-bold text-[#FF2D55]">
      {summaryTags[0] || 'Team collaboration'}  {/* Center */}
    </p>
  ) : (
    <p className="italic">No tasks yet</p>
  )}
  
  <p className="text-[11px]">
    {energyTasks.length} tasks  {/* Bottom */}
  </p>
</Card>
```

**Layout:**
- Top: Emotion name (10px, gray, uppercase)
- Center: Keyword (20px, bold, colored)
- Bottom: Task count (11px, gray)

#### 5. Fallback Logic

**If no patterns match:**
1. Try task types ("Design work", "Development tasks")
2. Try most common words from descriptions
3. Final fallback: Generic labels ("Daily tasks", "Work activities")

**Ensures**: Every card always has a keyword, never empty!

## Example Keywords by Emotion

### Energized Card
- "Team collaboration" (tasks with "team", "together", "collaborative")
- "Feature completion" (tasks with "completed", "finished", "shipped")
- "Creative exploration" (tasks with "explore", "experiment", "sketch")
- "Progress made" (tasks with "progress", "moved forward")

### Drained Card
- "Evening wrap-up" (tasks with "evening", "end of day", "wrap")
- "Technical challenges" (tasks with "technical", "code", "bug")
- "Schedule alignment" (tasks with "schedule", "time", "calendar")
- "Clarifying scope" (tasks with "scope", "clarify", "define")

### Meaningful Card
- "Deep focus" (tasks with "focused", "concentrate", "deep work")
- "Organizing workflow" (tasks with "organize", "clean", "setup")
- "Documentation" (tasks with "document", "write", "spec")
- "Morning routines" (tasks with "morning", "breakfast", "early")

### Curious Card
- "Creative exploration" (tasks with "explore", "experiment")
- "Learning new skills" (tasks with "learn", "study", "tutorial")
- "Design refinement" (tasks with "refine", "polish", "improve")
- "Social moments" (tasks with "meetup", "social", "chat")

## Key Files

1. **`src/components/InsightsScreen.tsx`** (lines 127-169, 507-640)
   - Defines 4 emotion categories
   - useEffect for loading AI keywords
   - Filters tasks by emotion
   - Renders 4 cards in grid

2. **`src/utils/smartSummaryService.ts`**
   - `generateSummaryTags()` - Pattern-based keyword extraction
   - `generateSummaryTagsWithAI()` - AI version ⭐ ACTIVE!
   - 30+ theme patterns (regex matching)
   - Fallback logic for unmatched tasks

3. **`api/generate-emotion-keywords.ts`** ⭐ NEW!
   - Vercel serverless endpoint
   - Calls OpenAI GPT for keyword extraction
   - Falls back if no API key
   - Processes all 4 emotion categories

## Edge Cases

- **No tasks in category**: Shows "No tasks yet" in italic, 50% opacity
- **Tasks but no matching patterns**: Uses fallback (task types, common words, or generic)
- **Multiple themes found**: Shows top 1 theme (highest frequency)
- **Empty descriptions**: Falls back to generic "Daily tasks"
- **Very long keywords**: Truncates naturally with text wrapping
- **Task in multiple emotion categories**: Can appear in multiple cards (e.g., Satisfied → both Energized and Meaningful)

## Visual Design

### Card Structure
- **Size**: Min 160px wide, 180px tall (mobile) | 214px wide, 198px tall (desktop)
- **Padding**: 20px
- **Border radius**: 16px (rounded corners)
- **Background**: White overlay with opacity (from Card component)
- **Layout**: Flexbox column with space-between

### Text Styling

**Emotion Label (Top):**
- Font: Inter, 600 weight, 10px
- Color: `#938F99` (gray)
- Transform: Uppercase
- Letter spacing: Wider

**Keyword (Center):**
- Font: Bold, 20px
- Color: Emotion-specific (red, gray, yellow, purple)
- Leading: Tight (multi-line support)
- Flex: Centered vertically

**Task Count (Bottom):**
- Font: Regular, 11px
- Color: `#938F99` (gray)
- Format: "X task" or "X tasks" (pluralization)

### Interaction

**Hover/Active:**
- Active: `scale(0.98)` (slightly shrinks)
- Cursor: Pointer
- Transition: All properties, smooth

**Click Action:**
- Navigates to EmotionDetailPage
- Shows all tasks for that emotion category
- Allows detailed exploration

## Performance

- ⚡ **Fast filtering** - O(n) where n = total tasks
- 🔍 **Pattern matching** - O(m) where m = number of patterns checked
- 📊 **Keyword extraction** - Runs once per category
- 💾 **No storage** - Computed on-the-fly
- 🔄 **Updates automatically** - Recalculates when time range changes

## Design Decisions

### Why These 4 Emotion Categories?

**Maps 16 emotions to 4 meaningful groups:**
- Easier to understand than 16 individual cards
- Captures key emotional patterns:
  - **Energized** = Positive, active states
  - **Drained** = Low energy, challenging states
  - **Meaningful** = Calm, reflective states
  - **Curious** = Engaged, passionate states

### Why Show Keywords Instead of Emotion Names?

**Keywords provide context:**
- ✅ Shows *what* caused the emotion ("Team collaboration")
- ✅ More actionable than just "Energized"
- ✅ Helps users understand patterns
- ✅ Makes reflection more specific

**Example:**
```
Card showing: "Energized: Team collaboration (3 tasks)"
vs.
Card showing: "Energized: 3 tasks"

First tells you WHY you felt energized!
```

## AI-Powered Keyword Extraction

### Current Status: ✅ IMPLEMENTED!

AI-powered keyword extraction is fully implemented and active!

**Current state:**
- ✅ API endpoint created: `api/generate-emotion-keywords.ts`
- ✅ Function active: `generateSummaryTagsWithAI()`
- ✅ InsightsScreen uses AI version for all 4 cards
- ✅ Falls back to pattern-based if no API key
- ✅ Ready to use - just add API key!

**Architecture:**
- Follows same pattern as daily summary
- Parallel API calls for all 4 emotion categories
- Self-contained Vercel endpoint
- Graceful fallback to pattern matching

### How It Works:

**Without API Key (Current Default):**
- Uses pattern-based `generateSummaryTags()`
- 30+ regex patterns
- Fast, reliable, no costs

**With API Key (OpenAI Enabled):**
- Calls `generateSummaryTagsWithAI()` for each card
- → Calls `/api/generate-emotion-keywords`
- → API calls OpenAI GPT
- → Returns 1-3 contextual keywords

### Benefits of AI Keywords:

- ✨ **More contextual** - Understands task meaning beyond keywords
- 🎯 **Better theme detection** - Spots patterns humans define
- 💬 **Natural phrasing** - More readable, less template-like
- 🤝 **Adaptive** - Works with any task description format

### GPT Prompt (In API):

```
"Extract 1-3 SHORT thematic keywords (2-3 words, max 25 chars) 
that capture what these tasks were about.

Good: "Team collaboration", "Creative exploration"
Bad: "Working on stuff" (vague), "Designing the homepage..." (too long)
```

**Temperature**: 0.5 (balanced creativity)  
**Max tokens**: 100  
**Response format**: JSON array

### How to Enable:

```bash
# Add API key to Vercel (if not already there)
vercel env add OPENAI_API_KEY

# Deploy
git push origin main
```

**Same API key enables:**
- ✅ Daily Summary
- ✅ Challenge Matching
- ✅ Weekly/Monthly Reflection
- ✅ Emotional Card Keywords ← NEW!

## Integration Testing

### Test Strategy

Integration tests verify keyword extraction and emotion categorization work correctly:

1. **Pattern Matching** - Correct themes extracted from descriptions
2. **Emotion Categorization** - Tasks filtered into correct categories
3. **Fallback Logic** - Generic tags when no patterns match
4. **Task Counting** - Correct count for each category
5. **Top Theme Selection** - Most frequent theme chosen
6. **Empty Categories** - Handles categories with no tasks

### Test Scenarios

**Scenario 1: Clear Theme Match**
- Input: Tasks with "team meeting", "team review", "team sync"
- Expected: "Team collaboration" keyword

**Scenario 2: Multiple Themes**
- Input: Tasks with various themes
- Expected: Most frequent theme shown

**Scenario 3: No Pattern Match (Fallback)**
- Input: Tasks with unique/uncommon descriptions
- Expected: Generic fallback tag ("Daily tasks")

**Scenario 4: Emotion Categorization**
- Input: 10 tasks with different emotions
- Expected: Correct count in each category

**Scenario 5: Empty Category**
- Input: No tasks for "Meaningful" emotion
- Expected: "No tasks yet", count = 0

**Scenario 6: Task in Multiple Categories**
- Input: Task with emotion "Satisfied" (appears in both Energized + Meaningful)
- Expected: Appears in both categories

### Running Integration Tests

```bash
# Run all emotional card tests
npx tsx test-emotional-cards.ts

# Run specific scenario
npx tsx test-emotional-cards.ts "Clear Theme Match"
npx tsx test-emotional-cards.ts "Emotion Categorization"

# Show help
npx tsx test-emotional-cards.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual `generateSummaryTags()` function  
✅ **No mocks** - Tests complete keyword extraction  
✅ **Pattern matching** - Validates 30+ theme patterns  
✅ **Emotion filtering** - Confirms correct task categorization  
✅ **Fallback logic** - Tests generic tag generation  
✅ **Task counting** - Verifies accurate counts  
✅ **Edge cases** - Empty categories, no matches

### Test Output Example

```
============================================================
Testing: Clear Theme Match
============================================================

📝 Input:
   3 tasks in Energized category:
     1. "Morning team standup"
     2. "Team design review"
     3. "Collaborative brainstorming"

📊 Pattern Matching:
   Checking 30+ theme patterns...
   
   Matches found:
     "Team collaboration": 3 occurrences
     "Morning routines": 1 occurrence
     "Creative exploration": 1 occurrence

✅ Result:
   Top keyword: "Team collaboration"
   Task count: 3
   Emotion category: Energized
   Color: #FF2D55
   Expected keyword: "Team collaboration" ✅
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pure pattern matching
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **Deterministic** - Same tasks = same keywords

