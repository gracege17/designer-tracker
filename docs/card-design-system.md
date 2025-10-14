# Card Design System

## **Asymmetric Corner Card** (Primary Card Style)

A distinctive, minimal card design with a single rounded corner for visual interest and brand personality.

---

## Visual Properties

### **Border Radius**
```css
border-radius: 0 48px 0 0;
```
- Top-left: **0** (square)
- Top-right: **48px** (very rounded)
- Bottom-right: **0** (square)
- Bottom-left: **0** (square)

**Variants:**
- **Large cards:** `0 48px 0 0` (energy cards, quote cards, overview cards)
- **Medium cards:** `0 32px 0 0` (CTA buttons)
- **Small cards:** `0 24px 0 0` (settings cards, input fields)
- **Compact cards:** `0 20px 0 0` (task cards, review cards)
- **Tiny elements:** `0 16px 0 0` (project pills, small buttons)

### **Shadow**
```css
box-shadow: none;
```
- ❌ No shadows
- ✅ Flat, clean design
- Depth created through color contrast instead

### **Border**
```css
border: 2px solid #F6F1EB; /* slate-200 */
```
- Only used on white/light cards
- Not used on colored cards (orange, gray, cyan, etc.)

### **Padding**
```css
padding: 16px; /* p-4 for most cards */
padding: 24px; /* p-6 for larger cards */
```

---

## Typography Scale

### **Title Text** (Card Headers)
```css
font-size: 12px;
font-weight: 400; /* font-normal */
color: #0F172A; /* slate-900 */
```
Example: "What gave you joy", "What sparked your passion"

### **Main Content** (Hero Text)
```css
font-size: 20px;
font-weight: 900; /* font-black */
line-height: tight;
color: #0F172A; /* slate-900 */
```
Example: Task descriptions from reflections

### **Subtitle/Meta** (Supporting Text)
```css
font-size: 12px;
font-weight: 500; /* font-medium */
color: #475569; /* slate-700 */
```
Example: "Based on 5 reflections"

---

## Color System

### **Background Colors**

**Gradient Backgrounds:**

1. **Joy Gradient** 🌅
   ```css
   background: linear-gradient(132deg, #FFE27A 0%, #FF7B54 103.78%);
   ```
   - Direction: 132° (diagonal)
   - Start: `#FFE27A` (Light Yellow)
   - End: `#FF7B54` (Coral Orange)
   - Use case: "What gave you joy" card

2. **Passion Gradient** 🔥
   ```css
   background: linear-gradient(180deg, #FA604D 0%, #F37E58 100%);
   ```
   - Direction: 180° (top to bottom)
   - Start: `#FA604D` (Coral Red)
   - End: `#F37E58` (Soft Orange)
   - Use case: "What sparked your passion" card, "Top Happy", "Top Struggles"

3. **Meaningful Gradient** 💜
   ```css
   background: linear-gradient(132deg, #C7D1FF 0%, #BC7AFF 103.78%);
   ```
   - Direction: 132° (diagonal)
   - Start: `#C7D1FF` (Light Lavender)
   - End: `#BC7AFF` (Bright Purple)
   - Use case: "What felt meaningful" card ONLY
   - Text color: Dark (`#0F172A` slate-900) for better contrast on light gradient

4. **Draining Gradient** 🌫️
   ```css
   background: linear-gradient(132deg, #E3E3E3 0%, #A69FAE 103.78%);
   ```
   - Direction: 132° (diagonal)
   - Start: `#E3E3E3` (Very Light Gray)
   - End: `#A69FAE` (Muted Purple Gray)
   - Use case: "What drained you" card, "Top Struggles"
   - Text color: Dark (`#0F172A` slate-900) for contrast on light gradient

**Additional Gradients (Overview Page):**

5. **Frustrators Gradient** 🌿
   ```css
   background: linear-gradient(180deg, #DAE6E6 0%, #B8C6AD 100%);
   ```
   - Direction: 180° (top to bottom)
   - Start: `#DAE6E6` (Soft Teal)
   - End: `#B8C6AD` (Sage Green)
   - Use case: "Top Frustrators" in Overview page only

