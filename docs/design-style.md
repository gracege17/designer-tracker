# 🎨 Designer's Life Tracker - Design Style Guide

*A comprehensive guide to maintain visual consistency across the app*

**Theme: Dark Mode Only** - The app exclusively uses a dark theme based on Material Design 3 guidelines for a comfortable, focused experience.

---

## ✨ Design Philosophy

**Mood:** Cozy, calm, minimal  
**Purpose:** Create a safe, non-judgmental space for designers to reflect  
**Feeling:** Like a warm journal that understands you  

### Core Principles
- **Emotional Safety First:** Every design choice should feel welcoming, never intimidating
- **3-Minute Rule:** Visual hierarchy supports quick, effortless interactions
- **Mobile-First:** Thumb-friendly, accessible, and touch-optimized
- **Gentle Feedback:** Soft animations, encouraging messages, warm responses

---

## 🎨 Color Palette

**Note: The app uses dark mode only, following Material Design 3 dark theme guidelines.**

### Primary Colors (Dark Mode)
```css
Background: #1C1B1F  /* Main app background (Material 3 surface) */
Text: #E6E1E5       /* Primary text (Material 3 on-surface) */
CTA: #EC5429        /* Warm orange-red - call-to-action buttons */
CTA Hover: #F76538  /* Lighter orange on hover */
```

### Surface Colors (Material 3 Dark Theme)
```css
Surface Base: #1C1B1F           /* Base surface */
Surface Dim: #141218            /* Darker variant */
Surface Container Low: #1D1B20  /* Low elevation cards */
Surface Container: #211F26      /* Standard cards */
Surface Container High: #2B2930 /* High elevation cards */
Surface Container Highest: #36343B /* Highest elevation */
```

### Text Colors (Material 3 Dark Theme)
```css
Primary Text: #E6E1E5    /* Main text, headings */
Secondary Text: #CAC4D0  /* Supporting text, labels */
Tertiary Text: #938F99   /* Helper text, placeholders */
```

### Border & Outline Colors
```css
Outline: #49454F      /* Borders, dividers */
Outline Variant: #938F99 /* Subtle borders */
```

### Emotion Colors (Expressive & Meaningful)
```css
Energized:  #FF2D55  /* Bright reddish-orange - energetic and friendly ⚡ */
Curious:    #AF52DE  /* Purple - conveys inspiration and exploration 🤔 */
Drained:    #48484A  /* Dark grayish blue - represents low energy or fatigue 😫 */
Meaningful: #F4C95D  /* Soft golden yellow - warm and purposeful 😍 */
Neutral:    #E3E3E3  /* Light gray - neutral state 😐 */
```

### Project Colors (Warm Tones)
```css
#FFD678  /* Warm yellow (matches CTA) */
#FFB3B3  /* Soft coral */
#B3E5D1  /* Sage green */
#E6D3F7  /* Lavender */
#FFE066  /* Light yellow */
#F7D794  /* Peach */
#A8E6CF  /* Mint */
#FFB6C1  /* Light pink */
#DDA0DD  /* Plum */
#F0E68C  /* Khaki */
```

---

## 🔠 Typography

### Font Families
- **Headings:** Playfair Display (serif) - elegant, readable, calming
- **Body Text:** Inter (sans-serif) - clean, modern, accessible
- **UI Elements:** Inter (sans-serif) - consistent with body text

### Font Sizes & Usage

#### Headings (Playfair Display)
```css
Heading XL: 32px/40px, weight 400  /* App title, main welcome */
Heading LG: 28px/36px, weight 400  /* Screen titles */
Heading MD: 24px/32px, weight 400  /* Section headers, card titles */
```

#### Body Text (Inter)
```css
Body LG: 16px/24px, weight 400     /* Important descriptions */
Body MD: 14px/20px, weight 400     /* Standard body text */
Body SM: 12px/16px, weight 400     /* Helper text, labels */
```

