# Emotional Radar Chart Feature

## What It Does

The "Emotional Radar Chart" visualizes the user's emotional distribution across 5 emotion categories using an animated, organic blob shape. It provides a visual at-a-glance understanding of emotional patterns for the selected time period (week or month).

**Visual Display:**
- Animated organic blob shape (not a traditional pentagon radar)
- 5 emotion categories: Calm, Happy, Excited, Frustrated, Anxious
- Color-coded based on dominant emotion
- Subtle breathing animation (blob pulses gently)
- Rippling contour lines for depth
- Emotion labels around the perimeter
- Grid lines and axes for reference
- Size: 240px × 240px canvas

## User-Facing Behavior

1. **User navigates to Insights screen**
2. **Selects time range** (Week or Month tabs)
3. **App analyzes all tasks** from that period
4. **Calculates emotion breakdown** (5 categories as percentages)
5. **Draws animated radar blob** showing proportions
6. **Blob pulses gently** with breathing animation
7. **Updates in real-time** when switching week/month

**Example Flow:**
```
User selects "Week" tab:
- 20 tasks logged this week
- Emotions: 40% excited, 30% happy, 20% calm, 10% frustrated, 0% anxious
- Chart displays:
  - Large bulge toward "Excited" (top)
  - Medium bulge toward "Happy" 
  - Small bulge toward "Calm"
  - Tiny bulge toward "Frustrated"
  - Minimal point toward "Anxious"
  - Color: Red/pink gradient (excited is dominant)
```

## Technical Implementation

### Core Logic Location
- **Component**: `src/components/EmotionalRadarChart.tsx`
- **Display**: `src/components/InsightsScreen.tsx` (lines 432-457)
- **Data source**: `getEmotionBreakdown(entries)` from filtered time range
- **Rendering**: HTML5 Canvas with custom drawing logic

### How It Works (Step-by-Step)

#### 1. Get Emotion Breakdown Data

**Input from parent:**
```typescript
<EmotionalRadarChart 
  emotionData={emotionBreakdown}      // 5 emotion percentages
  taskCount={20}                       // Total tasks
  view='weekly'                        // Time period
  showLabels={true}                    // Show labels/grid
  size={240}                           // Canvas size
/>
```

**emotionData structure:**
```typescript
{
  mainEmotion: 'excited',              // Dominant emotion
  breakdown: {
    calm: 0.2,                         // 20%
    happy: 0.3,                        // 30%
    excited: 0.4,                      // 40%
    frustrated: 0.1,                   // 10%
    anxious: 0.0                       // 0%
  },
  totalTasks: 20
}
```

#### 2. Calculate Visual Scale Factor

**Function**: `getVisualScaleFactor(taskCount, view)`

**Purpose**: Boost small data for visibility, keep large data accurate

**Thresholds by view:**
```typescript
today:   { low: 5, medium: 15, high: 25 }
weekly:  { low: 10, medium: 25, high: 40 }
monthly: { low: 20, medium: 40, high: 60 }
```

**Scale logic:**
- Very sparse (≤low): 1.2× boost
- Transitioning (low-medium): 1.15× - 1.05× gradual reduction
- Approaching accurate (medium-high): 1.05× - 1.0× minimal boost
- Abundant (>high): 1.0× accurate proportions

**Example:**
```
Weekly view with 8 tasks:
- Below low threshold (10)
- Apply ~1.18× boost
- Makes small emotions more visible on chart
```

#### 3. Calculate Blob Points (Pentagon)

**5 points around a circle** (one per emotion):

```typescript
for (let i = 0; i < 5; i++) {
  const angle = (i * Math.PI * 2) / 5 - Math.PI / 2  // Start from top
  
  // Get emotion value (0-1), apply minimum for visibility
  let visualValue = data[i] < 0.08 ? 0.08 : data[i]
  visualValue = Math.min(visualValue * scaleFactor, 1.0)
  
  // Calculate position
  const radius = visualValue * maxRadius
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  
  points.push({ x, y })
}
```

**Positions (starting from top, clockwise):**
1. Calm (top)
2. Happy (top-right)
3. Excited (bottom-right)
4. Frustrated (bottom-left)
5. Anxious (top-left)

#### 4. Draw Chart Layers

**Layer 1: Static Grid (if showLabels)**
- 4 concentric circles (25%, 50%, 75%, 100% of max radius)
- White color, 15% opacity
- NO animation (static reference)

**Layer 2: Static Axes**
- 5 lines from center to edge (one per emotion)
- White color, 20% opacity
- NO animation

**Layer 3: Static Labels**
- 5 emotion names around perimeter
- Font: Inter 600, 14px
- Color: `#E6E1E5` (light gray)
- Positioned 24px outside chart edge

**Layer 4: Animated Contour Lines**
- 2 inner contour lines (35%, 70% of blob size)
- Ripple animation (opacity pulses)
- Adds depth to visualization
- ONLY if showLabels is true

