# Overall Feeling Feature ("How's Your Day So Far?")

## What It Does

The "Overall Feeling" feature is the first step in the daily logging flow where users rate their overall emotional state for the day using an interactive slider (0-100). This creates a holistic assessment that gets displayed in the weekly emoji calendar.

**Visual Display:**
- Full-screen centered slider interface
- Large emoji (120px) that changes based on slider position
- Emotion label and description text
- Gradient-colored slider track (gray → red)
- Color-matched circular thumb with white border
- "Low Energy" to "High Energy" range labels
- "Continue" CTA button (disabled until user drags slider)

## User-Facing Behavior

1. **User clicks "Add Entry"** from Dashboard
2. **"How's your day so far?" screen appears** (if no tasks logged yet today)
3. **Continue button is disabled** (gray, not clickable)
4. **User drags slider** from 0 (Low Energy) to 100 (High Energy)
5. **Continue button becomes enabled** (orange, clickable)
6. **Emoji updates in real-time** as slider moves
7. **Label and description change** to match emotion
8. **Emoji scales subtly** (grows slightly as value increases)
9. **User clicks "Continue"** to confirm and proceed to project selection
10. **Slider value (0-100) saved** as `entry.overallFeeling`

**Example Interaction:**
```
User at slider = 0:    😠 "Very Unpleasant" - Feeling overwhelmed
User drags to 50:     😊 "Okay" - Balanced mood
User drags to 85:     ⚡ "Energized" - Full of ideas
User clicks Continue → Value 85 saved to entry
```

## Slider to Emoji Mapping

| Slider Range | Emoji | Label | Description | Icon Path |
|-------------|-------|-------|-------------|-----------|
| 0-10 | 😠 | Very Unpleasant | Feeling overwhelmed | `/icons/emoji_xl/32px-Frustrated.png` |
| 11-20 | 😢 | Unpleasant | Low energy day | `/icons/emoji_xl/32px-Sad.png` |
| 21-30 | 😫 | Somewhat Low | A bit drained | `/icons/emoji_xl/32px-Drained.png` |
| 31-40 | 😐 | Neutral | Calm and steady | `/icons/emoji_xl/32px-Neutral.png` |
| 41-50 | 😊 | Okay | Balanced mood | `/icons/emoji_xl/32px-Satisfied.png` |
| 51-60 | 😀 | Pleasant | Feeling good | `/icons/emoji_xl/32px-Happy.png` |
| 61-70 | 😍 | Good | Positive energy | `/icons/emoji_xl/32px-Proud.png` |
| 71-80 | 🤩 | Great | Really inspired | `/icons/emoji_xl/32px-Excited.png` |
| 81-90 | ⚡ | Energized | Full of ideas | `/icons/emoji_xl/32px-Energized.png` |
| 91-100 | 😌 | Very Pleasant | On fire today! | `/icons/emoji_xl/32px-joy.png` |

## Technical Implementation

### Core Logic Location
- **Component**: `src/components/OverallFeeling.tsx`
- **State management**: `src/App.tsx` → `handleOverallFeelingComplete()`
- **Storage**: Saved to `Entry.overallFeeling` field
- **Usage**: Weekly emoji calendar displays this emoji

### How It Works (Step-by-Step)

#### 1. Component State

```typescript
const [sliderValue, setSliderValue] = useState(50) // Default: middle (Okay)
const [hasInteracted, setHasInteracted] = useState(false) // Track if user moved slider
```

**Initial state**: 
- `sliderValue`: 50 (Okay/Satisfied range)
- `hasInteracted`: false (button disabled)

**Updates**: On every slider movement via `onChange`
- Sets new slider value
- Sets `hasInteracted` to true (enables Continue button)

#### 2. Gradient Color Calculation

**Gradient Stops** (11 color points along 0-100 range):
```typescript
const gradientStops = [
  { position: 0, color: '#E3E3E3' },   // Neutral gray
  { position: 10, color: '#686A6C' },  // Dark gray
  { position: 20, color: '#48484A' },  // Drained - low energy
  { position: 30, color: '#7B6891' },  // Purple transition
  { position: 40, color: '#AF52DE' },  // Curious purple
  { position: 50, color: '#C987DB' },  // Mid purple
  { position: 60, color: '#E5AB7C' },  // Warm transition
  { position: 70, color: '#F4C95D' },  // Golden yellow
  { position: 80, color: '#F7904C' },  // Orange
  { position: 90, color: '#FF2D55' },  // Energized red
  { position: 100, color: '#EC5429' } // Bright orange-red
]
```

