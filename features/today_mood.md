# Today's Mood Feature

## What It Does

The "Today's Mood" feature displays the user's **overall day feeling** from the "How's your day so far?" slider as a single emoji. It shows the holistic emotional assessment the user made at the start of their logging session.

**Visual Display:**
- Shows in the Dashboard as a card (2-column grid with Today's Color)
- Displays a large emotion icon (64px)
- Shows the emotion label below the icon (e.g., "Great", "Okay", "Energized")
- **Only appears when overall feeling has been set for today**
- If not set: Grid still has 2 columns, but Today's Mood slot is empty (Today's Color fills its space)

## User-Facing Behavior

1. **User starts logging** and sets "How's your day so far?" slider
2. **Slider value (0-100) saved** as overall feeling
3. **Today's Mood card displays** the corresponding emoji from that slider value
4. **Card appears on Dashboard** showing the user's holistic day assessment
5. **If overall feeling not set** → Card doesn't appear

**Example Flow:**
- User sets "How's your day so far?" slider to 75
- Slider maps to: 🤩 Great (range 71-80)
- User completes logging tasks
- Dashboard shows: **Today's Mood: 🤩 Great**
- Even if individual tasks had different emotions, mood shows the overall feeling

**Key Point:**
- Today's Mood = Overall day assessment (from slider at start)
- NOT based on individual task emotions

## Technical Implementation

### Core Logic Location
- **Main logic**: `src/components/Dashboard.tsx` (lines 238-270)
- **Emoji mapping**: `src/utils/overallFeelingMapper.ts`
- **Display component**: Inline in Dashboard
- **Data source**: `entry.overallFeeling` (0-100 slider value)

### How It Works (Step-by-Step)

#### 1. Check for Overall Feeling

```typescript
if (!todayEntry?.overallFeeling) {
  return null // Don't show card if slider wasn't set
}
```

**Condition**: Card only appears if `entry.overallFeeling` exists (user set the slider)

#### 2. Map Slider Value to Emoji

```typescript
const emoji = getEmojiFromOverallFeeling(todayEntry.overallFeeling)
const label = getLabelFromOverallFeeling(todayEntry.overallFeeling)
const iconPath = getIconPathFromOverallFeeling(todayEntry.overallFeeling)
```

**Example:**
```
todayEntry.overallFeeling = 75

getEmojiFromOverallFeeling(75) → '🤩'
getLabelFromOverallFeeling(75) → 'Great'
getIconPathFromOverallFeeling(75) → '/icons/32px-png/32px-Excited.png'
```

**Uses same mapping as:**
- OverallFeeling slider preview
- Weekly emoji calendar
- Consistent across all features!

#### 3. Display Emotion Card

**UI Structure:**
```jsx
<div className="p-6 bg-white/[0.04] flex flex-col items-center">
  <p className="text-[14px] text-[#938F99]">Today's Mood</p>
  
  <img 
    src={emotionData.iconPath} 
    alt={emotionData.label}
    className="w-16 h-16"
  />
  
  <p className="text-[18px] font-semibold text-white">
    {emotionData.label}
  </p>
</div>
```

**Styling:**
- Background: White overlay with 4% opacity
- Border radius: 16px (rounded corners)
- Padding: 24px
- Min height: 180px
- Centered content (flex column)

## Example Scenarios

### Scenario 1: High Energy Day
**Input:** Overall feeling slider set to 85
```
entry.overallFeeling = 85 (Energized range: 81-90)

Display: ⚡ Energized
```

### Scenario 2: Okay/Balanced Day
**Input:** Overall feeling slider set to 50
```
entry.overallFeeling = 50 (Okay range: 41-50)

Display: 😊 Okay
```

### Scenario 3: Low Energy Day
**Input:** Overall feeling slider set to 25
```
entry.overallFeeling = 25 (Somewhat Low range: 21-30)

Display: 😫 Somewhat Low
```

### Scenario 4: No Overall Feeling Set
**Input:** Entry exists but no overall feeling
```
entry.overallFeeling = undefined

Display: (Card doesn't appear)
```

## Key Files

1. **`src/components/Dashboard.tsx`** (lines 238-270)
   - Checks for overallFeeling
   - Maps value to emoji/label
   - Card rendering

2. **`src/utils/overallFeelingMapper.ts`**
   - getEmojiFromOverallFeeling()
   - getLabelFromOverallFeeling()
   - getIconPathFromOverallFeeling()

3. **`src/types/index.ts`**
   - Entry interface with `overallFeeling?: number`

## Edge Cases

