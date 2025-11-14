# Reflections History Feature

## What It Does

The "Reflections" history shows a chronological list of all past daily journal entries, grouped by month. Users can browse their complete logging history, see task summaries for each day, and click entries to view full details.

**Visual Display:**
- Page title: "Reflections"
- Search icon in header (visual only, not functional)
- Entries grouped by month (e.g., "Nov, 2025", "Oct, 2025")
- Collapsible month sections (click to expand/collapse)
- Each entry shows:
  - Date square (weekday + day number)
  - Up to 3 task descriptions
  - "+X more tasks" indicator if more than 3
- Click any entry to view full details
- Bottom navigation

## User-Facing Behavior

1. **User clicks History icon** in bottom navigation
2. **Page shows all entries** grouped by month (newest first)
3. **Month sections are collapsible** - click month header to expand/collapse
4. **Each entry card shows:**
   - Date: "MON 12" format
   - First 3 task descriptions
   - "+2 more tasks" if entry has >3 tasks
5. **Click entry** to navigate to detailed view
6. **Today's entry**: Can edit tasks (clickable, full opacity)
7. **Past entries**: Read-only (non-clickable tasks, reduced opacity)
8. **Empty state** if no entries logged yet

**Important Distinction:**
- **Today's tasks**: Editable (can modify description, emotions, notes)
- **Past tasks**: Read-only (can view but not edit)

**Example Display:**
```
Reflections              [🔍]

Nov, 2025                 [▼]
  MON
  12    Design homepage hero section
        Team brainstorming session
        Prototype new feature
        +2 more tasks

  SUN
  11    Morning standup
        Client presentation

Oct, 2025                 [▶]
  (collapsed)
```

## Technical Implementation

### Core Logic Location
- **Component**: `src/components/EntryList.tsx`
- **Date utilities**: `src/utils/dateUtils.ts` → `DateUtils.parseLocalDate()`
- **Navigation**: `src/App.tsx` → Routes to 'entryList' view
- **Data source**: All entries from localStorage

### How It Works (Step-by-Step)

#### 1. Sort Entries by Date

```typescript
const sortedEntries = entries.sort((a, b) => 
  b.date.localeCompare(a.date)
)
```

**Logic**: Newest entries first (descending order)

**Example:**
```
Entries:
- 2025-11-12
- 2025-11-10
- 2025-10-28
- 2025-11-11

Sorted:
- 2025-11-12 (newest)
- 2025-11-11
- 2025-11-10
- 2025-10-28 (oldest)
```

#### 2. Group Entries by Month

**Function**: `groupEntriesByMonth(entries)`

```typescript
const grouped: Record<string, Entry[]> = {}

entries.forEach(entry => {
  const date = DateUtils.parseLocalDate(entry.date)
  const monthKey = `${date.toLocaleString('en-US', { month: 'short' })}, ${date.getFullYear()}`
  
  if (!grouped[monthKey]) {
    grouped[monthKey] = []
  }
  grouped[monthKey].push(entry)
})
```

**Creates groups:**
```typescript
{
  "Nov, 2025": [entry1, entry2, entry3],
  "Oct, 2025": [entry4, entry5],
  "Sep, 2025": [entry6]
}
```

#### 3. Initialize Expanded State

**On mount**: All months start expanded

```typescript
useEffect(() => {
  const allMonths = Object.keys(groupedEntries).reduce((acc, month) => {
    acc[month] = true  // All expanded
    return acc
  }, {})
  setExpandedMonths(allMonths)
}, [])
```

**User can toggle** by clicking month header

#### 4. Render Month Sections

**For each month:**

**Month Header** (clickable):
```jsx
<button onClick={() => toggleMonth(monthKey)}>
  <h3>Nov, 2025</h3>
  <CaretRight className={expanded ? 'rotate-90' : ''} />
</button>
```

Caret rotates 90° when expanded (points down)

**Month Entries** (if expanded):
```jsx
{expandedMonths[monthKey] && (
  <div>
    {monthEntries.map(entry => renderEntry(entry))}
  </div>
)}
```

#### 5. Render Individual Entry Cards

**Structure:**
```jsx
<div onClick={() => onViewEntry(entry)} className="flex gap-4">
  {/* Date Square */}
  <div className="w-[48px] h-[48px] bg-[#1C1B1F]">
    <label>MON</label>
    <p>12</p>
  </div>
  
  {/* Content */}
  <div>
    {entry.tasks.slice(0, 3).map(task => (
      <p>{task.description}</p>
    ))}
    
    {entry.tasks.length > 3 && (
      <p>+{entry.tasks.length - 3} more tasks</p>
    )}
  </div>
</div>
```

**Note**: Clicking entry navigates to EntryDetail page, where edit permissions are determined.

#### 6. Entry Detail View (Edit Permissions)

**When user clicks an entry**, navigates to EntryDetail component which checks:

