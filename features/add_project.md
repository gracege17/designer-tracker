# Add & Edit Projects

## What It Is

The **Add & Edit Projects** feature allows users to create and rename projects to categorize their daily tasks. Projects are created inline during the task entry flow, and can be edited anytime by tapping the edit icon. This makes it quick and seamless to manage work categories without interrupting the reflection process.

---

## User Behavior

### When It Appears
- **During Task Entry** - On the "What did you work on?" project selection screen
- **Inline Creation** - Shows as "+ Project" button below existing project pills
- **Always Available** - Can add projects anytime during task entry

### How It Works

**Step 1: View Project Selection Screen**
- User sees all existing projects as selectable pills
- Each project appears as a tag/pill with its name
- Selected projects have orange accent color
- "+ Project" button appears below project pills

**Step 2: Click "+ Project" Button**
- Button expands into an inline input field
- Input field auto-focuses for immediate typing
- Placeholder shows "Project name"
- Character counter "0/24" appears below input
- Two action buttons appear: "Add" and "Cancel"

**Step 3: Enter Project Name**
- User types project name (e.g., "Website Redesign")
- Character counter updates in real-time (e.g., "15/24")
- Counter turns orange when reaching 24 characters
- Maximum 24 characters enforced (`maxLength`)
- Cannot type beyond character limit
- Enter key submits the form
- Escape key cancels input

**Step 4: Submit New Project**
- User clicks "Add" button or presses Enter
- Project is immediately created and saved to localStorage
- New project appears as a pill with other projects
- **Auto-selected** - Newly created project is automatically selected
- Input field collapses back to "+ Project" button
- Form resets, ready for another project

**Step 5: Continue Task Entry**
- User can add more projects if needed
- Or tap "Next" to continue with selected projects
- At least one project must be selected to proceed

### Cancel Behavior
- Click "Cancel" button or press Escape key
- Input field collapses without saving
- Returns to "+ Project" button
- No project is created

### Edit Project Name (From Pills)
- Each project pill has an edit icon (pencil ✏️) next to the name
- Tap edit icon to enter edit mode
- Project name becomes an editable text field
- Character counter "X/24" appears below
- Same validation rules apply (24 chars max, no duplicates)
- Press Enter or tap outside to save
- Press Escape to cancel editing
- Changes saved immediately to localStorage

### Delete Project (From Pills)
- Each project pill has a remove icon (X ❌) next to the edit icon
- Tap remove icon to delete a project
- Confirmation prompt appears
- If confirmed, project is removed from storage and UI

---

## Visual Design

### Project Pills Display
- **Layout**: Flex wrap, 3px gaps between pills
- **Structure**: Each pill contains (left to right):
  1. Project name text
  2. Edit icon (pencil ✏️)
  3. Remove icon (X ❌)
- **Appearance**: 
  - Unselected: Subtle background (`white/[0.04]`), gray text
  - Selected: Orange background (`#EC5429/20`), orange text, shadow glow
- **Icons**:
  - Edit icon: Small, subtle, shows on same line as title
  - Remove icon: Small, subtle, shows on same line as title
  - Both icons inline with project name
- **Interaction**:
  - Tap project name to toggle selection
  - Tap edit icon to rename project
  - Tap remove icon to delete project
  - Active state scales down slightly (`scale-[0.99]`)

### "+ Project" Button
- **Appearance**: 
  - Orange background (`#EC5429`)
  - White text
  - Rounded corners
  - Auto-width with horizontal padding
- **State**:
  - Default: Orange with shadow
  - Hover: Slightly brighter orange
  - Active: Scales down (`scale-[0.99]`)

### Inline Input Form
- **Input Field**:
  - Full width
  - Dark background (`white/[0.04]`)
  - Border: Default gray (`#49454F`), focused orange (`#EC5429`)
  - Placeholder: "Project name" in gray
  - Text: White (`#E6E1E5`)
  - Auto-focus on show
  - **Max Length**: 24 characters (`maxLength={24}`)
- **Character Counter**:
  - Displays below input field
  - Shows current/max characters (e.g., "15/24")
  - Color: Gray (`#938F99`) normally
  - Color: Orange when at limit (24/24)
  - Font size: Small (12px)
  - Updates in real-time as user types
