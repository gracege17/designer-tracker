# Emotional Radar Chart - Dynamic Scaling Guide

## Overview

The `TodayEmotionRadarBlob` component now features intelligent dynamic scaling that adapts the blob visualization based on the number of tasks and time period being viewed.

## Key Improvements

### 1. **Removed Artificial Boosting**
- ❌ Old: `data[i] === 0 ? 0.3 : Math.min(data[i] + 0.5, 1)` - artificially inflated all values by 0.5
- ✅ New: Uses actual emotion values with minimal adjustments for visibility

### 2. **Dynamic Scale Factor**
The blob size now adapts based on:
- **Task count**: How many tasks contribute to the data
- **Time period**: Today vs Weekly vs Monthly views
- **Data sparsity**: More boost for new users, accurate proportions for active users

### 3. **Minimum Visual Value**
- Zero or very small emotions (< 0.08) get a subtle minimum radius (0.08) for visibility
- Non-zero values remain proportional to actual data

## Usage

### Basic Usage (defaults)
```tsx
<TodayEmotionRadarBlob 
  emotionData={emotionData}
  showLabels={true}
/>
// Uses default: taskCount=10, view='today'
```

### With Task Count and View
```tsx
<TodayEmotionRadarBlob 
  emotionData={emotionData}
  showLabels={true}
  taskCount={5}           // Number of tasks contributing to this data
  view="today"            // 'today' | 'weekly' | 'monthly'
/>
```

## Scaling Algorithm

### Scale Factor Calculation

The `getVisualScaleFactor(taskCount, view)` function applies different boost levels based on thresholds:

#### **Today View**
- **1-5 tasks**: 1.5x - 1.3x boost (significant presence for new users)
- **5-15 tasks**: 1.3x - 1.1x boost (gradual transition)
- **15-25 tasks**: 1.1x - 1.0x boost (approaching accurate)
- **25+ tasks**: 1.0x boost (accurate proportions)

#### **Weekly View**
- **1-10 tasks**: 1.5x - 1.3x boost
- **10-25 tasks**: 1.3x - 1.1x boost
- **25-40 tasks**: 1.1x - 1.0x boost
- **40+ tasks**: 1.0x boost

#### **Monthly View**
- **1-20 tasks**: 1.5x - 1.3x boost
- **20-40 tasks**: 1.3x - 1.1x boost
- **40-60 tasks**: 1.1x - 1.0x boost
- **60+ tasks**: 1.0x boost

### Visual Value Processing

For each emotion axis:

1. **Get raw value** (0.0 - 1.0)
2. **Apply minimum** for visibility: `value < 0.08 ? 0.08 : value`
3. **Apply scale factor**: `value * scaleFactor`
4. **Clamp to maximum**: `Math.min(value, 1.0)`
5. **Calculate radius**: `value * maxRadius`

## Examples

### Scenario 1: New User - 2 Tasks Today
```tsx
<TodayEmotionRadarBlob 
  emotionData={{
    mainEmotion: 'happy',
    breakdown: { calm: 0.2, happy: 0.8, excited: 0.1, frustrated: 0, anxious: 0 }
  }}
  taskCount={2}
  view="today"
/>
```
**Result:**
- Scale factor: ~1.44x
- `calm: 0.2 → 0.29` (proportional boost)
- `happy: 0.8 → 1.0` (capped at max)
- `excited: 0.1 → 0.14`
- `frustrated: 0 → 0.12` (minimum for visibility)
- **Visual presence maintained while preserving proportions!**

### Scenario 2: Active User - 30 Tasks This Month
```tsx
<TodayEmotionRadarBlob 
  emotionData={{
    mainEmotion: 'calm',
    breakdown: { calm: 0.5, happy: 0.3, excited: 0.1, frustrated: 0.05, anxious: 0.05 }
  }}
  taskCount={30}
  view="monthly"
/>
```
**Result:**
- Scale factor: ~1.08x (minimal boost)
- `calm: 0.5 → 0.54`
- `happy: 0.3 → 0.32`
- `excited: 0.1 → 0.11`
- `frustrated: 0.05 → 0.08` (minimum)
- `anxious: 0.05 → 0.08` (minimum)
- **Accurate representation with slight enhancement!**

### Scenario 3: Power User - 70 Tasks This Month
```tsx
<TodayEmotionRadarBlob 
  emotionData={{
    mainEmotion: 'excited',
    breakdown: { calm: 0.4, happy: 0.5, excited: 0.9, frustrated: 0.2, anxious: 0.1 }
  }}
  taskCount={70}
  view="monthly"
/>
```
**Result:**
- Scale factor: 1.0x (no boost)
- Values displayed exactly as recorded
- **True proportional representation!**

## Integration Points

### Where to Pass Task Count

You'll need to pass the actual task count from your data source. Common places:

