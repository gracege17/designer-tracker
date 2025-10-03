# 🔄 AI-Powered Mobile App Development Workflow

*A step-by-step guide for solo designers building mobile apps with Cursor + AI*

---

## 🎯 **Workflow Overview**

This workflow transforms Cursor into your AI development partner. You'll plan, design, build, test, and polish features one at a time with clear checkpoints, AI prompts, and reviews.

**Tech Stack:** React Native + Expo + NativeWind (Tailwind CSS)  
**Target:** Solo designers with basic HTML/CSS skills  
**Goal:** Build mobile apps without deep coding knowledge  

---

## 📋 **Before You Start**

### ✅ **Prerequisites Checklist**
- [ ] Cursor IDE installed and configured
- [ ] Node.js installed (v16 or higher)
- [ ] Expo CLI installed (`npm install -g @expo/cli`)
- [ ] Expo Go app on your phone for testing
- [ ] Basic understanding of HTML/CSS

### 📱 **Setup Verification**
```bash
# Verify your setup
node --version          # Should be v16+
expo --version         # Should show Expo CLI version
npx expo start         # Should start development server
```

---

## 🔟 **The 10-Step Workflow**

### **Step 1: 💡 App Idea + User Goal**

**Objective:** Define your app concept and core value proposition

**Actions:**
1. Sketch your app idea (paper/digital)
2. Define 2–3 core features maximum
3. Identify your target users

**🤖 AI Prompt:**
```
I want to build a mobile app that helps users [describe main function]. 
Help me brainstorm:
- 3-5 key features that would be most valuable
- Target user personas and their goals
- Creative app name ideas
- Simple user flow for the core feature
```

**✅ Success Criteria:**
- Clear app concept in 1-2 sentences
- 2-3 core features identified
- Target user defined

---

### **Step 2: 📄 Create Your PRD**

**Objective:** Document your product requirements systematically

**Actions:**
1. Open `docs/PRD.md`
2. Fill out the template with your app details
3. Write user stories for each feature
4. Define acceptance criteria

**🤖 AI Prompt:**
```
Help me create a comprehensive PRD for my [app type] app. 
The app should [main function]. 

Please help me write:
- Clear problem statement and value proposition
- User stories in format: "As a [user], I want [action] so that [benefit]"
- Specific acceptance criteria for each feature
- Technical considerations for React Native + Expo
```

**✅ Success Criteria:**
- Complete PRD with all sections filled
- Clear user stories for each feature
- Measurable acceptance criteria
- Technical notes documented

---

### **Step 3: ✅ Break It into Tasks**

**Objective:** Convert PRD into actionable development tasks

**Actions:**
1. Open `tasks/todo.md`
2. Create tasks for each feature
3. Add setup and polish tasks
4. Prioritize tasks by dependency

**🤖 AI Prompt:**
```
Based on my PRD, convert each feature into specific development tasks. 
Break down into:
- Setup tasks (navigation, components, etc.)
- UI tasks (screens, forms, layouts)
- Logic tasks (data handling, validation, storage)
- Testing tasks (user flows, edge cases)
- Polish tasks (animations, error handling)

Use the task format with status tags: [todo], [in-progress], [review], [done], [blocked]
```

**✅ Success Criteria:**
- All features broken into specific tasks
- Tasks tagged with status
- Dependencies identified
- Realistic time estimates

---

### **Step 4: 🎨 Design the Screen** *(Optional)*

**Objective:** Create visual mockups for better implementation

**Actions:**
1. Sketch or wireframe key screens
2. Define color scheme and typography
3. Plan user interactions and flows

**🤖 AI Prompt:**
```
Help me design a clean, modern mobile UI for [specific screen/feature].
Consider:
- Mobile-first design principles
- Accessibility best practices
- Consistent spacing and typography
- Touch-friendly interaction areas
- Loading and error states

Suggest specific NativeWind classes for implementation.
```

**✅ Success Criteria:**
- Key screens sketched or wireframed
- Design system basics defined
- UI patterns documented

---

### **Step 5: 🛠 Start a Task with Cursor**

**Objective:** Begin implementation with AI assistance

**Actions:**
1. Pick highest priority `[todo]` task
2. Mark as `[in-progress]`
3. Use AI to implement step-by-step

**🤖 AI Prompt:**
```
Let's start implementing this task: "[Task Name from todo.md]"

Requirements from PRD:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Please implement using:
- React Native + Expo
- NativeWind for styling
- TypeScript for type safety
- AsyncStorage for data persistence

Break this into sub-steps and implement one at a time.
```

**✅ Success Criteria:**
- Task marked as `[in-progress]`
- Implementation started with AI
- Code follows project structure

---

### **Step 6: 🤖 Implement UI + Logic Step-by-Step**

**Objective:** Build feature incrementally with AI guidance

**Actions:**
1. Implement UI layout first
2. Add interactivity and logic
3. Handle data persistence
4. Add error handling

**🤖 AI Prompts:**
```
Step 1: First, create the basic layout and UI components.
```
```
Step 2: Now add form validation and user input handling.
```
```
Step 3: Implement data saving with AsyncStorage.
```
```
Step 4: Add success/error messaging and loading states.
```

**✅ Success Criteria:**
- UI matches design requirements
- Logic works as expected
- Data persists correctly
- Error cases handled