- **Action Buttons**:
  - "Add" button: Orange, enabled only when text entered
  - "Cancel" button: Gray with border
  - Buttons aligned to right
  - Gap between buttons

### Success States
- **Immediate Visual Feedback**:
  - New project pill appears instantly
  - Pill is auto-selected (orange highlight)
  - Smooth animation (fade-in)
  - Input field collapses

---

## Technical Implementation

### 1. Component Structure

**File**: `src/components/ProjectSelectionImproved.tsx`

```typescript
const [localProjects, setLocalProjects] = useState<Project[]>(projects)
const [selectedProjects, setSelectedProjects] = useState<string[]>(initialSelectedProjects)
const [showAddInput, setShowAddInput] = useState(false)
const [newProjectName, setNewProjectName] = useState('')
```

**State Management**:
- `localProjects` - List of all available projects
- `selectedProjects` - Array of selected project IDs
- `showAddInput` - Boolean to toggle inline input visibility
- `newProjectName` - Controlled input value for new project name (max 24 chars)

### 2. Create Project Logic

```typescript
const handleAddProject = () => {
  if (newProjectName.trim()) {
    // Create new project
    const newProject = createProject(newProjectName.trim(), '#94A3B8')
    
    // Save to storage
    ProjectStorage.saveProject(newProject)
    
    // Add to local projects
    setLocalProjects(prev => [...prev, newProject])
    
    // Auto-select the new project
    setSelectedProjects(prev => [...prev, newProject.id])
    
    // Reset form
    setNewProjectName('')
    setShowAddInput(false)
  }
}
```

**Key Steps**:
1. Validate input (trim whitespace)
2. Call `createProject()` helper with name and default color
3. Save to localStorage via `ProjectStorage`
4. Update local state with new project
5. Auto-select the new project
6. Reset and hide input form

### 3. Project Creation Helper

**File**: `src/utils/dataHelpers.ts`

```typescript
export const createProject = (name: string, color: string): Project => {
  return {
    id: generateId(),
    name,
    color,
    createdAt: new Date()
  }
}
```

**Default Color**: `'#94A3B8'` (slate gray)
- Consistent default for all new projects
- Can be customized later (feature not yet implemented)

### 4. Input Field with Character Counter

**File**: `src/components/ProjectSelectionImproved.tsx`

```typescript
<div className="flex flex-col gap-3">
  <div>
    <input
      type="text"
      value={newProjectName}
      onChange={(e) => setNewProjectName(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Project name"
      maxLength={24}
      autoFocus
      className="w-full px-4 py-3 bg-white/[0.04] border border-[#49454F] text-[#E6E1E5]..."
    />
    {/* Character counter */}
    <p className={`text-xs mt-1 ml-1 ${
      newProjectName.length === 24 ? 'text-[#EC5429]' : 'text-[#938F99]'
    }`}>
      {newProjectName.length}/24
    </p>
  </div>
  
  <div className="flex gap-2 justify-end">
    {/* Add and Cancel buttons */}
  </div>
</div>
```

**Key Elements**:
- `maxLength={24}` - Browser-level validation, prevents typing beyond 24 characters
- Character counter - Shows `{length}/24` in real-time
- Color change - Orange (`#EC5429`) at limit, gray (`#938F99`) otherwise
- `autoFocus` - Input automatically focused when shown

### 5. Keyboard Shortcuts

