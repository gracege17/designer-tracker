# Language Consistency Updates

## Summary
Updated all UI text across the application for consistent tone, clarity, and language style. The app now has a unified **warm, casual, and supportive** voice throughout.

---

## Card Titles - Dashboard & Insights

### Before:
- "What Gave You a Boost" / "What Sparked Passion"
- "What Drained Your Energy"
- "What Felt Fulfilling"
- "What Lit You Up"

### After (Consistent & Balanced):
- **"What Energized You"**
- **"What Drained You"**
- **"What Felt Meaningful"**
- **"What Excited You"**

**Why:** All now use simple, direct past-tense questions with consistent formality level.

---

## Navigation Labels

### Fixed: "Setting" → "Settings"
Updated in all 5 navigation footers:
- Dashboard.tsx (line 603)
- Settings.tsx (line 390)
- InsightsScreen.tsx (line 523)
- EntryList.tsx (line 202)

**Why:** Matches the Settings page title and standard convention.

---

## Button Text

### Capitalization Standardized to Sentence Case:
- ~~"Save Reflections"~~ → **"Save reflections"**
- ~~"+ Capture the moment"~~ → **"Capture the moment"**

**Why:** Consistent with modern UI best practices (sentence case for actions).

---

## Greeting & Headers

### Dashboard:
- ~~"How was your workday?"~~ → **"How's your workday going?"**

**Why:** More flexible timing (works even if checked in the middle of the day).

### Onboarding:
- ~~"Tell Us About Yourself"~~ → **"A bit about you"**
- ~~"This helps us personalize..."~~ → **"This helps personalize..."**
- ~~"This helps us give you..."~~ → **"This helps give you..."**

**Why:** Removed corporate "Us" language for a more personal feel.

---

## Questions & Instructions

### Task Entry:
- ~~"What task did you work on?"~~ → **"What did you work on?"**

**Why:** Simpler, friendlier, less formal.

### Project Selection:
- ~~"Select one or more projects you worked on"~~ → **"Which projects did you work on today?"**

**Why:** More conversational question format.

### Emotion Selection:
- ~~"Select all that apply"~~ → **"Pick as many as you'd like"**

**Why:** More encouraging and casual.

---

## Empty States

### Review Reflection:
- ~~"No tasks to review"~~ → **"No tasks yet"**
- ~~"Go back and add some tasks..."~~ → **"Start by capturing a moment from your day."**

**Why:** More encouraging and action-oriented.

---

## Descriptive Copy

### Dashboard Card Descriptions:
- ~~"Those moments that light you up — a flow state, a breakthrough, or just pure fun."~~ 
  → **"Moments that energize you — hitting flow, breakthroughs, or pure fun."**

- ~~"The tasks that took your energy — tedious work, confusion, or feeling stuck."~~
  → **"Tasks that drain you — tedious work, confusion, or feeling stuck."**

**Why:** Shorter, clearer, more direct.

### Onboarding Welcome:
- ~~"A calm space to reflect on your daily creative work and discover what truly brings you joy."~~
  → **"A calm space to reflect on your design work and discover what brings you joy."**

- ~~"Quick, gentle reflections that fit into your busy creative life"~~
  → **"Quick, gentle check-ins that fit your busy life"**

**Why:** Removed redundant words ("truly", "creative"); "check-ins" is more specific.

---

## Privacy & Data Language

### Standardized Privacy Message:
- ~~"All your reflections stay on your device."~~
  → **"Everything stays on your device."**

- ~~"We use this info to improve your experience."~~
  → **"Everything stays on your device."**

**Why:** Clear, consistent message about local-only storage.

### Settings Data Control:
- ~~"Export My Entries"~~ → **"Export my data"**
- ~~"Delete All My Data"~~ → **"Delete all my data"**

**Why:** Simpler, clearer ("data" is more understandable than "entries").

### Settings Reminders:
- ~~"Send me a check-in reminder at {time}"~~
  → **"Remind me to check in at {time}"**

**Why:** More natural, active voice.

---

## Confirmation Dialogs

### Project Deletion:
- ~~"Are you sure you want to delete this project? This action cannot be undone."~~
  → **"Delete this project? This can't be undone."**

### Data Deletion:
- ~~"Are you sure you want to delete ALL your data?\n\nThis cannot be undone."~~
  → **"Delete ALL your data?\n\nThis can't be undone."**

**Why:** More direct, uses conversational contractions.

---

## Files Updated

1. ✅ **Dashboard.tsx** - Card titles, greeting, button text, empty states
2. ✅ **TaskEntry.tsx** - Question text
3. ✅ **EmotionSelection.tsx** - Instructions
4. ✅ **OnboardingWelcome.tsx** - Descriptive copy, privacy message
5. ✅ **OnboardingUserInfo.tsx** - Header, removed "Us", privacy message
6. ✅ **ProjectSelection.tsx** - Question text, confirmation dialog
7. ✅ **ReviewReflection.tsx** - Button capitalization, empty states
8. ✅ **Settings.tsx** - Navigation label, button text, reminders, confirmations
9. ✅ **InsightsScreen.tsx** - Navigation label, card titles
10. ✅ **EntryList.tsx** - Navigation label

---

## Voice & Tone Guidelines (For Future Updates)

### ✅ Do:
- Use conversational language ("Pick as many as you'd like")
- Keep it simple and direct
- Use contractions ("can't" instead of "cannot")
- Be encouraging and supportive
- Use sentence case for buttons
- Stay consistent with past-tense questions

### ❌ Don't:
- Use corporate "we/us" language
- Use overly formal phrasing
- Mix formal and casual tones
- Use redundant words ("truly", "really")
- Use title case for buttons (except single-word actions)
- Refer to "Setting" (always "Settings")

---

## Testing Checklist

- [ ] Navigation labels all say "Settings"
- [ ] Card titles are consistent across Dashboard and Insights
- [ ] All buttons use sentence case
- [ ] Privacy messages are consistent
- [ ] Confirmation dialogs use casual language
- [ ] Empty states are encouraging
- [ ] No "Us" language in onboarding

---

*Last Updated: October 17, 2025*
*All linter checks passed ✅*

