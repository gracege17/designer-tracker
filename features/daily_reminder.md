# Daily Reminder Feature

## What It Does

The "Daily Reminder" feature allows users to set a preferred time for an evening reflection reminder. Currently, this is a **visual UI element** on the Settings page that lets users select their desired reminder time.

**Visual Display:**
- Section on Settings page labeled "DAILY REMINDER"
- Time picker input (HH:MM format)
- Preview text showing selected time in 12-hour format
- Moon emoji (🌙) indicating evening reminder
- Card layout with rounded corners

**Current Status: ⚠️ UI ONLY**
- ✅ UI implemented and functional
- ✅ Time selection works
- ⚠️ Does NOT save the time (state only)
- ⚠️ Does NOT send actual notifications
- ⚠️ Pending implementation of notification system

## User-Facing Behavior

1. **User navigates to Settings page**
2. **Scrolls to "DAILY REMINDER" section**
3. **Clicks time picker input**
4. **Selects desired reminder time** (e.g., 19:00)
5. **Preview updates** showing "7:00 PM 🌙"
6. **Value stored in component state** (not persisted)

**Example:**
```
DAILY REMINDER

Reminder Time
[19:00]  ← Time picker

Evening reflection reminder at 7:00 PM 🌙
```

## Technical Implementation

### Core Logic Location
- **Component**: `src/components/Settings.tsx` (lines 171-195)
- **State**: Component-level state (not persisted)
- **Interface**: `src/types/index.ts` → `AppSettings` (defined but not used)

### How It Works (Step-by-Step)

#### 1. Component State

```typescript
const [reminderTime, setReminderTime] = useState('19:00')
```

**Initial value**: '19:00' (7:00 PM)  
**Not saved**: Resets to default on page refresh

#### 2. Time Picker Input

```tsx
<input
  type="time"
  value={reminderTime}
  onChange={(e) => setReminderTime(e.target.value)}
  className="bg-white/[0.06] rounded-md p-2 w-full text-white"
/>
```

**Input type**: Native HTML5 time picker  
**Format**: 24-hour (HH:MM)  
**Updates**: On user selection

#### 3. Time Display Formatting

**Converts 24-hour to 12-hour format for display:**
```typescript
reminderTime.replace(/^(\d{2}):(\d{2})$/, (_, h, m) => {
  const hour = parseInt(h)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${m} ${period}`
})
```

**Examples:**
- `19:00` → "7:00 PM"
- `07:30` → "7:30 AM"
- `12:00` → "12:00 PM"
- `00:00` → "12:00 AM"

#### 4. Display Preview Text

```tsx
<p className="text-xs text-[#938F99]">
  Evening reflection reminder at {formatted time} 🌙
</p>
```

Shows user-friendly confirmation of selected time

## Current Implementation Status

### What's Implemented:

✅ **UI Component** - Time picker and display  
✅ **State management** - Stores selected time in component state  
✅ **Time formatting** - Converts 24h → 12h for display  
✅ **Visual design** - Card, labels, preview text  

### What's NOT Implemented:

❌ **Persistence** - Time not saved to localStorage  
❌ **AppSettings usage** - Interface defined but not connected  
❌ **Actual notifications** - No browser notifications sent  
❌ **Service worker** - No background notification system  
❌ **Reminder toggle** - No enable/disable switch  

### Defined Interface (Not Used Yet):

```typescript
// In src/types/index.ts
export interface AppSettings {
  dailyReminderEnabled: boolean  // Not implemented
  reminderTime?: string          // Not saved
  theme: 'light' | 'dark' | 'auto'
  accessibilityMode: boolean
  dataExportEnabled: boolean
}
```

## Visual Design

### Section Header
- Text: "DAILY REMINDER"
- Font: 12px, uppercase, gray
- Letter spacing: Wide
- Margin bottom: 12px

### Card Container
- Background: White with opacity
- Padding: Card component default
- Border radius: From Card component
- Spacing: 12px between elements

### Time Input
- Type: Native time picker
- Background: White 6% opacity
- Padding: 8px
- Border radius: 6px
- Text color: White
- Focus: Orange ring (`#EC5429`)

### Preview Text
- Font: 12px, gray
- Format: "Evening reflection reminder at X:XX PM 🌙"
- Moon emoji: Indicates evening/nighttime

## Future Implementation Plan

### To Make It Functional:

**Step 1: Save Settings**
```typescript
// Save to localStorage
const settings: AppSettings = {
  dailyReminderEnabled: true,
  reminderTime: '19:00',
  // ... other settings
}
localStorage.setItem('settings', JSON.stringify(settings))
```

**Step 2: Request Notification Permission**
```typescript
if ('Notification' in window) {
  Notification.requestPermission()
}
```

**Step 3: Schedule Notification**
```typescript
// Calculate time until reminder
// Set timeout or use service worker
// Show browser notification at scheduled time
```

**Step 4: Add Enable/Disable Toggle**
```typescript
<Switch 
  checked={dailyReminderEnabled}
  onChange={setDailyReminderEnabled}
/>
```

**Step 5: Notification Content**
```
Title: "Time for your daily reflection 🌙"
Body: "How was your design day? Log your tasks and emotions."
Actions: ["Open App", "Dismiss"]
Frequency: Once per day at selected time
```

**Important**: Only one notification per day, sent at the user's chosen time. No spam, just a gentle daily reminder.

## Key Files

1. **`src/components/Settings.tsx`** (lines 171-195)
   - Daily Reminder UI
   - Time picker input
   - Time formatting display

2. **`src/types/index.ts`** (lines 147-153)
   - AppSettings interface (defined but not used)
   - dailyReminderEnabled, reminderTime fields