**Color Interpolation:**
- For any slider value, finds surrounding color stops
- Uses linear RGB interpolation between them
- Creates smooth color transitions
- Updates thumb background color to match

**Example:**
```
Slider at 45:
  Between stops: 40 (#AF52DE) and 50 (#C987DB)
  Ratio: (45 - 40) / (50 - 40) = 0.5
  Result: Blend of purple shades
```

#### 3. Emoji Selection

**Function**: `getEmojiAndLabel(value)`

Returns object with:
- `emoji`: Icon path (e.g., `/icons/emoji_xl/32px-Excited.png`)
- `label`: Emotion name (e.g., "Great")
- `description`: Supportive text (e.g., "Really inspired")

**Logic**: Simple range checks (10-point buckets)

#### 4. Real-Time Updates

**As user drags slider:**
1. `onChange` → `setSliderValue(newValue)`
2. Color recalculated → Thumb and label color update
3. Emoji path recalculated → Image src updates
4. Label and description recalculated → Text updates
5. Emoji scale adjusts → `scale(0.9 + sliderValue/1000)`

**All transitions:**
- Color changes: 600ms ease-in-out
- Scale changes: Instant
- Smooth, fluid experience

#### 5. User Confirms

**When user clicks "Continue":**
```typescript
onClick={() => onComplete(sliderValue)}
```

**Note**: Button is **disabled** until user drags the slider at least once. This ensures intentional selection.

**Flow:**
1. Calls `onComplete` callback with current `sliderValue` (0-100)
2. Parent component (`App.tsx`) receives value
3. Stored in state: `setOverallFeeling(sliderValue)`
4. Proceeds to next screen: Project Selection
5. User then selects projects and logs tasks
6. At the end, when "Save" is clicked, creates an **Entry** object:
   ```typescript
   Entry {
     date: "2025-11-12",
     overallFeeling: 75,  ← Slider value saved here!
     tasks: [
       { description: "Design homepage", emotion: 3, ... },
       { description: "Team meeting", emotion: 6, ... }
     ]
   }
   ```

**What Gets Saved:**

```typescript
// Slider value saved to Entry
Entry {
  overallFeeling: 75  // 0-100 slider value
}
```

**That's it!** Just one number representing the user's overall day feeling.

## UI Components Breakdown

### Emoji Display
- **Size**: 120px × 120px
- **Drop shadow**: Subtle depth effect
- **Scale effect**: Grows from 0.9× to 0.99× based on slider
- **Image**: Large emotion icons from `/icons/emoji_xl/`

### Label Text
- **Font**: Playfair Display (serif), 32px, bold
- **Color**: Matches slider thumb color (dynamic)
- **Transition**: 600ms smooth color change

### Description Text
- **Font**: Inter, 16px, normal
- **Color**: `#CAC4D0` (light gray, static)
- **Content**: Supportive, contextual phrases

### Slider Track
- **Height**: 12px (h-3)
- **Background**: Multi-color linear gradient
- **Border radius**: Fully rounded
- **Gradient**: Shows entire emotional range visually

### Slider Thumb
- **Size**: 32px circle
- **Background**: Matches current slider color
- **Border**: 4px white
- **Shadow**: Drop shadow for depth
- **Hover**: Scale 1.1×
- **Active**: Scale 1.2×
- **Cursor**: Pointer

### Range Labels
- **Text**: "Low Energy" (left), "High Energy" (right)
- **Color**: `#938F99` (muted gray)
- **Size**: 12px