#### Dashboard Component
```tsx
// In Dashboard.tsx or wherever you aggregate emotion data
const todayTaskCount = entries.filter(e => isToday(e.date)).length
const weeklyTaskCount = entries.filter(e => isThisWeek(e.date)).length
const monthlyTaskCount = entries.filter(e => isThisMonth(e.date)).length

// Then pass to the chart:
<TodayEmotionRadarBlob 
  emotionData={todayEmotionData}
  taskCount={todayTaskCount}
  view="today"
/>
```

#### Insights Screen
```tsx
// Weekly view
<TodayEmotionRadarBlob 
  emotionData={weeklyEmotionData}
  taskCount={weeklyTaskCount}
  view="weekly"
/>

// Monthly view
<TodayEmotionRadarBlob 
  emotionData={monthlyEmotionData}
  taskCount={monthlyTaskCount}
  view="monthly"
/>
```

## Customization Options

### Adjusting Scale Thresholds

To modify when boosting transitions occur, edit the thresholds in `getVisualScaleFactor`:

```tsx
const thresholds = {
  today: { low: 5, medium: 15, high: 25 },    // Adjust these
  weekly: { low: 10, medium: 25, high: 40 },  // values to tune
  monthly: { low: 20, medium: 40, high: 60 }  // the transition points
}
```

### Adjusting Boost Strength

To change how much sparse data is boosted:

```tsx
const minScale = 1.5  // Max boost (50%) for very sparse data
const maxScale = 1.0  // No boost for abundant data

// Modify transition ranges:
if (taskCount <= t.low) {
  return minScale - (minScale - 1.3) * (taskCount / t.low)  // Adjust 1.3
} else if (taskCount <= t.medium) {
  const progress = (taskCount - t.low) / (t.medium - t.low)
  return 1.3 - 0.2 * progress  // Adjust range: 1.3 - 1.1
}
// ...etc
```

### Adjusting Minimum Visual Value

To change the visibility threshold for zero/small values:

```tsx
const MIN_VISUAL_VALUE = 0.08  // Increase for more visible minimums
                               // Decrease for more accurate representation
```

## Optional: Normalized View

For a normalized view where the blob always fills the available space regardless of absolute values, uncomment and use this approach:

```tsx
// In the drawChart function, add:
const maxEmotionValue = Math.max(...data, 0.01)

// Then in the loop:
const normalizedValue = rawValue / maxEmotionValue
let visualValue = normalizedValue < MIN_VISUAL_VALUE ? MIN_VISUAL_VALUE : normalizedValue
```

This makes the highest emotion always reach the outer edge, useful for comparing emotion **distributions** rather than absolute intensities.

## Benefits

### For New Users
- ✅ Blob has visual presence even with 1-2 tasks
- ✅ Still shows proportional differences between emotions
- ✅ Encourages continued usage

### For Active Users
- ✅ Accurate representation of emotion patterns
- ✅ No misleading artificial inflation
- ✅ True data visualization

### For All Users
- ✅ Smooth transition as they log more tasks
- ✅ Context-aware scaling (daily vs monthly)
- ✅ Maintains beautiful organic blob animation
- ✅ Respects actual emotion proportions

## Testing Scenarios

Test with these data patterns:

1. **Sparse Neutral**: `{ calm: 0.2, happy: 0.2, excited: 0.2, frustrated: 0.2, anxious: 0.2 }` with `taskCount=1`
2. **Sparse Dominant**: `{ calm: 0.9, happy: 0.1, excited: 0, frustrated: 0, anxious: 0 }` with `taskCount=3`
3. **Medium Balanced**: `{ calm: 0.5, happy: 0.4, excited: 0.3, frustrated: 0.2, anxious: 0.1 }` with `taskCount=20`
4. **High Intense**: `{ calm: 0.3, happy: 0.7, excited: 0.9, frustrated: 0.4, anxious: 0.5 }` with `taskCount=50`

## Migration Notes

### Before (Old Code)
```tsx
const boostedValue = data[i] === 0 ? 0.3 : Math.min(data[i] + 0.5, 1)
const radius = boostedValue * maxRadius
```

### After (New Code)
```tsx
const scaleFactor = getVisualScaleFactor(taskCount, view)
let visualValue = rawValue < MIN_VISUAL_VALUE ? MIN_VISUAL_VALUE : rawValue
visualValue = Math.min(visualValue * scaleFactor, 1.0)
const radius = visualValue * maxRadius
```

### Key Differences
- Old: +0.5 boost to ALL values (made 0.1 become 0.6!)
- New: Proportional scaling based on context (0.1 with 2 tasks → 0.14)
- Old: 0.3 minimum even for zero values
- New: 0.08 minimum, more subtle and accurate

---

**Last Updated**: October 2025
**Component**: `src/components/EmotionalRadarChart.tsx`