- **No overall feeling set**: Card doesn't appear (returns null)
- **Overall feeling = 0**: Shows 😠 Very Unpleasant (valid range)
- **Overall feeling = 100**: Shows 😌 Very Pleasant (valid range)
- **Overall feeling = 50**: Shows 😊 Okay (default slider position)
- **Entry has tasks but no overall feeling**: Card doesn't appear (slider is required)
- **Grid layout**: Card is in 2-column grid, so if Today's Mood missing, Today's Color takes full width (or stays in column)

## Performance

- ⚡ **Very fast** - Simple value lookup
- 🔍 **Mapping**: O(1) constant time
- 💾 **No storage needed** - Uses existing entry field
- 🔄 **No recalculation** - Already stored value
- 🎨 **Same as calendar** - Reuses overallFeelingMapper functions

## Design Decisions

### Why Use Overall Feeling (Same as Weekly Calendar)?

**Pros:**
- ✅ Consistent with weekly calendar (same emoji)
- ✅ Represents user's holistic day assessment
- ✅ Simpler logic (just map one value)
- ✅ No ambiguity from ties or multiple emotions
- ✅ Matches user's initial reflection ("How's your day?")

**Cons:**
- ❌ Doesn't reflect task-level emotional changes
- ❌ Card doesn't appear if slider wasn't set
- ❌ Might not match actual task emotions

**Why This Makes Sense:**
- Today's Mood + Weekly Calendar = Same data source (overall feeling)
- Today's Color = Different data source (task emotions)
- Provides both perspectives: Overall assessment vs detailed task breakdown

## Integration Testing

### Test Strategy

Integration tests verify Today's Mood display logic works correctly:

1. **Display with Overall Feeling** - Card shows when overallFeeling exists
2. **Hide without Overall Feeling** - Card hidden when overallFeeling missing
3. **Correct Emoji Mapping** - Various slider values show correct emojis
4. **Edge Values** - Boundary cases (0, 50, 100)
5. **Entry with Tasks but No Overall Feeling** - Card correctly hidden

### Test Scenarios

**Scenario 1: High Energy Day**
- Input: Entry with overallFeeling = 85
- Expected: Card displays with ⚡ Energized emoji

**Scenario 2: Great Day**
- Input: Entry with overallFeeling = 75
- Expected: Card displays with 🤩 Great emoji

**Scenario 3: Okay/Balanced Day**
- Input: Entry with overallFeeling = 50
- Expected: Card displays with 😊 Okay emoji

**Scenario 4: Low Energy Day**
- Input: Entry with overallFeeling = 25
- Expected: Card displays with 😫 Somewhat Low emoji

**Scenario 5: Very Low Day**
- Input: Entry with overallFeeling = 5
- Expected: Card displays with 😠 Very Unpleasant emoji

**Scenario 6: Entry without Overall Feeling**
- Input: Entry exists but no overallFeeling
- Expected: Card doesn't display

**Scenario 7: No Entry**
- Input: No entry for today
- Expected: Card doesn't display

**Scenario 8: Boundary Value - Min**
- Input: Entry with overallFeeling = 0
- Expected: Card displays with 😠 Very Unpleasant

**Scenario 9: Boundary Value - Max**
- Input: Entry with overallFeeling = 100
- Expected: Card displays with 😌 Very Pleasant

### Running Integration Tests

```bash
# Run all Today's Mood display tests
npx tsx test-today-mood.ts

# Run specific scenario
npx tsx test-today-mood.ts "Entry with Overall Feeling"
npx tsx test-today-mood.ts "Various Slider Values"

# Show help
npx tsx test-today-mood.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual Dashboard display logic  
✅ **No mocks** - Tests complete rendering decision  
✅ **Conditional rendering** - Validates show/hide behavior  
✅ **Emoji mapping** - Confirms correct emoji from overallFeeling  
✅ **Label generation** - Verifies correct labels  
✅ **Edge cases** - Missing data, boundary values

### Test Output Example

```
============================================================
Testing: Great Day
============================================================

📝 Scenario: Entry has overallFeeling = 75 (Great range)
   Entry: exists
   overallFeeling: 75

✅ Result:
   Card displays: YES
   Emoji: 🤩
   Label: "Great"
   Icon: /icons/32px-png/32px-Excited.png
   Expected display: YES ✅
   Expected label: "Great" ✅
   Expected emoji: 🤩 ✅

============================================================
Testing: Entry without Overall Feeling
============================================================

📝 Scenario: Entry exists but NO overallFeeling set
   Entry: exists
   overallFeeling: not set

✅ Result:
   Card displays: NO
   Expected display: NO ✅
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pure display logic
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **Uses real mapper functions** - Same as overall feeling

