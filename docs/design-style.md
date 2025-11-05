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
Component: <ButtonSecondary />  (src/components/ButtonSecondary.tsx)
Background: rgba(255,255,255,0.04)
Text: #E6E1E5
Border: 1px solid rgba(255,255,255,0.6)
Border Radius: 12px
Padding: 8px 16px (py-2 px-4)
Font: Inter, 14px, weight 500 (Tailwind `font-medium`)
Hover: #3A3840
Active: scale 0.99, gentle ease-out
```

Use this for neutral or secondary actions such as "Cancel" or "Add another task" so spacing, typography, and interaction states remain consistent.

#### Icon Button (Tertiary)
```css
Component: <ButtonIcon />  (src/components/ButtonIcon.tsx)
Layout: Inline-flex, centered icon
Background: transparent (hover adds white/10 overlay)
Text: #E6E1E5 (override per icon color)
Padding: 8px (p-2)
Border Radius: 8px (Tailwind `rounded`), override with `rounded-full` as needed
Hover: Slight tint, white/10 overlay
Active: scale 0.90, keep motion snappy
Opacity: 80% default, override to 100% for main navigation/back actions
```

Use for icon-only affordances (back button, close, calendar toggle). Add `rounded-full`, custom padding, or color overrides through the `className` prop when a different shape or state is needed.

#### Text Button (Link Style)
```css
Component: <ButtonText />  (src/components/ButtonText.tsx)
Font: Inter, 14px, weight 500
Color: #E6E1E5 (override per context)
Hover: underline
Active: opacity 0.8
Transition: 200ms
Spacing: No default padding — add via `className` if required
```

Use for tertiary actions such as "Skip", "View all", inline prompts, or link-style CTAs.

#### Badge / Tag
```css
Component: <Badge />  (src/components/Badge.tsx)
Shape: Rounded-full, inline-flex
Sizes: sm (px-2.5 py-1 text-11) · md (px-3.5 py-2 text-13)
Default Tone: Neutral surface tint (bg white/4, border white/10, text #E6E1E5)
Accent Tones: accent / positive / warning / info colorways available
Case: Uppercase by default (`uppercase` prop toggles normal case)
```

Use badges for compact metadata chips (e.g. Top Trigger tags, Selected states). Stack variants or override colors through the `tone`, `size`, and `className` props to support contextual accents without redefining styles.

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

---

*This style guide is a living document. Update it as the design system evolves.*

**Last Updated:** November 5, 2025  
**Version:** 1.3