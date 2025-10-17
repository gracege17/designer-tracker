# Content Strategy: Designer's Life Tracker

This document outlines our content approach, principles, and guidelines for future features.

---

## **Content Mission**

**We help designers understand and celebrate their creative work through warm, reflective language that honors both the process and the emotions behind it.**

---

## **Content Principles**

### **1. Emotion First, Data Second**
We don't just track tasks—we help designers understand how their work makes them *feel*.

**In Practice:**
- Lead with feelings, not metrics
- Use poetic language for insights
- Celebrate emotional patterns, not just productivity

**Examples:**
- ✅ "Creative tasks that involved visual thinking energized you."
- ❌ "You completed 5 tasks with an average emotion rating of 8.2."

---

### **2. Reflection Over Logging**
This isn't a to-do list—it's a journal for creative work.

**In Practice:**
- Use "reflection" instead of "entry" or "log"
- Frame actions as thoughtful, not mechanical
- Encourage pause and introspection

**Examples:**
- ✅ "Capture the moment"
- ❌ "Log task"

---

### **3. Designer-Centric Language**
We speak the language of designers—creative, visual, process-oriented.

**In Practice:**
- Use design terminology naturally (e.g., "flow state," "visual thinking")
- Reference creative struggles and wins
- Avoid generic productivity language

**Examples:**
- ✅ "Exploratory design work lit up your curiosity."
- ❌ "You were productive this week."

---

### **4. Warmth Without Clutter**
Be friendly, but respect the user's time and attention.

**In Practice:**
- Short, meaningful sentences
- Emojis sparingly (only where they add warmth)
- White space and breathing room

**Examples:**
- ✅ "No reflections yet. Start tracking your work to see your history here."
- ❌ "👋 Hey there! 🎨 It looks like you haven't added any reflections yet! 📝 Why not start tracking your awesome design work today? 🚀"

---

### **5. Conversational, Not Corporate**
Write like a supportive mentor, not a productivity app.

**In Practice:**
- Use contractions
- Ask questions
- Acknowledge feelings
- Keep it human

**Examples:**
- ✅ "That day's already journaled into history. Let it chill."
- ❌ "This entry is read-only and cannot be modified."

---

## **Content Hierarchy**

### **Primary Content (Most Important)**
- **CTA buttons** – Guide the user's next action
- **Greeting** – Set the tone for the day
- **Insight cards** – Deliver value and reflection

### **Secondary Content**
- **Navigation labels** – Orient the user
- **Section headings** – Organize information
- **Helper text** – Provide context

### **Tertiary Content**
- **Empty states** – Encourage first use
- **Placeholders** – Show examples
- **Tooltips** – Clarify when needed

---

## **Content by Screen**

### **Onboarding**
**Goal:** Build trust, collect essential info, reduce friction

**Tone:** Welcoming, clear, reassuring

**Key Messages:**
- Your privacy is protected
- This will help you understand your creative work
- It's quick and easy

**Content Checklist:**
- [ ] Clear value proposition
- [ ] Privacy reassurance
- [ ] Example inputs (placeholders)
- [ ] Optional vs. required fields marked
- [ ] Skip options where appropriate

---

### **Dashboard (Home)**
**Goal:** Daily check-in, quick reflection, insight preview

**Tone:** Warm, encouraging, reflective

**Key Messages:**
- We're glad you're here
- Take a moment to reflect
- Here's what we noticed about your work

**Content Checklist:**
- [ ] Personalized greeting
- [ ] Clear primary CTA
- [ ] 4 insight cards with meaningful copy
- [ ] Inspirational quote
- [ ] Easy navigation

---

### **Task Entry Flow**
**Goal:** Capture reflections quickly without friction

**Tone:** Supportive, light, encouraging

**Key Messages:**
- Just capture what comes to mind
- There's no wrong answer
- Your feelings matter

**Content Checklist:**
- [ ] Clear question at each step
- [ ] Helpful placeholders
- [ ] Progress indication (if multi-step)
- [ ] Easy back navigation
- [ ] Clear next action