```typescript
const isToday = DateUtils.isDateStringToday(entry.date)
```

**Today's entry:**
- Tasks are **clickable** (cursor-pointer)
- Full opacity (100%)
- Click task → Opens edit modal
- Can modify: description, emotions, notes

**Past entries:**
- Tasks are **non-clickable** (cursor-default)
- Reduced opacity (75%)
- Click does nothing
- **Read-only mode** - view only

**Visual indicator:**
```typescript
className={`
  ${isToday 
    ? 'cursor-pointer hover:shadow-md active:scale-[0.99]'  // Editable
    : 'cursor-default opacity-75'                            // Read-only
  }
`}
```

**Date square:**
- Weekday: Uppercase, gray, 10px
- Day number: 24px, bold, white

**Task descriptions:**
- Show first 3 tasks only
- 15px font, white text
- 2-line clamp (truncates long descriptions)
- Line height: 1.6

**More indicator:**
- Shows if >3 tasks exist
- Format: "+2 more tasks" (or "+1 more task")
- Italic, gray, 14px

## Visual Design

### Header
- Title: "Reflections" (Playfair Display, 28px, bold)
- Search icon (visual only, not functional yet)
- Sticky position (stays on scroll)
- Border bottom

### Month Header
- Font: Bold, 18px, white
- Tracking: Wide letter spacing
- Padding: 12px vertical
- Full width clickable
- Caret icon (transitions on expand)

### Date Square
- Size: 48px × 48px
- Background: `#1C1B1F` (dark gray)
- Border radius: Default (slightly rounded)
- Centered text (flexbox)

### Entry Card
- Layout: Flex row (date left, content right)
- Gap: 16px between date and content
- Spacing: 16px between entries
- Hover: opacity-80
- Cursor: Pointer
- Transition: Smooth

### Task Descriptions
- Max 3 shown per entry
- Text: 15px, white, relaxed leading
- Line clamp: 2 lines max per description
- Overflow: Hidden with ellipsis

## Empty State

**When no entries exist:**
```
      📝

No reflections yet

Start tracking your work to 
see your history here.
```

- Centered layout
- Empty icon (could be added)
- Title: "No reflections yet" (xl, semibold)
- Subtitle: Encouraging text (gray)

## Month Collapse/Expand

**Collapsed state:**
- Month header visible
- Caret points right (→)
- Entries hidden
- Click to expand

**Expanded state:**
- Month header visible
- Caret points down (↓)
- All entries for that month visible
- Click to collapse

**Default**: All months start expanded

## Navigation

**To History:**
- Click History icon in bottom nav
- From any screen

**From History:**
- Click entry → Navigate to EntryDetail
- Click bottom nav icons → Navigate to that screen
- Click search (visual only, not functional)

## Date Formatting

**Day of week:**
- Format: "MON", "TUE", "WED", etc.
- Always uppercase, 3 letters
- Extracted from date string

**Day number:**
- Format: 1-31
- No leading zero (12, not 012)

**Month grouping:**
- Format: "Nov, 2025" (Short month, Year)
- Uses locale-specific month names

## Edit Permissions

### Read-Only Past Entries

**Why past entries can't be edited:**
- ✅ Preserves historical accuracy
- ✅ Prevents accidental changes to past reflections
- ✅ Encourages forward-looking journaling
- ✅ Maintains data integrity

**Visual indicators:**
```
Today's Entry:
- Tasks: Full white color, 100% opacity
- Cursor: Pointer
- Hover: Shadow effect
- Click: Opens edit modal ✏️

Past Entry:
- Tasks: Faded, 75% opacity
- Cursor: Default (not-allowed)
- Hover: No effect
- Click: Does nothing 🔒
```

### How Edit Detection Works

**In EntryDetail component:**
```typescript
const isToday = DateUtils.isDateStringToday(entry.date)

// In task card rendering:
onClick={() => {
  if (!isToday) {
    return  // Do nothing for historical entries
  }
  onEditTask(task.id)  // Edit only today's tasks
}}
```

**Date comparison:**
- Compares entry.date with current date
- If dates match → Today (editable)
- If dates don't match → Past (read-only)

## Key Files

1. **`src/components/EntryList.tsx`**
   - Complete history page component
   - Entry grouping by month
   - Collapse/expand logic
   - Entry card rendering
   - Clicking entry → Navigate to detail

2. **`src/components/EntryDetail.tsx`** ⭐ Edit Logic
   - Checks if entry is today (`isToday`)
   - Applies edit permissions
   - Today: Editable (clickable tasks, edit modal)
   - Past: Read-only (non-clickable, view only)

3. **`src/utils/dateUtils.ts`**
   - `parseLocalDate()` - Date parsing
   - `isDateStringToday()` - Today check for edit permissions
   - Date formatting utilities

4. **`src/utils/storage.ts`**
   - Entry loading from localStorage
   - Entry storage interface

