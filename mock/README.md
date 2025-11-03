# Mock Data for Testing

This directory contains mock data for testing the Designer Tracker app, particularly the Insights screen features.

## Files

### `mockEntries.ts`
Contains 10 days of mock Entry data (Oct 25 - Nov 3, 2025) with realistic task descriptions and emotions.

**Structure:**
- Each entry has 3 tasks
- Tasks span different emotions (Energized, Drained, Meaningful, Curious)
- Tasks reference mock projects
- Includes proper timestamps

**Example:**
```typescript
{
  id: 'entry-2025-11-03',
  date: '2025-11-03',
  tasks: [
    {
      id: 'task-1103-1',
      projectId: 'proj-emotion-tracker',
      projectName: 'Emotion Tracker App',
      description: 'Implemented smart summary tags feature',
      taskType: 'visual-design',
      emotion: 10, // Energized
      emotions: [10],
      notes: 'Really proud of this feature!'
    },
    // ... more tasks
  ],
  createdAt: new Date('2025-11-03T09:00:00'),
  updatedAt: new Date('2025-11-03T17:00:00')
}
```

### `mockProjects.ts`
Contains 2 mock projects that are referenced in the entries.

**Projects:**
1. **Emotion Tracker App** (`proj-emotion-tracker`) - Red/Pink color
2. **Designer Dashboard** (`proj-designer-dashboard`) - Purple color

### `mockData.ts`
Contains simplified task data for other testing purposes.

**Structure:**
```typescript
{
  date: "2025-11-02",
  projectName: "Emotion Tracker App",
  task: "Styled emotion selection page",
  mood: "Excited"
}
```

## Usage

### Enable/Disable Mock Data

In `src/App.tsx`:
```typescript
// Enable mock data for testing insights
const USE_MOCK_ENTRIES = true  // Set to false to disable
```

### How It Works

When `USE_MOCK_ENTRIES` is `true`:

1. **Entries**: Mock entries are merged with real entries from localStorage
   ```typescript
   setEntries([...mockEntries, ...loadedEntries])
   ```

2. **Projects**: Mock projects are added if they don't already exist
   ```typescript
   const newMockProjects = mockProjects.filter(p => !existingProjectIds.has(p.id))
   finalProjects = [...finalProjects, ...newMockProjects]
   ```

### What Gets Populated

With mock data enabled, the Insights screen will show:

✅ **Emotional Cards** (Energized, Drained, Meaningful, Curious)
- Smart summary tags generated from task descriptions
- e.g., "Team collaboration", "Morning routines", "Social moments"

✅ **Emotional Radar Chart**
- Visual representation of emotion distribution
- Based on tasks across all days

✅ **Weekly Calendar**
- Shows emotion overview for each day
- Color-coded by dominant emotions

✅ **Insights & Analytics**
- Weekly insights generated from patterns
- Most energizing/draining task types
- Emotion trends over time

## Mock Data Coverage

### Emotion Distribution
The mock data includes a balanced mix of emotions:

- **Energized**: 6 tasks
- **Excited**: 7 tasks
- **Meaningful/Proud**: 8 tasks
- **Satisfied**: 3 tasks
- **Neutral**: 2 tasks
- **Curious**: 4 tasks
- **Tired**: 3 tasks
- **Drained**: 2 tasks
- **Frustrated**: 1 task
- **Anxious**: 1 task
- **Sad**: 1 task
- **Annoyed**: 1 task
- **Surprised**: 1 task
- **Nostalgic**: 2 tasks

### Task Types
- `visual-design`: 8 tasks
- `prototyping`: 9 tasks
- `meetings`: 2 tasks
- `documentation`: 3 tasks
- `design-system`: 3 tasks
- `user-research`: 2 tasks
- `user-testing`: 2 tasks
- `wireframing`: 1 task

### Time Span
- **10 days** of data (Oct 25 - Nov 3, 2025)
- **3 tasks per day** = 30 total tasks
- **2 projects** referenced throughout

## Testing Scenarios

