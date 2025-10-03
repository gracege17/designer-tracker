# ✨ Designer's Life Tracker

> A calm, reflective journaling app that helps designers discover what truly motivates and drains them in their work.

**Reflect. Discover. Grow.**

---

## 🎯 What Is This?

Designer's Life Tracker is a web-based journaling app built for UX/UI designers and creative professionals. In just 3 minutes a day, you can:

- Log what you worked on across multiple projects
- Track your emotional responses to different types of work
- Discover patterns in what energizes or drains you
- Get insights and suggestions for improving work satisfaction

The app uses a cozy, minimal design with soft colors and gentle interactions to make daily reflection feel effortless and enjoyable.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd designer-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack

- **⚡ Vite** - Fast build tool and dev server
- **⚛️ React 18** - UI framework
- **📘 TypeScript** - Type safety
- **🎨 Tailwind CSS** - Utility-first styling
- **💾 localStorage** - Local data persistence
- **🎭 Lucide React** - Beautiful icons

No backend required - all data is stored locally in your browser for privacy.

---

## 📁 Project Structure

```
/designer-tracker
├── 📄 index.html              # Entry HTML
├── 📄 package.json            # Dependencies and scripts
├── 📄 vite.config.ts          # Vite configuration
├── 📄 tailwind.config.js      # Tailwind CSS configuration
├── 📄 tsconfig.json           # TypeScript configuration
│
├── 📁 src/
│   ├── 📄 main.tsx            # App entry point
│   ├── 📄 App.tsx             # Main app component & routing
│   ├── 📄 index.css           # Global styles
│   │
│   ├── 📁 components/         # React components
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── AddEntryForm.tsx   # Quick entry form
│   │   ├── EntryList.tsx      # History view
│   │   ├── EntryDetail.tsx    # Individual entry view
│   │   ├── InsightsScreen.tsx # Analytics & patterns
│   │   ├── ProjectSelection.tsx
│   │   ├── TaskEntry.tsx
│   │   ├── EmotionSelection.tsx
│   │   ├── ReviewReflection.tsx
│   │   └── Onboarding*.tsx    # Onboarding flow
│   │
│   ├── 📁 types/
│   │   └── index.ts           # TypeScript type definitions
│   │
│   └── 📁 utils/
│       ├── storage.ts         # localStorage helpers
│       ├── dataHelpers.ts     # Data transformation
│       ├── dateUtils.ts       # Date formatting
│       ├── suggestionEngine.ts # Insight generation
│       └── validation.ts      # Form validation
│
├── 📁 docs/
│   ├── PRD.md                 # Product requirements
│   ├── design-style.md        # Design system
│   └── workflow.md            # Development workflow
│
└── 📁 tasks/
    ├── todo.md                # Active tasks
    └── archive.md             # Completed tasks
```

---

## ✨ Key Features

### 1. **Daily Reflection Flow**
A guided 3-minute flow to log your work:
- Select projects you worked on
- Describe tasks for each project
- Choose emotions (multiple allowed)
- Add optional notes
- Review and save

### 2. **Multi-Project Task Logging**
- Create and manage multiple projects
- Color-code your projects
- Track tasks across different contexts
- Edit or delete past entries

### 3. **Emotion Tracking**
Choose from 5 emotion levels:
- 😫 Drained (1)
- 😕 Frustrated (2)
- 😐 Neutral (3)
- 🙂 Energized (4)
- 🤩 Excited (5)

### 4. **Insights Dashboard**
- Weekly and monthly statistics
- Emotion distribution charts
- Project satisfaction scores
- Task frequency analysis
- Warm, encouraging suggestions

### 5. **Smooth Onboarding**
- Welcome flow with app introduction
- User profile setup
- First project creation
- Guided first entry

---

## 🎨 Design System

**Color Palette:**
- Background: Soft cream (`#FEFBEA`)
- Text: Gentle gray (`#5E5E5E`)
- Primary CTA: Warm yellow (`#FFD678`)
- Supporting: Light grays and soft emotion colors

**Typography:**
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Weights: 300-500 (light to medium)

**Components:**
- Soft rounded corners (12-24px)
- Generous padding and whitespace
- Smooth transitions and micro-interactions
- Mobile-responsive design

See `docs/design-style.md` for complete specifications.

---

## 📝 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production (runs vite build only)
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🔒 Privacy & Data

**All data stays on your device.** The app uses browser localStorage to save:
- Your entries and reflections
- Project information
- User profile (name, design focus)
- Onboarding status

**No data is sent to any server.** You can export your data anytime by checking the browser's localStorage.

---

## 🐛 Troubleshooting

### Development server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Styles not applying
- Check that Tailwind CSS is properly configured in `tailwind.config.js`
- Verify PostCSS configuration in `postcss.config.js`
- Restart the dev server

---

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Build command: npm run build
# Publish directory: dist
```

The app is a static site - the `dist` folder contains everything needed for deployment.

---

## 📚 Documentation

- **PRD**: See `docs/PRD.md` for complete product requirements
- **Design System**: See `docs/design-style.md` for UI/UX specifications
- **Workflow**: See `docs/workflow.md` for development process

---

## 🎯 Development Workflow

This project was built using AI-assisted development with Cursor. The workflow:

1. **Plan** - Define features in `docs/PRD.md`
2. **Task** - Break down into tasks in `tasks/todo.md`
3. **Build** - Implement features with AI assistance
4. **Test** - Verify in browser
5. **Archive** - Move completed tasks to `tasks/archive.md`

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit PRs for improvements
- Share your experience using the app

---

## 📄 License

MIT License - feel free to use this project as inspiration for your own reflective journaling app!

---

## 🌟 About

Built by designers, for designers. This app emerged from a personal need to understand patterns in creative work and make more informed career decisions.

**Happy reflecting! ✨**

---

*Last Updated: October 2025*
