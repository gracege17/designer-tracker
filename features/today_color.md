# Today's Color Feature

## What It Does

The "Today's Color" feature shows users a single blended color that represents their emotional state for the day, displayed with a poetic color name like "Purple Heart" or "Golden Yellow".

**Visual Display:**
- Shows in the Dashboard as a card
- Displays a flower-shaped icon filled with the calculated color
- Shows "Today's Color" label
- Displays the human-readable color name (e.g., "Purple Heart", "Golden Glow")

## User-Facing Behavior

1. **When you log emotions throughout the day**, the app tracks each task's emotion
2. **Each emotion maps to a color family** based on emotional qualities
3. **The app blends all your emotions** into a single representative color
4. **A poetic name is generated** using the Pantone color naming system
5. **The flower icon updates** to show your daily color in real-time

**Example Flow:**
- User logs 3 tasks today:
  - Task 1: Frustrated (Purple family)
  - Task 2: Tired (Gray-Blue family)  
  - Task 3: Anxious (Purple family)
- Result: **"Purple Heart"** (66% purple, 33% gray-blue blend)

## Technical Implementation

### Core Logic Location
- **Main function**: `src/utils/emotionColorBlender.ts` → `calculateDailyColor()`
- **Display component**: `src/components/Dashboard.tsx` (lines 248-305)
- **Color naming**: `color-namer` npm package

### How It Works (Step-by-Step)

#### 1. Emotion → Color Family Mapping

Each of the 16 emotions maps to one of 5 color families:

```typescript
RED_PINK (#FF2D55) - "热情高涨型" Passionate/Energized
├─ Energized
├─ Excited
└─ Proud

GOLDEN_YELLOW (#F4C95D) - "平和满足型" Peaceful/Content
├─ Happy
├─ Satisfied
├─ Calm
└─ Nostalgic

PURPLE (#AF52DE) - "紧张警觉型" Tense/Alert
├─ Anxious
├─ Frustrated
└─ Surprised

GRAY_BLUE (#48484A) - "精疲力尽型" Exhausted/Drained
├─ Tired
├─ Drained
├─ Sad
└─ Annoyed

LIGHT_GRAY (#E3E3E3) - "中性状态" Neutral
├─ Neutral
└─ Normal
```

#### 2. Calculate Color Proportions

**Function**: `calculateColorProportions(entry)`

For today's tasks:
1. Count how many tasks belong to each color family
2. Calculate proportion: `count / totalTasks`

**Example:**
- 2 tasks with Purple emotions (Anxious, Frustrated)
- 1 task with Gray-Blue emotion (Tired)
- Result: `{ PURPLE: 0.66, GRAY_BLUE: 0.33 }`

#### 3. Blend Colors (RGB Weighted Average)

**Function**: `blendColors(colorProportions)`

1. Convert each hex color to RGB values
2. Multiply each RGB component by its proportion
3. Sum all weighted RGB values
4. Convert back to hex color

**Math Example:**
```
Purple (#AF52DE) = RGB(175, 82, 222)
Gray-Blue (#48484A) = RGB(72, 72, 74)

Blended RGB:
R = (175 × 0.66) + (72 × 0.33) = 115.5 + 23.76 = 139
G = (82 × 0.66) + (72 × 0.33) = 54.12 + 23.76 = 78
B = (222 × 0.66) + (74 × 0.33) = 146.52 + 24.42 = 171

Result: #8B4EAB (purplish color)
```

#### 4. Generate Human-Readable Name

**Library**: `color-namer` (npm package)

```typescript
const colorResult = namer(dailyColor)
const colorName = colorResult.pantone?.[0]?.name || colorResult.basic?.[0]?.name
```

The `color-namer` library:
- Takes a hex color as input
- Returns multiple naming systems (basic, pantone, ntc, html)
- We prefer **Pantone names** for sophistication (e.g., "Purple Heart", "Lemon Curry")
- Fallback to **basic names** if Pantone unavailable (e.g., "Purple", "Yellow")

#### 5. Format and Display

**Formatting**:
```typescript
const formattedColorName = colorName
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ')
```

This ensures proper capitalization: `"purple heart"` → `"Purple Heart"`

**Visual Display**:
- Flower SVG with clip path
- Rectangle fill with the calculated color
- CSS transition for smooth color changes
- Drop shadow for depth

## Key Files

1. **`src/utils/emotionColorBlender.ts`**
   - Core blending logic
   - Emotion-to-color mapping
   - Color proportion calculations

2. **`src/components/Dashboard.tsx`** (lines 248-305)
   - UI rendering
   - Color name formatting
   - Flower icon display

3. **`docs/emotion-color-system.md`**
   - Design rationale for color families
   - Emotional psychology behind color choices

## Dependencies

- **`color-namer`** (npm package) - Converts hex colors to human-readable names
- No AI/API calls - all calculations done client-side
- Uses browser's built-in color rendering

## Edge Cases

- **No tasks today**: Returns `LIGHT_GRAY (#E3E3E3)` as default
- **All same emotion**: Returns the pure color family (no blending)
- **Empty entry**: Returns light gray
- **Multiple emotions per task**: Currently uses single emotion field (future: could blend per-task emotions)

## Performance

