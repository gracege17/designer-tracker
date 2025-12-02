# Onboarding Flow

## What It Is

The **Onboarding Flow** is a 5-step guided walkthrough shown to new users when they first open the app. It collects basic user information, learning preferences, and projects to personalize the experience before starting their first daily reflection.

---

## User Behavior

### When It Appears
- **First Launch Only** - Shown automatically when the app detects no previous data
- **One-Time Experience** - Never shown again after completion
- **Skippable Sections** - Users can skip optional steps (auth, projects)

### Flow Steps

**Step 1: Welcome & Authentication** (Optional)
- **Screen**: `OnboardingAuth`
- **What User Sees**: 
  - App logo and welcome message
  - "Track your creative work and discover what brings you joy"
  - 3 sign-in options: Google, Facebook, Email
  - "Skip for now (use as guest)" option
- **User Action**: 
  - Choose sign-in method OR skip to continue as guest
  - All data stored locally regardless of choice
- **Visual**: Progress bar not shown (entry point)

**Step 2: User Profile** (Required)
- **Screen**: `OnboardingUserInfo`
- **What User Sees**:
  - "A bit about you" heading
  - 4 form fields:
    1. Name (required) - Text input, e.g., "Alex Johnson"
    2. Job Title (required) - Text input, e.g., "Product Designer"
    3. Gender (optional) - Dropdown: Male 👨, Female 👩, Non-binary 🧑, Prefer not to say 👤
    4. Age Range (optional) - Dropdown: 18-24, 25-34, 35-44, 45-54, 55-64, 65+
    5. Privacy agreement - Checkbox to agree to terms (required)
- **User Action**:
  - Fill required fields (name, job title, privacy agreement)
  - Optionally select gender and age range
  - Tap "Continue" button
- **Validation**:
  - Continue button disabled until name, job title filled, and privacy agreement checked
  - Error messages shown if required fields empty or agreement not checked
- **Visual**: Progress bar shows 1/4 complete

**Step 3: Learning Preferences** (Required)
- **Screen**: `OnboardingLearningPreference`
- **What User Sees**:
  - "What's your favorite way to learn?" heading
  - 5 learning style options (multi-select):
    - 🧠 Visual
    - 🎧 Listening
    - 📖 Reading
    - 🎥 Watching
    - ✍️ Hands-on
  - Explanation: "We'll tailor insights and resources to match how you absorb information best"
  - "Back" button in top left
- **User Action**:
  - Select one or more learning styles (at least one required)
  - Selected options show "Selected" badge with accent color
  - Tap "Next" button
- **Visual**: Progress bar shows 2/4 complete

**Step 4: Add Projects** (Optional)
- **Screen**: `OnboardingFirstProject`
- **What User Sees**:
  - "What projects are you working on?" heading
  - Inline input form with "+ Add Project" button
  - Added projects appear as pills below
  - "Skip for now" button in top right
  - "Next" button to continue (enabled when at least one project added or skipped)
- **User Action**:
  - Tap "+ Add Project" button
  - Type project name in input field (max 24 characters)
  - Character counter shows "X/24" in real-time
  - Tap "Add" or press Enter to create project
  - Project appears as pill, auto-selected
  - Repeat to add more projects
  - OR tap "Skip for now" to create default project later
- **Input Validation**:
  - Maximum 24 characters enforced
  - Character counter turns orange at limit
  - Empty/whitespace input rejected
  - Duplicate names prevented (case-insensitive)
- **Visual**: Progress bar shows 3/4 complete

**Step 5: Ready to Start** (Informational)
- **Screen**: `OnboardingFirstEntry`
- **What User Sees**:
  - "You're All Set! 🎉" heading
  - "Let's walk through your first daily reflection. It takes just 3 minutes!"
  - 3 preview cards showing what's next:
    1. 📝 Describe Your Task
    2. 😊 Pick Your Emotions
    3. 💬 Add Notes (Optional)
  - Pro tip: "There's no right or wrong way to reflect"
  - Large "Start My First Reflection ✨" button
- **User Action**:
  - Tap "Start My First Reflection" button
  - App marks onboarding as complete
  - Transitions to Dashboard (home page)
- **Visual**: Progress bar shows 4/4 complete (all bars filled)

### After Onboarding
- **Onboarding Status**: `localStorage` key `'onboarding'` set to `'true'`
- **Next View**: User enters normal app flow starting with Dashboard (home page)
- **Data Saved**:
  - User profile (name, job title, gender, age range, learning preferences)
  - Projects (if added)
  - No entries yet (first entry flow begins)

---

## Visual Design

