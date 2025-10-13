# Icons & Illustrations Guide

## 📁 Folder Structure

```
/public
  /icons          - UI icons (navigation, actions, etc.)
  /images         - Photos, hero images, backgrounds
  /illustrations  - Custom artwork, decorative graphics
```

## 🎨 How to Add Your Custom Icons

### Option 1: Replace Lucide Icons with Custom SVGs

**Current (Lucide):**
```jsx
import { Home, Settings } from 'lucide-react'
<Home size={24} />
```

**After (Custom SVG):**
```jsx
<img src="/icons/home.svg" alt="Home" className="w-6 h-6" />
```

### Option 2: Inline SVG Component

Create a new file: `src/components/icons/HomeIcon.tsx`
```jsx
export const HomeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="..." fill="currentColor" />
  </svg>
)
```

## 🖼️ Adding Illustrations

### Quote Card Illustration
1. Drop your SVG/PNG into `/public/illustrations/`
2. Update Dashboard.tsx:
```jsx
<img 
  src="/illustrations/quote-art.svg" 
  alt="" 
  className="w-full h-48 object-cover"
/>
```

## 📐 Recommended Sizes

- **Navigation Icons**: 24x24px or 26x26px
- **Quote Card Illustration**: 320x192px (landscape)
- **Card Icons**: 20x20px to 24x24px

## 🎯 Icon Style Tips

- Use **2px stroke width** for consistency
- Keep **square corners** or **subtle rounding** (4-8px)
- Match the **#000** or **#94A3B8** color scheme
- Export as **SVG** for scalability

## 📦 Where to Find/Make Icons

- [Lucide Icons](https://lucide.dev) - Download SVG
- [Heroicons](https://heroicons.com) - Download SVG
- [Figma](https://figma.com) - Design custom ones
- [Illustrator/Sketch](https://adobe.com) - Export as SVG

---

**Quick Replace Navigation Icons:**
1. Export your icons as SVG
2. Name them: `home.svg`, `settings.svg`, `overview.svg`, `history.svg`
3. Drop in `/public/icons/`
4. Update component imports

