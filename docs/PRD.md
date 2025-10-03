# 📋 Product Requirements Document (PRD)

## 📱 App Overview

**App Name:** ✨ Designer's Life Tracker  
**Target Platform:** Mobile (iOS/Android via Expo)  
**Tech Stack:** React Native + Expo + NativeWind (Tailwind CSS)  

### 🎯 Problem Statement
Designers often struggle with burnout, career direction uncertainty, and lack of self-awareness about what truly motivates or drains them in their work. Without reflection tools, they miss patterns in their emotional responses to different types of design tasks and projects.

### 👥 Target Users
- UX/UI & graphic designers
- Creative professionals seeking more self-awareness
- Anyone feeling stuck, burned out, or unsure what kind of work fulfills them

### 🌟 Value Proposition
**Reflect. Discover. Grow.**

Designer's Life Tracker is a calm, mobile-first journaling app that helps designers reflect on their daily work — in just 3 minutes a day. Users log what they worked on, how it made them feel, and why — across multiple projects and tasks. Over time, the app reveals emotional patterns, helping designers understand what truly motivates them, what drains them, and where their creative energy thrives.

**Core Purpose:** To help designers discover what excites, frustrates, or fulfills them — by gently tracking emotional responses to their work over time.

---

## 🚀 Key Features

### Feature 1: Daily Reflection Flow
**User Story:** As a designer, I want to quickly log my daily work and emotional responses in under 3 minutes so that I can build a habit of self-reflection without it feeling burdensome.

**Acceptance Criteria:**
- [ ] Simple, guided flow that takes 3 minutes or less
- [ ] Can log multiple tasks/projects in one session
- [ ] Emoji-based emotion selection with optional notes
- [ ] Date-based entry system with ability to edit past entries
- [ ] Gentle reminders without being pushy

**Priority:** High

---

### Feature 2: Multi-Project Task Logging
**User Story:** As a designer working on multiple projects, I want to categorize my tasks by project and track how different types of work make me feel so that I can identify patterns across different contexts.

**Acceptance Criteria:**
- [ ] Create and manage multiple projects
- [ ] Assign tasks to specific projects
- [ ] Tag tasks by type (e.g., wireframing, user research, visual design)
- [ ] Quick task entry with project/type selection
- [ ] View tasks filtered by project or type

**Priority:** High

---

### Feature 3: Emotion Tracking & Insights
**User Story:** As a designer, I want to see patterns in my emotional responses to different types of work so that I can make informed decisions about my career and daily work choices.

**Acceptance Criteria:**
- [ ] Visual emotion tracking with emoji system
- [ ] Weekly and monthly insight summaries
- [ ] Pattern recognition (what tasks energize vs drain)
- [ ] Mood trends over time visualization
- [ ] Warm, encouraging insights and suggestions

**Priority:** High

---

### Feature 4: Weekly/Monthly Insights Dashboard
**User Story:** As a designer, I want to see meaningful insights about my work patterns and emotional responses so that I can understand what fulfills me and make better career decisions.

**Acceptance Criteria:**
- [ ] Weekly reflection summaries
- [ ] Monthly pattern analysis
- [ ] Most energizing vs draining task types
- [ ] Project satisfaction comparisons
- [ ] Gentle suggestions for improvement

**Priority:** Medium

---

### Feature 5: Warm Suggestions & Guidance
**User Story:** As a designer seeking growth, I want to receive thoughtful, non-judgmental suggestions based on my reflection patterns so that I can improve my work satisfaction and career direction.

**Acceptance Criteria:**
- [ ] Personalized suggestions based on patterns
- [ ] Encouraging tone, never judgmental
- [ ] Actionable advice for improving work satisfaction
- [ ] Career direction insights when patterns emerge
- [ ] Optional motivational quotes/affirmations

**Priority:** Medium

---

## 🎨 Design Notes