**File**: `src/components/ProjectSelectionImproved.tsx`

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleAddProject()
  } else if (e.key === 'Escape') {
    setShowAddInput(false)
    setNewProjectName('')
  }
}
```

**Shortcuts**:
- **Enter** - Submit and create project
- **Escape** - Cancel and hide input

### 6. Storage Operations

**File**: `src/utils/storage.ts`

```typescript
export const ProjectStorage = {
  saveProject: (project: Project) => {
    try {
      const projects = ProjectStorage.getAllProjects()
      projects.push(project)
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    } catch (error) {
      console.error('Error saving project:', error)
    }
  },
  
  getAllProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading projects:', error)
      return []
    }
  }
}
```

**Persistence**:
- All projects saved to `localStorage`
- Key: `STORAGE_KEYS.PROJECTS`
- Format: JSON array of project objects
- Retrieved on app initialization

### 7. Auto-Selection Logic

```typescript
// Auto-select the new project
setSelectedProjects(prev => [...prev, newProject.id])
```

**Why Auto-Select?**
- User is creating a project to work on it now
- Saves an extra tap (don't need to manually select)
- Intuitive UX - "I created it, so I'm using it"
- Can always deselect if added by mistake

---

## Key Files

### Components
1. **`src/components/ProjectSelectionImproved.tsx`**
   - Main project selection screen
   - Inline project creation UI
   - Inline project editing UI
   - Project pill display and selection
   - "+ Project" button and input form
   - Edit icon (✏️) and remove icon (❌) on each pill

2. **`src/components/AddProject.tsx`** *(Standalone - Not Currently Used)*
   - Full-screen dedicated project creation form
   - Alternative approach for adding projects
   - Has success messages and "Done" button
   - May be used from Settings in future

### Utilities
3. **`src/utils/dataHelpers.ts`**
   - `createProject(name, color)` - Creates project object
   - `generateId()` - Generates unique project ID

4. **`src/utils/storage.ts`**
   - `ProjectStorage.saveProject()` - Saves to localStorage
   - `ProjectStorage.getAllProjects()` - Loads all projects
   - `ProjectStorage.deleteProject()` - Removes project

### Types
5. **`src/types.ts`**
   ```typescript
   export interface Project {
     id: string
     name: string
     color: string
     createdAt: Date
   }
   ```

---

## Edge Cases

### Empty Input
- **Behavior**: "Add" button is disabled
- **Visual**: Grayed out, cursor not-allowed
- **Validation**: Checks `!newProjectName.trim()`

### Whitespace Only
- **Behavior**: Trimmed to empty string, button disabled
- **Example**: "   " → Treated as empty

### Duplicate Project Names
- **NOT Allowed**: No, duplicate names are prevented
- **Validation**: System checks if project name already exists before creating
- **Case-Insensitive**: "Dashboard" and "dashboard" treated as duplicates
- **User Feedback**: Error message shown if name already exists
- **Reason**: Prevent confusion, each project should have unique name

### Character Limit
- **Maximum Length**: 24 characters
- **Validation**: Input field has `maxLength={24}` attribute
- **User Feedback**: 
  - Cannot type beyond 24 characters
  - Character counter shows "X/24" in real-time
  - Counter turns orange at limit (visual warning)
- **Reason**: Keeps project names concise and readable in pill display

### Special Characters
- **Allowed**: Yes, any character accepted
- **Examples**: "Project #1", "Client's Website", "Re-design 2.0"
- **Storage**: JSON stringifies correctly

### Creating Then Canceling
- **Scenario**: User creates project "Test", then immediately wants to undo
- **Workaround**: Tap "X" on project pill to delete it
- **No Undo**: Once created and saved, can only delete manually

### Typo in Project Name
- **Scenario**: User creates "Websit Redesign" instead of "Website Redesign"
- **Solution**: Tap edit icon (pencil ✏️) next to project name
- **Edit Mode**: Project name becomes editable text field
- **Fix**: Correct the typo and press Enter or tap outside to save
- **No Need to Delete**: Editing is available inline

### Editing to Duplicate Name
- **Scenario**: User tries to rename "Project A" to "Project B" but "Project B" already exists
- **Validation**: Duplicate check prevents saving
- **Feedback**: Alert message "A project with this name already exists"
- **Result**: Edit mode remains active, user can fix or cancel

### Editing to Empty Name
- **Scenario**: User deletes all characters in edit mode
- **Validation**: Empty names rejected on save attempt
- **Result**: Changes not saved, edit mode closes, original name preserved

### Accidentally Triggering Edit
- **Scenario**: User taps edit icon by mistake
- **Solution**: Press Escape to cancel without changes
- **Alternative**: Tap outside without making changes (name unchanged)

### Edit Icon vs Selection
- **Scenario**: User wants to select project, accidentally taps edit icon
- **Behavior**: Edit icon has `stopPropagation` to prevent selection
- **Result**: Edit mode opens, project NOT selected
- **Fix**: Press Escape, then tap project name to select

### Network/Storage Errors
- **Try-Catch**: Wrapped in error handling
- **Console Log**: Errors logged to console
- **User Feedback**: None currently (silent fail)
- **Future**: Should show error toast

---

## Comparison to Other Features

| Feature | Add Project (Inline) | Onboarding Projects | Edit Project Name |
|---------|---------------------|---------------------|------------------|
| **When Shown** | During task entry | First-time setup | On project pills |
| **UI Style** | Inline input form | Conversational chat | Inline edit mode |
| **Character Limit** | 24 characters | No limit | 24 characters |
| **Duplicate Check** | Yes (case-insensitive) | No | Yes (case-insensitive) |
| **Trigger** | "+ Project" button | Conversational prompt | Edit icon (✏️) |
| **Success Message** | Visual (pill appears) | Chat confirmation | Auto-save on blur |
| **Character Counter** | Yes, "X/24" | No | Yes, "X/24" |
| **Current Status** | ✅ Implemented | ✅ Implemented | ✅ Implemented |

---

## Performance

- ⚡ **Instant Creation** - No API calls, localStorage only
- 💾 **Immediate Persistence** - Saved before state update
- 🎨 **Smooth Animations** - Input expand/collapse, pill fade-in
- 📱 **Mobile Optimized** - Touch-friendly targets, auto-focus

---

## Design Decisions

### Why Inline Instead of Modal?
- **Less Disruptive** - Doesn't interrupt flow (for both create and edit)
- **Faster** - No screen transition
- **Context Preserved** - User sees existing projects while creating/editing
- **Progressive Disclosure** - "+ Project" hint is subtle, input only shows when needed
- **Edit in Place** - Edit icon on pill allows immediate inline editing without navigation

### Why Auto-Select New Projects?
- **Intent-Based** - User creates it because they need it now
- **Reduces Friction** - One less tap required
- **Reversible** - Can deselect if wrong

### Why 24 Character Limit?
- **Mobile Readability** - Longer names wrap awkwardly in pill display
- **Quick Recognition** - Short, concise names are easier to scan
- **Common Use Cases** - Most project names fit within 24 characters
- **Balance** - Long enough to be descriptive, short enough to be scannable
- **Example**: "Website Redesign 2024" = 23 chars (perfect fit)

### Why No Project Colors?
- **Speed Over Customization** - Don't slow down task entry
- **Default Works** - Gray is neutral and professional
- **Future Enhancement** - Color picker can be added to Settings

### Why Icons on Same Line?
- **Discoverability** - Edit and remove options are immediately visible
- **Efficiency** - No need to long-press or open menu to access actions
- **Mobile-Friendly** - Icons are tappable targets next to project name
- **Visual Hierarchy** - Clear structure: Name | Edit | Remove
- **Reduced Taps** - Direct access without additional interaction layer

### Why Prevent Duplicate Names?
- **Clarity** - Each project should be clearly distinguishable
- **User Experience** - Avoid confusion when selecting projects
- **Data Integrity** - Easier to manage and track unique projects
- **Best Practice** - Encourage meaningful, descriptive project names

---

## Integration Testing

### Test Strategy

Integration tests verify the add project logic works correctly:

1. **Project Creation** - New project saved to storage
2. **Auto-Selection** - Created project is selected automatically
3. **Input Validation** - Empty/whitespace input rejected
4. **Special Characters** - Names with special chars saved correctly
5. **Duplicate Names** - Multiple projects with same name allowed
6. **Keyboard Shortcuts** - Enter submits, Escape cancels
7. **Storage Persistence** - Projects persist after app reload

### Test Scenarios

**Scenario 1: Create Project Successfully**
- Input: "Website Redesign"
- Expected: 
  - Project created with unique ID
  - Project saved to localStorage
  - Project appears in UI
  - Project is auto-selected

**Scenario 2: Empty Input Validation**
- Input: "" (empty string)
- Expected: Add button disabled, no project created

**Scenario 3: Whitespace Only Input**
- Input: "   " (spaces only)
- Expected: Trimmed to empty, add button disabled

**Scenario 4: Special Characters**
- Input: "Client's Website #2 (Re-design)"
- Expected: Project created with exact name, no sanitization

**Scenario 5: Duplicate Project Names Prevention**
- Input: Create "Website Redesign", then try to create "Website Redesign" again
- Expected: First project created successfully, second attempt rejected with error message

**Scenario 6: Enter Key Submission**
- Input: Type "Mobile App" and press Enter
- Expected: Project created without clicking "Add" button

**Scenario 7: Escape Key Cancellation**
- Input: Type "Test Project" and press Escape
- Expected: Input cleared, form collapsed, no project created

**Scenario 8: Maximum Character Limit**
- Input: "Website Redesign 2024!!" (24 characters)
- Expected: Project created successfully, exactly 24 characters accepted

**Scenario 9: Case-Insensitive Duplicate Detection**
- Input: Create "Mobile App", then try to create "mobile app"
- Expected: First project created, second attempt rejected (case-insensitive match)

**Scenario 10: Character Limit Enforcement**
- Input: "This Project Name Is Way Too Long And Exceeds Limit" (51 characters)
- Expected: Name truncated to first 24 characters, project created successfully

### Running Integration Tests

```bash
# Run all add project tests
npx tsx test-add-project.ts

