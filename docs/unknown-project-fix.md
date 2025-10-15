# Unknown Project Issue - Deep Investigation & Fix

## Problem Summary

"Unknown Project" was appearing in various places throughout the app when trying to display project names for tasks. This issue occurs when tasks reference project IDs that no longer exist in the database.

## Root Causes

### 1. **Data Integrity Issue - Orphaned Tasks**
When projects are deleted, their tasks remain in the entries but point to non-existent project IDs.

**How it happens:**
- User creates a project (e.g., `project-123`)
- User creates tasks associated with that project
- User deletes the project
- Tasks still reference `project-123`, which no longer exists
- App displays "Unknown Project" as a fallback

### 2. **State vs LocalStorage Mismatch**
Components use `ProjectStorage.getProjectById()` which reads directly from localStorage, but the React state might not be in sync.

### 3. **Race Conditions**
In rare cases, tasks could be saved before projects are fully committed to localStorage, especially during onboarding.

### 4. **Manual LocalStorage Manipulation**
If a user or developer manually clears projects from localStorage but leaves entries intact.

## Where "Unknown Project" Appears

The issue was found in 7 locations across the codebase:

1. **EntryDetail.tsx** - When viewing reflection details
2. **InsightsScreen.tsx** - In "Top Happy Moments", "Top Frustrators", and "Top Struggles" cards
3. **EditTask.tsx** - When editing a task
4. **ReviewReflection.tsx** - When reviewing today's tasks
5. **storage.ts** - When exporting data as CSV

## Implemented Solutions

### ✅ 1. Automatic Data Repair on App Initialization

**File:** `src/App.tsx`

Added automatic detection and repair of orphaned tasks when the app loads:

```typescript
// Check for orphaned tasks (tasks with invalid project IDs)
const projectIds = new Set(finalProjects.map(p => p.id))
const hasOrphanedTasks = loadedEntries.some(entry => 
  entry.tasks.some(task => !projectIds.has(task.projectId))
)

if (hasOrphanedTasks) {
  // Create a recovery project for orphaned tasks
  const recoveryProject: Project = {
    id: 'recovered-project',
    name: 'Recovered Projects',
    color: '#D1D5DB', // Gray
    createdAt: new Date()
  }
  
  // Fix orphaned tasks by reassigning them to recovery project
  // ...
}
```

**Benefits:**
- Automatically fixes the issue without user intervention
- Preserves all task data - nothing is lost
- Creates a "Recovered Projects" folder for orphaned tasks
- Only runs once per session at app initialization

### ✅ 2. Project Deletion Protection

**File:** `src/components/ProjectSelectionImproved.tsx`

Already implemented - prevents deletion of projects that have associated tasks:

```typescript
const handleProjectDelete = (projectId: string, e: React.MouseEvent) => {
  // Check if project has any tasks
  const entries = EntryStorage.loadEntries()
  const hasTasksInProject = entries.some(entry => 
    entry.tasks.some(task => task.projectId === projectId)
  )
  
  if (hasTasksInProject) {
    alert(`Cannot delete "${project.name}" because it has tasks.`)
    return
  }
  // ... proceed with deletion
}
```

**Benefits:**
- Prevents the issue from happening in the first place
- User gets clear feedback about why deletion is blocked
- Maintains referential integrity

### ✅ 3. Entry Validation Before Saving

**File:** `src/utils/storage.ts`

Added validation to check all project IDs exist before saving entries:

```typescript
// Validate that all project IDs in entry exist
validateProjectIds: (entry: Entry): { isValid: boolean; invalidIds: string[] } => {
  const projects = ProjectStorage.loadProjects()
  const validProjectIds = new Set(projects.map(p => p.id))
  const invalidIds: string[] = []
  
  entry.tasks.forEach(task => {
    if (!validProjectIds.has(task.projectId)) {
      invalidIds.push(task.projectId)
    }
  })
  
  return {
    isValid: invalidIds.length === 0,
    invalidIds: Array.from(new Set(invalidIds))
  }
}

// Save single entry (create or update)
saveEntry: (entry: Entry): void => {
  // Validate project IDs before saving
  const validation = EntryStorage.validateProjectIds(entry)
  if (!validation.isValid) {
    throw new Error(`Cannot save entry: Invalid project IDs found`)
  }
  // ... proceed with save
}
```