### Continue Button
- **Component**: `ButtonPrimaryCTA`
- **Text**: "Continue"
- **Position**: Bottom of screen
- **Initial State**: Disabled (gray, not clickable)
- **Enabled**: After user drags slider at least once
- **Disabled Style**: Gray background (#938F99), 50% opacity, no-drop cursor
- **Enabled Style**: Orange background (#EC5429), clickable
- **Action**: Saves slider value and proceeds to next screen

## Entry Flow Integration

### When Overall Feeling Appears

**Condition 1**: User clicks "Add Entry" from Dashboard
- If user **already has tasks today** → Skip Overall Feeling, go to Project Selection
- If user **has NO tasks today** → Show Overall Feeling first

**Condition 2**: First-time logging for the day
- Overall Feeling → Project Selection → Task Entry → Emotions → Notes → Review

### Value Persistence

**During entry flow:**
```typescript
// App.tsx state
const [overallFeeling, setOverallFeeling] = useState<number | null>(null)

// When slider completes
const handleOverallFeelingComplete = (feelingScore: number) => {
  setOverallFeeling(feelingScore)  // Store in state
  setCurrentView('projectSelection')
}

// When saving entry
const newEntry: Entry = {
  id: generateId(),
  date: todayDate,
  tasks: newTasks,
  overallFeeling: overallFeeling ?? undefined, // Save to entry
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**After save:**
- Resets to `null` for next entry
- Persisted in `Entry` object in localStorage
- Used by weekly calendar for emoji display

## Visual Design Details

### Color Psychology

**Low Energy (0-20)**: Gray tones
- Neutral, drained feelings
- Desaturated colors convey low mood

**Medium (21-60)**: Purple to warm transitions
- Purple = curious, contemplative
- Gradual warming = building energy

**High Energy (61-100)**: Golden → Orange → Red
- Yellow/gold = meaningful, purposeful
- Orange/red = energized, passionate
- Bright, saturated colors convey high mood

### Micro-Interactions

**Slider thumb:**
- Hover: Scale up 10% (feels responsive)
- Active (dragging): Scale up 20% (clear feedback)
- Color transitions: 600ms (smooth, not jarring)

**Emoji:**
- Subtle scale increase with value (0.9× to 0.99×)
- Creates sense of "growing energy"
- Not too dramatic (maintains calm aesthetic)

**Text:**
- Label color matches thumb (visual cohesion)
- Description stays gray (hierarchy, readability)

## Key Files

1. **`src/components/OverallFeeling.tsx`**
   - Full UI component
   - Slider logic and gradient
   - Emoji/label mapping
   - Color interpolation

2. **`src/App.tsx`**
   - Entry flow routing
   - State management for overallFeeling
   - Saves to Entry when complete

3. **`src/utils/overallFeelingMapper.ts`**
   - Shared mapping functions
   - Used by weekly calendar
   - Ensures consistent emoji display

4. **`src/types/index.ts`**
   - Entry interface with `overallFeeling?: number`

## Edge Cases

- **User clicks back**: Returns to Dashboard, feeling not saved
- **User doesn't drag slider**: Continue button stays disabled (gray)
- **User drags even slightly**: Continue button becomes enabled (orange)
- **User skips (already has tasks today)**: Overall Feeling screen not shown
- **Slider at default (50)**: Shows "Okay" / Satisfied
- **User drags to extremes (0 or 100)**: Shows appropriate extreme emotions
- **Multiple entries same day**: Uses most recent overallFeeling value

## Button State Behavior

**Disabled State (Initial):**
- Background: Gray (`#938F99`)
- Opacity: 50%
- Cursor: not-allowed
- Not clickable
- **Reason**: Ensures user makes intentional selection

**Enabled State (After Interaction):**
- Background: Orange (`#EC5429`)  
- Opacity: 100%
- Cursor: pointer
- Clickable
- Hover: Lighter orange
- **Trigger**: Any slider movement (even 1 pixel)

## Performance

- ⚡ **Real-time updates** - Color/emoji change instantly on slider move
- 🎨 **Smooth transitions** - 600ms color interpolation
- 💾 **Minimal state** - Just one number (sliderValue)
- 🔄 **No API calls** - Pure client-side UI

## Connection to Other Features

**Used by:**
1. **Weekly Emoji Calendar** - Displays this emoji for each day
2. **Entry Storage** - Saved as `entry.overallFeeling`

**Not used by:**
- Daily summary generation (uses task emotions instead)
- Today's color (uses task emotions instead)
- Insights/analytics (currently not factored in)

## Integration Testing

### Test Strategy

Integration tests verify the slider-to-emoji mapping works correctly:

1. **Slider Value Mapping** - All 10 ranges map to correct emojis
2. **Boundary Values** - Tests edge values (0, 10, 11, 20, 21, etc.)
3. **Icon Path Generation** - Correct icon paths returned
4. **Label Generation** - Correct labels for each range
5. **Edge Cases** - Min (0), max (100), middle (50)

### Test Scenarios

**Scenario 1: Very Low Values (0-20)**
- Input: Slider values 0, 5, 10, 15, 20
- Expected: 😠 Very Unpleasant, 😢 Unpleasant emojis

**Scenario 2: Low-Medium Values (21-40)**
- Input: Slider values 25, 35
- Expected: 😫 Somewhat Low, 😐 Neutral

**Scenario 3: Medium Values (41-60)**
- Input: Slider values 45, 55
- Expected: 😊 Okay, 😀 Pleasant

**Scenario 4: High Values (61-80)**
- Input: Slider values 65, 75
- Expected: 😍 Good, 🤩 Great

**Scenario 5: Very High Values (81-100)**
- Input: Slider values 85, 95, 100
- Expected: ⚡ Energized, 😌 Very Pleasant

**Scenario 6: Boundary Testing**
- Input: Exact boundary values (10, 20, 30, 40, 50, 60, 70, 80, 90)
- Expected: Correct emoji for each boundary

**Scenario 7: All Ranges**
- Input: One value from each range (5, 15, 25, 35, 45, 55, 65, 75, 85, 95)
- Expected: All 10 different emojis

### Running Integration Tests

```bash
# Run all slider mapping tests
npx tsx test-overall-feeling-mapping.ts

# Run specific scenario
npx tsx test-overall-feeling-mapping.ts "Boundary Testing"
npx tsx test-overall-feeling-mapping.ts "All Ranges"

# Show help
npx tsx test-overall-feeling-mapping.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual `overallFeelingMapper.ts` functions  
✅ **No mocks** - Tests the actual mapping logic  
✅ **All emoji ranges** - Validates all 10 slider ranges  
✅ **Icon paths** - Verifies correct icon file paths  
✅ **Labels** - Confirms correct emotion labels  
✅ **Boundary values** - Tests edge cases (10, 20, 30, etc.)

### Test Output Example

```
============================================================
Testing: All Ranges
============================================================

📝 Input: Testing all 10 emoji ranges

🎨 Slider Mapping Results:

   Value 5 → 😠 "Very Unpleasant"
      Icon: /icons/32px-png/32px-Frustrated.png ✅

   Value 15 → 😢 "Unpleasant"
      Icon: /icons/32px-png/32px-Sad.png ✅

   Value 25 → 😫 "Somewhat Low"
      Icon: /icons/32px-png/32px-Drained.png ✅

   Value 35 → 😐 "Neutral"
      Icon: /icons/32px-png/32px-Neutral.png ✅

   Value 45 → 😊 "Okay"
      Icon: /icons/32px-png/32px-Satisfied.png ✅

   Value 55 → 😀 "Pleasant"
      Icon: /icons/32px-png/32px-Happy.png ✅

   Value 65 → 😍 "Good"
      Icon: /icons/32px-png/32px-Proud.png ✅

   Value 75 → 🤩 "Great"
      Icon: /icons/32px-png/32px-Excited.png ✅

   Value 85 → ⚡ "Energized"
      Icon: /icons/32px-png/32px-Energized.png ✅

   Value 95 → 😌 "Very Pleasant"
      Icon: /icons/32px-png/32px-joy.png ✅

✅ Result: All 10 ranges mapped correctly
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pure mapping logic
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **100% deterministic** - Same input = same output

## Future Enhancements

**Potential uses for overall feeling data:**
- Track how overall feeling correlates with task emotions
- Show discrepancy alerts (feeling great but logging frustrated tasks?)
- Use in insights to show "predicted vs actual" day quality
- Integration with daily summary (mention overall feeling)

