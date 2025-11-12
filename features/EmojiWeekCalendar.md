# Weekly Emoji Calendar Feature

## What It Does

The "Weekly Emoji Calendar" shows a visual overview of the user's emotional journey throughout the current week (Monday to Sunday), displaying one emoji per day based on their logged tasks.

**Visual Display:**
- 7-column grid showing M T W T F S S (Monday to Sunday)
- Each day shows an emotion icon/emoji from the "How's your day so far?" slider ONLY
- If overall feeling wasn't set, shows gray circle (⚪)
- Date number appears below each emoji
- Empty days show a gray circle (⚪) with 30% opacity
- Days with overall feeling show colorful emotion icons with hover effects

## User-Facing Behavior

1. **Calendar shows current week** (Monday to Sunday)
2. **Each day displays overall feeling emoji** from the "How's your day so far?" slider
3. **Empty days** show placeholder circles
4. **Hover effect** on days with data (scale up 10%)
5. **Updates in real-time** as tasks are logged

**Example Flow:**
- User starts Monday: Selects "How's your day so far?" → Slider at 25 (Drained)
- User starts Tuesday: Slider at 80 (Excited)
- Wednesday: No entry logged
- Calendar shows:
  - Mon 10: 😫 Drained icon (from slider value 25)
  - Tue 11: 🤩 Excited icon (from slider value 80)
  - Wed 12: ⚪ Empty (no entry)
  - Thu 13-Sun 16: ⚪ Empty days

**Important:**
- Calendar ONLY shows emoji if "How's your day so far?" was set
- If user didn't set overall feeling → shows gray circle (⚪)
- No fallback to task emotions

## Technical Implementation

### Core Logic Location
- **Overall feeling capture**: `src/components/OverallFeeling.tsx` → Slider (0-100)
- **Feeling storage**: `src/App.tsx` → `handleOverallFeelingComplete()` saves to Entry
- **Emoji mapping**: `src/utils/overallFeelingMapper.ts` → Maps 0-100 to emoji
- **Calendar generation**: `src/components/Dashboard.tsx` → `getWeeklyEmotionalData()`
- **Display component**: `src/components/Dashboard.tsx` (lines 380-445)
- **Data source**: Entries from localStorage filtered by current week dates

### How It Works (Step-by-Step)

#### 1. Calculate Current Week Range (Monday to Sunday)

**Function**: `getWeeklyEmotionalData()`

```typescript
// Find Monday of current week
const today = new Date()
const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
const monday = new Date(today)
monday.setDate(today.getDate() - daysFromMonday)

// Generate 7 days from Monday
for (let i = 0; i < 7; i++) {
  const date = new Date(monday)
  date.setDate(monday.getDate() + i)
  // ... process each day
}
```

**Logic:**
- If today is Sunday (0), go back 6 days to get Monday
- If today is Monday (1), go back 0 days (already Monday)
- If today is Tuesday (2), go back 1 day, etc.
- Always displays Monday-Sunday of current week

#### 2. Find Entry for Each Day

For each day in the week:

```typescript
const dateString = `${year}-${month}-${day}` // "2025-11-10"
const dayEntry = entries.find(entry => entry.date === dateString)
```

**If entry exists AND has overallFeeling:**
- Map `overallFeeling` (0-100) to emoji using `getEmojiFromOverallFeeling()`
- Get icon path using `getIconPathFromOverallFeeling()`
- Mark as `hasData: true`
- Store task count and average emotion

**If entry exists but NO overallFeeling:**
- Show gray circle (⚪) - user didn't set overall feeling
- Mark as `hasData: false`
- Set opacity to 30%

**If no entry:**
- Use empty circle emoji (⚪)
- Mark as `hasData: false`
- Set opacity to 30%

#### 3. Extract Emotion Icon

**Source**: Only from `entry.overallFeeling` (0-100 slider value)

```typescript
if (dayEntry.overallFeeling !== undefined) {
  emoji = getEmojiFromOverallFeeling(dayEntry.overallFeeling)
  iconPath = getIconPathFromOverallFeeling(dayEntry.overallFeeling)
  hasData = true
} else {
  // No overall feeling set → show gray circle
  emoji = '⚪'
  hasData = false
}
```

**Why ONLY Overall Feeling?**
- ✅ Captures user's overall day assessment  
- ✅ More holistic than individual task emotions
- ✅ Set at start of logging flow (intentional reflection)
- ✅ Clear requirement: must be from slider, not tasks
- ⚠️ Entries without overall feeling show gray circle (encourages users to set it)

#### 4. Build Calendar Data Structure

Each day creates an object:

```typescript
{
  label: 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S',
  emoji: '😠' | '😊' | '⚪' etc.,
  hasData: true | false,
  avgEmotion: number,      // Calculated but not shown
  taskCount: number,
  date: number,            // Day of month (10, 11, 12...)
  dateString: string,      // 'YYYY-MM-DD'
  entry: Entry | null      // Contains overallFeeling field
}
```