### Test Smart Summary Tags
1. Enable mock data
2. Navigate to Insights screen
3. Check emotional cards show summary tags like:
   - "Team collaboration"
   - "Morning routines"
   - "Social moments"
   - "Design refinement"
   - "Technical challenges"

### Test Emotional Patterns
1. View Energized card → Should show positive work patterns
2. View Drained card → Should show challenging task themes
3. View Meaningful card → Should show accomplishment themes
4. View Curious card → Should show learning/exploration themes

### Test Weekly View
1. Switch to "Week" tab
2. Navigate between weeks using arrows
3. Check calendar shows different emotion distributions

### Test Monthly View
1. Switch to "Month" tab
2. Navigate between months
3. Verify data aggregation across weeks

## Customizing Mock Data

### Add More Entries
Edit `mockEntries.ts` and add new Entry objects:

```typescript
{
  id: 'entry-2025-11-04',
  date: '2025-11-04',
  tasks: [
    {
      id: 'task-1104-1',
      projectId: 'proj-your-project',
      projectName: 'Your Project',
      description: 'Your task description',
      taskType: 'visual-design',
      emotion: 10, // Choose emotion number
      emotions: [10],
      notes: 'Your notes'
    }
  ],
  createdAt: new Date('2025-11-04T09:00:00'),
  updatedAt: new Date('2025-11-04T17:00:00')
}
```

### Add More Projects
Edit `mockProjects.ts`:

```typescript
{
  id: 'proj-your-project',
  name: 'Your Project Name',
  color: '#FF6B6B', // Your color
  createdAt: new Date()
}
```

### Change Emotion Mapping
Update the `moodToEmotion` object in `mockEntries.ts` to map mood names to emotion numbers.

## Emotion Reference

```typescript
1:  Happy
2:  Neutral
3:  Excited
4:  Frustrated
5:  Sad
6:  Anxious
8:  Satisfied
9:  Nostalgic
10: Energized
11: Proud
12: Tired
13: Surprised
14: Annoyed
15: Drained
```

## Task Type Reference

```typescript
'wireframing'
'user-research'
'visual-design'
'prototyping'
'user-testing'
'design-system'
'meetings'
'feedback-review'
'documentation'
'other'
```

## Hooks

### `useMockEntries()`
Custom hook to provide mock entries when enabled.

**Location:** `hooks/useMockEntries.ts`

**Usage:**
```typescript
const entries = useMockEntries()
```

**Control:**
```typescript
const USE_MOCK = true  // Set to false to use real data
```

### `useTasks()` (from `useMockTasks`)
Custom hook to provide simplified mock task data.

**Location:** `hooks/useMockTasks.ts`

**Usage:**
```typescript
const tasks = useTasks()
```

## Troubleshooting

### No Insights Showing
✅ **Solution:** Ensure `USE_MOCK_ENTRIES = true` in `src/App.tsx`

### Projects Not Found Error
✅ **Solution:** Mock projects are automatically added when mock entries are enabled

### Wrong Date Range
✅ **Solution:** Mock data covers Oct 25 - Nov 3, 2025. Adjust dates if needed.

### Smart Tags Not Showing
✅ **Solution:** Ensure `generateSummaryTags()` is imported and called in `InsightsScreen.tsx`

### Emotional Cards Empty
✅ **Solution:** Check that tasks have proper emotion numbers (1-15) matching the emotion categories

## Future Enhancements

### AI Integration
- Generate mock data with AI for more realistic patterns
- Create personalized testing scenarios

### Data Generator
- Script to generate random mock data
- Configurable date ranges and patterns

### Import/Export
- Export real data as mock data for testing
- Import mock data from JSON files

## Notes

- Mock data is **merged** with real data, not replaced
- Mock projects won't be saved to localStorage
- Disabling mock data won't delete real data
- Mock data is only active when explicitly enabled

## Changelog

### v1.0.0 (2025-11-03)
- ✅ Initial mock entries (10 days, 30 tasks)
- ✅ Mock projects (2 projects)
- ✅ Integration with App.tsx
- ✅ Smart summary tags support
- ✅ Emotion distribution balance
- ✅ Documentation