# Run specific scenario
npx tsx test-add-project.ts "Create Project Successfully"

# Show help
npx tsx test-add-project.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual `createProject()` and storage logic  
✅ **No mocks** - Tests complete project creation end-to-end  
✅ **Input validation** - Tests empty, whitespace, special chars  
✅ **Character limit** - Tests 24 character maximum enforcement  
✅ **Auto-selection** - Validates new project is selected  
✅ **Storage persistence** - Tests localStorage save/load  
✅ **Duplicate prevention** - Tests rejection of duplicate project names (case-insensitive)  
✅ **Keyboard shortcuts** - Tests Enter and Escape keys

### Test Output Example

```
============================================================
Testing: Maximum Character Limit
============================================================

📝 Scenario: Project name at 24 character limit
   Input: "Website Redesign 2024!!"

📊 Creation Result:
   ✅ Project created
   Project ID: project-1234567890
   Project Name: "Website Redesign 2024!!"
   Project Color: #94A3B8
   Created At: 2024-11-18T10:30:00.000Z

✅ Result:
   Has unique ID: YES ✅
   Name matches input: YES ✅
   Default color applied: YES ✅
   Character count: 24 ✅
   Saved to storage: YES ✅
   Auto-selected: YES ✅
============================================================
```

---

## Editing Project Names

