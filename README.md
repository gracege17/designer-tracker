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

## 🧪 Integration Testing with OpenAI

This project includes integration tests that verify the challenge matching system works correctly with real OpenAI API calls.

### What Gets Tested

The integration test validates the complete flow:
1. **Input Processing** - Takes user task descriptions and emotions
2. **Challenge Filtering** - Identifies relevant challenge templates from the database
3. **OpenAI API Call** - Sends prompts to GPT-4o for semantic matching
4. **Response Processing** - Parses AI responses and returns matched challenges with reasoning

### Two Test Options

#### Option 1: Simple Test (Recommended)
Tests challenge matching logic by calling OpenAI directly from Node.js - no web server needed.

**Setup:**
```bash
# 1. Create .env file with your OpenAI API key
echo "OPENAI_API_KEY=sk-your-key-here" > .env
echo "OPENAI_MODEL=gpt-4o" >> .env

# 2. Run all test scenarios
npx tsx test-challenge-matching-simple.ts

# 3. Or run a specific scenario
npx tsx test-challenge-matching-simple.ts "Cursor/Tool Frustration"
```

**Available Test Scenarios:**
- `Deadline Pressure` - Tests stress/deadline detection
- `Stuck on Problem` - Tests "no progress" triggers
- `Cursor/Tool Frustration` - Tests tool-specific matching
- `General Overwhelm` - Tests multiple draining tasks
- `Creative Block` - Tests frustration/stuck patterns
- `AI Anxiety` - Tests AI-related concerns

#### Option 2: Full Stack Test
Tests the entire deployed system including Vercel API endpoints.

**Setup:**
```bash
# 1. Add OPENAI_API_KEY to Vercel environment variables
# Go to: https://vercel.com/your-project/settings/environment-variables

# 2. Redeploy to Vercel
vercel --prod

# 3. Run test against deployed API
npx tsx test-challenge-matching.ts
```

### Getting an OpenAI API Key

1. Sign up at https://platform.openai.com/
2. Go to https://platform.openai.com/api-keys
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add it to your `.env` file locally or Vercel environment variables

**Supported Models:**
- `gpt-4o` (recommended, most capable)
- `gpt-4o-mini` (faster, cheaper)
- `gpt-3.5-turbo` (legacy, widely available)

### Understanding Test Output

When you run the test, you'll see:

```
============================================================
Testing: Deadline Pressure
============================================================

📝 Entry data:
  - Working on homepage redesign
    Notes: Feeling stressed about the deadline pressure
    Emotion: 6 (Anxious)

⏳ Matching challenges with OpenAI...
🤖 Calling OpenAI API...

✅ Found 3 challenge(s):

1. Deadline pressure feels intense
   Score: 92
   Reasoning: User explicitly mentioned "stressed about the deadline 
   pressure" which directly aligns with deadline anxiety patterns...

2. General overwhelm - too many tasks
   Score: 68
   Reasoning: The anxiety around deadlines suggests possible workload...
```

### Cost Considerations

- **gpt-4o**: ~$0.01-0.02 per test scenario
- **gpt-4o-mini**: ~$0.001-0.002 per test scenario
- **gpt-3.5-turbo**: ~$0.0001-0.0005 per test scenario

Running all 6 test scenarios ≈ **$0.06** (gpt-4o) or **$0.006** (gpt-4o-mini)

### Troubleshooting

**"No OPENAI_API_KEY found"**
```bash
# Make sure .env file exists with your key
cat .env
# Should show: OPENAI_API_KEY=sk-...
```

**"Model not found" or 403 error**
```bash
# Try a different model
OPENAI_MODEL=gpt-3.5-turbo npx tsx test-challenge-matching-simple.ts
```

**"Rate limit exceeded"**
- Wait a few minutes between test runs
- Upgrade your OpenAI plan for higher limits
- Use `gpt-3.5-turbo` which has higher rate limits

### Files Involved

- `test-challenge-matching-simple.ts` - Direct OpenAI integration test
- `test-challenge-matching.ts` - Full stack test (includes Vercel API)
- `api/match-challenges.ts` - Vercel serverless function that calls OpenAI
- `src/utils/hybridChallengeMatchingService.ts` - Frontend matching service
- `src/data/challengeRecommendations.ts` - Challenge template database
- `INTEGRATION_TEST_SETUP.md` - Detailed setup guide

---

*Last Updated: November 2025*
