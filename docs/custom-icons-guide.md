# Custom Icons & Illustrations Guide

## 🎨 Adding Your Own Icons

### Step 1: Prepare Your Icons

Export your icons from Figma/Illustrator/Sketch as **SVG** files with these settings:
- Format: SVG
- Size: 24x24px (or 26x26px for nav icons)
- Stroke width: 2px
- Color: Use `currentColor` for flexible theming

### Step 2: Upload to Project

Drop your SVG files into these folders:
```
/public/icons/          - Navigation & UI icons
/public/illustrations/  - Artwork & decorative graphics
/public/images/        - Photos & backgrounds
```

### Step 3: Use in Components

#### Method A: Direct Image Tag (Easiest)
```jsx
<img 
  src="/icons/home.svg" 
  alt="Home" 
  className="w-6 h-6" 
/>
```

#### Method B: React Component (More Control)
Create `/src/components/icons/CustomIcon.tsx`:
```jsx
interface IconProps {
  size?: number
  className?: string
}

export const CustomHomeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "" 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    className={className}
  >
    <path 
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
```

Then use it:
```jsx
import { CustomHomeIcon } from './icons/CustomIcon'
<CustomHomeIcon size={26} className="text-slate-900" />
```

---

## 🖼️ Replacing Navigation Icons

### Current Components Using Lucide Icons

1. **Dashboard.tsx** - Home, Settings, BarChart2, Calendar
2. **InsightsScreen.tsx** - Home, Settings, BarChart2, Calendar
3. **EntryList.tsx** - Home, Settings, BarChart2, Calendar
4. **EntryDetail.tsx** - ArrowLeft

### How to Replace

**Before:**
```jsx
import { Home } from 'lucide-react'
<Home size={26} fill="currentColor" strokeWidth={0} />
```

**After:**
```jsx
<img src="/icons/home.svg" alt="Home" className="w-[26px] h-[26px]" />
// or
<CustomHomeIcon size={26} className="fill-current" />
```

---

## 🎭 Illustrations for Cards

### Quote Card Illustration

The quote card on the home page uses: `/public/illustrations/quote-illustration.svg`

**To replace:**
1. Create your illustration (320x192px recommended)
2. Export as SVG or PNG
3. Drop into `/public/illustrations/`
4. Rename to `quote-illustration.svg` (or update Dashboard.tsx)

**Code location:** `Dashboard.tsx` line 159

```jsx
<img 
  src="/illustrations/quote-illustration.svg" 
  alt="Decorative illustration" 
  className="w-full h-full object-cover"
/>
```

---

## 📐 Icon Specifications

### Navigation Icons
- **Size**: 26x26px
- **Stroke**: 2px
- **Style**: Outlined or filled
- **Colors**: 
  - Active: `#0F172A` (slate-900)
  - Inactive: `#94A3B8` (slate-400)

### Card Illustrations
- **Quote Card**: 320x192px (landscape)
- **Format**: SVG preferred, PNG acceptable
- **Style**: Match brand personality

### Button Icons
- **Size**: 20-24px
- **Stroke**: 2-2.5px
- **Colors**: Inherit from button text color

---

## 🎯 Icon Resources

- **[Lucide](https://lucide.dev)** - Clean, consistent icons (download SVG)
- **[Heroicons](https://heroicons.com)** - Tailwind's icon set
- **[Phosphor Icons](https://phosphoricons.com)** - Flexible icon family
- **[Figma Community](https://figma.com/community)** - Free icon packs
- **Custom Design** - Design in Figma/Illustrator

---

## ✅ Quick Checklist

- [ ] Icons exported as SVG
- [ ] Dropped into `/public/icons/` or `/public/illustrations/`
- [ ] Updated component imports
- [ ] Tested in browser (check console for 404s)
- [ ] Verified sizing and colors match design system

---

## 🔄 Example: Replace All Nav Icons

1. **Prepare 4 SVG files:**
   - `material-symbols_home-outline-rounded.svg` ✅ **DONE**
   - `material-symbols_overview-outline-rounded.svg` ✅ **DONE**
   - `ic_round-history.svg` ✅ **DONE**
   - `uil_setting.svg` ✅ **DONE**

2. **Drop into:** `/public/icons/` ✅ **DONE**

3. **Updated components:** ✅ **DONE**
   - `Dashboard.tsx` - Home page navigation
   - `InsightsScreen.tsx` - Overview page navigation
   - `EntryList.tsx` - Past Reflections navigation
   - `EntryDetail.tsx` - Reflection Details navigation
   - `Settings.tsx` - Settings page navigation

**Example code (now in all components):**
```jsx
{/* Home - Active State (full opacity) */}
<button className="text-slate-900 ...">
  <img src="/icons/material-symbols_home-outline-rounded.svg" alt="" className="w-[26px] h-[26px]" />
  <p className="text-[11px] font-medium">Home</p>
</button>

{/* Overview - Inactive State with Hover */}
<button onClick={onViewInsights} className="text-slate-400 hover:text-slate-900 transition-colors ...">
  <img src="/icons/material-symbols_overview-outline-rounded.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
  <p className="text-[11px] font-medium">Overview</p>
</button>

{/* History - Inactive State with Hover */}
<button onClick={onNavigateHistory} className="text-slate-400 hover:text-slate-900 transition-colors ...">
  <img src="/icons/ic_round-history.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
  <p className="text-[11px] font-medium">History</p>
</button>

{/* Settings - Inactive State with Hover */}
<button className="text-slate-400 hover:text-slate-900 transition-colors ...">
  <img src="/icons/uil_setting.svg" alt="" className="w-[26px] h-[26px] opacity-40 hover:opacity-100 transition-opacity" />
  <p className="text-[11px] font-medium">Setting</p>
</button>
```

**Icon Color States:**
- **Active:** Full opacity (no opacity class) - matches `text-slate-900` (black)
- **Inactive:** `opacity-40` - matches `text-slate-400` (gray)
- **Hover:** `hover:opacity-100` + `transition-opacity` - smooth transition to black on hover

---

**Need help?** Check `/public/icons/README.md` for quick reference!

