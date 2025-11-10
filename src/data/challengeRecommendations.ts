export type ChallengeResponseMode =
  | 'structured-3-step-guide'
  | 'direct-resource-recommendation'
  | 'lightweight-2-step-plus-tools'
  | 'action-focused'

export interface ChallengeAction {
  title: string
  description: string
  type?: 'action' | 'resource' | 'tool' | 'podcast' | 'book'
}

export interface ChallengeRecommendationTemplate {
  id: string
  title: string
  summary: string
  insight: string
  emotionTags: string[]
  topicTags: string[]
  growthGoalTags: string[]
  responseMode: ChallengeResponseMode
  notes?: string
  actions: ChallengeAction[]
  aliases?: string[]
}

export const CHALLENGE_RECOMMENDATIONS: ChallengeRecommendationTemplate[] = [
  {
    id: 'ai-replacement-fear',
    title: 'Designers Worry AI Will Replace Them',
    summary:
      "As AI tools like Uizard, Galileo AI, and Figma AI become more powerful, many designers fear they'll be replaced — especially when PMs or stakeholders generate prototypes themselves and bypass the design team.",
    insight:
      "The fear isn’t truly about AI’s capabilities, but about unclear professional identity. When design is narrowly defined as 'interface creation,' AI seems threatening. Reclaiming value means shifting from executors to facilitators of clarity and direction.",
    emotionTags: ['Anxiety', 'Insecurity'],
    topicTags: ['AI Tools', 'Job Security'],
    growthGoalTags: ['Identity Shift', 'AI Collaboration'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        title: 'Prompt practice',
        description: 'Ask ChatGPT for three layout ideas, then refine one using your design eye to highlight human judgment.',
        type: 'action',
      },
      {
        title: 'Define your point of view',
        description: 'Write one sentence about what only you believe good design should achieve to clarify your signature value.',
        type: 'action',
      },
      {
        title: 'Explore AI and creativity',
        description: 'Watch a five-minute talk on AI and human creativity and capture one insight that excites you.',
        type: 'resource',
      },
      {
        title: 'Reflect on your process',
        description: "Name one thing AI can't replicate in how you approach problems, and share it with your team.",
        type: 'action',
      },
    ],
    aliases: [
      'ai will replace me',
      'fear ai will take my job',
      'machine replacing designers',
      'worried about ai',
    ],
  },
  {
    id: 'everyone-thinks-designer',
    title: "Everyone Thinks They're a Designer Now",
    summary:
      'With low-code tools and AI-driven UI generation, non-designers now create full mockups. Designers often feel reduced to clean-up duty, losing authority over user experience.',
    insight:
      'This tension reveals a missing shared language around what design actually entails. The solution isn’t gatekeeping tools — it’s clearly communicating what makes design thinking valuable, and inviting collaboration while holding space for UX rigor.',
    emotionTags: ['Undermined', 'Threatened'],
    topicTags: ['Democratization', 'Power Dynamics'],
    growthGoalTags: ['Reclaiming Role', 'Facilitation'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        title: 'Clarify your role',
        description: 'Write one sentence that describes the unique value you bring beyond tools or templates.',
        type: 'action',
      },
      {
        title: 'Facilitate, don’t fight',
        description: 'Help a non-designer improve their idea using design principles to demonstrate collaborative leadership.',
        type: 'action',
      },
      {
        title: 'Document your thinking',
        description: 'Annotate a recent design decision with the reasoning behind it to make invisible expertise visible.',
        type: 'resource',
      },
    ],
    aliases: [
      'everyone is a designer now',
      'non designers doing design',
      'others taking over design work',
    ],
  },
  {
    id: 'ai-anxiety-role',
    title: '"Everyone Is a Designer Now?" – AI Anxiety in the Design Role',
    summary:
      'PMs and stakeholders are using AI tools to create prototypes directly, leaving designers out of early stages and diminishing their role to visual tweaks.',
    insight:
      'The anxiety isn’t about AI being too powerful, but about organizations not understanding the full value of design. Designers must reassert leadership in framing problems and direction.',
    emotionTags: ['Fear of Replacement', 'Identity Confusion'],
    topicTags: ['AI Tools', 'Design Role'],
    growthGoalTags: ['Hybrid Skills', 'Strategic Confidence'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        title: 'Prompt reversal',
        description: 'Ask ChatGPT to design a form flow, then critique it using usability heuristics to spotlight your expertise.',
        type: 'action',
      },
      {
        title: 'Redefine designer',
        description: 'Draft a tweet-length definition of your role that centers strategy, clarity, and facilitation.',
        type: 'action',
      },
      {
        title: 'Compare and reflect',
        description: 'List three differences between an AI-generated design and a human-led version to articulate your value.',
        type: 'action',
      },
    ],
    aliases: [
      'who needs designers with ai',
      'ai anxiety for designers',
      'ai taking over design role',
    ],
  },
  {
    id: 'no-path-beyond-execution',
    title: 'No Clear Path Beyond Execution',
    summary:
      "Designers are stuck in execution work and excluded from strategic conversations or leadership development, which stalls career growth and confidence.",
    insight:
      'This stagnation stems from flat structures and lack of design leadership. Without clear paths to grow, designers plateau and lose strategic influence.',
    emotionTags: ['Stuck', 'Plateau'],
    topicTags: ['Career Growth', 'Execution Trap'],
    growthGoalTags: ['Strategic Thinking', 'Vision'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        title: 'Shadow cross-functional partners',
        description: 'Join one planning or user interview session this week, even as a listener, to learn upstream context.',
        type: 'action',
      },
      {
        title: 'Practice proactive framing',
        description: 'Pick a feature and write a short “What’s the user really trying to do?” point-of-view memo.',
        type: 'action',
      },
      {
        title: 'Frame before you design',
        description: 'Before opening your design tool, write a problem statement and three user goals to anchor your work.',
        type: 'action',
      },
    ],
    aliases: ['stuck pushing pixels', 'only executing designs', 'no career growth in design'],
  },
  {
    id: 'ux-feels-undervalued',
    title: 'UX Feels Undervalued',
    summary:
      'Designers feel their role is misunderstood or undervalued, being seen as surface-level polish rather than strategic partners.',
    insight:
      'This reflects low UX maturity. Without clear roles or shared vocabulary, designers are viewed as decorators instead of collaborators. Visibility and storytelling build credibility.',
    emotionTags: ['Ignored', 'Underappreciated'],
    topicTags: ['UX Advocacy', 'Cross-Team Communication'],
    growthGoalTags: ['Influence', 'Impact Framing'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        title: 'Visualize value',
        description: 'Create a single slide showing a before-and-after experience your design improved.',
        type: 'action',
      },
      {
        title: 'Reword your work',
        description: 'Rewrite a task you completed using impact language, focusing on outcomes instead of outputs.',
        type: 'action',
      },
      {
        title: 'Build a UX story bank',
        description: 'Collect short user quotes or usability findings to reference in stakeholder conversations.',
        type: 'resource',
      },
    ],
    aliases: ['no one listens to ux', 'ux not valued', 'ux ignored'],
  },
  {
    id: 'component-chaos',
    title: 'Component Chaos',
    summary:
      'Design systems become bloated and inconsistent, making component reuse difficult and onboarding frustrating.',
    insight:
      'Chaos grows when speed trumps system governance. Without ownership and naming standards, small decisions accumulate into overwhelming inconsistency.',
    emotionTags: ['Overwhelmed', 'Frustrated'],
    topicTags: ['Design System', 'Workflow Mess'],
    growthGoalTags: ['System Thinking', 'Ownership'],
    responseMode: 'direct-resource-recommendation',
    actions: [
      {
        title: 'Pick one component to fix',
        description: 'Choose a high-visibility component and standardize its spacing, typography, and interaction states.',
        type: 'action',
      },
      {
        title: 'Rename intentionally',
        description: 'Propose a clear naming convention such as “Button / Primary / Desktop” and document it.',
        type: 'action',
      },
      {
        title: 'Reflect like a system designer',
        description: 'Write three questions about what’s broken, duplicated, or most frustrating in the system.',
        type: 'action',
      },
    ],
    aliases: ['design system chaos', 'component library mess', 'inconsistent components'],
  },
  {
    id: 'awkward-microcopy',
    title: 'Awkward Microcopy',
    summary:
      'Interface text often ends up unclear or robotic when UX writing is an afterthought, hurting clarity and tone.',
    insight:
      'Writing is frequently tacked on at the end. Without voice guidelines or user context, copy becomes mechanical. Intentional practice builds a sharper product voice.',
    emotionTags: ['Cringe', 'Doubt'],
    topicTags: ['UX Writing', 'Product Voice'],
    growthGoalTags: ['Clear Communication', 'Tone Craft'],
    responseMode: 'direct-resource-recommendation',
    actions: [
      {
        title: 'Switch the voice',
        description: 'Rewrite one awkward message in three tones (formal, playful, confident) and pick what fits best.',
        type: 'action',
      },
      {
        title: 'Context test it',
        description: 'Read the copy aloud in the actual user scenario and adjust anything that feels stiff.',
        type: 'action',
      },
      {
        title: 'Borrow brilliance',
        description: 'Screenshot three great microcopy examples and note what makes them work.',
        type: 'resource',
      },
    ],
    aliases: ['bad microcopy', 'ui copy is awkward', 'writing feels robotic'],
  },
  {
    id: 'flat-prototypes',
    title: 'Flat Prototypes',
    summary:
      'Prototypes that lack motion or realistic content feel flat, making it harder to collect feedback or convey intent.',
    insight:
      'Teams default to static screens due to time or tool constraints. Without interaction or story, usability signals get missed and selling the vision is harder.',
    emotionTags: ['Disengaged', 'Self-doubt'],
    topicTags: ['Visual Design', 'Motion Design'],
    growthGoalTags: ['Storytelling', 'Interaction Design'],
    responseMode: 'direct-resource-recommendation',
    actions: [
      {
        title: 'Add motion moments',
        description: 'Identify one key interaction and prototype a micro-animation, hover, or transition.',
        type: 'action',
      },
      {
        title: 'Layer real context',
        description: 'Swap placeholder content with real data or copy to make the experience believable.',
        type: 'action',
      },
      {
        title: 'Narrate it',
        description: 'Record a 30-second walkthrough explaining the flow as if it were live, noting empty spots.',
        type: 'action',
      },
    ],
    aliases: ['prototypes feel flat', 'static mockups', 'prototypes lack motion'],
  },
  {
    id: 'research-ignored',
    title: 'User Research Gets Ignored',
    summary:
      'Even when user research is conducted, insights are often ignored because they clash with priorities or lack storytelling.',
    insight:
      'Research gets deprioritized when it contradicts plans or feels abstract. Translating findings into crisp narratives helps stakeholders stay aligned.',
    emotionTags: ['Discouraged', 'Frustrated'],
    topicTags: ['Research', 'Insight Sharing'],
    growthGoalTags: ['Influence', 'Insight Framing'],
    responseMode: 'direct-resource-recommendation',
    actions: [
      {
        title: 'Build a one-slide insight',
        description: 'Turn one research finding into a slide with a quote and impact statement.',
        type: 'action',
      },
      {
        title: 'Frame the problem',
        description: 'Rephrase a feature brief as a user need to center the conversation on evidence.',
        type: 'action',
      },
      {
        title: 'Start an insight bank',
        description: 'Collect memorable user quotes in a shared doc so others can reference them quickly.',
        type: 'resource',
      },
    ],
    aliases: ['research ignored', 'nobody uses research', 'stakeholders ignore research'],
  },
  {
    id: 'many-hats-no-support',
    title: 'Designers Wear Many Hats, But Lack Support and Clear Role Definition',
    summary:
      "Designers juggle multiple responsibilities without the structure or clarity needed to succeed, leading to burnout and confusion about expectations.",
    insight:
      'Multidisciplinary expectations are common, but the issue is unclear ownership and pacing. Designers become patch fixes instead of strategic partners.',
    emotionTags: ['Overwhelmed', 'Invisible'],
    topicTags: ['Role Clarity', 'Burnout'],
    growthGoalTags: ['Self-Definition', 'Team Alignment'],
    responseMode: 'direct-resource-recommendation',
    actions: [
      {
        title: 'Map your hats',
        description: 'List everything you do, then mark what gives energy versus what drains you.',
        type: 'action',
      },
      {
        title: 'Clarify your value',
        description: 'Complete the sentence “When I’m at my best, I help the team by…” to stake out your lane.',
        type: 'action',
      },
      {
        title: 'Redesign your role',
        description: 'Draft an ideal job description to set boundaries or guide conversations with your manager.',
        type: 'action',
      },
    ],
    aliases: ['wear many hats', 'doing everything', 'lack role definition'],
  },
  {
    id: 'feature-request-reframing',
    title: 'Designers Struggle to Reframe Stakeholder Feature Requests',
    summary:
      'Stakeholders provide solutions instead of sharing problems, making it difficult for designers to redirect conversations productively.',
    insight:
      'This comes from a solution-first culture where decisiveness matters. Designers need gentle reframing tools to explore underlying goals together.',
    emotionTags: ['Misaligned', 'Pressured'],
    topicTags: ['Stakeholder Requests', 'Product Strategy'],
    growthGoalTags: ['Facilitation', 'Problem Framing'],
    responseMode: 'lightweight-2-step-plus-tools',
    actions: [
      {
        title: 'Ask for the goal',
        description: 'Choose one stakeholder request and ask “What problem are we solving for the user?”',
        type: 'action',
      },
      {
        title: 'Rephrase as a user need',
        description: 'Rewrite the feature as an “As a [user], I want…” statement to expose assumptions.',
        type: 'action',
      },
      {
        title: 'Create a reverse brief',
        description: 'Turn the request into a short problem statement that you and the stakeholder can refine.',
        type: 'action',
      },
    ],
    aliases: ['stakeholders give solutions', 'hard to push back on features', 'feature requests instead of problems'],
  },
  {
    id: 'analysis-paralysis',
    title: 'Analysis Paralysis',
    summary:
      'Designers overthink edge cases and flows due to perfectionism or fear of making the wrong call, which stalls progress.',
    insight:
      'Driven by unclear priorities, designers freeze when they can’t validate every scenario. Light structure and timeboxing build momentum.',
    emotionTags: ['Stuck', 'Overthinking'],
    topicTags: ['Decision-Making', 'Exploration Overload'],
    growthGoalTags: ['Prioritization', 'Creative Focus'],
    responseMode: 'lightweight-2-step-plus-tools',
    actions: [
      {
        title: 'Pick one constraint',
        description: 'Select a single principle (speed, simplicity, trust) to guide this round of design decisions.',
        type: 'action',
      },
      {
        title: 'Timebox it',
        description: 'Set a 20-minute timer and commit to choosing one direction, even if it’s imperfect.',
        type: 'action',
      },
      {
        title: 'Write three priorities',
        description: 'Identify the three things that matter most and let the rest go for now.',
        type: 'action',
      },
    ],
    aliases: ['overthinking design', 'too much analysis', 'stuck deciding'],
  },
  {
    id: 'tool-mastery-not-enough',
    title: "Being Good at Tools Isn't Enough Anymore",
    summary:
      'Designers feel replaceable when mastery of tools no longer differentiates them, especially as AI accelerates visual output.',
    insight:
      'Tool fluency was once a proxy for design expertise. As AI speeds execution, leaning into strategy, storytelling, and facilitation refocuses value.',
    emotionTags: ['Insecurity', 'Identity Crisis'],
    topicTags: ['Tool Mastery', 'Career Plateau'],
    growthGoalTags: ['Strategy', 'Identity Building'],
    responseMode: 'lightweight-2-step-plus-tools',
    actions: [
      {
        title: 'Teach what you know',
        description: 'Record a short tutorial sharing an advanced technique to reveal your depth of knowledge.',
        type: 'action',
      },
      {
        title: 'Focus on outcomes',
        description: 'Select one project and write three sentences about the problem you solved, not the tool you used.',
        type: 'action',
      },
      {
        title: 'Upskill intentionally',
        description: 'Spend 15 minutes learning about strategy, systems thinking, or facilitation to broaden your range.',
        type: 'resource',
      },
    ],
    aliases: ['tools not enough', 'feel replaceable despite skills', 'ai makes tools easy'],
  },
]


