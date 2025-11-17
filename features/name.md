# Name Input Feature

## What It Does

The "Name" feature on the Settings page allows users to set or update their name, which appears in the daily greeting on the Dashboard (e.g., "Hey Maria"). It provides a simple, inline editing experience.

**Visual Display:**
- Section on Settings page labeled "ACCOUNT"
- Label: "Your Name"
- Editable text field with inline edit mode
- Preview text: "Appears in your daily greeting ✨"
- Card layout

## User-Facing Behavior

1. **User navigates to Settings page**
2. **Scrolls to "ACCOUNT" section**
3. **Sees current name** (or "Tap to set your name" if empty)
4. **Taps name field** to edit
5. **Input field appears** with mobile keyboard
6. **Types new name** on mobile keyboard
7. **Saves by:**
   - Tapping outside field (auto-save)
   - Tapping keyboard "Done" button
8. **Name updated** and saved to localStorage
9. **Appears on Dashboard** in greeting: "Hey [Name]"

**Example:**
```
ACCOUNT

Your Name
[Maria]  ← Click to edit

Appears in your daily greeting ✨
```

**Editing mode:**
```
Your Name
[Mari|a]  ← Cursor active, can type

Press Enter to save, Esc to cancel
```

## Technical Implementation

### Core Logic Location
- **Component**: `src/components/Settings.tsx` (lines 198-233)
- **State**: Component-level state + UserProfileStorage
- **Storage**: `src/utils/storage.ts` → `UserProfileStorage`
- **Data source**: User profile from localStorage

### How It Works (Step-by-Step)

#### 1. Load Existing Name

```typescript
const userProfile = UserProfileStorage.getUserProfile()
const [name, setName] = useState(userProfile?.name || '')
const [isEditingName, setIsEditingName] = useState(false)
```

**Initial state:**
- Loads name from localStorage (if exists)
- Not editing mode by default
- Empty string if no profile

#### 2. Display Mode (Default)

**When not editing:**
```tsx
<div 
  onClick={() => setIsEditingName(true)}
  className="bg-white/[0.06] rounded-md p-2 w-full text-white cursor-pointer hover:bg-white/[0.08]"
>
  {name || 'Tap to set your name'}
</div>
```

**Behavior:**
- Shows current name (or placeholder text)
- Clickable to enter edit mode
- Hover effect (slightly lighter background)
- Looks like input field visually

#### 3. Edit Mode (When Clicked)

**When editing:**
```tsx
<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  onBlur={handleSaveName}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleSaveName()
    if (e.key === 'Escape') {
      setName(userProfile?.name || '')
      setIsEditingName(false)
    }
  }}
  autoFocus
  className="bg-white/[0.06] rounded-md p-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-[#EC5429]"
/>
```

**Features:**
- Auto-focuses on edit (mobile keyboard appears)
- Real-time typing (onChange updates state)
- Saves on blur (tap outside)
- Saves when mobile keyboard "Done" tapped
- Focus ring: Orange (`#EC5429`)

**Note**: Keyboard events (Enter/Escape) are in the code for desktop browser support, but primary use case is mobile touch interaction.

#### 4. Save Name

**Function**: `handleSaveName()`

```typescript
if (name.trim() && userProfile) {
  UserProfileStorage.saveUserProfile({
    ...userProfile,
    name: name.trim()
  })
  setIsEditingName(false)
}
```

**Process:**
1. Trims whitespace from name
2. Validates name is not empty
3. Updates user profile in localStorage
4. Exits edit mode
5. Returns to display mode

**Storage format:**
```typescript
UserProfile {
  id: "user-123",
  name: "Maria",  // Updated!
  jobTitle: "UX Designer",
  gender: "female",
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. Cancel Editing

**On Escape key:**
```typescript
setName(userProfile?.name || '')  // Reset to original
setIsEditingName(false)            // Exit edit mode
```

Discards changes and restores original name.

## Where Name Appears

**Dashboard greeting:**
```tsx
<h1>Hey {userName}</h1>
<p>What did you work on today?</p>
```

**Updates immediately** after saving in Settings!

## Visual Design

### Display Mode
- Background: White 6% opacity
- Padding: 8px
- Border radius: 6px
- Text: White, 14px
- Hover: Slightly lighter background (8% opacity)
- Cursor: Pointer
- Transition: Smooth color change

### Edit Mode
- Background: White 6% opacity
- Padding: 8px
- Border radius: 6px
- Text: White, 14px
- Focus ring: 2px orange (`#EC5429`)
- Outline: None (uses ring instead)
- Auto-focus: Cursor appears immediately

### Label
- Text: "Your Name"
- Font: 14px, white
- Margin bottom: 8px

### Preview Text
- Text: "Appears in your daily greeting ✨"
- Font: 12px, gray
- Sparkles emoji for delight

## Mobile Interactions

**While editing:**
- **Tap outside field**: Saves changes automatically
- **Mobile keyboard "Done" button**: Saves changes
- **Typing**: Updates in real-time
- **No cancel button**: Must tap outside to save (no way to revert on mobile)

