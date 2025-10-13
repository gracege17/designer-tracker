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
font-size: 14px;
font-weight: 700; /* font-bold */
color: #0F172A; /* slate-900 */
```
Example: "What lifted you up this week?"

### **Main Content** (Hero Text)
```css
font-size: 24px;
font-weight: 900; /* font-black */
line-height: tight;
color: #0F172A; /* slate-900 */
text-transform: capitalize;
```
Example: "Design", "Review design work"

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
- **Orange (Energy Boost):** `#FF8C42`
- **Gray (Energy Drain):** `#E0E0E0`
- **Coral/Red (Happy):** `#FF6B6B`
- **Light Green (Frustrators):** `#D4E5D4`
- **Cyan (Struggles):** `#7DD3FC`
- **White (Default):** `#FFFFFF`
- **Off-White (Inputs):** `#F8FAFC` (slate-50)

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

**Large Card (Energy/Overview):**
```jsx
<div 
  className="bg-[#FF8C42] p-4 transition-all active:scale-[0.99] flex items-start self-stretch w-full" 
  style={{ borderRadius: '0 48px 0 0', gap: '-2px' }}
>
  <div className="flex flex-col items-start gap-4 w-full">
    <p className="text-[14px] font-bold text-slate-900">Title</p>
    <p className="text-[24px] font-black text-slate-900 leading-tight">Main Content</p>
    <p className="text-[12px] text-slate-700 font-medium">Subtitle</p>
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
- **14px titles:** Small enough to be subtle, bold enough to be clear
- **24px main:** Large enough to be hero content, not overwhelming
- **12px meta:** Compact but readable supporting information

---

## Quick Reference

| Element | Border Radius | Padding | Shadow | Border |
|---------|--------------|---------|--------|--------|
| Energy Card | 0 48px 0 0 | 16px | None | None |
| CTA Button | 0 32px 0 0 | 20px v | None | None |
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