**Benefits:**
- Prevents new orphaned tasks from being created
- Provides clear error messages in console
- Catches bugs early in development

### ✅ 4. Manual Data Integrity Check Tool

**File:** `src/components/Settings.tsx`

Added a "Check Data Integrity" button in Settings that users can run manually:

```typescript
const handleCheckDataIntegrity = () => {
  // Find orphaned tasks
  const orphanedTasks = []
  entries.forEach(entry => {
    entry.tasks.forEach(task => {
      if (!projectIds.has(task.projectId)) {
        orphanedTasks.push({
          entryDate: entry.date,
          taskDescription: task.description,
          invalidProjectId: task.projectId
        })
      }
    })
  })
  
  if (orphanedTasks.length === 0) {
    alert('✅ Data integrity check passed!')
  } else {
    // Show issues and offer to fix
    // ...
  }
}
```

**Benefits:**
- Gives users control over data repair
- Provides detailed information about issues found
- Optional - user can choose to fix or ignore

## Testing the Fix

### For Existing Users with the Issue:

1. **Refresh the app** - The automatic repair will run on the next load
2. Check console for warnings: `⚠️ Found tasks with invalid project IDs. Cleaning up...`
3. Look for a new project called "Recovered Projects" with orphaned tasks
4. **Or manually run:** Go to Settings → "Check Data Integrity"

### For New Users:

The issue should not occur because:
- Projects can't be deleted if they have tasks
- Entry validation prevents saving tasks with invalid project IDs

### To Test Data Integrity Manually:

1. Open the app
2. Go to Settings
3. Tap "Check Data Integrity"
4. If issues are found, you'll see a detailed report
5. Choose to fix automatically or leave as-is

## Prevention Strategies

### For Users:
1. ✅ Don't manually edit localStorage
2. ✅ Use the "Check Data Integrity" tool periodically
3. ✅ Export backups regularly (Settings → Export My Entries)

### For Developers:
1. ✅ Always use `EntryStorage.saveEntry()` instead of direct localStorage
2. ✅ Validate project existence before creating tasks
3. ✅ Use the validation helper: `EntryStorage.validateProjectIds(entry)`
4. ✅ Test deletion scenarios thoroughly

## Debug Tools

### Console Warnings
The app now logs helpful warnings when issues are detected:
- `⚠️ Found tasks with invalid project IDs. Cleaning up...`
- `Fixing task "brainstorming" with invalid projectId: project-xyz`

### Settings → Check Data Integrity
Manual tool to inspect and repair data integrity issues on demand.

### Debug HTML (For Developers)
Created `/tmp/check_storage.html` - A standalone HTML page that inspects localStorage:
- Lists all projects
- Lists all entries
- Identifies orphaned tasks
- Can be opened in any browser

To use:
```bash
open /tmp/check_storage.html
```

## Migration Notes

### Data Changes:
- Orphaned tasks are automatically moved to "Recovered Projects" (ID: `recovered-project`)
- Original task data is preserved (description, emotions, notes, date)
- Only the `projectId` field is updated

### No Breaking Changes:
- All existing functionality works as before
- No data is deleted
- Users can manually reassign tasks to correct projects later

## Summary

The "Unknown Project" issue has been comprehensively addressed with:
1. ✅ **Automatic repair** on app load
2. ✅ **Prevention** through deletion protection
3. ✅ **Validation** before saving entries
4. ✅ **Manual tools** for user control

The app now maintains referential integrity between tasks and projects, preventing this issue from occurring in the future while automatically fixing any existing problems.

