# Emotional Radar Chart - Visual Examples

## Quick Reference: Scale Factors by Task Count

### Today View
| Tasks | Scale Factor | Boost Level | Use Case |
|-------|--------------|-------------|----------|
| 1     | 1.50x        | Maximum     | First-time user |
| 2     | 1.44x        | High        | New user exploring |
| 5     | 1.30x        | Medium-High | Learning phase |
| 10    | 1.20x        | Medium      | Regular user |
| 15    | 1.10x        | Low         | Active user |
| 25+   | 1.00x        | None        | Power user |

### Weekly View
| Tasks | Scale Factor | Boost Level | Use Case |
|-------|--------------|-------------|----------|
| 1-5   | 1.50-1.35x   | High        | Light weekly usage |
| 10    | 1.30x        | Medium-High | Moderate engagement |
| 20    | 1.16x        | Medium      | Regular weekly user |
| 30    | 1.06x        | Low         | Active user |
| 40+   | 1.00x        | None        | Heavy user |

### Monthly View
| Tasks | Scale Factor | Boost Level | Use Case |
|-------|--------------|-------------|----------|
| 1-10  | 1.50-1.35x   | High        | Occasional user |
| 20    | 1.30x        | Medium-High | Light monthly usage |
| 35    | 1.13x        | Medium      | Moderate user |
| 50    | 1.03x        | Low         | Active user |
| 60+   | 1.00x        | None        | Power user |

## Visual Comparison: Before vs After

### Example 1: New User (2 Tasks Today)
**Emotion Data**: `{ calm: 0.2, happy: 0.8, excited: 0.1, frustrated: 0, anxious: 0 }`

#### ❌ Before (Old Boosting)
```
calm:       0.2 → 0.7  (artificial +0.5)
happy:      0.8 → 1.0  (capped)
excited:    0.1 → 0.6  (artificial +0.5) ⚠️ TOO BIG
frustrated: 0   → 0.3  (artificial minimum)
anxious:    0   → 0.3  (artificial minimum)
```
**Problem**: Small emotions (0.1) look nearly as big as strong emotions (0.8)!

#### ✅ After (Dynamic Scaling)
```
calm:       0.2 → 0.29  (1.44x scale)
happy:      0.8 → 1.0   (capped, but natural)
excited:    0.1 → 0.14  (proportional boost) ✓
frustrated: 0   → 0.12  (subtle minimum)
anxious:    0   → 0.12  (subtle minimum)
```
**Result**: Proportions maintained! Happy is clearly dominant, excited is subtle.

---

### Example 2: Active User (30 Tasks Monthly)
**Emotion Data**: `{ calm: 0.5, happy: 0.3, excited: 0.1, frustrated: 0.05, anxious: 0.05 }`

#### ❌ Before (Old Boosting)
```
calm:       0.5 → 1.0  (capped! loses accuracy)
happy:      0.3 → 0.8  (inflated)
excited:    0.1 → 0.6  (inflated) ⚠️
frustrated: 0.05 → 0.55 (heavily inflated) ⚠️
anxious:    0.05 → 0.55 (heavily inflated) ⚠️
```
**Problem**: Everything looks big! Can't see the actual differences.

#### ✅ After (Dynamic Scaling)
```
calm:       0.5 → 0.54  (1.08x scale)
happy:      0.3 → 0.32  (slight boost)
excited:    0.1 → 0.11  (accurate)
frustrated: 0.05 → 0.08 (minimum for visibility)
anxious:    0.05 → 0.08 (minimum for visibility)
```
**Result**: Accurate representation! Calm is clearly strongest.

---

### Example 3: Power User (70 Tasks Monthly)
**Emotion Data**: `{ calm: 0.4, happy: 0.5, excited: 0.9, frustrated: 0.2, anxious: 0.1 }`

#### ❌ Before (Old Boosting)
```
calm:       0.4 → 0.9  (distorted)
happy:      0.5 → 1.0  (capped)
excited:    0.9 → 1.0  (capped, loses dominance info) ⚠️
frustrated: 0.2 → 0.7  (heavily inflated) ⚠️
anxious:    0.1 → 0.6  (heavily inflated) ⚠️
```
**Problem**: Can't distinguish between happy (0.5) and excited (0.9)!

#### ✅ After (Dynamic Scaling)
```
calm:       0.4 → 0.4  (1.0x scale - accurate)
happy:      0.5 → 0.5  (accurate)
excited:    0.9 → 0.9  (clearly dominant) ✓
frustrated: 0.2 → 0.2  (accurate)
anxious:    0.1 → 0.1  (accurate)
```
**Result**: Perfect proportional representation!