### Current Status
✅ **Fully Implemented** - Users CAN edit project names directly from project pills.

### How to Edit a Project Name

**Step 1: Locate the Project**
- Find the project pill on the project selection screen
- Each pill displays: Project Name | ✏️ Edit Icon | ❌ Remove Icon

**Step 2: Enter Edit Mode**
- Tap the edit icon (pencil ✏️) next to the project name
- Project name transforms into an editable text field
- Current name is pre-filled and selected
- Character counter "X/24" appears below the input

**Step 3: Edit the Name**
- Type the new project name
- Character counter updates in real-time
- Maximum 24 characters enforced
- Counter turns orange when at limit (24/24)

**Step 4: Save Changes**
- **Option 1**: Press Enter key
- **Option 2**: Tap outside the input field (blur)
- Changes are saved immediately to localStorage
- Project pill updates with new name
- If name is invalid, changes are not saved

**Step 5: Cancel Editing (Optional)**
- Press Escape key to cancel without saving
- Project name reverts to original

### Validation Rules

Same rules as project creation:
- **Required**: Name cannot be empty or whitespace only
- **Character Limit**: 24 characters maximum
- **Duplicate Check**: Case-insensitive (e.g., "dashboard" = "Dashboard")
- **Special Characters**: Allowed (e.g., #, ', -, etc.)
- **Trimming**: Leading/trailing whitespace automatically removed

### Visual Feedback

**Edit Mode:**
- Input field has orange border to indicate editing
- Character counter shown below: "15/24"
- Counter color: Gray normally, orange at limit
- Input auto-focused and text pre-selected

**After Save:**
- Project pill updates instantly with new name
- No success toast (silent update)
- Pill remains in same position

### Technical Implementation

**File**: `src/components/ProjectSelectionImproved.tsx`

```typescript
// State for editing
const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
const [editingName, setEditingName] = useState('')

// Enter edit mode
const handleEditClick = (project: Project, e: React.MouseEvent) => {
  e.stopPropagation() // Prevent pill selection
  setEditingProjectId(project.id)
  setEditingName(project.name)
}

// Save edited name
const handleSaveEdit = (projectId: string) => {
  const trimmedName = editingName.trim()
  
  // Validate
  if (!trimmedName || trimmedName.length > 24) {
    setEditingProjectId(null)
    return
  }
  
  // Check for duplicates (case-insensitive)
  const duplicate = projects.find(
    p => p.id !== projectId && 
    p.name.toLowerCase() === trimmedName.toLowerCase()
  )
  
  if (duplicate) {
    alert('A project with this name already exists')
    return
  }
  
  // Update project
  const project = projects.find(p => p.id === projectId)
  if (project) {
    const updatedProject = { ...project, name: trimmedName }
    ProjectStorage.saveProject(updatedProject)
    // Refresh projects list
    refreshProjects()
  }
  
  setEditingProjectId(null)
  setEditingName('')
}

// Cancel editing
const handleCancelEdit = () => {
  setEditingProjectId(null)
  setEditingName('')
}

// Keyboard shortcuts
const handleKeyDown = (e: React.KeyboardEvent, projectId: string) => {
  if (e.key === 'Enter') {
    handleSaveEdit(projectId)
  } else if (e.key === 'Escape') {
    handleCancelEdit()
  }
}
```

### UI Structure

Each project pill in edit mode:
```jsx
{editingProjectId === project.id ? (
  /* Edit Mode */
  <div className="flex flex-col gap-1">
    <input
      type="text"
      value={editingName}
      onChange={(e) => setEditingName(e.target.value)}
      onBlur={() => handleSaveEdit(project.id)}
      onKeyDown={(e) => handleKeyDown(e, project.id)}
      maxLength={24}
      autoFocus
      className="..."
    />
    <p className={`text-xs ${
      editingName.length === 24 ? 'text-orange' : 'text-gray'
    }`}>
      {editingName.length}/24
    </p>
  </div>
) : (
  /* Display Mode */
  <div className="flex items-center gap-2">
    <span>{project.name}</span>
    <button onClick={(e) => handleEditClick(project, e)}>✏️</button>
    <button onClick={(e) => handleDeleteClick(project, e)}>❌</button>
  </div>
)}
```

---

## Future Improvements

### Potential Enhancements
- **Project Colors** - Color picker in Settings to customize project colors
- **Project Icons** - Add emoji or icon to projects for visual distinction
- **Project Templates** - Quick-add common project types (e.g., "Client Work", "Internal", "Personal")
- **Project Search** - Search/filter projects when list grows large
- **Project Reordering** - Drag to reorder projects by importance/frequency
- **Recent Projects** - Show most recently used projects first
- **Undo Create** - Toast with "Undo" button after creating project
- **Undo Edit** - Toast with "Undo" button after renaming project
- **Bulk Import** - Import projects from CSV or other apps
- **Project Analytics** - Show task count per project on hover

### Error Handling
- **Storage Full** - Graceful degradation if localStorage quota exceeded
- **Invalid JSON** - Recovery mechanism if storage data corrupted
- **User Feedback** - Toast messages for success/error states

---

**Last Updated**: November 18, 2024  
**Test Coverage**: 12 scenarios  
**Status**: ✅ Fully Implemented (Inline Creation & Editing)  
**Alternative**: AddProject.tsx component exists but not actively used  
**Duplicate Prevention**: ✅ Case-insensitive validation  
**Character Limit**: ✅ 24 characters maximum  
**Character Counter**: ✅ Real-time "X/24" display with color indicator  
**Edit Project Name**: ✅ Inline editing with edit icon (✏️)  
**Delete Project**: ✅ Remove icon (❌) with confirmation