#### 5. Render Calendar UI

**Week headers:**
```jsx
<div className="grid grid-cols-7 gap-2 mb-3">
  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(dayName => (
    <div className="text-center text-sm text-[#938F99]">
      {dayName}
    </div>
  ))}
</div>
```

**Calendar days:**
```jsx
<div className="grid grid-cols-7 gap-2">
  {weeklyData.map(day => (
    <div className="flex flex-col items-center gap-1">
      {/* Emoji/Icon */}
      <div className={hasData ? 'hover:scale-110' : 'opacity-30'}>
        <img src={iconPath} className="w-8 h-8" />
      </div>
      {/* Date number */}
      <span className="text-[10px]">{day.date}</span>
    </div>
  ))}
</div>
```

## Visual States

### Day with Data (hasData: true)
- **Emoji**: Full color emotion icon (32px)
- **Opacity**: 100%
- **Hover**: Scales to 110%
- **Cursor**: Pointer (clickable appearance)
- **Filter**: `brightness(1.3) contrast(1.1)` for vibrancy

### Empty Day (hasData: false)
- **Emoji**: Gray circle ⚪
- **Opacity**: 30%
- **Hover**: None
- **Cursor**: Default (not clickable)
- **Size**: Text emoji (text-3xl)

## Example Data Flow

**User has 3 days of entries this week:**

```
Monday Nov 10:
  Overall Feeling: Slider at 25 (Somewhat Low/Drained)
  - Task 1: "Homepage design" → Frustrated (4)
  - Task 2: "Meeting" → Tired (12)
  Display: 😫 Drained icon + "10" (from overallFeeling)

Tuesday Nov 11:
  Overall Feeling: Slider at 75 (Great/Excited)
  - Task 1: "Prototyping" → Excited (3)
  Display: 🤩 Excited icon + "11" (from overallFeeling)

Wednesday Nov 12:
  No entry logged
  Display: ⚪ + "12" (30% opacity)
```

**Result:**
```
M   T   W   T   F   S   S
😫  🤩  ⚪  ⚪  ⚪  ⚪  ⚪
10  11  12  13  14  15  16
```

**Entry Without Overall Feeling:**
```
Monday Nov 10 (entry without overallFeeling set):
  - Task 1: "Homepage design" → Frustrated (4)
  - Task 2: "Meeting" → Tired (12)
  Display: ⚪ + "10" (no overall feeling → gray circle)
```

## Key Files

1. **`src/components/OverallFeeling.tsx`**
   - "How's your day so far?" slider UI
   - Maps 0-100 value to emoji preview
   - Sends feelingScore to App.tsx

2. **`src/App.tsx`**
   - Stores overallFeeling in state
   - Saves to Entry when logging complete
   - State management for entry flow

3. **`src/utils/overallFeelingMapper.ts`** ⭐ NEW!
   - Maps 0-100 slider value to emoji
   - Maps to icon paths
   - Consistent with OverallFeeling component ranges

4. **`src/components/Dashboard.tsx`** (lines 41-100, 398-445)
   - getWeeklyEmotionalData() function
   - Calendar rendering logic
   - Uses overallFeeling with fallback

5. **`src/types/index.ts`**
   - Entry interface with `overallFeeling?: number`
   - EMOTIONS constant with emoji/icon mappings

## Edge Cases

- **Week spans two months**: Correctly shows dates (e.g., 29, 30, 31, 1, 2, 3, 4)
- **Current day is Sunday**: Goes back 6 days to find Monday
- **No entries this week**: All 7 days show gray circles
- **Entry has overallFeeling**: Shows corresponding emoji from slider
- **Entry has NO overallFeeling**: Shows gray circle (⚪) - user didn't set it
- **Entry has tasks but no overallFeeling**: Still shows gray circle (slider is required)
- **Multiple tasks per day**: Irrelevant - only overall feeling matters
- **Multiple emotions per task**: Irrelevant - only overall feeling matters

## Performance

- ⚡ **Very fast** - Simple filtering and mapping
- 🔍 **Date calculation**: O(1) for finding Monday
- 🗂️ **Entry lookup**: O(n) where n = total entries (typically <100)
- 💾 **No storage needed** - Computed on-the-fly
- 🔄 **Updates automatically** - Recalculates when entries change

## Design Decisions

### Why Use Overall Feeling ONLY (No Fallback)?

**Pros:**
- ✅ Holistic day assessment (set at start of logging)
- ✅ User's intentional reflection on entire day
- ✅ More meaningful than individual task emotions
- ✅ Consistent with "How's your day so far?" flow
- ✅ Avoids complexity of blending multiple task emotions
- ✅ Clear source of truth (always from slider, never ambiguous)