**Solid Backgrounds:**
- **White (Default):** `#FFFFFF`
- **Off-White (Inputs):** `#F8FAFC` (slate-50)

### **Gradient Implementation**

**React/Tailwind Inline Style:**
```jsx
style={{ 
  borderRadius: '0 48px 0 0',
  background: 'linear-gradient(132deg, #FFE27A 0%, #FF7B54 103.78%)'
}}
```

**CSS Class:**
```css
.gradient-joy {
  background: linear-gradient(132deg, #FFE27A 0%, #FF7B54 103.78%);
}

.gradient-passion {
  background: linear-gradient(180deg, #FA604D 0%, #F37E58 100%);
}

.gradient-meaningful {
  background: linear-gradient(132deg, #C7D1FF 0%, #BC7AFF 103.78%);
  color: #0F172A; /* Dark text for contrast on light gradient */
}

.gradient-frustrators {
  background: linear-gradient(180deg, #DAE6E6 0%, #B8C6AD 100%);
}

.gradient-draining {
  background: linear-gradient(132deg, #E3E3E3 0%, #A69FAE 103.78%);
  color: #0F172A; /* Dark text for contrast on light gradient */
}
```

### **Text Colors**
- **Primary:** `#0F172A` (slate-900)
- **Secondary:** `#475569` (slate-700)
- **Tertiary:** `#64748B` (slate-600)

---

## Layout Properties

### **Flex Container**
```css
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 16px; /* gap-4 */
align-self: stretch;
width: 100%; /* full width by default */
```

### **Inner Content Wrapper**
```css
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 16px; /* gap-4 */
width: 100%;
```

---

## Interaction States

### **Hover**
```css
/* No hover effects - keep it minimal */
transition: transform 0.3s;
```

### **Active/Pressed**
```css
transform: scale(0.99);
transition: all 0.3s;
```

### **Disabled**
```css
background: #999999;
color: #FFFFFF;
cursor: not-allowed;
opacity: 1; /* keep solid, not faded */
```

---

## Usage Examples

### **React/Tailwind Implementation**

**Insight Card (Homepage):**
```jsx
<div 
  className="p-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
  style={{ 
    borderRadius: '0 48px 0 0',
    background: 'linear-gradient(180deg, #FA604D 0%, #F37E58 100%)'
  }}
>
  <div className="flex flex-col items-start gap-2 w-full">
    <p className="text-[12px] font-normal text-slate-900">What sparked your passion</p>
    <p className="text-[20px] font-black text-slate-900 leading-tight">Task description</p>
  </div>
</div>
```

**CTA Button:**
```jsx
<button
  className="w-full bg-[#000] text-white py-5 font-bold text-[17px] transition-all active:scale-[0.99]"
  style={{ borderRadius: '0 32px 0 0' }}
>
  Button Text
</button>
```

**White Card (Settings/Lists):**
```jsx
<div 
  className="bg-white p-4 border border-slate-200 transition-all" 
  style={{ borderRadius: '0 24px 0 0' }}
>
  Content
</div>
```

---

## Homepage Insight Cards

Four emotional insight cards displayed on the dashboard, pulling from the user's entire reflection history.

### **Card Categories & Colors**

**1. What gave you joy** 🌅
- Background: `linear-gradient(132deg, #FFE27A 0%, #FF7B54 103.78%)`
- Emotions: Happy (😀), Excited (🤩), Energized (⚡)
- Shows random task from joy-related reflections

**2. What sparked your passion** 🔥
- Background: `linear-gradient(180deg, #FA604D 0%, #F37E58 100%)`
- Emotions: Excited (🤩), Energized (⚡), Surprised (😮)
- Shows random task from passion-related reflections

**3. What felt meaningful** 💜
- Background: `linear-gradient(132deg, #C7D1FF 0%, #BC7AFF 103.78%)`
- Text Color: Dark (slate-900) for contrast on light gradient
- Emotions: Relaxed (😌), Nostalgic (🥹), Normal (🙂)
- Shows random task from meaningful reflections