### Progress Indicator
- **Appearance**: 4 horizontal bars at top of screen
- **Where Shown**: Steps 2, 3, 4, and 5
- **Behavior**: 
  - Step 2 (User Profile): 1 bar filled, 3 empty (1/4 complete)
  - Step 3 (Learning Preferences): 2 bars filled, 2 empty (2/4 complete)
  - Step 4 (Add Projects): 3 bars filled, 1 empty (3/4 complete)
  - Step 5 (Ready to Start): All 4 bars filled (4/4 complete)
- **Style**: Filled bars glow with primary color shadow (`rgba(236,84,41,0.35)`), empty bars are `white/10`

### Screen Styling
- **Background**: Dark surface color (`--md-sys-color-surface`)
- **Cards**: Rounded corners with signature "0 24px 0 0" style
- **Buttons**:
  - Primary: Orange gradient with large shadow
  - Secondary: Surface container with subtle border
  - Disabled: Grayed out, cursor not-allowed
- **Inputs**:
  - Text fields with labels and error states
  - Multi-select buttons with accent border when selected
- **Privacy Agreement**:
  - Card with signature rounded corners (`0 24px 0 0`)
  - Privacy text centered with lock emoji and bold emphasis
  - Checkbox centered below text with "I agree to the privacy terms" label
  - Error message appears below if unchecked on form submission
- **Project Input Form** (Projects screen):
  - "+ Add Project" button: Orange background, white text
  - Inline input field: Dark background, orange border when focused
  - Character counter: "X/24" below input, orange at limit
  - Project pills: Display added projects with edit/remove icons

### Animations
- Selected option buttons lift slightly (`translateY(-2px)`)
- Primary button scales down on press (`scale-[0.98]`)
- Chat messages scroll smoothly into view

---

## Technical Implementation

### 1. Onboarding Detection

**File**: `src/App.tsx`

```typescript
// Check if user has completed onboarding
const hasCompletedOnboarding = OnboardingStorage.isOnboardingCompleted()
const initialView: ViewType = hasCompletedOnboarding ? 'dashboard' : 'onboardingAuth'

const [currentView, setCurrentView] = useState<ViewType>(initialView)
```

**Logic**:
- On app load, check `localStorage` for `'onboarding'` key
- If `'onboarding' === 'true'`: Show dashboard (normal app)
- If not set: Show `onboardingAuth` (start onboarding)

### 2. Navigation Between Steps

**File**: `src/App.tsx`

Each onboarding component receives callbacks to progress to next step:

```typescript
// Step 1 → Step 2: Auth to User Info
const handleContinueWithEmail = () => {
  setCurrentView('onboardingUserInfo')
}

// Step 2 → Step 3: User Info to Learning Preferences
const handleUserInfoComplete = (userData: UserProfileData) => {
  UserProfileStorage.saveUserProfile(userData)
  setUserProfile(userData)
  setCurrentView('onboardingLearningPreference')
}

// Step 3 → Step 4: Learning Preferences to Projects
const handleLearningPreferenceComplete = (preferences: string[]) => {
  UserProfileStorage.updateUserProfile({ learningPreferences: preferences })
  setUserProfile(prev => prev ? { ...prev, learningPreferences: preferences } : prev)
  setCurrentView('onboardingFirstProject')
}

// Step 4 → Step 5: Projects to Ready Screen
const handleOnboardingProjectComplete = (projectsData: Array<{ name: string; color: string }>) => {
  const newProjects: Project[] = projectsData.map(projectData => ({
    id: generateId(),
    name: projectData.name,
    color: projectData.color,
    createdAt: new Date()
  }))
  
  newProjects.forEach(project => ProjectStorage.saveProject(project))
  setProjects(newProjects)
  setCurrentView('onboardingFirstEntry')
}

// Step 4 (Skip) → Step 5: Skip Projects
const handleOnboardingSkip = () => {
  const defaultProject = ProjectStorage.createDefaultProject()
  setProjects([defaultProject])
  setCurrentView('onboardingFirstEntry')
}

// Step 5 → App: Mark Complete and Go to Dashboard
const handleOnboardingStartEntry = () => {
  OnboardingStorage.markOnboardingCompleted()
  setCurrentView('dashboard')
}
```

### 3. Data Storage

**File**: `src/utils/storage.ts`

**Onboarding Status**:
```typescript
export const OnboardingStorage = {
  // Check if onboarding is completed
  isOnboardingCompleted: (): boolean => {
    try {
      const completed = localStorage.getItem(STORAGE_KEYS.ONBOARDING)
      return completed === 'true'
    } catch (error) {
      return false
    }
  },

  // Mark onboarding as completed
  markOnboardingCompleted: (): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true')
    } catch (error) {
      console.error('Error marking onboarding as completed:', error)
    }
  },

  // Reset onboarding status (for testing)
  resetOnboarding: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING)
    } catch (error) {
      console.error('Error resetting onboarding:', error)
    }
  }
}
```