**Cons:**
- ❌ Requires user to set it (extra step in flow)
- ❌ Entries without it show gray circle (could look incomplete)

**No Fallback Strategy:**
- If `overallFeeling` not set → Show gray circle (⚪)
- Encourages users to always set overall feeling
- Clear visual indicator of missing data

### Why Monday to Sunday?

- Standard work week view for designers
- Monday = fresh start
- Sunday = week end/reflection
- Matches common calendar conventions

### Overall Feeling Slider Mapping

The 0-100 slider maps to 10 emotion ranges (10-point buckets):
- Matches OverallFeeling component's existing ranges
- Provides good granularity without overwhelming choice
- Each range corresponds to a distinct emoji
- Consistent mapping ensures predictable results

## Integration Testing

### Test Strategy

Integration tests verify the weekly calendar generation works correctly:

1. **Week Range Calculation** - Correctly finds Monday-Sunday
2. **Entry Matching** - Finds entries for correct dates
3. **Overall Feeling Mapping** - Converts 0-100 slider value to emoji
4. **Missing Overall Feeling** - Shows gray circle when not set
5. **Empty Day Handling** - Shows placeholders for days without data
6. **Edge Cases** - Week boundaries, missing data, various dates

### Test Scenarios

**Scenario 1: Full Week**
- Input: 7 entries with different overall feeling slider values (15, 55, 75, 35, 50, 95, 85)
- Expected: 7 different emojis showing range from 😢 to ⚡

**Scenario 2: Partial Week**
- Input: Only Mon (25), Wed (80), Fri (50) have overall feeling set
- Expected: 3 emojis (😫, 🤩, 😊) + 4 gray circles

**Scenario 3: Empty Week**
- Input: No entries this week
- Expected: 7 gray circles

**Scenario 4: Overall Feeling Overrides Task Emotions**
- Input: Monday overall feeling = 60 (Pleasant), shows 😀
- Expected: Calendar shows slider value, task emotions irrelevant

**Scenario 5: Sunday as Current Day**
- Input: Current day = Sunday, entries on Mon & Sun
- Expected: Correctly shows Mon-Sun week range

**Scenario 6: Various Slider Values**
- Input: 4 entries with values 5, 25, 50, 80 (low to high range)
- Expected: Shows 😠, 😫, 😊, 🤩

**Scenario 7: Without Overall Feeling**
- Input: Entry exists with tasks but NO overallFeeling set
- Expected: Shows gray circle (⚪) - user must set slider

### Running Integration Tests

```bash
# Run all calendar tests
npx tsx test-emoji-week-calendar.ts

# Run specific scenario
npx tsx test-emoji-week-calendar.ts "Full Week"
npx tsx test-emoji-week-calendar.ts "Week Boundary"

# Show help
npx tsx test-emoji-week-calendar.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual `getWeeklyEmotionalData()` logic  
✅ **No mocks** - Tests complete calendar generation  
✅ **Date calculations** - Verifies Monday-Sunday range  
✅ **Entry matching** - Validates correct date filtering  
✅ **Overall feeling mapping** - Confirms 0-100 → emoji conversion  
✅ **Missing data handling** - Validates gray circles for missing overallFeeling  
✅ **Edge cases** - Week boundaries, empty weeks, various scenarios

### Test Output Example

```
============================================================
Testing: Various Slider Values
============================================================

📝 Scenario: Various slider values from low to high
   Entries created: 4

📅 Week Range:
   Monday: 2025-11-10
   Sunday: 2025-11-16

🎨 Calendar Data:
   M 11/10: 😠 Very Unpleasant [Overall: 5]
   T 11/11: 😫 Somewhat Low [Overall: 25]
   W 11/12: 😊 Okay [Overall: 50]
   T 11/13: 🤩 Great [Overall: 80]
   F 11/14: ⚪ (no data)
   S 11/15: ⚪ (no data)
   S 11/16: ⚪ (no data)

✅ Result:
   Days with data: 4/7
   Empty days: 3/7
   Expected days with data: 4 ✅
```

**Without Overall Feeling Example:**
```
Testing: Without Overall Feeling

🎨 Calendar Data:
   M 11/10: ⚪ (no overall feeling set) ← entry exists but slider not set!
   T 11/11: 😍 Good [Overall: 75] ← slider was set
   W 11/12: ⚪ (no data) ← no entry at all
   ...

✅ Result:
   Days with data: 1/7  ← Only Tue counts (has overallFeeling)
   Empty days: 6/7
```

Shows that **ONLY entries with overall feeling** display emotion emojis. Tasks are irrelevant.

### No External Dependencies

Like color blending tests:
- ❌ **No API calls** - Pure date/array logic
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **Deterministic** - Same date + entries = same calendar

