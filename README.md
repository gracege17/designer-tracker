# 📱 AI-Powered Mobile App Workflow for Solo Designers

> Transform Cursor into your AI development partner for building mobile apps with **Expo + React Native + NativeWind**

## 🎯 Who This Is For

**Solo designers** with basic HTML/CSS skills who want to build mobile apps using **Cursor + AI**. No deep coding knowledge required!

---

## 🚀 Quick Start

1. **Clone or download this workflow template**
2. **Open in Cursor**
3. **Follow the 10-step workflow below**
4. **Start building your app with AI assistance!**

---

## 🔟 The 10-Step Smart Workflow

### 1. 💡 **App Idea + User Goal**

Start by sketching your app idea and defining 2–3 core features.

**🤖 AI Prompt:**
```
I want to build a mobile app that helps users [track workouts / manage mood / etc]. 
Help me brainstorm features, user goals, and name ideas.
```

### 2. 📄 **Create Your PRD**

Open `docs/PRD.md` and fill out the template with:
- App Overview
- Key Features (as User Stories)  
- Acceptance Criteria
- Design or Tech Notes

**🤖 AI Prompt:**
```
Help me generate a PRD for a mobile app that lets users [X]. 
Include overview, user stories, and success criteria.
```

### 3. ✅ **Break It into Tasks**

Open `tasks/todo.md` and convert your PRD into actionable tasks.

**🤖 AI Prompt:**
```
Convert the PRD into a task list with checkboxes. 
Include UI tasks, logic tasks, and setup tasks.
```

**Task Tags:** `[todo]` `[in-progress]` `[review]` `[done]` `[blocked]`

### 4. 🎨 **Design the Screen** *(Optional)*

Use Figma or sketch screen layouts. Keep it simple, 1 screen at a time.

**🤖 AI Prompt:**
```
Give me tips for designing a clean [workout tracking / mood logging / etc] UI in mobile format.
```

### 5. 🛠 **Start a Task with Cursor**

Pick one task from your list and get AI to implement it.

**🤖 AI Prompt:**
```
Let's start the task: "[Task Name]"
Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]
Use React Native + Expo + NativeWind for styling.
```

### 6. 🤖 **Implement UI + Logic Step-by-Step**

Break each task into smaller steps and review each part.

**🤖 AI Prompts:**
```
First, create the basic layout.
```
```
Now, add the save functionality using AsyncStorage.
```
```
Now, show success/failure message.
```

### 7. 🧪 **Test the Feature**

After AI finishes a feature:
- Test manually on Expo Go
- Verify acceptance criteria from PRD

**🤖 AI Prompt:**
```
What edge cases should I test for this [form / screen / feature]?
```

### 8. 🔍 **Review + Mark Complete**

Once tested and working:

**🤖 AI Prompt:**
```
✅ This task is complete and approved. 
Let's move on to the next task: "[Next Task Name]"
```

If there are issues:
```
This isn't working. Here's the error [...]. Help me fix it.
```

### 9. 🚀 **GitHub + Version Control**

```bash
git init
git add .
git commit -m "Initial commit"
```

Create GitHub repo and push. Link to Vercel for web previews if needed.

### 10. 📦 **Polish + Share**

- Move completed tasks to `tasks/archive.md`
- Ask AI to clean code and add comments
- Share QR code from Expo Go

**🤖 AI Prompt:**
```
Review the codebase and suggest simple improvements or refactors.
```

---

## 🔁 **Repeat This Loop**

1. **Pick** next task
2. **Design** (if needed)  
3. **AI implements**
4. **You test**
5. **Review/approve**
6. **Archive & continue**

---

## 💬 **AI Prompt Library**

### 🚀 **Starting Tasks**
```
Let's start this task: "[task name]"
Here's what it should include: [requirements]
Use React Native + Expo + NativeWind.
```

### 🏗️ **Architecture Questions**
```
How should we structure this [screen/component/feature]?
```

### 🧪 **Testing Guidance**
```
What are some key test cases for this feature?
```
```
Generate test scenarios for [specific functionality].
```

### 🐛 **Bug Fixes**
```
This code throws an error: [error message]. Help me fix it.
```
```
The [feature] isn't working as expected. Here's what's happening: [description]
```

### ✅ **Task Completion**
```
This task is complete. Approved. Move to next task: [task name]
```

### 🎨 **Design Help**
```
Help me design a clean, modern UI for [specific screen/feature].
```
```
What are some mobile UX best practices for [specific interaction]?
```

### 🔧 **Code Quality**
```
Review this code and suggest improvements for readability and performance.
```
```
Help me refactor this component to be more reusable.
```

---

## 📁 **Folder Structure**

```
/your-app-name
├── 📄 README.md                    # This workflow guide
├── 📁 docs/
│   └── 📄 PRD.md                   # Product Requirements Document
├── 📁 tasks/
│   ├── 📄 todo.md                  # Active task management
│   └── 📄 archive.md               # Completed tasks log
├── 📁 src/                         # Your app source code
│   ├── 📁 components/              # Reusable UI components
│   ├── 📁 screens/                 # App screens
│   ├── 📁 utils/                   # Helper functions
│   └── 📁 types/                   # TypeScript types
├── 📄 package.json                 # Dependencies
├── 📄 app.json                     # Expo configuration
└── 📄 tailwind.config.js           # NativeWind configuration
```

---

## 🛠️ **Tech Stack**

- **📱 React Native** - Cross-platform mobile development
- **🚀 Expo** - Development platform and tools
- **🎨 NativeWind** - Tailwind CSS for React Native
- **💾 AsyncStorage** - Local data persistence
- **🧭 React Navigation** - Screen navigation
- **📝 TypeScript** - Type safety (recommended)

---

## 🎯 **Success Tips**

### ✅ **Do This:**
- Work on **one feature at a time**
- **Test frequently** on real devices via Expo Go
- **Break large tasks** into smaller steps
- **Use the task tags** to track progress
- **Ask AI for specific help** rather than vague questions
- **Review and approve** each step before moving on

### ❌ **Avoid This:**
- Building multiple features simultaneously
- Skipping the testing phase
- Making tasks too large or vague
- Not updating task status regularly
- Asking AI to build everything at once

---

## 🆘 **Troubleshooting**

### **Expo Issues**
```bash
# Clear Expo cache
expo start --clear

# Reset Metro bundler
npx react-native start --reset-cache
```

### **NativeWind Not Working**
- Check `tailwind.config.js` configuration
- Ensure `nativewind/babel` is in `babel.config.js`
- Restart Expo development server

### **AsyncStorage Issues**
```bash
# Install AsyncStorage
npx expo install @react-native-async-storage/async-storage
```

---

## 🎉 **You're Ready!**

This workflow turns Cursor into your personal AI development partner. Start with step 1, follow the prompts, and build amazing mobile apps!

**Happy building! 🚀**

---

*Created for solo designers who want to build mobile apps with AI assistance*