3. **`src/utils/storage.ts`**
   - Storage utilities (could be used for saving settings)

## Edge Cases (Current UI)

- **Invalid time**: Browser validates (native time picker)
- **No time selected**: Defaults to 19:00 (7:00 PM)
- **Page refresh**: Resets to default (not saved)
- **Midnight (00:00)**: Displays as "12:00 AM" ✅
- **Noon (12:00)**: Displays as "12:00 PM" ✅

## Design Decisions

### Why Default to 19:00 (7:00 PM)?

- Standard work day end time for designers
- Evening allows reflection on full day
- Not too late (still productive time)
- Matches "evening reflection" concept

### Why Show Preview Text?

- Confirms selected time in familiar format
- 12-hour format easier to understand than 24-hour
- Moon emoji reinforces evening/nighttime context
- Provides immediate feedback

### Why Not Implemented Fully Yet?

**Technical complexity:**
- Requires service worker for background notifications
- Browser permission handling
- Cross-platform notification differences
- Time zone considerations
- Notification scheduling/persistence

**Current value:**
- Placeholder for future feature
- Lets users set preference even if not functional yet
- Good UX to have the UI ready

## Performance

- ⚡ **Instant** - Just component state
- 💾 **No storage** - Not persisted (yet)
- 🔄 **No background tasks** - Passive UI only

## Note

**This feature is currently visual-only.** The UI exists and works, but:
- Time selection is not saved
- No actual notifications are sent
- Requires future implementation to be functional

Users can set their preferred time, but it won't trigger any reminders until the notification system is implemented.

## Future: Native iOS App

**Vision**: In the future, I would love to add notifications to a native iOS app version.

**Reminder Frequency:**
- 🔔 **One reminder per day** at the user's chosen time
- Evening reflection prompt (e.g., 7:00 PM)
- Encourages daily logging habit
- Not intrusive - just one gentle nudge

**Why Native iOS:**
- ✅ **Reliable notifications** - Background push notifications that actually work
- ✅ **Better UX** - Native iOS notification UI and sound
- ✅ **Schedule persistence** - Notifications sent even when app is closed
- ✅ **iOS integration** - Works with Focus modes, notification center
- ✅ **User control** - Proper iOS notification settings

**Potential Implementation:**
- Build native iOS app with React Native or SwiftUI
- Reuse existing React components/logic where possible
- Add native notification scheduling
- Submit to App Store
- Users get reliable daily reminders! 🔔

**Current web app limitations:**
- Browser notifications on iOS Safari are very limited
- Not reliable for scheduled reminders
- Better suited for desktop/Android browsers

The time picker UI is ready and waiting for when native iOS notifications become a reality! 🌙📱

## Integration Testing

### Test Strategy

Integration tests verify the time formatting logic works correctly:

1. **24h to 12h Conversion** - Correct AM/PM formatting
2. **Edge Cases** - Midnight (00:00), noon (12:00)
3. **Morning Times** - 1:00 AM to 11:59 AM
4. **Evening Times** - 1:00 PM to 11:59 PM
5. **Format Validation** - Proper display format

### Test Scenarios

**Scenario 1: Morning Times**
- Input: 07:00, 08:30, 09:15
- Expected: "7:00 AM", "8:30 AM", "9:15 AM"

**Scenario 2: Evening Times**
- Input: 19:00, 20:30, 22:45
- Expected: "7:00 PM", "8:30 PM", "10:45 PM"

**Scenario 3: Midnight Edge Case**
- Input: 00:00, 00:30
- Expected: "12:00 AM", "12:30 AM"

**Scenario 4: Noon Edge Case**
- Input: 12:00, 12:30
- Expected: "12:00 PM", "12:30 PM"

**Scenario 5: Before Noon**
- Input: 11:00, 11:59
- Expected: "11:00 AM", "11:59 AM"

**Scenario 6: After Midnight**
- Input: 01:00, 01:30
- Expected: "1:00 AM", "1:30 AM"

### Running Integration Tests

```bash
# Run all reminder tests
npx tsx test-daily-reminder.ts

# Run specific scenario
npx tsx test-daily-reminder.ts "Evening Times"
npx tsx test-daily-reminder.ts "Midnight Edge Case"

# Show help
npx tsx test-daily-reminder.ts --help
```

### What Gets Tested

✅ **Real production code** - Uses actual time formatting logic  
✅ **No mocks** - Tests complete conversion function  
✅ **AM/PM detection** - Validates correct period  
✅ **Hour conversion** - Confirms 24h → 12h math  
✅ **Edge cases** - Midnight, noon, boundaries  
✅ **Format consistency** - Proper "H:MM AM/PM" format

### Test Output Example

```
============================================================
Testing: Evening Times
============================================================

📝 Scenario: Evening times (13:00-23:59)

🕐 Time Conversions:
   19:00 → "7:00 PM" ✅
   20:30 → "8:30 PM" ✅
   22:45 → "10:45 PM" ✅

✅ Result:
   All conversions correct: YES ✅
   All show PM: YES ✅

============================================================
Testing: Midnight Edge Case
============================================================

📝 Scenario: Midnight hour (00:00-00:59)

🕐 Time Conversions:
   00:00 → "12:00 AM" ✅
   00:30 → "12:30 AM" ✅

✅ Result:
   Midnight shows as 12: YES ✅
   Shows AM: YES ✅
```

### No External Dependencies

Like other feature tests:
- ❌ **No API calls** - Pure time formatting
- ❌ **No API keys** - Works immediately
- ❌ **No network** - Client-side only
- ✅ **Instant execution** - Runs in milliseconds
- ✅ **100% deterministic** - Same input = same output

