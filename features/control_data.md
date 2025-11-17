# Export Data Feature

## What It Does

The "Export Data" feature allows users to download a complete backup of all their reflection data as a JSON file. This provides data portability and peace of mind.

**Visual Display:**
- Section on Settings page labeled "DATA CONTROL"
- Clickable card showing:
  - Download icon (gray)
  - "Export Data" title
- Card has hover and tap effects

## User-Facing Behavior

1. **User taps "Export Data" card**
2. **App collects all data** (entries, projects, user profile)
3. **Creates JSON file** with timestamp
4. **Triggers download** to device
5. **Shows success alert**: "Data exported successfully!"

**File format:**
```
designer-tracker-backup-2025-11-12.json
```

**File contents:**
```json
{
  "entries": [...],
  "projects": [...],
  "userProfile": {...},
  "exportedAt": "2025-11-12T19:30:00.000Z"
}
```

## Technical Implementation

### Core Logic Location
- **Component**: `src/components/Settings.tsx` (lines 38-62, 240-256)
- **Entry storage**: `src/utils/storage.ts` → `EntryStorage`
- **Project storage**: `src/utils/storage.ts` → `ProjectStorage`

### How It Works

**Function**: `handleExportData()`

```typescript
const data = {
  entries: EntryStorage.loadEntries(),
  projects: ProjectStorage.loadProjects(),
  userProfile: userProfile,
  exportedAt: new Date().toISOString()
}

const blob = new Blob([JSON.stringify(data, null, 2)], { 
  type: 'application/json' 
})
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `designer-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
a.click()
URL.revokeObjectURL(url)
```

**Process:**
1. Load all data from localStorage
2. Create JavaScript object with all data + timestamp
3. Convert to JSON string (pretty-printed with 2-space indent)
4. Create Blob (binary data)
5. Create download URL
6. Create invisible `<a>` link
7. Set download filename with today's date
8. Programmatically click link (triggers download)
9. Clean up URL object

**Filename format:** `designer-tracker-backup-YYYY-MM-DD.json`

## Visual Design

### Section Header
- Text: "DATA CONTROL"
- Font: 12px, uppercase, gray
- Letter spacing: Wide
- Margin bottom: 12px

### Card Layout
- Background: White with opacity
- Full width button
- Text align: Left
- Layout: Flex row (icon left, text right)
- Gap: 12px between icon and text
- Padding: From Card component
- Active: Scale down (0.98)
- Hover: Lighter background

### Icon
- Download symbol
- Size: 20px
- Container: 40px circle
- Background: White 6% opacity
- Color: Gray (`#CAC4D0`)

### Text
- Title: "Export Data" - 14px, white, medium weight

## Safety Features

- ✅ **Safe operation** - Read-only, doesn't modify data
- ✅ **Non-destructive** - Just creates a copy
- ✅ **No confirmation needed** - Can't cause harm
- ✅ **Can export multiple times** - No limits

## Error Handling

- Try-catch wraps export operation
- On error: Alert "Failed to export data. Please try again."
- Logs error to console for debugging
- User can retry immediately

## Key Files

1. **`src/components/Settings.tsx`** (lines 38-62, 240-256)
   - Export Data implementation
   - UI rendering
   - Download trigger logic

2. **`src/utils/storage.ts`**
   - `EntryStorage.loadEntries()` - Load all entries
   - `ProjectStorage.loadProjects()` - Load projects
   - `UserProfileStorage.getUserProfile()` - Load user profile

## Edge Cases

- **No data**: Exports empty arrays (still creates valid JSON)
- **Large data**: No size limit (browser handles download)
- **Download blocked**: Browser security may block automatic download
- **File name**: Always includes today's date for organization
- **Special characters in data**: JSON properly escapes
- **Failed download**: Error alert shown, can retry

## Performance

- ⚡ **Fast** - Typical export completes in <1 second
- 📊 **Data collection**: O(n) where n = total entries
- 💾 **JSON creation**: Instant for typical data size
- 📁 **File size**: ~100KB for year's worth of data (100 entries)

## Use Cases

**When to export:**
- Regular backups (weekly/monthly recommended)
- Before major app updates
- Moving to new device
- Sharing data with other analysis tools
- Peace of mind (always have a backup)
- End of year archival

## Data Export Format

**JSON structure:**
```json
{
  "entries": [
    {
      "id": "entry-123",
      "date": "2025-11-12",
      "tasks": [...],
      "overallFeeling": 75,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "projects": [
    {
      "id": "project-456",
      "name": "Homepage Redesign",
      "color": "#FFD678",
      "createdAt": "..."
    }
  ],
  "userProfile": {
    "id": "user-789",
    "name": "Maria",
    "jobTitle": "UX Designer",
    ...
  },
  "exportedAt": "2025-11-12T19:30:00.000Z"
}
```

**Use exported data:**
- Import into spreadsheet
- Analyze with custom tools
- Restore on new device (manual import)
- Keep as permanent backup

## Integration Testing

### Test Strategy

Integration tests verify the export data collection and formatting works correctly:

1. **Data Collection** - All entries, projects, user profile collected
2. **JSON Structure** - Valid JSON format with correct fields
3. **Filename Generation** - Correct date-based filename
4. **Data Completeness** - All fields included
5. **Empty Data** - Handles no entries/projects gracefully
6. **Timestamp** - exportedAt field present and valid

### Test Scenarios

**Scenario 1: Export with Full Data**
- Input: 5 entries, 3 projects, user profile
- Expected: JSON with all data, valid structure

**Scenario 2: Export with Empty Data**
- Input: 0 entries, 0 projects
- Expected: JSON with empty arrays, still valid

**Scenario 3: Export with No User Profile**
- Input: Entries and projects but no user profile
- Expected: userProfile field is null or undefined

**Scenario 4: Filename Generation**
- Input: Export on 2025-11-12
- Expected: Filename "designer-tracker-backup-2025-11-12.json"

**Scenario 5: Data Completeness**
- Input: Full entry with overallFeeling, multiple tasks
- Expected: All fields preserved in export

**Scenario 6: Special Characters**
- Input: Tasks with emojis, accents, Chinese characters
- Expected: JSON properly escapes, all data preserved

### Running Integration Tests

```bash
# Run all export data tests
npx tsx test-export-data.ts

# Run specific scenario
npx tsx test-export-data.ts "Export with Full Data"
npx tsx test-export-data.ts "Filename Generation"

# Show help
npx tsx test-export-data.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual data collection logic  
✅ **No mocks** - Tests complete export structure  
✅ **JSON validity** - Validates parseable JSON  
✅ **Data completeness** - Confirms all fields present  
✅ **Filename format** - Tests date-based naming  
✅ **Edge cases** - Empty data, missing profile, special chars

### Test Output Example

```
============================================================
Testing: Export with Full Data
============================================================

📝 Input:
   Entries: 5
   Projects: 3
   User profile: YES

📊 Data Collection:
   Collected entries: 5 ✅
   Collected projects: 3 ✅
   Collected user profile: YES ✅

🔍 JSON Structure:
   Valid JSON: YES ✅
   Has "entries" field: YES ✅
   Has "projects" field: YES ✅
   Has "userProfile" field: YES ✅
   Has "exportedAt" field: YES ✅

✅ Result:
   Data export successful: YES ✅
   All data included: YES ✅
   
   File would be named: designer-tracker-backup-2025-11-12.json
   File size: 15.2 KB
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pure data collection
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ❌ **No actual file download** - Tests logic only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **Deterministic** - Same data = same export