---

### **History / Reflections**
**Goal:** Browse past entries, see progress over time

**Tone:** Calm, organized, nostalgic

**Key Messages:**
- Look how far you've come
- Every moment is preserved
- Your creative journey is here

**Content Checklist:**
- [ ] Clear date grouping
- [ ] Scannable task previews
- [ ] Easy entry access
- [ ] Empty state for new users

---

### **Insights / Overview**
**Goal:** Help users understand patterns and emotions

**Tone:** Thoughtful, reflective, warm

**Key Messages:**
- Here's what we noticed
- These patterns reveal your creative rhythms
- Use this to guide future work

**Content Checklist:**
- [ ] Visual emotional calendar
- [ ] 3-4 key insight cards
- [ ] Meaningful, reflective copy (not just data)
- [ ] Time period toggle (week/month)

---

### **Settings**
**Goal:** Configure app, manage data, provide feedback

**Tone:** Clear, transparent, helpful

**Key Messages:**
- You're in control of your data
- We're here if you need help
- Privacy is paramount

**Content Checklist:**
- [ ] Clear section headings
- [ ] Explanatory helper text
- [ ] Confirmation for destructive actions
- [ ] Privacy reassurances
- [ ] Contact/feedback option

---

## **Content Patterns**

### **Empty States**
```
[Icon/Illustration - Optional]
[Heading]: State description (concise)
[Body]: Next step or encouragement
[CTA - Optional]: Primary action
```

**Example:**
```
No reflections yet
Start tracking your work to see your history here.
```

---

### **Insight Cards**
```
[Small label]: Category (12px, normal)
[Main insight]: Reflective sentence (20px, medium, italic)
[Examples - Expandable]: 1-3 task examples (14px, normal)
[Subtitle]: Context or theme (14px, normal, 70% opacity)
```

**Example:**
```
What Energized You

Creative tasks that involved visual thinking energized you.

• Tweaked layouts and visual hierarchy
• Designed onboarding experiences

Projects that sparked excitement
```

---

### **Confirmation Dialogs**
```
[First line]: Clear question with consequence
[Optional break]
[Second line]: Action options
```

**Example:**
```
What would you like to do with this task?

Press OK to edit, or Cancel to delete.
```

---

### **AI Chat Messages**
```
[Greeting]: Personalized, warm, emoji
[Context/Instruction]: Clear, flexible
[Examples]: Show multiple input formats
[Escape hatch]: Option to skip
```

**Example:**
```
Hey Alex 👋

Got any projects in motion?

You can list them like:
• One per line, or
• Separate with commas, or
• Use "and" between them

Type "skip" if you'd rather add them later. No rush!
```

---

## **Localization & Accessibility**

### **Writing for Translation**
When we expand to other languages:
- Avoid idioms and slang
- Keep sentences simple
- Don't rely on wordplay
- Use inclusive language

**Current phrases to reconsider for localization:**
- "Let it chill" (very English-specific)
- "No worries" (idiom)

---

### **Writing for Screen Readers**
- Use descriptive alt text for images
- Ensure navigation labels are clear
- Don't rely on color alone for meaning
- Write clear button labels (not "Click here")

---

## **Future Features: Content Approach**

### **If We Add: Weekly Email Summary**
**Tone:** Reflective, celebratory, brief

**Content Pattern:**
- Personal greeting
- 1-2 key insights
- Visual summary (emoji calendar)
- Encouraging closing

**Example:**
```
Subject: Your creative week in review 🎨

Hey Alex,

This week, you worked on 12 tasks across 3 projects. Here's what stood out:

✨ Flow State Alert
Creative tasks that involved visual thinking energized you.

🌱 Growth Moment
You pushed through some tricky UX challenges and came out stronger.

Keep going! See you next week.
```

---

### **If We Add: Sharing/Export Features**
**Tone:** Clear, privacy-focused, flexible