---

## Real-World Usage Patterns

### Pattern 1: Daily Check-in User
- Logs 3-5 tasks per day
- View: **Today** (uses 1.3-1.4x scaling)
- Result: Blob has presence, emotions are distinguishable

### Pattern 2: Weekly Reviewer
- Logs 15-20 tasks per week
- View: **Weekly** (uses 1.15-1.2x scaling)
- Result: Balanced view, patterns emerge clearly

### Pattern 3: Monthly Tracker
- Logs 40-50 tasks per month
- View: **Monthly** (uses 1.0-1.05x scaling)
- Result: Accurate statistical view of emotional patterns

---

## Integration Code Examples

### Dashboard Integration
```tsx
import TodayEmotionRadarBlob from './components/EmotionalRadarChart'
import { getTodayEmotionData } from './utils/emotionBreakdownService'

function Dashboard() {
  const entries = useAppContext().entries
  const todayEntries = entries.filter(e => isToday(e.date))
  
  const emotionData = getTodayEmotionData(todayEntries)
  const taskCount = todayEntries.length
  
  return (
    <div className="dashboard">
      <h2>Today's Emotional Landscape</h2>
      <TodayEmotionRadarBlob 
        emotionData={emotionData}
        taskCount={taskCount}
        view="today"
        showLabels={true}
      />
    </div>
  )
}
```

### Insights Screen (Multiple Views)
```tsx
function InsightsScreen() {
  const entries = useAppContext().entries
  
  // Calculate for different time periods
  const todayData = getTodayEmotionData(entries.filter(e => isToday(e.date)))
  const weeklyData = getWeeklyEmotionData(entries.filter(e => isThisWeek(e.date)))
  const monthlyData = getMonthlyEmotionData(entries.filter(e => isThisMonth(e.date)))
  
  const todayCount = entries.filter(e => isToday(e.date)).length
  const weeklyCount = entries.filter(e => isThisWeek(e.date)).length
  const monthlyCount = entries.filter(e => isThisMonth(e.date)).length
  
  return (
    <div className="insights-grid">
      {/* Today */}
      <Card>
        <h3>Today</h3>
        <TodayEmotionRadarBlob 
          emotionData={todayData}
          taskCount={todayCount}
          view="today"
          showLabels={true}
        />
        <p className="text-xs">{todayCount} tasks logged</p>
      </Card>
      
      {/* This Week */}
      <Card>
        <h3>This Week</h3>
        <TodayEmotionRadarBlob 
          emotionData={weeklyData}
          taskCount={weeklyCount}
          view="weekly"
          showLabels={true}
        />
        <p className="text-xs">{weeklyCount} tasks logged</p>
      </Card>
      
      {/* This Month */}
      <Card>
        <h3>This Month</h3>
        <TodayEmotionRadarBlob 
          emotionData={monthlyData}
          taskCount={monthlyCount}
          view="monthly"
          showLabels={true}
        />
        <p className="text-xs">{monthlyCount} tasks logged</p>
      </Card>
    </div>
  )
}
```

### Compact View (No Labels)
```tsx
// For small cards or preview views
<TodayEmotionRadarBlob 
  emotionData={emotionData}
  taskCount={5}
  view="today"
  showLabels={false}  // Compact mode
/>
```

---

## Testing Checklist

- [ ] Test with 0 tasks (all zero emotions)
- [ ] Test with 1 task (single emotion dominant)
- [ ] Test with 2-5 tasks (sparse data)
- [ ] Test with 10-20 tasks (medium data)
- [ ] Test with 30+ tasks (abundant data)
- [ ] Test with balanced emotions (all similar values)
- [ ] Test with one dominant emotion (one high, others low)
- [ ] Test with all emotions at 1.0 (maximum intensity)
- [ ] Test view switching (today → weekly → monthly)
- [ ] Verify smooth animation continues through data updates

---

## Tips for Best Results

1. **Always pass actual task count** - Don't hardcode or estimate
2. **Match view to time period** - Use 'today' for daily data, etc.
3. **Show task count in UI** - Help users understand the context
4. **Consider minimum thresholds** - Maybe hide chart if taskCount < 1?
5. **Animate transitions** - When task count changes, animate the scale change

---

**Related Documentation**:
- [Radar Chart Scaling Guide](./radar-chart-scaling.md)
- [Card Design System](./card-design-system.md)
- [Emotion Breakdown Service](../src/utils/emotionBreakdownService.ts)

