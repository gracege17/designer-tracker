export type ChallengeResponseMode =
  | 'structured-3-step-guide'
  | 'direct-resource-recommendation'
  | 'lightweight-2-step-plus-tools'
  | 'action-focused'

export interface ChallengeAction {
  title: string
  description: string
  type?: 'action' | 'resource' | 'tool' | 'podcast' | 'book'
  url?: string
  searchQuery?: string // Copy-pasteable Google search query
  aiPrompt?: string // Copy-pasteable ChatGPT/Gemini prompt
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
  triggerExamples?: string[]
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
    id: 'ai-tool-prompt-clarity',
    title: 'Fuzzy Prompts → Fuzzy Results with AI Tools',
    summary:
      'Working with AI coding tools like Cursor feels frustrating and unpredictable when prompts aren\'t clear or specific enough, leading to outputs that don\'t match expectations.',
    insight:
      'Designers working with AI tools are essentially "designing with language." When prompts are vague, the output becomes unpredictable — creating friction, especially when trying to move fast or be precise. Clear, structured prompts = better control.',
    emotionTags: ['Frustrated', 'Annoyed', 'Stuck'],
    topicTags: ['AI Tools', 'Cursor', 'Prompt Engineering'],
    growthGoalTags: ['AI Collaboration', 'Prompt Clarity', 'Tool Control'],
    responseMode: 'lightweight-2-step-plus-tools',
    notes: 'This is specifically for designers/builders frustrated with AI coding assistants like Cursor, GitHub Copilot, etc.',
    actions: [
      {
        title: 'Use the "Context + Goal + Constraint" formula',
        description: 'Before asking, state: "I\'m building [X], I need [Y], and it should [Z]." Specificity reduces ambiguity.',
        type: 'action',
        url: 'https://www.promptingguide.ai/techniques/fewshot',
      },
      {
        title: 'Break requests into smaller chunks',
        description: 'Instead of "build a form," try "create a text input with validation" → then "add a submit button" → then "connect to state."',
        type: 'action',
        url: 'https://learnprompting.org/docs/basics/techniques',
      },
      {
        title: 'Use examples in your prompt',
        description: 'Show the AI what "good" looks like: "Make it like this: [paste example code or describe reference]."',
        type: 'action',
        url: 'https://www.promptingguide.ai/techniques/fewshot',
      },
      {
        title: 'Watch: Prompt Engineering for Designers',
        description: 'A 10-minute primer on structuring effective prompts for creative and technical AI tools.',
        type: 'resource',
        url: 'https://www.youtube.com/results?search_query=prompt+engineering+for+designers',
      },
      {
        title: 'Read: Cursor Tips & Tricks',
        description: 'Community-sourced guide to getting better results from Cursor with clear prompt patterns.',
        type: 'resource',
        url: 'https://github.com/getcursor/cursor/discussions',
      },
    ],
    aliases: [
      'cursor is hard to use',
      'ai tool not working',
      'frustrated with cursor',
      'ai gives wrong results',
      'cant control cursor',
    ],
    triggerExamples: [
      'cursor is hard to control',
      'hard to control',
      'cursor',
      'tool is confusing',
      'frustrated with tool',
      'frustrated with cursor',
      'lost in the interface',
      'ai not understanding',
      'unclear output',
      'unpredictable results',
      'cursor keeps messing up',
      'hard to get what i want',
      'using cursor',
      'building with cursor',
    ],
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
    triggerExamples: ['stuck', 'blocked', 'can\'t move forward', 'paralyzed', 'no progress'],
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
    aliases: ['tools not enough', 'feel replaceable despite skills', 'ai makes tools easy', 'figma not enough'],
  },
  {
    id: 'deadline-pressure-stress',
    title: 'Deadline pressure feels intense',
    summary:
      'Your body flagged today’s work as stressful. When pressure spikes, clarity and momentum come from shrinking the next step.',
    insight:
      'Anxious energy is a signal, not a verdict. Translate the pressure into a plan so your mind can settle and your craft can show up again.',
    emotionTags: ['Anxiety', 'Pressure', 'Stress'],
    topicTags: ['Planning', 'Focus', 'Workload'],
    growthGoalTags: ['Grounding', 'Prioritization'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        type: 'action',
        title: 'Reset the plan',
        description: 'List the next three moves only — nothing beyond. Narrowing scope calms urgency.',
      },
      {
        type: 'tool',
        title: 'Daily reset checklist',
        description: 'Use a simple Notion template to close loops and surface one priority at a time.',
        searchQuery: 'Notion daily reset template productivity',
        aiPrompt: 'Help me create a daily reset checklist template in Notion. I need sections for: closing loops, identifying top priority, and planning tomorrow. Make it simple and actionable.',
      },
      {
        type: 'podcast',
        title: 'Managing design stress',
        description: 'Design Better Podcast episode on coping with pressure without burning out.',
        searchQuery: 'Design Better Podcast managing stress burnout designers',
        aiPrompt: 'I\'m a designer feeling stressed about deadlines and pressure. Can you recommend strategies for managing design stress and avoiding burnout? Give me practical, actionable advice.',
      },
      {
        type: 'book',
        title: 'The Obstacle Is the Way',
        description: 'Ryan Holiday’s guide to reframing obstacles into momentum-building constraints.',
      },
    ],
    aliases: [
      'stressed about deadlines',
      'deadline pressure',
      'feeling pressure from today',
      'overwhelmed by workload',
    ],
  },
  {
    id: 'low-energy-recovery',
    title: 'Energy dipped throughout the day',
    summary:
      'Multiple moments today felt draining. That’s your cue to trade willpower for rhythm and recovery.',
    insight:
      'Creative energy is cyclical. Designing rest into your flow keeps craft sharp and burnout away.',
    emotionTags: ['Drained', 'Tired', 'Low Energy'],
    topicTags: ['Rest', 'Sustainable Pace'],
    growthGoalTags: ['Recovery', 'Self-Care'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        type: 'action',
        title: 'Protect a micro-break',
        description: 'Block 10 minutes after the next focus block — stretch, walk, or breathe.',
      },
      {
        type: 'tool',
        title: 'Designer recharge meditation',
        description: 'A five-minute Calm session built for creative reset.',
        searchQuery: 'Calm app meditation for designers creative reset',
        aiPrompt: 'I need a 5-minute meditation script for designers to recharge during the workday. Focus on creative reset, reducing mental fatigue, and restoring focus. Make it practical and easy to follow.',
      },
      {
        type: 'podcast',
        title: 'Avoiding designer burnout',
        description: 'Design Details episode on spotting exhaustion before it derails momentum.',
        searchQuery: 'Design Details podcast burnout designers exhaustion',
        aiPrompt: 'I\'m a designer starting to feel burned out. What are early warning signs of designer burnout, and what practical steps can I take to prevent it? Give me actionable strategies.',
      },
      {
        type: 'book',
        title: 'Rest Is Also Growth',
        description: 'Short essays on why recovery is essential to creative excellence.',
      },
    ],
    aliases: ['feeling drained', 'low energy', 'need rest', 'burned out'],
  },
  {
    id: 'creative-block-frustration',
    title: 'Creative momentum stalled',
    summary:
      'Today’s work carried some stuck or frustrated moments. Let’s add motion, reflection, and inspiration back into the loop.',
    insight:
      'Blocks are a request for new inputs. Change the environment, the medium, or the conversation to unstick your thinking.',
    emotionTags: ['Frustrated', 'Stuck', 'Blocked'],
    topicTags: ['Inspiration', 'Creative Process'],
    growthGoalTags: ['Exploration', 'Momentum'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        type: 'book',
        title: 'Overcoming Creative Blocks',
        description: 'Austin Kleon’s playbook for moving through creative friction.',
        searchQuery: 'Austin Kleon creative blocks book Steal Like an Artist',
        aiPrompt: 'I\'m experiencing a creative block as a designer. Based on Austin Kleon\'s approach to overcoming creative blocks, what practical strategies can I use to break through? Give me actionable steps.',
      },
      {
        type: 'tool',
        title: 'Creative research template',
        description: 'Gather references and sparks in a Notion board to reboot curiosity.',
        searchQuery: 'Notion creative research template design inspiration board',
        aiPrompt: 'Help me create a Notion template for creative research. I need sections for: design references, inspiration, color palettes, typography examples, and notes. Make it visual and easy to organize.',
      },
      {
        type: 'podcast',
        title: 'When projects go wrong',
        description: '99% Invisible stories on reframing failures into forward motion.',
        url: 'https://99percentinvisible.org',
      },
      {
        type: 'action',
        title: 'Five-minute reset',
        description: 'Step away, sketch with pen and paper, or talk it out loud to a teammate.',
      },
    ],
    aliases: ['stuck and frustrated', 'creative block', 'can’t make progress'],
  },
  {
    id: 'creative-flow-momentum',
    title: 'Ride today’s creative momentum',
    summary:
      'You logged energized or joyful moments — perfect fuel for a bold move. Let’s amplify what worked.',
    insight:
      'Momentum compounds when you direct it with intention. Use today’s spark to move the needle on something meaningful.',
    emotionTags: ['Excited', 'Joyful', 'Energized'],
    topicTags: ['Growth', 'Momentum'],
    growthGoalTags: ['Amplitude', 'Impact'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        type: 'action',
        title: 'Tackle the hard thing',
        description: 'Use the energy window to move a high-impact task forward, even 10%.',
      },
      {
        type: 'tool',
        title: 'Design systems organizer',
        description: 'Channel the flow into a Figma cleanup or component improvement.',
        searchQuery: 'Figma design system component library organization best practices',
        aiPrompt: 'I want to organize my Figma design system better. What\'s the best way to structure components, create a component library, and maintain consistency? Give me a step-by-step approach.',
      },
      {
        type: 'podcast',
        title: 'Scaling your design impact',
        description: 'High Resolution episode on expanding influence when energy is high.',
        searchQuery: 'High Resolution podcast scaling design impact influence',
        aiPrompt: 'I\'m a designer with high energy and want to scale my impact. How can I expand my influence, take on bigger projects, and make a greater impact in my organization? Give me practical strategies.',
      },
      {
        type: 'book',
        title: 'Creative Flow',
        description: 'Mihaly Csikszentmihalyi’s classic on sustaining deep engagement.',
        searchQuery: 'Mihaly Csikszentmihalyi Flow book creative state',
        aiPrompt: 'Explain Mihaly Csikszentmihalyi\'s concept of "flow" and how I can achieve it as a designer. What conditions help me enter flow state, and how can I sustain it during creative work?',
      },
    ],
    aliases: [
      'riding creative momentum',
      'feeling energized',
      'in flow today',
      'creative high',
    ],
  },
  {
    id: 'general-overwhelm-focus',
    title: 'Scattered across too many tasks',
    summary:
      'Everything felt important today, which steals focus. Let\'s shrink decision load and rebuild momentum with one clear move.',
    insight:
      'Overwhelm fades when you choose a single anchor. Name the impact, protect a container for it, and let the rest wait.',
    emotionTags: ['Overwhelmed', 'Scattered'],
    topicTags: ['Prioritization', 'Focus', 'Task Management'],
    growthGoalTags: ['Clarity', 'Execution'],
    responseMode: 'structured-3-step-guide',
    actions: [
      {
        type: 'tool',
        title: 'Minimal task board',
        description: 'A pared-down Notion board for today’s top three priorities only.',
        searchQuery: 'Notion minimal task board template top 3 priorities',
        aiPrompt: 'Create a simple Notion template for a minimal task board. I only want to see my top 3 priorities for today. Make it clean, focused, and help me avoid overwhelm.',
      },
      {
        type: 'book',
        title: 'Make Time',
        description: 'Jake Knapp’s framework for choosing a daily highlight and protecting energy.',
        searchQuery: 'Jake Knapp Make Time book daily highlight framework',
        aiPrompt: 'Explain Jake Knapp\'s "Make Time" framework. How do I choose a daily highlight and protect my energy? Give me practical steps to implement this as a designer.',
      },
      {
        type: 'podcast',
        title: 'Finding balance in design work',
        description: 'Design Better stories on pacing multiple tracks without burning out.',
        searchQuery: 'Design Better Podcast balance multiple projects designers',
        aiPrompt: 'I\'m juggling multiple design projects and feeling overwhelmed. How can I find balance, pace myself, and avoid burning out? Give me practical strategies for managing multiple tracks.',
      },
      {
        type: 'action',
        title: 'Set a focus timer',
        description: 'Commit to 25 minutes on the highest leverage task, then reassess.',
      },
    ],
    aliases: ['too many tasks', 'scattered', 'overwhelmed with work'],
    triggerExamples: [
      'too many tasks',
      'scattered across tasks',
      'overwhelmed with multiple projects',
      'juggling too many things',
    ],
    notes: 'This challenge is specifically about task/project overwhelm, NOT debugging or technical bugs. For debugging frustration, see "Debugging feels endless" challenge.',
  },
  {
    id: 'debugging-overwhelm',
    title: 'Debugging feels endless',
    summary:
      'Too many bugs pile up, making debugging feel like an endless cycle. Each fix reveals another issue, draining energy and momentum.',
    insight:
      'Debugging overwhelm happens when problems compound without a clear strategy. Setting up a systematic debugging workflow helps you tackle issues efficiently.',
    emotionTags: ['Frustrated', 'Drained', 'Overwhelmed'],
    topicTags: ['Debugging', 'Technical Work', 'Problem Solving'],
    growthGoalTags: ['Systematic Approach', 'Debugging Workflow'],
    responseMode: 'action-focused',
    actions: [
      {
        type: 'action',
        title: 'Set up a debugging checklist',
        description: 'Create a standard process: 1) Reproduce the bug, 2) Check console/network errors, 3) Isolate the component, 4) Test one fix at a time, 5) Verify the fix works.',
        url: 'https://www.freecodecamp.org/news/debugging-guide/',
      },
      {
        type: 'tool',
        title: 'Use browser DevTools effectively',
        description: 'Set breakpoints, inspect elements, check Network tab for failed requests, use Console to test code snippets. Master these tools to debug faster.',
        url: 'https://developer.chrome.com/docs/devtools',
      },
    ],
    aliases: [
      'too many bugs',
      'debugging is endless',
      'bugs keep piling up',
      'frustrated with bugs',
      'debugging overwhelm',
    ],
    triggerExamples: [
      'too many bugs',
      'debugging',
      'bugs keep appearing',
      'endless debugging',
      'frustrated debugging',
      'can\'t fix all the bugs',
    ],
  },
]


