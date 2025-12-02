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
  - Privacy agreement: "🔒 Your privacy matters. Your personal info stays local. AI insights use secure, anonymous processing. You control everything and can update anytime in settings."
  - Checkbox: "I agree to the privacy terms" (required)
- **User Action**:
  - Enter name and job title (must complete to proceed)
  - Select gender and age range (optional)
  - Check privacy agreement checkbox (must complete to proceed)
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
  - Conversational chat interface
  - AI assistant asks: "What did you work on?"
  - Instructions for input formats:
    - "One per line"
    - "Separate with commas"
    - "Or use 'and'"
  - Chat input field with send button
  - "Skip for now" button in top right
- **User Action**:
  - Type project names in any format:
    - Multiple lines: "NetSave 2\nK12 visual UI"
    - Commas: "NetSave 2, K12 visual UI"
    - And: "NetSave 2 and K12 visual UI"
  - AI parses input and shows extracted project names
  - User confirms with "yes" or re-types to fix
  - Type "done" or "great" when finished
  - OR tap "Skip for now" to create default project later
- **Parsing Logic**:
  - Splits by commas, "and", or newlines
  - Capitalizes first letter of each project
  - Assigns colors automatically from color palette
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
  - Transitions to normal task entry flow (Project Selection)
- **Visual**: Progress bar shows 4/4 complete (all bars filled)

### After Onboarding
- **Onboarding Status**: `localStorage` key `'onboarding'` set to `'true'`
- **Next View**: User enters normal app flow starting with "Project Selection"
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
- **Chat Interface** (Projects screen):
  - User messages: Right-aligned, orange background
  - AI messages: Left-aligned, surface container background
  - Auto-scroll to bottom on new messages

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

// Step 5 → App: Mark Complete and Start Entry
const handleOnboardingStartEntry = () => {
  OnboardingStorage.markOnboardingCompleted()
  setCurrentView('projectSelection')
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

### 4. Project Name Parsing

**File**: `src/components/OnboardingFirstProject.tsx`

```typescript
const parseProjects = (input: string): string[] => {
  // Split by common separators: commas, 'and', newlines
  const projectNames = input
    .split(/,|\band\b|\n/gi)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      // Capitalize first letter
      return p.charAt(0).toUpperCase() + p.slice(1)
    })
  
  return projectNames
}
```

**Regex**: `/,|\band\b|\n/gi`
- Splits by: comma (`,`), word "and" (`\band\b`), newline (`\n`)
- Case-insensitive (`i` flag)
- Global matching (`g` flag)

### 5. Chat Conversation State

**File**: `src/components/OnboardingFirstProject.tsx`

```typescript
const [messages, setMessages] = useState<ChatMessage[]>([...])
const [pendingProjects, setPendingProjects] = useState<Project[]>([])
const [waitingForConfirmation, setWaitingForConfirmation] = useState(false)
const [waitingForProjectConfirmation, setWaitingForProjectConfirmation] = useState(false)
```

**State Machine**:
1. **Initial**: AI asks for projects
2. **User Types**: Parse input, show extracted projects
3. **Waiting for Confirmation**: AI asks "Does this look right?"
4. **User Confirms**:
   - "yes" → Save projects, ask if done
   - Other → Re-parse as correction
5. **Waiting for Done**: AI says "Type 'Done' when ready"
6. **User Types "done"**: Complete onboarding step

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
   - Conversational chat interface for adding projects
   - Props: `userName`, `onComplete` (receives project array), `onSkip`
   - AI-like parsing and confirmation flow

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
- **Changing Mind**: User can type "skip" or "no" at any point in project chat

### Keyboard/Input
- **Enter Key**: Sends message in chat interface
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
| **Projects** | Conversational chat | Not editable in Settings |
| **Learning Preferences** | Multi-select during setup | Can update in Settings |
| **Persistence** | One-time, never shown again | Editable anytime |

---

## Performance

- ⚡ **Instant screen transitions** - No loading states between steps
- 💾 **Profile data local** - Your info saved locally. AI insights use secure API processing
- 🎨 **Smooth animations** - Button presses, progress bars, chat scroll
- 📱 **Mobile-first** - Optimized for touch interactions

---

## Design Decisions

### Why 5 Steps?
- **Progressive Disclosure** - Collect only what's needed for each step
- **Not Overwhelming** - Each screen has one focused task
- **Clear Progress** - Visual progress bar shows how far along user is

### Why Conversational Chat for Projects?
- **Natural Language** - Users can type however they think
- **Flexible Parsing** - Handles multiple formats gracefully
- **Friendly Tone** - Feels like a conversation, not a form
- **Confirmation Loop** - Builds trust by showing what was understood

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
3. **Project Parsing** - Multiple input formats parsed correctly
4. **Validation** - Required fields enforced
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

**Scenario 4: Project Parsing - Commas**
- Input: "NetSave 2, K12 visual UI, Portfolio redesign"
- Expected: 3 projects extracted and capitalized

**Scenario 5: Project Parsing - Multiple Lines**
- Input: "NetSave 2\nK12 visual UI\nPortfolio redesign"
- Expected: 3 projects extracted and capitalized

**Scenario 6: Project Parsing - "and"**
- Input: "NetSave 2 and K12 visual UI and Portfolio redesign"
- Expected: 3 projects extracted and capitalized

**Scenario 7: Skip Projects**
- Input: User taps "Skip for now" on projects screen
- Expected: Default project "General" created

**Scenario 8: Onboarding Completion**
- Input: User completes all steps and taps "Start My First Reflection"
- Expected: 
  - `localStorage.getItem('onboarding')` returns `'true'`
  - App navigates to `projectSelection` view

### Running Integration Tests

```bash
# Run all onboarding tests
npx tsx test-onboarding-flow.ts

# Run specific scenario
npx tsx test-onboarding-flow.ts "Project Parsing - Commas"

# Show help
npx tsx test-onboarding-flow.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual storage and parsing logic  
✅ **No mocks** - Tests complete onboarding flow end-to-end  
✅ **Data persistence** - Validates localStorage operations  
✅ **Project parsing** - Tests all input format variations  
✅ **Validation logic** - Tests required field enforcement  
✅ **Skip functionality** - Tests default project creation  
✅ **Completion status** - Tests onboarding flag is set correctly

### Test Output Example

```
============================================================
Testing: Project Parsing - Commas
============================================================

📝 Scenario: Parse projects from comma-separated input
   Input: "NetSave 2, K12 visual UI, Portfolio redesign"

📊 Parsing Result:
   ✅ Extracted 3 projects
   1. "NetSave 2"
   2. "K12 visual UI"
   3. "Portfolio redesign"

✅ Result:
   Project count: 3 ✅
   First letter capitalized: YES ✅
   No empty strings: YES ✅
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