**User Profile**:
```typescript
export const UserProfileStorage = {
  saveUserProfile: (profile: UserProfileData) => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
  },
  
  updateUserProfile: (updates: Partial<UserProfileData>) => {
    const current = UserProfileStorage.getUserProfile()
    if (current) {
      UserProfileStorage.saveUserProfile({ ...current, ...updates })
    }
  },
  
  getUserProfile: (): UserProfileData | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
    return data ? JSON.parse(data) : null
  }
}
```

**Projects**:
- Saved to `localStorage` using `ProjectStorage.saveProject(project)`
- If user skips, a default project "General" is created

### 4. Project Creation Logic

**File**: `src/components/OnboardingFirstProject.tsx`

```typescript
const [projects, setProjects] = useState<Array<{ name: string; color: string }>>([])
const [showAddInput, setShowAddInput] = useState(false)
const [newProjectName, setNewProjectName] = useState('')

const handleAddProject = () => {
  if (newProjectName.trim() && newProjectName.length <= 24) {
    // Check for duplicates (case-insensitive)
    const isDuplicate = projects.some(
      p => p.name.toLowerCase() === newProjectName.trim().toLowerCase()
    )
    
    if (!isDuplicate) {
      const newProject = {
        name: newProjectName.trim(),
        color: getNextColor() // Assigns color from palette
      }
      setProjects(prev => [...prev, newProject])
      setNewProjectName('')
      setShowAddInput(false)
    }
  }
}
```

**Key Features**:
- Maximum 24 characters enforced via `maxLength={24}`
- Character counter shows "X/24" in real-time
- Duplicate prevention (case-insensitive)
- Auto-assigns colors from palette

---

## Key Files

### Components
1. **`src/components/OnboardingAuth.tsx`**
   - Welcome screen with sign-in options
   - Props: `onContinueWithGoogle`, `onContinueWithFacebook`, `onContinueWithEmail`

2. **`src/components/OnboardingUserInfo.tsx`**
   - User profile form (name, job title, gender, age)
   - Props: `onComplete` (receives `UserProfileData`)
   - Validation: Name and job title required

3. **`src/components/OnboardingLearningPreference.tsx`**
   - Multi-select learning styles
   - Props: `onComplete` (receives `string[]` of preferences), `onBack`
   - Requires at least one selection

4. **`src/components/OnboardingFirstProject.tsx`**
   - Inline project creation form (same pattern as ProjectSelectionImproved)
   - Props: `userName`, `onComplete` (receives project array), `onSkip`
   - Character counter, validation, and project pills display

5. **`src/components/OnboardingFirstEntry.tsx`**
   - Final "ready to start" screen
   - Props: `onStartEntry`
   - Shows preview of what's next

### Utilities
6. **`src/utils/storage.ts`**
   - `OnboardingStorage` - Manages onboarding completion status
   - `UserProfileStorage` - Saves/loads user profile
   - `ProjectStorage` - Saves projects

7. **`src/App.tsx`**
   - Main routing logic for onboarding flow
   - Determines initial view based on onboarding status
   - Handles navigation between onboarding steps

### Types
8. **`src/components/OnboardingUserInfo.tsx`**
   ```typescript
   export interface UserProfileData {
     name: string
     jobTitle: string
     gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
     ageRange: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+'
     learningPreferences?: string[]
   }
   ```

---

## Edge Cases

### Empty States
- **No Name/Job Title**: Continue button disabled, error messages shown
- **No Learning Preferences**: Next button disabled
- **No Projects**: Creates default "General" project automatically
- **Skip Auth**: Works fine - all data stored locally anyway

### Invalid Input
- **Whitespace Only** (Name/Job Title): Validation error shown
- **Unparseable Project Names**: AI responds "Hmm, I didn't catch any project names. Try..."
- **User Types Random Text**: Chat handles gracefully, prompts to re-type or skip

### User Corrections
- **Re-typing Projects**: AI re-parses new input, shows updated list
- **Changing Mind**: User can tap "Skip for now" or remove added projects

### Keyboard/Input
- **Enter Key**: Submits project name in input field
- **Auto-focus**: Input fields auto-focus on screen load
- **Auto-scroll**: Chat messages scroll to bottom automatically

### Data Persistence
- **Refresh During Onboarding**: Onboarding state resets (starts over)
- **After Completing**: Onboarding never shown again (even after refresh/reopen)
- **Resetting**: Developer can call `OnboardingStorage.resetOnboarding()` to test

---

## Comparison to Other Features

| Feature | Onboarding Flow | Settings Profile |
|---------|----------------|------------------|
| **When Shown** | First launch only | Anytime in Settings |
| **Required** | Name, job title | Optional updates |
| **Projects** | Inline input form with pills | Not editable in Settings |
| **Learning Preferences** | Multi-select during setup | Can update in Settings |
| **Persistence** | One-time, never shown again | Editable anytime |