**Key Messages:**
- You control what you share
- Your data stays private by default
- Export formats are designer-friendly

**Content Needs:**
- Share options (text, image, PDF)
- Privacy settings explanation
- Formatting options
- Social copy templates

---

### **If We Add: Collaboration/Team Features**
**Tone:** Professional, but still warm

**Key Messages:**
- Reflection is still personal
- Share insights, not raw data
- Teams grow together

**Content Needs:**
- Team invitation copy
- Shared insight language
- Permission explanations
- Team vs. personal reflection distinction

---

### **If We Add: Goal Setting**
**Tone:** Encouraging, not pressuring

**Key Messages:**
- Goals are aspirational, not obligations
- Track what matters to you
- Adjust as you grow

**Content Needs:**
- Goal creation prompts
- Progress language (avoid shame)
- Celebration messages
- Reflection on goals

---

### **If We Add: Recommendations**
**Tone:** Helpful, not pushy

**Key Messages:**
- Based on your patterns
- Suggestions, not requirements
- You know yourself best

**Content Needs:**
- Recommendation rationale
- Easy dismissal
- Learning from user feedback
- Variety in suggestions

---

## **Voice & Tone Spectrum**

Our tone adapts to context:

```
Playful ←→ Professional
"Let it chill" | "This reflection is read-only"

Casual ←→ Formal
"Hey Alex" | "Account Settings"

Encouraging ←→ Neutral
"Keep going!" | "No reflections yet"

Reflective ←→ Direct
"Creative work lit up your curiosity" | "Export data"
```

**When to be more playful:** Daily interactions, empty states, casual reminders

**When to be more professional:** Settings, data management, error messages

**When to be encouraging:** Onboarding, first-time experiences, milestones

**When to be reflective:** Insights, historical views, summary messages

---

## **Content Maintenance**

### **Monthly Review**
- Check for inconsistencies in new features
- Update placeholder examples to stay relevant
- Review user feedback for unclear copy
- Test with new users

### **Quarterly Audit**
- Compare all screens against this guide
- Update guide based on new patterns
- Check accessibility compliance
- Review localization readiness

---

## **Content Success Metrics**

### **How We Measure Good Content:**
1. **Clarity** – Users complete tasks without confusion
2. **Engagement** – Users return regularly
3. **Emotional Connection** – Users describe the app as "warm" or "supportive"
4. **Efficiency** – Copy is concise without being cold
5. **Consistency** – Voice is recognizable across all touchpoints

### **What We Track:**
- User feedback on specific copy
- Task completion rates (copy affects UX)
- Support requests related to unclear language
- Survey responses about app personality

---

## **Copy Approval Process**

### **For New Features:**
1. **Draft** – Write initial copy using this guide
2. **Review** – Check against voice & tone principles
3. **User Test** – Test with 2-3 target users
4. **Revise** – Refine based on feedback
5. **Document** – Add patterns to this guide

### **For Copy Changes:**
1. **Justify** – Why does current copy need to change?
2. **Test** – Does new copy follow the guide?
3. **Review** – Check with team/stakeholders
4. **Update** – Change copy + update documentation

---

## **Content Resources**

### **Inspiration:**
- Reflective apps: Day One, Stoic
- Designer tools: Figma (clear), Linear (direct)
- Wellness apps: Calm (warm), Headspace (friendly)

### **Writing References:**
- *Nicely Said* by Nicole Fenton & Kate Kiefer Lee
- *Strategic Writing for UX* by Torrey Podmajersky
- *The Elements of Style* by Strunk & White

### **Our Favorite Copy Examples:**
- Notion's empty states
- Duolingo's encouragement
- Slack's error messages
- Figma's onboarding
- Apple's product descriptions (clarity)

---

**Version:** 1.0  
**Last Updated:** October 17, 2025  
**Maintained by:** Designer's Life Tracker Team  
**Questions?** Refer to `voice-and-tone-guide.md` for specific writing guidelines.