### Typography Guidelines
- **Line Height:** Always generous (1.4-1.6x) for readability
- **Font Weight:** Keep light to regular (400-500) for gentle feel
- **Letter Spacing:** Default, no tight spacing
- **Text Color:** Use gentle gray (#5E5E5E) as primary, never pure black

---

## 📐 Spacing & Layout

### Spacing Scale
```css
4px   (1 unit)   /* Micro spacing */
8px   (2 units)  /* Small spacing */
12px  (3 units)  /* Medium spacing */
16px  (4 units)  /* Standard spacing */
24px  (6 units)  /* Large spacing */
32px  (8 units)  /* Extra large spacing */
48px  (12 units) /* Section spacing */
64px  (16 units) /* Major section spacing */
```

### Layout Principles
- **Generous White Space:** Never cramped, always breathing room
- **Consistent Margins:** 24px (6 units) standard screen margins
- **Card Padding:** 24px (6 units) for comfortable content spacing
- **Vertical Rhythm:** 16px base, scale up for section breaks

### Mobile-First Guidelines
- **Touch Targets:** Minimum 44px height for buttons
- **Thumb Zone:** Important actions within easy thumb reach
- **Safe Areas:** Respect device safe areas and notches
- **Scrolling:** Smooth, natural scroll behavior

---

## 🧩 Component Styles

### Buttons

#### Primary Button (CTA)
```css
Component: <ButtonPrimaryCTA />  (src/components/ButtonPrimaryCTA.tsx)
Background: #EC5429  /* base */
Text: #FFFFFF
Hover: #F76538
Active: scale 0.98
Border Radius: 12px (can be overridden per usage)
Padding: 8px 16px (py-2 px-4)
Font: Inter, 14px, weight 500 (Tailwind `font-medium`)
Transition: 200ms ease-out, matches Tailwind utilities
```

Usage always flows through the reusable component so that spacing, font, and interaction states remain consistent across flows.

```tsx
import ButtonPrimaryCTA from '@/components/ButtonPrimaryCTA'

<ButtonPrimaryCTA onClick={handleSubmit} disabled={isSaving}>
  Save Reflection
</ButtonPrimaryCTA>
```

#### Secondary Button
```css
Background: transparent / surface tint
Text: #E6E1E5
Border: 1px solid #49454F
Border Radius: 12px
Padding: 12px 24px
Hover: bg-white/[0.08]
```

#### Outline Button
```css
Background: transparent
Border: 1px solid #938F99
Text: #E6E1E5
Border Radius: 12px
Padding: 10px 22px
Hover: border-[#EC5429] text-[#EC5429]
```

#### Pill Button
```css
Background: #EC5429 (or surface tint)
Text: #FFFFFF
Border Radius: 9999px
Padding: 12px 20px
Shadow: subtle glow (#EC5429/15)
```

### Cards

#### Standard Card
```css
Background: #FFFFFF (white)
Border: 1px solid #F5F5F5 (light gray)
Border Radius: 12px (soft)
Padding: 24px (generous)
Shadow: 0 2px 8px rgba(0,0,0,0.04) (soft)
```

#### Cream Card (for highlights)
```css
Background: #FEFBEA (cream)
Border: 1px solid #F5F5F5 (light gray)
Border Radius: 12px (soft)
Padding: 24px (generous)
Shadow: 0 2px 8px rgba(0,0,0,0.04) (soft)
```

### Input Fields

#### Text Input
```css
Background: #FFFFFF (white)
Border: 2px solid #F5F5F5 (light gray)
Border Radius: 12px (soft)
Padding: 16px (comfortable)
Font: Inter, 14px, weight 400
Text Color: #3E3E3E (dark gray)
Placeholder: #9E9E9E (medium gray)
Focus Border: #FFD678 (warm yellow)
Shadow: 0 2px 8px rgba(0,0,0,0.04)
```

### Emotion Picker

#### Emotion Button
```css
Size: 64px × 64px (large touch target)
Background: #FFFFFF (white)
Border: 2px solid #F5F5F5 (light gray)
Border Radius: 50% (full circle)
Shadow: 0 2px 8px rgba(0,0,0,0.04)
Emoji Size: 36px (large, clear)

Selected State:
Background: #FFD678 (warm yellow)
Border: 2px solid #FFD678 (warm yellow)
Shadow: 0 4px 16px rgba(0,0,0,0.06) (gentle)
```

---

## 🎭 Interaction States

### Button States
```css
Default: Full opacity, soft shadow
Hover: Slight scale (1.02), enhanced shadow
Active: Slight scale (0.98), reduced shadow
Disabled: 50% opacity, no interaction
Loading: Spinner in appropriate color
```

### Animation Guidelines
- **Duration:** 200-300ms for micro-interactions
- **Easing:** ease-out for natural feel
- **Transforms:** Subtle scale (0.98-1.02) for feedback
- **Opacity:** Smooth transitions, never jarring
- **No Bounce:** Keep animations calm and gentle

---

## 📱 Screen Layout Patterns

### Standard Screen Structure
```
SafeAreaView (bg-cream)
├── ScrollView (px-6 py-8)
    ├── Header Section (mb-10)
    │   ├── Title (font-heading text-heading-xl)
    │   └── Subtitle (font-body text-body-lg)
    ├── Content Sections (mb-8)
    │   └── Cards (mb-6)
    └── Footer/Actions
```

### Navigation Patterns
- **Back Button:** Always top-left, gentle arrow
- **Primary Action:** Bottom-right or full-width at bottom
- **Tab Bar:** If needed, use soft icons with warm yellow active state

---

## 🌈 Accessibility Guidelines

### Color Contrast
- **Text on Cream:** #5E5E5E meets WCAG AA (4.8:1)
- **Text on White:** #5E5E5E meets WCAG AA (5.7:1)
- **CTA Button:** #3E3E3E on #FFD678 meets WCAG AA (4.2:1)

### Touch Targets
- **Minimum Size:** 44px × 44px
- **Preferred Size:** 48px × 48px or larger
- **Spacing:** 8px minimum between targets

### Screen Reader Support
- **Semantic HTML:** Use proper heading hierarchy
- **Alt Text:** Descriptive text for all images/icons
- **Labels:** Clear, descriptive labels for all inputs
- **Focus States:** Visible focus indicators

---

## 📝 Content Guidelines

### Tone of Voice
- **Encouraging:** "Great job reflecting today!"
- **Non-judgmental:** "Every feeling is valid"
- **Gentle:** "Take your time" vs "Hurry up"
- **Personal:** "Your journey" vs "The process"

### Microcopy Examples
```
✅ Good: "How are you feeling about today's work?"
❌ Avoid: "Rate your productivity level"

✅ Good: "You're building great habits! 🌱"
❌ Avoid: "Task completed successfully"

✅ Good: "Take a moment to reflect..."
❌ Avoid: "Please fill out this form"
```

### Emoji Usage
- **Consistent:** Use same emojis for same concepts
- **Meaningful:** Each emoji should add emotional context
- **Accessible:** Always pair with text, never emoji-only
- **Gentle:** Avoid intense or negative emojis

---

## 🔧 Implementation Notes

### Tailwind Classes Quick Reference
```css
/* Colors */
bg-cream, bg-white
text-gray-gentle, text-gray-dark
bg-yellow-warm, text-yellow-warm

/* Typography */
font-heading, font-body
text-heading-xl, text-body-md

/* Spacing */
p-6 (24px), m-8 (32px)
space-y-4 (16px vertical)

/* Borders */
rounded-soft (12px)
rounded-pill (24px)

/* Shadows */
shadow-soft, shadow-gentle, shadow-cozy
```

### Component Import Pattern
```typescript
// Always import from types for consistency
import { EmotionLevel, EMOTIONS, DESIGN_COLORS } from '../types';
```

---

## 🎯 Quality Checklist

Before implementing any new screen or component, verify:

- [ ] Uses cream background (#FEFBEA) for main screens
- [ ] Typography follows Playfair Display (headings) + Inter (body)
- [ ] Touch targets are minimum 44px height
- [ ] Generous spacing (24px margins, 16px+ between elements)
- [ ] Soft rounded corners (12px) on all containers
- [ ] Primary actions use <ButtonPrimaryCTA> (bg #EC5429, text-white)
- [ ] Gentle gray (#5E5E5E) for text
- [ ] Soft shadows for depth
- [ ] Encouraging, non-judgmental copy
- [ ] Emoji usage is meaningful and consistent
- [ ] Accessibility contrast ratios met
- [ ] Mobile-first responsive design

---

*This style guide is a living document. Update it as the design system evolves.*

**Last Updated:** November 5, 2025  
**Version:** 1.1