---

## Performance

- ⚡ **Instant screen transitions** - No loading states between steps
- 💾 **Profile data local** - Your info saved locally. AI insights use secure API processing
- 🎨 **Smooth animations** - Button presses, progress bars, pill transitions
- 📱 **Mobile-first** - Optimized for touch interactions

---

## Design Decisions

### Why 5 Steps?
- **Progressive Disclosure** - Collect only what's needed for each step
- **Not Overwhelming** - Each screen has one focused task
- **Clear Progress** - Visual progress bar shows how far along user is

### Why Inline Input Form for Projects?
- **Consistency** - Same pattern as task entry project selection
- **Character Limit** - 24 characters keeps names concise and readable
- **Immediate Feedback** - Projects appear as pills instantly
- **Familiar UX** - Same interaction pattern users will use throughout app

### Why Optional Steps?
- **Faster Onboarding** - Power users can skip to get started quickly
- **No Friction** - Don't force users to fill everything upfront
- **Editable Later** - Everything can be changed in Settings

### Why Store Locally?
- **Privacy First** - Your profile stays local. AI insights use secure, anonymous processing
- **Works Offline** - App works without internet
- **Instant** - No API delays, no loading spinners

---

## Integration Testing

### Test Strategy

Integration tests verify the onboarding flow logic works correctly:

1. **Onboarding Detection** - First launch vs returning user
2. **Data Persistence** - User profile, learning preferences, projects saved
3. **Project Creation** - Inline input with 24 character limit
4. **Validation** - Required fields enforced, duplicates prevented
5. **Skip Functionality** - Default project created when skipped
6. **Completion Status** - Onboarding marked as complete after Step 5

### Test Scenarios

**Scenario 1: First Launch Detection**
- Input: Empty `localStorage` (no onboarding key)
- Expected: App shows `onboardingAuth` screen

**Scenario 2: Returning User**
- Input: `localStorage` has `'onboarding' === 'true'`
- Expected: App shows `dashboard` screen (skip onboarding)

**Scenario 3: User Profile Validation**
- Input: Empty name or job title
- Expected: Continue button disabled, error messages shown

**Scenario 4: Project Creation - Valid Name**
- Input: "Website Redesign" (16 characters)
- Expected: Project created, appears as pill, character counter shows "16/24"

**Scenario 5: Project Creation - At Character Limit**
- Input: "Website Redesign 2024!!" (24 characters)
- Expected: Project created, counter shows "24/24" in orange

**Scenario 6: Project Creation - Duplicate Prevention**
- Input: Create "Mobile App", then try "mobile app"
- Expected: Second attempt rejected (case-insensitive match)

**Scenario 7: Skip Projects**
- Input: User taps "Skip for now" on projects screen
- Expected: Default project "General" created

**Scenario 8: Onboarding Completion**
- Input: User completes all steps and taps "Start My First Reflection"
- Expected: 
  - `localStorage.getItem('onboarding')` returns `'true'`
  - App navigates to `dashboard` view (home page)

### Running Integration Tests

```bash
# Run all onboarding tests
npx tsx test-onboarding-flow.ts

# Run specific scenario
npx tsx test-onboarding-flow.ts "Project Creation - Valid Name"

# Show help
npx tsx test-onboarding-flow.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual storage and parsing logic  
✅ **No mocks** - Tests complete onboarding flow end-to-end  
✅ **Data persistence** - Validates localStorage operations  
✅ **Project creation** - Tests inline input with character limit and duplicate prevention  
✅ **Validation logic** - Tests required field enforcement  
✅ **Skip functionality** - Tests default project creation  
✅ **Completion status** - Tests onboarding flag is set correctly

### Test Output Example

```
============================================================
Testing: Project Creation - Valid Name
============================================================

📝 Scenario: Create project with inline input
   Input: "Website Redesign"

📊 Creation Result:
   ✅ Project created
   Project Name: "Website Redesign"
   Character Count: 16/24
   Color Assigned: #94A3B8

✅ Result:
   Name saved correctly: YES ✅
   Character limit enforced: YES ✅
   Appears as pill: YES ✅
============================================================
```

---

## Future Improvements

### Potential Enhancements
- **Email Verification** - When user chooses email sign-in
- **Google/Facebook OAuth** - Real authentication integration
- **Profile Pictures** - Upload avatar during user info step
- **Tutorial Overlay** - Interactive tooltips on first entry
- **Skip All** - Fast-track button to skip entire onboarding

### Analytics (Future)
- Track which steps users skip most often
- Measure time spent on each screen
- Identify drop-off points

---

**Last Updated**: November 18, 2024  
**Test Coverage**: 8 scenarios planned  
**Status**: ✅ Fully Implemented