**4. What drained you** 🌫️
- Background: `linear-gradient(132deg, #E3E3E3 0%, #A69FAE 103.78%)`
- Text Color: Dark (slate-900) for contrast on light gradient
- Emotions: Tired (😴), Bored (😐), Anxious (😰), Sad (😢)
- Shows random task from draining reflections

### **Typography Structure**
```jsx
<p className="text-[12px] font-normal text-slate-900">Card title</p>
<p className="text-[20px] font-black text-slate-900 leading-tight">Task description</p>
```

### **Display Logic**
- Cards only appear if user has tasks with matching emotions
- Randomly selects from up to 5 matching tasks to keep content fresh
- Uses entire history (not just current week)
- Maintains consistent spacing with `gap-2` between title and content

---

## Emotion Selection Cards

Interactive cards used for selecting emotional states during task reflection and editing. Features a 4-column grid layout with asymmetric corners and clear visual states.

### **Visual Properties**

```css
/* Grid Layout */
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 12px; /* gap-3 */

/* Card Style */
border-radius: 0 24px 0 0;
padding: 16px 8px; /* py-4 px-2 */
border: 2px solid;
transition: all 0.2s;
```

### **States**

**Unselected State (Default):**
```css
background-color: #FFFFFF;
border-color: #E2E8F0; /* slate-200 */
```
```jsx
className="bg-white border-slate-200"
```

**Hover State:**
```css
border-color: #CBD5E1; /* slate-300 */
```
```jsx
className="hover:border-slate-300"
```

**Selected State:**
```css
background-color: #FFD678;
border-color: #0F172A; /* slate-900 */
transform: scale(1.05);
```
```jsx
className="bg-[#FFD678] border-slate-900 scale-105"
```

**Active/Pressed State:**
```css
transform: scale(0.95);
```
```jsx
className="active:scale-95"
```

### **Typography**

**Emoji:**
```css
font-size: 30px; /* text-3xl */
margin-bottom: 8px;
```

**Label:**
```css
font-size: 11px;
font-weight: 500; /* font-medium */
line-height: 1.25; /* leading-tight */
color: #0F172A; /* slate-900 */
text-align: center;
```

### **12 Emotion Options**

| Level | Emoji | Label | Category |
|-------|-------|-------|----------|
| 1 | 😀 | Happy | Positive |
| 2 | 😌 | Relaxed | Neutral |
| 3 | 🤩 | Excited | Positive |
| 4 | 😠 | Angry | Negative |
| 5 | 😢 | Sad | Negative |
| 6 | 😰 | Anxious | Negative |
| 7 | 😮 | Surprised | Neutral |
| 8 | 😐 | Bored | Neutral |
| 9 | 🥹 | Nostalgic | Neutral |
| 10 | ⚡ | Energized | Positive |
| 11 | 🙂 | Normal | Neutral |
| 12 | 😴 | Tired | Neutral |

### **Usage Context**