### UI/UX Considerations
- **Cozy, Calm, Minimal:** Soft cream backgrounds, gentle interactions, lots of white space
- **3-Minute Rule:** Every interaction should feel quick and effortless
- **Mobile-First:** Thumb-friendly navigation, large touch targets, soft padding
- **Emotional Safety:** Non-judgmental language, encouraging tone throughout
- **Accessibility:** High contrast ratios, readable fonts, screen reader support
- **Offline-First:** Works without internet connection

### Design System Specifications
**✨ Mood:** Cozy, calm, minimal  
**🎨 Colors:**
- Background: Soft cream (#FEFBEA)
- Text: Gentle gray (#5E5E5E)
- CTA: Warm yellow (#FFD678)
- Supporting: Light grays, soft emotion colors

**🔠 Typography:**
- Headings: Playfair Display (large, elegant serif)
- Body: Inter (small, clean sans-serif)
- Weights: Light to regular (400-500)

**📐 Spacing & Layout:**
- Generous white space and soft padding
- Rounded corners (12px soft radius)
- Pill-style buttons (24px radius)
- Soft shadows for depth

**🧩 Components:**
- Emoji-friendly design throughout
- Pill-style buttons with warm yellow
- Soft card containers with gentle shadows
- Large touch targets for mobile

### Screen Flow
1. **Daily Flow:** Home → Quick Log → Emotion Selection → Optional Notes → Save
2. **Project Management:** Home → Projects → Add/Edit Project → Task Categories
3. **Insights Flow:** Home → Insights → Weekly/Monthly Views → Pattern Details
4. **Onboarding:** Welcome → Purpose Explanation → First Project Setup → First Entry

---

## 🔧 Technical Notes

### Data Storage
- **Local-First:** AsyncStorage for all user data (privacy-focused)
- **Data Structure:** JSON-based entries with date indexing
- **Backup:** Export functionality for user data portability
- **No Cloud:** Keeps data private and reduces complexity

### Data Models
```typescript
interface Entry {
  id: string;
  date: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  projectId: string;
  description: string;
  taskType: string;
  emotion: EmotionLevel;
  notes?: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}
```

### Performance Requirements
- **Loading:** App loads in <2 seconds
- **Entry Creation:** Complete daily log in <3 minutes
- **Offline:** Full functionality without internet
- **Smooth Animations:** 60fps transitions and micro-interactions

---

## 📊 Success Metrics

### Launch Goals (MVP)
- [ ] User can complete daily reflection in under 3 minutes
- [ ] App loads and responds within 2 seconds
- [ ] Zero critical bugs in core logging flow
- [ ] Successful data persistence across app sessions
- [ ] Intuitive onboarding (no user confusion)

### User Experience Goals
- [ ] 80% of users complete their first entry
- [ ] Users return for at least 7 consecutive days
- [ ] Average session time stays under 5 minutes
- [ ] Users create insights after 2 weeks of usage

### Future Goals
- Weekly active usage patterns
- Long-term retention (30+ days)
- User-generated feedback on insights quality
- Feature adoption rates

---

## 📅 Timeline & Milestones

### **Milestone 1: Foundation Setup** (Week 1)
- Project initialization and basic navigation
- Core UI components and design system
- Data models and storage setup
- Basic project management

### **Milestone 2: Core Logging Flow** (Week 2-3)
- Daily reflection entry screen
- Emotion tracking system
- Task logging with project assignment
- Data persistence and retrieval

### **Milestone 3: Insights & Analytics** (Week 4)
- Weekly/monthly insight calculations
- Pattern recognition algorithms
- Insights dashboard UI
- Data visualization components

### **Milestone 4: Polish & Enhancement** (Week 5)
- Warm suggestions system
- Onboarding flow
- Animations and micro-interactions
- Testing and bug fixes

### **Milestone 5: Launch Preparation** (Week 6)
- Final testing across devices
- Performance optimization
- App store preparation
- Documentation and demo creation

---

*Last Updated: September 30, 2025*
*Version: 1.0*