**Layer 5: Main Blob (Animated)**
- **Shape**: Smooth organic blob using Catmull-Rom splines
- **Fill**: Radial gradient based on dominant emotion
- **Border**: 2px thick, 80% opacity
- **Animation**: Subtle breathing (2% scale variation over 6 seconds)

#### 5. Apply Colors Based on Dominant Emotion

**Color mapping:**
```typescript
calm:       Purple (#AF52DE → #C77FE8)
happy:      Golden (#F4C95D → #F7D87F)
excited:    Red/Pink (#FF2D55 → #FF5A7A)
frustrated: Gray (#48484A → #6B6B6D)
anxious:    Purple (#AF52DE → #C77FE8)
```

**Gradient structure:**
- Center: 50% opacity (primary color)
- Middle: 31% opacity (secondary color)
- Edges: 19% opacity (primary color)

Creates depth and organic feel!

#### 6. Animation Loop

**Breathing Animation:**
```typescript
// 4% scale variation over 6 second cycle
breathing = 1 + Math.sin(time * π/3) * 0.02
```

**Ripple Animation:**
```typescript
// Contour line opacity pulses
opacity = 0.15 + Math.sin(ripplePhase + i) * 0.05
```

**Updates**: 60 FPS via `requestAnimationFrame`

## Visual Examples

### High Excited Week
**Data:** 60% excited, 20% happy, 20% calm
```
     Calm
       ●
      / \
Anxious   Happy
  ●       ●
   \  ▓  /
    \ ▓ /
     ▓▓▓  ← Large bulge toward Excited
    / ▓ \
   /  ▓  \
  ●       ●
Frustrated Excited
```
Color: Red/pink gradient

### Balanced Week
**Data:** 25% each (calm, happy, excited, frustrated), 0% anxious
```
     Calm
      ▓
     /●\
    ▓   ▓
   ●     ●
  Anx   Happy
   ●     ●
    ▓   ▓
     \●/
    Excited
```
Color: Based on whichever is slightly higher

### Challenging Week
**Data:** 60% frustrated, 30% anxious, 10% calm
```
     Calm
       ●
      
Anxious●  ● Happy
    ▓▓▓
    ▓▓▓▓
     ▓▓▓  ← Large bulge toward Frustrated
      ●
  Frustrated
```
Color: Gray gradient

## Rendering Details

### Canvas Setup
- **Size**: 240px (default for Insights), 300px (optional), 160px (compact)
- **Coordinate system**: Center origin (0, 0)
- **Overall scale**: 0.9× (90%) to prevent overflow
- **Edge padding**: 40px (for labels) or 16px (no labels)

### Smooth Curve Algorithm

**Uses Catmull-Rom Splines:**
- Connects 5 emotion points with smooth curves
- Tension: 0.5 (balance between sharp and overly smooth)
- Creates organic, blob-like shape (not harsh pentagon)
- Closed path (returns to starting point)

**Math:**
```typescript
// For each point, calculate control points:
cp1x = p1.x + (p2.x - p0.x) / 6 * tension
cp1y = p1.y + (p2.y - p0.y) / 6 * tension

// Draw bezier curve:
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
```

Creates natural, flowing curves!

### Minimum Visibility

**Problem**: Emotions with 0% or very low % are invisible

**Solution**: Minimum visual value
```typescript
const MIN_VISUAL_VALUE = 0.08  // 8% minimum

visualValue = rawValue < 0.08 ? 0.08 : rawValue
```

Even 0% emotions show a tiny point (prevents invisible areas).

## Key Files

1. **`src/components/EmotionalRadarChart.tsx`**
   - Complete canvas rendering logic
   - Animation loops
   - Catmull-Rom spline curves
   - Color gradients

2. **`src/components/InsightsScreen.tsx`** (lines 432-457)
   - Renders chart with emotion data
   - Passes view type (weekly/monthly)
   - Conditional rendering (only if data exists)

3. **`src/utils/emotionBreakdownService.ts`**
   - Provides emotion breakdown data
   - Calculates percentages

## Edge Cases

- **No emotions data**: Chart doesn't render (returns null)
- **All zero emotions**: Shows 5 equal tiny points (all at minimum)
- **One dominant emotion (100%)**: Large bulge in one direction, tiny points elsewhere
- **All equal (20% each)**: Perfect pentagon shape
- **Very small task count**: Scaled up for visibility (e.g., 3 tasks → 1.2× boost)
- **Very large task count**: Accurate proportions (50+ tasks → no boost)
- **Labels hidden**: Compact 160px version without grid/axes/labels

## Performance

- ⚡ **Smooth animation** - 60 FPS via requestAnimationFrame
- 🎨 **Canvas rendering** - Hardware accelerated
- 📊 **Calculation**: O(n) for emotion breakdown, O(1) for drawing
- 💾 **No storage** - Redraws from props
- 🔄 **Updates on prop change** - Automatic redraw

