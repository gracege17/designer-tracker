# Feeling Note Feature: "Why did you feel that way?"

## Overview
The feeling note feature allows users to provide optional context about why they felt the specific emotion(s) they selected in the emoji section. The question dynamically displays the selected emotion labels (e.g., "Why did you feel Happy?" or "Why did you feel Happy and Excited?") instead of the generic "that way", making it more personalized and contextual.

## Behavior

### User Flow
1. **When it appears**: After users select emotions (emojis) for a task in the emotion selection screen, they navigate to the `taskNotes` view which displays a personalized question based on their selected emotions:
   - **Single emotion**: "Why did you feel Happy?"
   - **Two emotions**: "Why did you feel Happy and Excited?"
   - **Three or more emotions**: "Why did you feel Happy, Excited, and Anxious?"
   - **No emotions** (fallback): "Why did you feel that way?"

2. **Input field**:
   - Large textarea (minimum height 140px)
   - Placeholder text: "e.g., The client loved the direction — felt proud!"
   - Maximum length: 1000 characters
   - Optional field (users can skip it)
   - Labeled as "Optional" below the heading

3. **Navigation options**:
   - **"+ Add another task"**: Saves current task with notes (if provided) and returns to task entry for the same project
   - **"Next Project"**: Saves current task with notes and moves to the next selected project
   - **"Done Reflecting"**: Saves current task with notes and proceeds to review screen (shown when it's the last project)

4. **Data persistence**:
   - Notes are trimmed of whitespace before saving
   - Empty notes are stored as `undefined` (not empty strings)
   - Notes are saved as part of the task object in the `notes` field
   - Notes persist through the entire reflection flow and are saved to local storage when the reflection is completed

5. **Display**:
   - Notes appear in the review reflection screen below the task description in italic gray text, wrapped in quotes
   - Notes can be edited later through the EditTask component

## Implementation

### Component Structure
- **Main Component**: `src/components/TaskNotes.tsx`
  - React functional component that manages the notes textarea input
  - Receives `selectedEmotions` prop from parent (`App.tsx`)
  - Dynamically formats the question to display selected emotion labels
  - Handles three navigation actions: add another task, next project, done reflecting

### Data Flow
1. User selects emotion(s) in emotion selection screen → emotions are stored in `selectedEmotions` state
2. User navigates to task notes screen → component receives `selectedEmotions` prop
3. Component formats question dynamically:
   - Maps emotion levels to labels using `EMOTIONS` constant
   - Formats question based on count (1 emotion, 2 emotions, 3+ emotions)
   - Displays personalized question (e.g., "Why did you feel Happy?")
4. User types in textarea → updates local `notes` state
5. User clicks action button → handler trims notes (`notes.trim() || undefined`)
6. Handler passes notes to parent callback (`onAddAnotherTask`, `onNextProject`, or `onDoneReflecting`)
7. Parent (`App.tsx`) creates `TaskReview` object with `notes` field (linked to the selected emotions)
8. Task is added to `collectedTasks` array
9. On final save, tasks are converted to `Task` format and saved via `EntryStorage`

### Type Definitions
- **Task interface** (`src/types/index.ts`): Includes optional `notes?: string` field
- **TaskReview interface**: Used during collection phase, also includes `notes?: string`

### Key Implementation Details
- Notes are optional - empty/whitespace-only input results in `undefined` being stored
- Question dynamically displays selected emotion labels (e.g., "Why did you feel Happy?" instead of generic "that way")
- Emotion labels are retrieved from `EMOTIONS` constant using emotion levels
- Question formatting handles 1, 2, or 3+ emotions with proper grammar (commas and "and")
- When adding another task, notes are temporarily saved in a ref before form reset, then passed to the handler
- Notes are trimmed on save to remove leading/trailing whitespace
- Maximum length validation (1000 chars) enforced at the textarea level
- Notes can be edited later via `EditTask` component which also uses the same placeholder text

### Related Components
- **EditTask** (`src/components/EditTask.tsx`): Allows editing notes after reflection is saved, uses same placeholder text
- **ReviewReflection** (`src/components/ReviewReflection.tsx`): Displays saved notes below task descriptions
- **App.tsx**: Orchestrates the flow and handles saving notes to task objects