## Edge Cases

- **Empty name**: Shows "Tap to set your name" placeholder
- **Only whitespace**: Not saved (trimmed to empty), keeps previous name
- **Very long name**: No character limit (mobile keyboard allows any length)
- **Special characters**: Allowed (emojis, accents, Chinese, etc.)
- **No user profile**: Creates new profile on first save
- **Tap outside while editing**: Saves automatically (blur)
- **Typing then leaving page**: Saves on blur before navigation

## Validation

**Current validation:**
- ✅ Trims whitespace
- ✅ Checks for empty string
- ✅ Requires user profile to exist

**No validation for:**
- ❌ Minimum length
- ❌ Maximum length
- ❌ Special characters
- ❌ Profanity/inappropriate content

**Simple and permissive** - trusts user input.

## Key Files

1. **`src/components/Settings.tsx`** (lines 198-233)
   - Name input UI
   - Edit/display mode toggle
   - Save and cancel logic

2. **`src/utils/storage.ts`**
   - `UserProfileStorage.getUserProfile()` - Load name
   - `UserProfileStorage.saveUserProfile()` - Save name

3. **`src/types/index.ts`**
   - UserProfile interface with `name: string` field

4. **`src/components/Dashboard.tsx`**
   - Displays name in greeting: "Hey {userName}"

## Performance

- ⚡ **Instant loading** - From localStorage
- 💾 **Persistent** - Saved between sessions
- 🔄 **Real-time updates** - Dashboard greeting updates immediately
- ⌨️ **Responsive** - No lag during typing

## Design Decisions

### Why Inline Edit Instead of Modal?

**Pros:**
- ✅ Faster interaction (no modal overlay)
- ✅ Clear what's being edited (in context)
- ✅ Less UI complexity
- ✅ Feels more direct

**Cons:**
- ❌ Less obvious how to save/cancel
- ❌ Could accidentally trigger edit

### Why Auto-Focus on Edit?

- User tapped to edit (clear intent)
- Mobile keyboard appears immediately
- Can start typing right away
- Better UX than requiring second tap

### Why Save on Blur (Tap Outside)?

- Matches mobile input behavior
- User doesn't have to remember to save
- Tapping anywhere saves (intuitive on mobile)
- Mobile keyboard "Done" triggers blur → auto-save

### Why No Cancel Button on Mobile?

- Keeps UI simple and uncluttered
- Most users want to save, not cancel
- Can always edit again if mistake
- Matches mobile design patterns (auto-save)

## Integration Testing

### Test Strategy

Integration tests verify the name save/load logic works correctly:

1. **Save Name** - Name persists to localStorage
2. **Load Name** - Name loads on component mount
3. **Update Name** - Existing name can be changed
4. **Empty Name** - Validation prevents empty save
5. **Whitespace Trimming** - Leading/trailing spaces removed
6. **Cancel Edit** - Escape key reverts changes

### Test Scenarios

**Scenario 1: Save New Name**
- Input: Set name to "Maria"
- Expected: Saved to localStorage, appears on Dashboard

**Scenario 2: Update Existing Name**
- Input: Change "Maria" to "Maria Chen"
- Expected: Updated in storage

**Scenario 3: Empty Name Validation**
- Input: Try to save empty string or only spaces
- Expected: Not saved, keeps previous value

**Scenario 4: Whitespace Trimming**
- Input: "  Maria  " (with spaces)
- Expected: Saved as "Maria" (trimmed)

**Scenario 5: Special Characters**
- Input: "María García" (accents), "李美" (Chinese), "Emma 👩‍🎨" (emoji)
- Expected: All saved correctly


### Running Integration Tests

```bash
# Run all name input tests
npx tsx test-name-input.ts

# Run specific scenario
npx tsx test-name-input.ts "Save New Name"
npx tsx test-name-input.ts "Whitespace Trimming"

# Show help
npx tsx test-name-input.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual save/load logic  
✅ **No mocks** - Tests complete storage integration  
✅ **localStorage** - Validates persistence  
✅ **Trimming logic** - Confirms whitespace handling  
✅ **Validation** - Tests empty name prevention  
✅ **Special characters** - Unicode, emojis, accents  
✅ **Edge cases** - Empty, whitespace-only, very long

### Test Output Example

```
============================================================
Testing: Save New Name
============================================================

📝 Scenario: Set name to "Maria"

💾 Storage Operation:
   Before: name = "" (empty)
   Action: Save "Maria"
   After: name = "Maria"

✅ Result:
   Name saved: YES ✅
   Value in localStorage: "Maria" ✅
   Matches expected: YES ✅

============================================================
Testing: Whitespace Trimming
============================================================

📝 Scenario: Input with leading/trailing spaces

💾 Storage Operation:
   Input: "  Maria Chen  "
   Trimmed: "Maria Chen"
   Saved: "Maria Chen"

✅ Result:
   Whitespace removed: YES ✅
   Saved value: "Maria Chen" ✅
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pure localStorage
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **Deterministic** - Same input = same output