## Design Decisions

### Why Organic Blob Instead of Traditional Radar?

**Traditional radar** (pentagon with straight edges):
- ❌ Feels technical, clinical
- ❌ Sharp, rigid appearance
- ❌ Less engaging visually

**Organic blob** (smooth curves):
- ✅ Warm, human, approachable
- ✅ Matches app's calm aesthetic
- ✅ More visually interesting
- ✅ Breathing animation adds life

### Why These 5 Emotion Categories?

Simplified from 16 individual emotions to 5 families:
- **Calm**: Reflective, peaceful states
- **Happy**: Positive satisfaction
- **Excited**: High energy, enthusiasm
- **Frustrated**: Active negative
- **Anxious**: Worried, stressed

Easier to understand at a glance than 16 individual emotions!

### Why Scale Sparse Data?

**Problem**: 3 tasks with different emotions → each 33% → too small to see

**Solution**: Boost factor (1.2×) for small datasets
- Makes patterns visible
- Still proportional (all scaled equally)
- Accuracy returns at higher task counts

### Why Breathing Animation?

- Adds subtle life to the visualization
- Prevents static, boring chart
- Matches app's calm, organic aesthetic
- 2% scale variation (barely noticeable, very subtle)
- 6-second cycle (slow, meditative pace)

## Integration Testing

### Test Strategy

Integration tests verify the radar chart calculations work correctly:

1. **Emotion Breakdown** - Correct percentage calculations
2. **Visual Scale Factor** - Proper scaling for different task counts
3. **Point Positioning** - Correct pentagon coordinates
4. **Dominant Emotion** - Identifies most common emotion
5. **Minimum Visibility** - Small emotions still show (8% minimum)
6. **Edge Cases** - Empty data, single emotion, all equal

### Test Scenarios

**Scenario 1: High Excited Week**
- Input: 20 tasks, 60% excited, 20% happy, 20% calm
- Expected: Excited point largest, proper proportions

**Scenario 2: All Equal Emotions**
- Input: 20 tasks, 20% each emotion
- Expected: Perfect pentagon shape (all points equal distance)

**Scenario 3: Single Dominant Emotion**
- Input: 20 tasks, 100% frustrated
- Expected: Large bulge toward frustrated, tiny points elsewhere

**Scenario 4: Sparse Data (Low Task Count)**
- Input: 5 tasks (weekly view)
- Expected: Scale factor ~1.18× boost applied

**Scenario 5: Abundant Data (High Task Count)**
- Input: 50 tasks (weekly view)
- Expected: Scale factor = 1.0× (no boost, accurate)

**Scenario 6: Zero Emotion**
- Input: Emotion with 0% value
- Expected: Shows at minimum (8%) for visibility

**Scenario 7: Different Views (Today/Weekly/Monthly)**
- Input: Same 15 tasks, different view types
- Expected: Different scale factors based on view thresholds

### Running Integration Tests

```bash
# Run all radar chart tests
npx tsx test-emotion-radarchart.ts

# Run specific scenario
npx tsx test-emotion-radarchart.ts "High Excited Week"
npx tsx test-emotion-radarchart.ts "Sparse Data"

# Show help
npx tsx test-emotion-radarchart.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual scale factor calculation  
✅ **No mocks** - Tests complete chart logic  
✅ **Emotion percentages** - Validates breakdown calculations  
✅ **Scale factors** - Confirms correct boosting for sparse data  
✅ **Point coordinates** - Verifies pentagon positioning  
✅ **Minimum visibility** - Tests 8% minimum threshold  
✅ **View types** - Different thresholds for today/weekly/monthly

### Test Output Example

```
============================================================
Testing: High Excited Week
============================================================

📝 Input:
   Task count: 20
   View: weekly
   Emotion breakdown:
     Calm: 20%
     Happy: 20%
     Excited: 60%
     Frustrated: 0%
     Anxious: 0%

📊 Analysis:
   Dominant emotion: excited
   Positive emotions: 100%
   Challenging emotions: 0%

🎨 Visual Calculations:
   Scale factor: 1.06× (moderate boost)
   Max radius: 100px (example)

   Point positions (5 pentagon points):
     1. Calm (20%): radius = 21.2px → (0, -21.2)
     2. Happy (20%): radius = 21.2px → (20.2, -6.5)
     3. Excited (60%): radius = 63.6px → (39.3, 49.9) ← Largest!
     4. Frustrated (0% → 8% min): radius = 8.5px → (-32.4, 31.0)
     5. Anxious (0% → 8% min): radius = 8.5px → (-32.4, -31.0)

✅ Result:
   Excited point is largest: YES ✅
   Zero emotions show minimum: YES ✅
   Scale factor in valid range (1.0-1.2): YES ✅
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pure calculation logic
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ❌ **No canvas rendering** - Tests logic only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **Deterministic** - Same input = same output