- ⚡ **Very fast** - Pure mathematical calculations
- 🎨 **Client-side only** - No API calls
- 🔄 **Real-time updates** - Recalculates on every task change
- 💾 **No storage needed** - Computed on-the-fly from existing task data

## Production Logging

The app logs detailed information about Today's Color calculation to the browser console:

### What Gets Logged

**Inputs:**
- List of all task descriptions and their emotions
- Total number of tasks

**Processing:**
- Color family breakdown with percentages
- Which emotions contributed to which color families

**Outputs:**
- Final blended color (hex code)
- Human-readable color name
- Visual color preview in the console

### Viewing Logs

1. **Open browser DevTools**: Press `F12` or `Cmd+Opt+I` (Mac) / `Ctrl+Shift+I` (Windows)
2. **Go to Console tab**
3. **Look for** `🎨 Today's Color Calculation` group
4. **Expand** to see full details

### Example Console Output

```
🎨 Today's Color Calculation
  📝 Input Emotions:
    1. Working on homepage redesign → Anxious
    2. Design review meeting → Frustrated
    3. Prototyping new feature → Excited
    Total tasks: 3
  
  🎨 Color Family Breakdown:
    Purple (紧张警觉): 67%
    Red/Pink (热情高涨): 33%
  
  ✅ Final Color:
    Hex: #C94A9F
    Name: "Purple Heart"
    Preview: [colored box shown in console]
```

### Debugging Tips

- **Color not updating?** Check the input emotions in the log
- **Unexpected color?** Review the color family breakdown percentages
- **Wrong color name?** The hex value is always correct, naming is cosmetic
- **Logs not showing?** Make sure Console is set to show "All levels" not just errors

### For Vercel Production

- ✅ **Logs appear in browser console** - Not in Vercel server logs
- ✅ **Client-side only** - These are browser console.log statements
- ⚠️ **Visible to users** - Anyone can open DevTools and see these logs

### Toggle Logging On/Off

Logging is currently **OFF** by default to keep production console clean.

**To enable logging:**

1. Open `src/utils/logger.ts`
2. Change `LOGGING_ENABLED` from `false` to `true`:
   ```typescript
   const LOGGING_ENABLED = true // Set to true to enable logs
   ```
3. Rebuild and deploy

**Quick toggle locations:**
- **Main control**: `src/utils/logger.ts` → `LOGGING_ENABLED` flag
- **All color logs**: Uses this flag automatically
- **Error logs**: Always show (even when logging disabled)

**Best practice:**
- ✅ Keep logging **ON** during development/debugging
- ✅ Turn logging **OFF** for production deployment
- ✅ Code stays in place - just flip the flag

## Integration Testing

### Test Strategy

Integration tests verify the complete color blending pipeline works correctly:

1. **Color Mapping** - Emotions correctly map to color families
2. **Proportion Calculation** - Percentages calculated accurately
3. **Color Blending** - RGB math produces expected results
4. **Color Naming** - `color-namer` returns readable names
5. **Edge Cases** - Empty entries, single emotions, all same emotion

### Test Scenarios

**Scenario 1: Pure Single Emotion**
- Input: 3 tasks, all "Anxious" (Purple family)
- Expected: Pure purple (#AF52DE) → "Purple" or similar name

**Scenario 2: Even Split (Two Families)**
- Input: 2 tasks "Anxious", 2 tasks "Tired"
- Expected: 50/50 blend of Purple + Gray-Blue

**Scenario 3: Dominant Emotion**
- Input: 3 tasks "Energized", 1 task "Sad"
- Expected: 75% Red/Pink, 25% Gray-Blue → Reddish blend

**Scenario 4: Complex Multi-Emotion Day**
- Input: 5 different emotions across families
- Expected: Proportional blend with accurate percentages

**Scenario 5: Edge Cases**
- Empty entry → Light Gray
- Single task → Pure color family
- All neutral → Light Gray

### Running Integration Tests

```bash
# Run all color blending tests
npx tsx test-color-blending.ts

# Run specific scenario
npx tsx test-color-blending.ts "Pure Single Emotion"
npx tsx test-color-blending.ts "Complex Multi-Emotion"

# Show detailed color breakdown
npx tsx test-color-blending.ts --verbose
```

### What Gets Tested

✅ **Real production code** - Uses actual `emotionColorBlender.ts` functions  
✅ **No mocks** - Tests the complete pipeline end-to-end  
✅ **Color accuracy** - Verifies RGB math and hex conversion  
✅ **Name generation** - Validates `color-namer` integration  
✅ **Proportion breakdown** - Shows percentage distribution

### Test Output Example

```
============================================================
Testing: Pure Single Emotion
============================================================

📝 Input: 3 tasks with "Anxious" emotion

🎨 Color Calculation:
   Purple (紧张警觉): 100%

✅ Result:
   Hex: #AF52DE
   RGB: (175, 82, 222)
   Name: "Purple"

============================================================
Testing: Even Split
============================================================

📝 Input: 2 "Anxious", 2 "Tired"

🎨 Color Calculation:
   Purple (紧张警觉): 50%
   Gray-Blue (精疲力尽): 50%

✅ Result:
   Hex: #7C6B94
   RGB: (124, 107, 148)
   Name: "Purple Shadow"
```

### No External Dependencies

Unlike challenge matching tests:
- ❌ **No API calls** - Pure math, no OpenAI needed
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **100% deterministic** - Same input = same output