---

### **Step 7: 🧪 Test the Feature**

**Objective:** Verify feature works correctly across scenarios

**Actions:**
1. Test on Expo Go (phone/simulator)
2. Verify all acceptance criteria
3. Test edge cases and error scenarios
4. Check performance and UX

**🤖 AI Prompt:**
```
Help me create comprehensive test cases for [feature name].
Include:
- Happy path scenarios
- Edge cases (empty inputs, network issues, etc.)
- Error conditions and recovery
- Performance considerations
- Accessibility testing

What should I specifically test on the device?
```

**✅ Success Criteria:**
- All acceptance criteria met
- Edge cases handled gracefully
- Performance is acceptable
- No critical bugs found

---

### **Step 8: 🔍 Review + Mark Complete**

**Objective:** Quality check and task completion

**Actions:**
1. Review code quality and structure
2. Update task status based on results
3. Document any issues or improvements

**🤖 AI Prompts:**

**If feature works well:**
```
✅ This task is complete and approved. 
Please help me:
1. Clean up the code and add helpful comments
2. Update the task status to [done]
3. Move to the next priority task: "[Next Task Name]"
```

**If issues found:**
```
This feature has issues: [describe problems]
Help me:
1. Identify the root cause
2. Fix the issues systematically  
3. Improve error handling
4. Re-test the functionality
```

**✅ Success Criteria:**
- Code reviewed and cleaned
- Task properly marked as `[done]` or needs fixes
- Ready to move to next task

---

### **Step 9: 🚀 Version Control + Deployment**

**Objective:** Save progress and prepare for sharing

**Actions:**
1. Commit completed features to Git
2. Push to GitHub repository
3. Create builds or sharing links

**Commands:**
```bash
# Initialize Git (first time only)
git init
git add .
git commit -m "Initial project setup"

# For each completed feature
git add .
git commit -m "feat: implement [feature name]"
git push origin main

# Create shareable build
npx expo build:web  # For web preview
# OR share Expo Go QR code for mobile testing
```

**✅ Success Criteria:**
- Code committed to version control
- Repository updated on GitHub
- Shareable version available

---

### **Step 10: 📦 Polish + Archive**

**Objective:** Finalize feature and prepare for next iteration

**Actions:**
1. Move completed task to `tasks/archive.md`
2. Polish code and add final touches
3. Update documentation
4. Plan next iteration

**🤖 AI Prompt:**
```
Help me polish this completed feature:
1. Review code for improvements and refactoring opportunities
2. Add comprehensive comments and documentation
3. Optimize performance where possible
4. Suggest enhancements for future versions
5. Update the archive with completion details
```

**✅ Success Criteria:**
- Task archived with completion notes
- Code polished and documented
- Ready for next feature development

---

## 🔄 **Iteration Loop**

After completing Step 10, return to Step 5 with the next priority task:

```
Step 5 → Step 6 → Step 7 → Step 8 → Step 9 → Step 10 → Step 5...
```

**Continue until all features are complete!**

---

## 📊 **Progress Tracking**

### **Daily Workflow**
1. **Morning:** Review `tasks/todo.md`, pick next task
2. **Development:** Follow Steps 5-8 for current task
3. **Evening:** Update task status, commit progress

### **Weekly Review**
1. Review completed tasks in `archive.md`
2. Update PRD if requirements changed
3. Plan next week's priorities
4. Celebrate progress! 🎉

### **Task Status Guide**
- `[todo]` - Ready to start
- `[in-progress]` - Currently working (only 1 at a time)
- `[review]` - Ready for testing
- `[done]` - Completed and working
- `[blocked]` - Waiting on something else

---

## 🆘 **Troubleshooting Guide**

### **Common Issues & Solutions**

**🐛 "AI code doesn't work"**
```
The code has errors: [paste error message]
Help me debug this step by step:
1. Identify the specific issue
2. Explain why it's happening  
3. Provide the corrected code
4. Prevent similar issues in the future
```

**📱 "App crashes on device"**
```
My app crashes when I [describe action]. 
Help me:
1. Add proper error handling
2. Debug the crash systematically
3. Test edge cases
4. Improve app stability
```

**🎨 "UI doesn't look right"**
```
The UI doesn't match my design. Issues:
- [List specific problems]
Help me fix the styling using NativeWind classes.
```

**💾 "Data not saving"**
```
AsyncStorage isn't working properly:
- [Describe the issue]
Help me debug the data persistence layer.
```

---

## 🎯 **Success Metrics**

### **Feature Completion Checklist**
- [ ] Matches PRD requirements
- [ ] All acceptance criteria met
- [ ] Tested on real device
- [ ] Error cases handled
- [ ] Code is clean and commented
- [ ] Performance is acceptable
- [ ] Ready for user testing

### **App Quality Standards**
- [ ] Loads in under 3 seconds
- [ ] Core user flow works smoothly
- [ ] No critical bugs in main features
- [ ] Works on both iOS and Android
- [ ] Accessible and user-friendly
- [ ] Data persists correctly

---

## 🚀 **Ready to Build!**

This workflow ensures you build high-quality mobile apps systematically with AI assistance. Each step has clear objectives, actions, and success criteria.

**Remember:** Take it one step at a time, test frequently, and leverage AI to guide you through each phase!

---

*Happy building! 📱✨*