Used in:
- Emotion Selection screen (during daily reflection)
- Edit Task screen (when editing existing tasks)
- Multiple selections allowed (Pick as many as you'd like)

### **Implementation Example**

```jsx
<div className="grid grid-cols-4 gap-3">
  {emotions.map((emotion) => {
    const isSelected = selectedEmotions.includes(emotion.level)
    
    return (
      <button
        key={emotion.level}
        onClick={() => handleEmotionToggle(emotion.level)}
        className={`
          flex flex-col items-center justify-center py-4 px-2 
          transition-all duration-200 border-2
          ${isSelected 
            ? 'bg-[#FFD678] border-slate-900 scale-105' 
            : 'bg-white border-slate-200 hover:border-slate-300 active:scale-95'
          }
        `}
        style={{ borderRadius: '0 24px 0 0' }}
      >
        <div className="mb-2 flex items-center justify-center">
          <span className="text-3xl">{emotion.emoji}</span>
        </div>
        <span className="text-[11px] font-medium text-slate-900 text-center leading-tight">
          {emotion.label}
        </span>
      </button>
    )
  })}
</div>
```

### **Design Notes**

- **4 columns** create balanced, scannable layout
- **Yellow selection** (`#FFD678`) provides warm, friendly feedback
- **Dark border** on selected state creates strong contrast
- **Scale effects** provide tactile interaction feedback
- **Asymmetric corner** maintains brand consistency
- **No shadows** keeps design clean and flat
- **Multi-select** allows nuanced emotional expression

---

## Design Principles

### **Why Asymmetric Corner?**
1. **Brand Identity:** Unique, memorable visual signature
2. **Visual Interest:** Breaks the monotony of standard rounded corners
3. **Directional Flow:** The rounded corner creates subtle movement/flow
4. **Modern Feel:** Contemporary, design-forward aesthetic

### **Why No Shadows?**
1. **Minimalism:** Clean, flat design language
2. **Contrast Over Depth:** Use color contrast instead of shadows
3. **Performance:** Lighter rendering, faster scrolling
4. **Print-Ready:** Works well in any medium

### **Why This Typography Scale?**
- **12px titles:** Compact and subtle, regular weight for clean look
- **20px main:** Large enough for impact, not overwhelming
- **12px meta:** Compact but readable supporting information

### **Why Gradients?**
1. **Visual Depth:** Creates dimension without shadows
2. **Emotional Connection:** Warm, vibrant gradients evoke feelings
3. **Brand Personality:** Modern, energetic, design-forward
4. **Subtle Movement:** Gradients add life to flat design
5. **Category Distinction:** Each emotion has unique gradient signature

---

## Quick Reference

| Element | Border Radius | Padding | Shadow | Border |
|---------|--------------|---------|--------|--------|
| Insight Card (Joy/Passion/Meaningful/Draining) | 0 48px 0 0 | 16px | None | None |
| CTA Button | 0 32px 0 0 | 20px v | None | None |
| Emotion Selection Card | 0 24px 0 0 | 16px v, 8px h | None | 2px (slate-200 or slate-900) |
| Settings Card | 0 24px 0 0 | 20px | None | 2px slate-200 |
| Task Card | 0 20px 0 0 | 16px | None | 2px slate-200 |
| Project Pill | 0 16px 0 0 | 12px v, 20px h | None | 2px slate-900 |

---

## CSS Class Name Suggestion

**Tailwind Class Pattern:**
```
.asymmetric-card-lg   → border-radius: 0 48px 0 0
.asymmetric-card-md   → border-radius: 0 32px 0 0
.asymmetric-card      → border-radius: 0 24px 0 0
.asymmetric-card-sm   → border-radius: 0 20px 0 0
.asymmetric-card-xs   → border-radius: 0 16px 0 0
```

**Reusable Component Pattern:**
```jsx
<AsymmetricCard size="lg" color="#FF8C42">
  <AsymmetricCard.Title>Title</AsymmetricCard.Title>
  <AsymmetricCard.Content>Main</AsymmetricCard.Content>
  <AsymmetricCard.Subtitle>Subtitle</AsymmetricCard.Subtitle>
</AsymmetricCard>
```

---

## Interactive Project Pill

A compact, colored pill component for displaying and managing selected projects with inline delete functionality.

### Visual Properties

```css
display: inline-flex;
align-items: center;
justify-content: space-between;
padding: 12px 20px; /* py-3 px-5 */
border: 1px solid rgba(0, 0, 0, 0.6); /* 60% opacity black */
border-radius: 0; /* Square corners */
transition: all 0.2s;
```

### Color System

**Background colors cycle through:**
1. **Orange (Primary):** `#FF8C42`
2. **Gray (Neutral):** `#E0E0E0`  
3. **Cyan (Accent):** `#7DD3FC`

Colors are assigned sequentially based on selection order (index % 3).

### Typography

```css
font-size: 14px;
font-weight: 400; /* font-normal / regular */
color: #0F172A; /* slate-900 */
```

### Interaction States

**Project Name (Click to Deselect):**
- Active: scale(0.99)
- Transition: all 0.2s
- Full width clickable area

**Delete Button:**
- Icon: X (20px, strokeWidth 2.5)
- Opacity: 50% default
- Hover: background black/10
- Active: scale(0.90)
- Padding: 4px (p-1)
- Rounded corners

### Usage

**When to Use:**
- Project selection screens
- Multi-select interfaces
- Tag/category displays with remove functionality
- Active filter indicators

**Examples:**
- Project selection during task entry
- Project management in settings
- Active project filters

### React/Tailwind Implementation

```jsx
{localProjects.map((project, index) => {
  const isSelected = selectedProjects.includes(project.id)
  if (!isSelected) return null
  
  // Cycle through colors
  const colors = ['#FF8C42', '#E0E0E0', '#7DD3FC']
  const bgColor = colors[index % colors.length]

  return (
    <div
      key={project.id}
      className="flex items-center justify-between w-auto inline-flex px-5 py-3 border transition-all"
      style={{ backgroundColor: bgColor, borderColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <button
        onClick={() => handleProjectToggle(project.id)}
        className="flex-1 text-left active:scale-[0.99] transition-all"
      >
        <span className="text-[14px] font-normal text-slate-900">
          {project.name}
        </span>
      </button>
      <button
        onClick={(e) => handleProjectDelete(project.id, e)}
        className="ml-3 p-1 hover:bg-black/10 rounded transition-all active:scale-90"
        title="Delete project"
      >
        <X size={20} className="text-slate-900 opacity-50" strokeWidth={2.5} />
      </button>
    </div>
  )
})}
```

### Design Notes

- **Inline-flex layout** - Pills sit side by side, wrap naturally
- **Square corners** - Matches minimal aesthetic (no border radius)
- **60% opacity border** - Consistent with Secondary Action Button
- **Color cycling** - Automatic color assignment prevents manual color management
- **Dual interaction** - Click name to deselect, click X to delete permanently
- **Delete confirmation** - Always confirm before permanent deletion
- **No shadows** - Flat design consistency
- **Regular weight text** - Clean, readable appearance on colored backgrounds

### Component Hierarchy

**Selected Pills:**
- Colored background (#FF8C42, #E0E0E0, #7DD3FC)
- 60% black border
- Regular weight text (14px)
- Delete button visible

**Unselected Projects:**
- Different UI treatment (not covered in this pattern)
- Typically lighter/disabled appearance

---

## Notes

- Always use inline styles for `borderRadius` to maintain exact pixel values
- Avoid using Tailwind's `rounded-*` classes for this pattern
- Keep text left-aligned (`items-start`) for consistency
- Use `gap-4` (16px) for internal spacing
- All cards are full width (`w-full`) by default
- Only use colored backgrounds for data visualization cards
- White cards get borders, colored cards don't need borders

---

## Primary CTA Button

The main call-to-action button style used throughout the app for primary actions.

### Visual Properties

```css
display: flex;
width: 100%;
padding: 20px 24px; /* py-5 px-6 */
font-weight: 500; /* font-medium */
font-size: 17px;
background-color: #000000;
color: #FFFFFF;
cursor: pointer;
border-radius: 0; /* Square corners */
transition: all 0.2s;
```

### Interaction States

**Default:**
- Background: #000 (pure black)
- Text: White

**Hover:**
- Background: #1e293b (slate-900, slightly lighter black)

**Active/Pressed:**
- Transform: scale(0.98) - slight shrink effect
- Provides tactile feedback

### Usage

**When to Use:**
- Primary action buttons (Continue, Save, Done)
- Form submit buttons when validated
- Main CTAs that move user forward in flow

**Examples:**
- "Continue with 1 project"
- "Save Reflections"
- "Done Reflecting"
- "+ Capture the moment"

### React/Tailwind Implementation

```jsx
<button
  className="w-full py-5 px-6 font-medium text-[17px] transition-all duration-200 bg-[#000] text-white hover:bg-slate-900 active:scale-[0.98]"
>
  Continue with 1 project
</button>
```

### Design Notes

- **Black background (#000)** - Strong, confident primary action
- **Medium weight** - Not too heavy, professional feel
- **Square corners** - Minimal, modern aesthetic
- **Scale feedback** - Subtle press animation (0.98)
- **No shadows** - Flat, clean design
- **17px font** - Comfortable reading size

---

## Disabled CTA Button

A standard disabled state for primary action buttons throughout the app.

### Visual Properties

```css
display: flex;
width: 100%;
padding: 20px 24px; /* py-5 px-6 */
font-weight: 500; /* font-medium */
font-size: 17px;
background-color: #999999;
color: #FFFFFF;
cursor: not-allowed;
border-radius: 0; /* Square corners */
transition: all 0.2s;
```

### Usage

**When to Use:**
- Primary action buttons in disabled state
- Form submit buttons before validation passes
- CTAs when required fields are missing
- Continue buttons before minimum selection met

**Examples:**
- "Select at least one project" - Before project selection
- "Describe your task to continue" - Before task description entered
- Save buttons when no data to save

### React/Tailwind Implementation

```jsx
<button
  disabled
  className="w-full py-5 px-6 font-medium text-[17px] transition-all duration-200 bg-[#999] text-white cursor-not-allowed"
>
  Select at least one project
</button>
```

### Design Notes

- **No hover effects** - Clearly indicates disabled state
- **Gray background (#999)** - Visually distinct from active black (#000)
- **Square corners** - Matches the minimal aesthetic
- **Medium weight** - Not bold, lighter feel
- **No active scale** - Button is non-interactive
- **White text** - Maintains readability even on gray

### Active vs Disabled State

**Active State:**
```jsx
bg-[#000] text-white hover:bg-slate-900 active:scale-[0.98]
```

**Disabled State:**
```jsx
bg-[#999] text-white cursor-not-allowed
```

---

## Secondary Action Button

A lighter, outline-style button for secondary actions that don't require as much visual weight as the primary CTA.

### Visual Properties

```css
display: flex;
width: 100%;
padding: 20px 24px; /* py-5 px-6 */
font-weight: 500; /* font-medium */
font-size: 17px;
background-color: #F5F6EB; /* Same as screen background */
color: #0F172A; /* slate-900 text */
border: 1px solid rgba(0, 0, 0, 0.6); /* 60% opacity black */
border-radius: 0; /* Square corners */
cursor: pointer;
transition: all 0.2s;
```

### Interaction States

**Default:**
- Background: #F5F6EB (cream, matches screen)
- Text: slate-900 (black)
- Border: rgba(0, 0, 0, 0.6)

**Hover:**
- Background: #F8FAFC (slate-50, slightly lighter)

**Active/Pressed:**
- Transform: scale(0.99) - slight shrink effect

### Usage

**When to Use:**
- Secondary actions (Add another task, Skip, Cancel)
- Optional actions that don't move user forward
- Actions that add more content but aren't required
- Buttons paired with a Primary CTA

**Examples:**
- "+ Add another task"
- "Skip for now"
- "Add another moment"

### React/Tailwind Implementation

```jsx
<button
  className="w-full py-5 px-6 text-center bg-[#F5F6EB] border text-slate-900 font-medium text-[17px] hover:bg-slate-50 transition-all active:scale-[0.99]"
  style={{ borderColor: 'rgba(0, 0, 0, 0.6)' }}
>
  + Add another task
</button>
```

### Design Notes

- **Transparent/matching background** - Blends with page, less prominent
- **60% opacity border** - Softer than solid black, subtle outline
- **Medium weight** - Consistent with Primary CTA but lighter action
- **Square corners** - Matches minimal aesthetic
- **Scale feedback** - Same tactile response as primary (0.99)
- **No shadows** - Flat, clean design

### Button Hierarchy

**Primary → Secondary → Disabled:**

1. **Primary CTA:** Black background, most prominent
2. **Secondary Action:** Outline only, less prominent
3. **Disabled:** Gray background, non-interactive

---

*Last Updated: October 2025*
*Style Name: Asymmetric Corner Card*
*Button Styles: Primary CTA Button, Secondary Action Button, Disabled CTA Button*
*Component Styles: Interactive Project Pill*