5. **`src/App.tsx`**
   - Navigation to/from EntryList
   - Routes 'entryList' view
   - Handles edit flow for today's tasks

## Edge Cases

- **No entries**: Shows empty state
- **Single entry**: Shows one month with one entry
- **Entry with 1 task**: Shows just that task (no "+more")
- **Entry with exactly 3 tasks**: Shows all 3, no "+more"
- **Entry with >3 tasks**: Shows first 3 + "+X more tasks"
- **Very long task descriptions**: Truncated to 2 lines with ellipsis
- **Same day, different months**: Groups correctly by month
- **Month with 1 entry**: Still collapsible
- **All months collapsed**: Compact view, just month headers
- **Today's entry in history**: Full opacity, editable when viewing detail
- **Past entries**: 75% opacity in detail view, read-only (no edit)
- **Clicking past task**: Does nothing (read-only protection)
- **Clicking today's task**: Opens edit modal

## Performance

- ⚡ **Fast sorting** - O(n log n) where n = total entries
- 📊 **Grouping**: O(n) single pass
- 💾 **No storage needed** - Uses existing entries from props
- 🔄 **No API calls** - Pure client-side rendering
- 📱 **Smooth collapse** - CSS transitions

## Design Decisions

### Why Group by Month?

**Pros:**
- ✅ Natural time chunking
- ✅ Easy to find specific periods
- ✅ Reduces visual clutter
- ✅ Collapsible for long histories

**Alternatives considered:**
- By week: Too granular, many small sections
- Flat list: Overwhelming for long histories
- By project: Loses chronological flow

### Why Show 3 Tasks Max?

**Pros:**
- ✅ Quick preview without overwhelming
- ✅ Keeps cards compact
- ✅ "+more" indicator shows there's detail
- ✅ Encourages clicking for full view

**Cons:**
- ❌ Can't see all tasks at a glance
- ❌ Might hide important tasks

### Why All Months Expanded by Default?

- User likely wants to browse recent entries
- One-click collapse if they want compact view
- Better than forcing clicks to expand

## Integration Testing

### Test Strategy

Integration tests verify the history display logic works correctly:

1. **Entry Sorting** - Newest first order
2. **Month Grouping** - Correct grouping by month
3. **Task Display** - First 3 tasks shown correctly
4. **More Indicator** - Correct count for >3 tasks
5. **Date Formatting** - Weekday and day number correct
6. **Empty State** - Shows when no entries
7. **Collapse/Expand** - Toggle logic works

### Test Scenarios

**Scenario 1: Multiple Entries, Multiple Months**
- Input: 10 entries across 3 months
- Expected: 3 month groups, correct sorting

**Scenario 2: Entry with >3 Tasks**
- Input: Entry with 5 tasks
- Expected: Shows first 3 + "+2 more tasks"

**Scenario 3: Entry with ≤3 Tasks**
- Input: Entry with 2 tasks
- Expected: Shows both tasks, no "+more"

**Scenario 4: Empty History**
- Input: 0 entries
- Expected: Empty state

**Scenario 5: Single Month, Multiple Entries**
- Input: 5 entries all from November
- Expected: 1 month group with 5 entries

**Scenario 6: Month Boundary**
- Input: Entries from Oct 31 and Nov 1
- Expected: 2 separate month groups

**Scenario 7: Date Formatting**
- Input: Entries from various days
- Expected: Correct weekday abbreviations (MON, TUE, etc.)

**Scenario 8: Today vs Past Entry Detection**
- Input: One entry from today, one from yesterday
- Expected: Today entry = editable, past entry = read-only

### Running Integration Tests

```bash
# Run all history tests
npx tsx test-reflection-history.ts

# Run specific scenario
npx tsx test-reflection-history.ts "Multiple Entries"
npx tsx test-reflection-history.ts "Empty History"

# Show help
npx tsx test-reflection-history.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual EntryList sorting and grouping logic  
✅ **No mocks** - Tests complete history display  
✅ **Entry sorting** - Validates newest-first order  
✅ **Month grouping** - Confirms correct month buckets  
✅ **Task truncation** - Tests 3-task limit  
✅ **More indicator** - Validates "+X more" logic  
✅ **Date formatting** - Tests weekday/day number extraction  
✅ **Edge cases** - Empty, single entry, month boundaries

### Test Output Example

```
============================================================
Testing: Multiple Entries, Multiple Months
============================================================

📝 Input:
   10 entries across Nov, Oct, Sep

📊 Grouping Results:
   Month groups created: 3
     "Nov, 2025": 4 entries
     "Oct, 2025": 3 entries
     "Sep, 2025": 3 entries

✅ Result:
   Entries sorted (newest first): YES ✅
   Correct month grouping: YES ✅
   
   Example entry display:
   Date: "MON 12"
   Tasks shown: 3
   More indicator: "+2 more tasks" ✅
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pure sorting and grouping
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **Deterministic** - Same entries = same display

