# @tokenring-ai/thinking

Structured reasoning service with 13 specialized thinking tools for disciplined problem-solving and persistent state management.

## Overview

The `@tokenring-ai/thinking` package provides a comprehensive suite of 13 structured reasoning tools that implement various thinking methodologies with persistent state management. Each tool guides AI agents through disciplined problem-solving using proven human cognitive frameworks and maintains reasoning sessions across multiple calls.

## Features

- **13 Structured Thinking Tools**: Scientific method, design thinking, root cause analysis, SWOT analysis, and more
- **State Management**: Persistent reasoning sessions that track progress across multiple calls
- **Automatic Integration**: Tools automatically register with chat services and agents
- **Session Isolation**: Independent session tracking for each reasoning tool
- **Progress Tracking**: Monitor completed steps and reasoning progress
- **Session Cleanup**: Clear individual or all reasoning sessions
- **Tool Integration**: Automatically registered with Token Ring agent chat systems
- **Zod Validation**: Typed input schemas for all tools
- **Error Handling**: Comprehensive error handling and validation
- **Testing**: Full test coverage with vitest

## Installation

```bash
bun install @tokenring-ai/thinking
```

The package automatically registers with the Token Ring application when included in your application's dependencies.

## Package Structure

```
pkg/thinking/
├── index.ts              # Package exports
├── plugin.ts             # Auto-registration plugin
├── ThinkingService.ts    # Core service implementation
├── tools.ts              # Tool exports and registry
├── state/
│   └── thinkingState.ts  # State management for sessions
├── tools/                # Individual tool implementations
│   ├── scientificMethod.ts
│   ├── socraticDialogue.ts
│   ├── designThinking.ts
│   ├── rootCauseAnalysis.ts
│   ├── swotAnalysis.ts
│   ├── preMortem.ts
│   ├── dialecticalReasoning.ts
│   ├── firstPrinciples.ts
│   ├── decisionMatrix.ts
│   ├── lateralThinking.ts
│   ├── agileSprint.ts
│   ├── feynmanTechnique.ts
│   └── sixThinkingHats.ts
├── test/                 # Test suite
│   ├── tools.test.ts
│   ├── integration.test.ts
│   ├── firstPrinciples.test.ts
│   ├── decisionMatrix.test.ts
│   ├── scientificMethod.test.ts
│   ├── thinkingState.test.ts
│   └── thinkingService.test.ts
└── vitest.config.ts      # Test configuration
```

## Core Components

### ThinkingService

Main service class that manages reasoning sessions and state persistence.

```typescript
import { ThinkingService } from "@tokenring-ai/thinking";

const thinkingService = new ThinkingService();
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Service name ("ThinkingService") |
| `description` | `string` | Service description ("Provides structured reasoning functionality") |

**Methods:**

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `attach` | `agent: Agent` | `void` | Initializes ThinkingState for agent |
| `processStep` | `toolName: string`, `args: any`, `agent: Agent`, `processor: (session, args) => any` | `ReasoningSession` | Processes step in reasoning session and returns updated session |
| `clearSession` | `toolName: string`, `agent: Agent` | `void` | Clears specific tool session |
| `clearAll` | `agent: Agent` | `void` | Clears all reasoning sessions |

### ThinkingState

Agent state slice that manages reasoning session persistence.

```typescript
import { ThinkingState } from "@tokenring-ai/thinking";

// Automatically attached to agents by ThinkingService
const state = agent.getState(ThinkingState);
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | State slice name ("ThinkingState") |
| `serializationSchema` | `ZodSchema` | Zod schema for serialization |
| `sessions` | `Map<string, ReasoningSession>` | Active reasoning sessions |

**Methods:**

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `constructor` | `data: Partial<ThinkingState>` | `void` | Create new state instance with optional initial data |
| `transferStateFromParent` | `parent: Agent` | `void` | Transfer state from parent agent |
| `reset` | `what?: ResetWhat[]` | `void` | Reset state (clears all sessions when called) |
| `serialize` | - | `z.output<typeof serializationSchema>` | Returns serialized state object |
| `deserialize` | `data: z.output<typeof serializationSchema>` | `void` | Load state from serialized data |
| `show` | - | `string[]` | Returns session summary array |

### ReasoningSession

Individual reasoning session state interface.

```typescript
interface ReasoningSession {
  tool: string;                  // Tool name
  problem: string;               // Problem being investigated
  stepNumber: number;            // Current step count
  data: Record<string, any>;     // Tool-specific data storage
  completedSteps: string[];      // Steps completed
  complete: boolean;             // Whether reasoning is complete
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `tool` | `string` | Tool name (e.g., "scientific-method-reasoning") |
| `problem` | `string` | Problem being investigated |
| `stepNumber` | `number` | Current step count in the session |
| `data` | `Record<string, any>` | Tool-specific data storage |
| `completedSteps` | `string[]` | Array of completed step names |
| `complete` | `boolean` | Whether reasoning is complete |

## Available Reasoning Tools

### 1. Scientific Method (`scientific-method-reasoning`)

A strictly disciplined reasoning tool that enforces exact adherence to the scientific method. The tool maintains persistent state anchored to a single, fixed problem/question. Every contribution must explicitly advance one of the core steps of the scientific method.

**Description:**
```
A strictly disciplined reasoning tool that enforces exact adherence to the scientific method.

The tool maintains persistent state anchored to a single, fixed problem/question. Every contribution must explicitly advance one of the core steps of the scientific method. No free-form thoughts, confidence scores, summaries, or extraneous features are permitted—only direct contributions to the defined steps.

Core scientific method steps enforced:
1. Question/Observation: Clearly state the problem and relevant observations.
2. Background Research: Gather and restate existing knowledge, constraints, or facts.
3. Hypothesis: Formulate testable hypotheses (one or more; each must be falsifiable).
4. Prediction: State specific, testable predictions derived from a hypothesis.
5. Testing/Experimentation: Perform tests (deductive reasoning, calculations, counterexamples, or external verification) to gather evidence.
6. Analysis: Interpret evidence objectively—does it support, refute, or require refinement of the hypothesis?
7. Conclusion: Draw evidence-based conclusion; if unresolved, iterate by revising earlier steps.

The process is iterative and self-correcting. Continue until a hypothesis is conclusively supported or refuted, or the question is fully answered.

Rules:
- First call must define the problem and begin with step 1 or 2.
- Every subsequent call must specify exactly one step and contribute only to it.
- Hypotheses are tracked explicitly; testing and analysis must reference them.
- Only set nextThoughtNeeded: false when a final, evidence-based conclusion is reached.
- Ignore all irrelevant information.
- Final answer must directly follow from the completed scientific process.
```

**Core Steps:**
1. `question_observation` - Clearly state the problem and relevant observations
2. `background_research` - Gather and restate existing knowledge, constraints, or facts
3. `hypothesis_formulation` - Formulate testable hypotheses (one or more; each must be falsifiable)
4. `prediction` - State specific, testable predictions derived from a hypothesis
5. `testing_experimentation` - Perform tests to gather evidence
6. `analysis` - Interpret evidence objectively—does it support, refute, or require refinement of the hypothesis?
7. `conclusion` - Draw evidence-based conclusion; if unresolved, iterate by revising earlier steps

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional().describe("The exact question or problem to investigate—required on first call only"),
  step: z.enum([
    "question_observation",
    "background_research",
    "hypothesis_formulation",
    "prediction",
    "testing_experimentation",
    "analysis",
    "conclusion"
  ]).describe("The specific scientific method step this contribution advances"),
  content: z.string().describe("Clear, focused contribution to the chosen step"),
  targets_hypothesis_id: z.array(z.string()).optional().describe("Hypothesis ID(s) this step references (e.g., ['h1'])—required for prediction, testing, analysis"),
  hypothesis_update: z.object({
    hypothesis_id: z.string().optional().describe("Existing ID to modify/refute (omit for new hypothesis)"),
    new_hypothesis_text: z.string().optional().describe("Text of a new or revised hypothesis (must be testable)"),
    action: z.enum(["propose", "refine", "refute", "support"]).optional().describe("Action taken on the hypothesis in this step")
  }).optional().describe("Create or update a hypothesis in hypothesis_formulation or analysis steps"),
  nextThoughtNeeded: z.boolean().describe("False only when conclusion step provides a final, evidence-based answer"),
  final_answer: z.string().optional().describe("The concluded answer—required when nextThoughtNeeded is false; must be justified by prior steps")
});
```

**Usage Example:**

```typescript
// First call - initialize with problem and observation
const result1 = await agent.executeTool('scientific-method-reasoning', {
  problem: "Why does water boil at different temperatures at different altitudes?",
  step: "question_observation",
  content: "Water boils at 100°C at sea level but at lower temperatures at higher altitudes.",
  nextThoughtNeeded: true
});

// Formulate hypothesis
const result2 = await agent.executeTool('scientific-method-reasoning', {
  step: "hypothesis_formulation",
  content: "Lower atmospheric pressure at higher altitudes reduces the boiling point.",
  hypothesis_update: {
    new_hypothesis_text: "Reduced atmospheric pressure causes water to boil at lower temperatures",
    action: "propose"
  },
  nextThoughtNeeded: true
});

// Test the hypothesis
const result3 = await agent.executeTool('scientific-method-reasoning', {
  step: "testing_experimentation",
  content: "At 3000m altitude, atmospheric pressure is ~70% of sea level, and water boils at ~90°C.",
  targets_hypothesis_id: ["h1"],
  nextThoughtNeeded: true
});

// Final conclusion
const result4 = await agent.executeTool('scientific-method-reasoning', {
  step: "conclusion",
  content: "Evidence confirms that reduced atmospheric pressure at higher altitudes causes water to boil at lower temperatures.",
  nextThoughtNeeded: false,
  final_answer: "Reduced atmospheric pressure at higher altitudes causes water to boil at lower temperatures."
});
```

### 2. Socratic Dialogue (`socratic-dialogue`)

Questions assumptions through structured inquiry.

**Description:**
```
Socratic dialogue tool for questioning assumptions through structured inquiry.

Steps: Question formulation → Assumption identification → Challenge assumption → Explore contradiction → Refine understanding → Synthesis
```

**Steps:**
1. `question_formulation` - Formulate the initial question
2. `assumption_identification` - Identify underlying assumptions
3. `challenge_assumption` - Challenge identified assumptions
4. `explore_contradiction` - Explore contradictions that arise
5. `refine_understanding` - Refine understanding based on analysis
6. `synthesis` - Synthesize new understanding

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["question_formulation", "assumption_identification", "challenge_assumption", "explore_contradiction", "refine_understanding", "synthesis"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('socratic-dialogue', {
  problem: "Is democracy the best form of government?",
  step: "question_formulation",
  content: "What makes a form of government 'best'?",
  nextThoughtNeeded: true
});

await agent.executeTool('socratic-dialogue', {
  step: "assumption_identification",
  content: "Assumption: 'Best' means most efficient at making decisions",
  nextThoughtNeeded: true
});

await agent.executeTool('socratic-dialogue', {
  step: "challenge_assumption",
  content: "Is efficiency the most important criterion, or should we consider representation and justice?",
  nextThoughtNeeded: true
});
```

### 3. Design Thinking (`design-thinking`)

Human-centered design process.

**Description:**
```
Design thinking tool for human-centered problem solving.

Steps: Empathize → Define problem → Ideate → Prototype → Test → Iterate
```

**Steps:**
1. `empathize` - Understand user needs and perspectives
2. `define` - Define the problem clearly
3. `ideate` - Generate creative solutions
4. `prototype` - Build prototypes of solutions
5. `test` - Test prototypes with users
6. `iterate` - Iterate based on feedback

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["empathize", "define", "ideate", "prototype", "test", "iterate"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('design-thinking', {
  problem: "Design a better mobile app for task management",
  step: "empathize",
  content: "Users need simple, intuitive task organization with minimal cognitive load",
  nextThoughtNeeded: true
});

await agent.executeTool('design-thinking', {
  step: "ideate",
  content: "Create a gesture-based interface for quick task manipulation",
  nextThoughtNeeded: true
});

await agent.executeTool('design-thinking', {
  step: "prototype",
  content: "Build a Figma prototype with swipe gestures for task completion",
  nextThoughtNeeded: true
});
```

### 4. Root Cause Analysis (`root-cause-analysis`)

5 Whys methodology for finding fundamental causes.

**Description:**
```
Root cause analysis (5 Whys) tool for drilling down to fundamental causes.

Steps: State problem → Ask why → Record answer → Ask why again (repeat 5x) → Identify root cause → Propose solution
```

**Steps:**
1. `state_problem` - Clearly state the problem
2. `ask_why` - Ask why the problem occurs
3. `identify_root_cause` - Identify the fundamental root cause
4. `propose_solution` - Propose a solution addressing the root cause

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["state_problem", "ask_why", "identify_root_cause", "propose_solution"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('root-cause-analysis', {
  problem: "Customer complaints about slow response times",
  step: "ask_why",
  content: "Why are response times slow? Because support team is understaffed",
  nextThoughtNeeded: true
});

await agent.executeTool('root-cause-analysis', {
  step: "ask_why",
  content: "Why is the support team understaffed? Because hiring process is too slow",
  nextThoughtNeeded: true
});

await agent.executeTool('root-cause-analysis', {
  step: "identify_root_cause",
  content: "Root cause: Inefficient hiring process prevents timely team expansion",
  nextThoughtNeeded: true
});
```

### 5. SWOT Analysis (`swot-analysis`)

Strategic planning through strengths, weaknesses, opportunities, threats.

**Description:**
```
SWOT analysis tool for structured strategic planning.

Steps: Define objective → Identify strengths → Identify weaknesses → Identify opportunities → Identify threats → Synthesize strategy
```

**Steps:**
1. `define_objective` - Define the objective or goal to analyze
2. `strengths` - Identify internal strengths
3. `weaknesses` - Identify internal weaknesses
4. `opportunities` - Identify external opportunities
5. `threats` - Identify external threats
6. `synthesize_strategy` - Synthesize findings into a strategy

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional().describe("The objective or goal to analyze"),
  step: z.enum(["define_objective", "strengths", "weaknesses", "opportunities", "threats", "synthesize_strategy"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('swot-analysis', {
  problem: "Expanding our startup into international markets",
  step: "strengths",
  content: "We have strong technical expertise and proven product-market fit",
  nextThoughtNeeded: true
});

await agent.executeTool('swot-analysis', {
  step: "weaknesses",
  content: "Limited marketing budget and no international presence",
  nextThoughtNeeded: true
});

await agent.executeTool('swot-analysis', {
  step: "opportunities",
  content: "Growing demand for our product type in Asian markets",
  nextThoughtNeeded: true
});
```

### 6. Pre-Mortem (`pre-mortem`)

Imagines failure to prevent it.

**Description:**
```
Pre-mortem analysis tool for imagining failure to prevent it.

Steps: Define goal → Assume failure → List reasons for failure → Assess likelihood → Develop mitigations → Revise plan
```

**Steps:**
1. `define_goal` - Define the goal or plan to analyze
2. `assume_failure` - Assume the plan has failed
3. `list_failure_reasons` - List reasons for the failure
4. `assess_likelihood` - Assess likelihood of each failure reason
5. `develop_mitigations` - Develop mitigations for high-likelihood failures
6. `revise_plan` - Revise the plan based on mitigations

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional().describe("The goal or plan to analyze"),
  step: z.enum(["define_goal", "assume_failure", "list_failure_reasons", "assess_likelihood", "develop_mitigations", "revise_plan"]),
  content: z.string(),
  likelihood: z.enum(["low", "medium", "high"]).optional(),
  targets_scenario: z.string().optional(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('pre-mortem', {
  problem: "Launching our new product feature",
  step: "assume_failure",
  content: "The feature launch failed to meet adoption targets",
  nextThoughtNeeded: true
});

await agent.executeTool('pre-mortem', {
  step: "list_failure_reasons",
  content: "Users don't understand how to use the new feature",
  likelihood: "high",
  nextThoughtNeeded: true
});

await agent.executeTool('pre-mortem', {
  step: "develop_mitigations",
  content: "Create onboarding tutorial and in-app guidance",
  targets_scenario: "Users don't understand how to use the new feature",
  nextThoughtNeeded: true
});
```

### 7. Dialectical Reasoning (`dialectical-reasoning`)

Considers opposing views.

**Description:**
```
Dialectical reasoning tool for considering opposing views.

Steps: State thesis → Develop antithesis → Identify contradictions → Find common ground → Synthesize higher understanding
```

**Steps:**
1. `state_thesis` - State the initial position or thesis
2. `develop_antithesis` - Develop the opposing position
3. `identify_contradictions` - Identify contradictions between thesis and antithesis
4. `find_common_ground` - Find common ground between opposing views
5. `synthesize` - Synthesize a higher understanding

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["state_thesis", "develop_antithesis", "identify_contradictions", "find_common_ground", "synthesize"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('dialectical-reasoning', {
  problem: "Should we prioritize growth or profitability?",
  step: "state_thesis",
  content: "We should prioritize growth to capture market share",
  nextThoughtNeeded: true
});

await agent.executeTool('dialectical-reasoning', {
  step: "develop_antithesis",
  content: "We should prioritize profitability to ensure long-term sustainability",
  nextThoughtNeeded: true
});

await agent.executeTool('dialectical-reasoning', {
  step: "identify_contradictions",
  content: "Growth requires investment which reduces short-term profitability",
  nextThoughtNeeded: true
});
```

### 8. First Principles (`first-principles`)

Breaks down to fundamental truths.

**Description:**
```
First principles thinking tool for breaking down to fundamental truths.

Steps: State problem → Identify assumptions → Challenge assumptions → Break to fundamental truths → Rebuild from basics → Novel solution
```

**Steps:**
1. `state_problem` - State the problem to solve
2. `identify_assumptions` - Identify assumptions about the problem
3. `challenge_assumptions` - Challenge each assumption
4. `break_to_fundamentals` - Break down to fundamental truths
5. `rebuild_from_basics` - Rebuild solution from fundamentals
6. `novel_solution` - Create novel solution

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["state_problem", "identify_assumptions", "challenge_assumptions", "break_to_fundamentals", "rebuild_from_basics", "novel_solution"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('first-principles', {
  problem: "How can we reduce battery costs?",
  step: "identify_assumptions",
  content: "Assumption: Batteries must use current lithium-ion technology",
  nextThoughtNeeded: true
});

await agent.executeTool('first-principles', {
  step: "challenge_assumptions",
  content: "What if we use different chemical compositions or energy storage methods?",
  nextThoughtNeeded: true
});

await agent.executeTool('first-principles', {
  step: "break_to_fundamentals",
  content: "Fundamental truth: Energy storage requires chemical potential difference",
  nextThoughtNeeded: true
});
```

### 9. Decision Matrix (`decision-matrix`)

Structured multi-criteria decision making.

**Description:**
```
Decision matrix tool for structured multi-criteria decision making.

Steps: Define decision → List options → Define criteria → Weight criteria → Score each option → Calculate totals → Decide
```

**Steps:**
1. `define_decision` - Define the decision to be made
2. `list_options` - List available options
3. `define_criteria` - Define evaluation criteria
4. `weight_criteria` - Weight the criteria by importance
5. `score_options` - Score each option against each criterion
6. `calculate_decide` - Calculate totals and make decision

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["define_decision", "list_options", "define_criteria", "weight_criteria", "score_options", "calculate_decide"]),
  content: z.string(),
  weight: z.number().optional(),
  option: z.string().optional(),
  criterion: z.string().optional(),
  score: z.number().optional(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('decision-matrix', {
  problem: "Which cloud provider should we choose?",
  step: "define_decision",
  content: "Select the most effective cloud provider for our project",
  nextThoughtNeeded: true
});

await agent.executeTool('decision-matrix', {
  step: "list_options",
  content: "AWS",
  nextThoughtNeeded: true
});

await agent.executeTool('decision-matrix', {
  step: "define_criteria",
  content: "Performance",
  weight: 3,
  nextThoughtNeeded: true
});

await agent.executeTool('decision-matrix', {
  step: "score_options",
  option: "AWS",
  criterion: "Performance",
  score: 8,
  nextThoughtNeeded: true
});
```

### 10. Lateral Thinking (`lateral-thinking`)

Creative problem reframing.

**Description:**
```
Lateral thinking tool for creative problem reframing.

Steps: State problem → Generate random stimulus → Force connection → Explore tangent → Extract insight → Apply to original problem
```

**Steps:**
1. `state_problem` - State the problem
2. `generate_stimulus` - Generate random stimulus
3. `force_connection` - Force connection between stimulus and problem
4. `explore_tangent` - Explore the tangent idea
5. `extract_insight` - Extract insight from exploration
6. `apply_to_problem` - Apply insight to original problem

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["state_problem", "generate_stimulus", "force_connection", "explore_tangent", "extract_insight", "apply_to_problem"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('lateral-thinking', {
  problem: "How to reduce office space usage?",
  step: "generate_stimulus",
  content: "Coffee shops have high productivity per square foot",
  nextThoughtNeeded: true
});

await agent.executeTool('lateral-thinking', {
  step: "force_connection",
  content: "What if employees worked from coffee shops 2 days per week?",
  nextThoughtNeeded: true
});

await agent.executeTool('lateral-thinking', {
  step: "extract_insight",
  content: "Hybrid remote work could reduce office space needs by 40%",
  nextThoughtNeeded: true
});
```

### 11. Agile Sprint (`agile-sprint`)

Iterative development planning.

**Description:**
```
Agile sprint planning tool for iterative development.

Steps: Define goal → Break into stories → Estimate effort → Prioritize → Plan sprint → Execute → Review → Retrospect
```

**Steps:**
1. `define_goal` - Define the sprint goal
2. `break_into_stories` - Break goal into user stories
3. `estimate_effort` - Estimate effort for each story
4. `prioritize` - Prioritize stories
5. `plan_sprint` - Plan the sprint
6. `execute` - Execute sprint tasks
7. `review` - Review sprint results
8. `retrospect` - Conduct retrospective

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["define_goal", "break_into_stories", "estimate_effort", "prioritize", "plan_sprint", "execute", "review", "retrospect"]),
  content: z.string(),
  estimate: z.number().optional(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('agile-sprint', {
  problem: "Build a customer portal in 2 weeks",
  step: "break_into_stories",
  content: "User authentication module",
  estimate: 3,
  nextThoughtNeeded: true
});

await agent.executeTool('agile-sprint', {
  step: "break_into_stories",
  content: "Dashboard with account overview",
  estimate: 5,
  nextThoughtNeeded: true
});

await agent.executeTool('agile-sprint', {
  step: "plan_sprint",
  content: "Focus on authentication and dashboard for MVP",
  nextThoughtNeeded: true
});
```

### 12. Feynman Technique (`feynman-technique`)

Learning through explanation.

**Description:**
```
Feynman technique for learning through explanation.

Steps: Choose concept → Explain simply → Identify gaps → Review source → Simplify further → Use analogies
```

**Steps:**
1. `choose_concept` - Choose the concept to understand
2. `explain_simply` - Explain it simply
3. `identify_gaps` - Identify gaps in understanding
4. `review_source` - Review source material
5. `simplify_further` - Simplify further
6. `use_analogies` - Use analogies to explain

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional().describe("The concept to understand"),
  step: z.enum(["choose_concept", "explain_simply", "identify_gaps", "review_source", "simplify_further", "use_analogies"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('feynman-technique', {
  problem: "Understand blockchain technology",
  step: "explain_simply",
  content: "Blockchain is like a shared notebook that multiple people can write in, but no one can erase what's already written",
  nextThoughtNeeded: true
});

await agent.executeTool('feynman-technique', {
  step: "identify_gaps",
  content: "I don't fully understand how consensus is reached",
  nextThoughtNeeded: true
});

await agent.executeTool('feynman-technique', {
  step: "use_analogies",
  content: "Consensus is like a group of strangers all verifying transactions together, like a community ledger",
  nextThoughtNeeded: true
});
```

### 13. Six Thinking Hats (`six-thinking-hats`)

Parallel thinking from different perspectives.

**Description:**
```
Six thinking hats tool for parallel thinking from different perspectives.

Hats: White (facts) → Red (emotions) → Black (risks) → Yellow (benefits) → Green (creativity) → Blue (process)
```

**Hats:**
- `white` - Facts and information
- `red` - Emotions and feelings
- `black` - Risks and caution
- `yellow` - Benefits and optimism
- `green` - Creativity and new ideas
- `blue` - Process and control

**Steps:**
1. `think` - Think from the perspective of a specific hat
2. `synthesize` - Synthesize all perspectives

**Input Schema:**

```typescript
z.object({
  problem: z.string().optional(),
  step: z.enum(["think", "synthesize"]),
  hat: z.enum(["white", "red", "black", "yellow", "green", "blue"]).optional(),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});
```

**Usage Example:**

```typescript
await agent.executeTool('six-thinking-hats', {
  problem: "Should we implement mandatory remote work?",
  step: "think",
  hat: "white",
  content: "Facts: 70% of employees prefer remote work options",
  nextThoughtNeeded: true
});

await agent.executeTool('six-thinking-hats', {
  step: "think",
  hat: "black",
  content: "Risks: Reduced collaboration, potential security concerns",
  nextThoughtNeeded: true
});

await agent.executeTool('six-thinking-hats', {
  step: "think",
  hat: "yellow",
  content: "Benefits: Increased productivity, better work-life balance",
  nextThoughtNeeded: true
});

await agent.executeTool('six-thinking-hats', {
  step: "synthesize",
  content: "Hybrid model balances collaboration needs with flexibility preferences",
  nextThoughtNeeded: false
});
```

## Integration with TokenRing

The package automatically integrates with the Token Ring application through the plugin system:

```typescript
// Automatically registered in plugin.ts
import thinkingPlugin from "@tokenring-ai/thinking/plugin";

// No manual registration needed - the plugin handles it automatically
```

### Service Registration

The ThinkingService is automatically registered with the application's service registry and can be accessed by agents:

```typescript
// Inside any tool execution
const thinkingService = agent.requireServiceByType(ThinkingService);
```

### Tool Registration

All 13 reasoning tools are automatically registered with the chat system:

```typescript
// Available for use via agent.executeTool()
await agent.executeTool('scientific-method-reasoning', {...});
await agent.executeTool('first-principles', {...});
// ... etc for all 13 tools
```

## State Management

Each reasoning tool maintains its own session state that persists across multiple calls:

```typescript
// First call - initializes session
const result1 = await agent.executeTool('scientific-method-reasoning', {
  problem: "My code is slow",
  step: "question_observation",
  content: "Performance monitoring shows 5 second response times",
  nextThoughtNeeded: true
});

// Second call - continues same session
const result2 = await agent.executeTool('scientific-method-reasoning', {
  step: "background_research",
  content: "Database queries are the likely bottleneck",
  nextThoughtNeeded: true
});

// Check session state
const state = agent.getState(ThinkingState);
console.log(state.show()); // Shows active sessions and progress

// Clear specific session
thinkingService.clearSession('scientific-method-reasoning', agent);

// Clear all sessions
thinkingService.clearAll(agent);
```

### State Transfer

The ThinkingState can transfer state from a parent agent:

```typescript
const childAgent = new Agent();
const parentAgent = new Agent();

// Transfer state from parent to child
const childThinkingState = new ThinkingState();
childThinkingState.transferStateFromParent(parentAgent);
```

### State Serialization

State can be serialized and deserialized for persistence:

```typescript
const state = agent.getState(ThinkingState);

// Serialize to JSON-compatible object
const serialized = state.serialize();
// Returns: { sessions: { 'scientific-method-reasoning': {...}, ... } }

// Deserialize from saved state
const newState = new ThinkingState(serialized);
```

### State Reset

State can be reset to clear all sessions:

```typescript
const state = agent.getState(ThinkingState);

// Reset state (clears all sessions)
state.reset();
```

## Configuration

No additional configuration required. The package uses sensible defaults and automatically integrates with the Token Ring framework.

## Integration Examples

### Basic Usage with an Agent

```typescript
import Agent from "@tokenring-ai/agent";
import thinkingPlugin from "@tokenring-ai/thinking/plugin";

// Create and configure agent
const agent = new Agent({
  workHandler: async (work) => {
    // Handle work requests
  }
});

// Plugin automatically registers tools with chat service
// Tools are available via agent.executeTool()

// Use a reasoning tool
const result = await agent.executeTool('scientific-method-reasoning', {
  problem: "Why is my application slow?",
  step: "question_observation",
  content: "User response times are 5+ seconds",
  nextThoughtNeeded: true
});
```

### Checking Session Progress

```typescript
const state = agent.getState(ThinkingState);
console.log(state.show());

// Output:
// Active Sessions: 1
//   scientific-method-reasoning: 3 steps, in progress
```

### Clearing Sessions

```typescript
// Clear a specific tool's session
thinkingService.clearSession('scientific-method-reasoning', agent);

// Clear all reasoning sessions
thinkingService.clearAll(agent);
```

### Custom Tool Integration

```typescript
// Use different thinking tools for different scenarios
await agent.executeTool('design-thinking', {
  problem: "Improve user onboarding flow",
  step: "empathize",
  content: "Users feel overwhelmed during first-time setup",
  nextThoughtNeeded: true
});

await agent.executeTool('pre-mortem', {
  problem: "Deploying new feature Friday afternoon",
  step: "assume_failure",
  content: "Production outage during weekend support gap",
  nextThoughtNeeded: true
});
```

## Development

### Building
```bash
bun run build
```

### Testing
```bash
bun run test
```

### Watch Tests
```bash
bun run test:watch
```

### Coverage
```bash
bun run test:coverage
```

## API Reference

### ThinkingService

```typescript
class ThinkingService implements TokenRingService {
  readonly name = "ThinkingService";
  readonly description = "Provides structured reasoning functionality";

  attach(agent: Agent): void;
  processStep(toolName: string, args: any, agent: Agent, processor: (session: ReasoningSession, args: any) => any): ReasoningSession;
  clearSession(toolName: string, agent: Agent): void;
  clearAll(agent: Agent): void;
}
```

### ThinkingState

```typescript
class ThinkingState implements AgentStateSlice<typeof serializationSchema> {
  readonly name = "ThinkingState";
  readonly serializationSchema = serializationSchema;
  sessions: Map<string, ReasoningSession>;

  constructor(data: Partial<ThinkingState> = {});
  transferStateFromParent(parent: Agent): void;
  reset(what?: ResetWhat[]): void;
  serialize(): z.output<typeof serializationSchema>;
  deserialize(data: z.output<typeof serializationSchema>): void;
  show(): string[];
}
```

### ReasoningSession

```typescript
interface ReasoningSession {
  tool: string;
  problem: string;
  stepNumber: number;
  data: Record<string, any>;
  completedSteps: string[];
  complete: boolean;
}
```

## Tool Schema Details

### Input Schema Pattern

All tools follow a consistent input schema pattern:

```typescript
z.object({
  problem: z.string().optional(),       // Required on first call
  step: z.enum([...]),                  // Tool-specific step enumeration
  content: z.string(),                  // Content for the current step
  nextThoughtNeeded: z.boolean(),       // False when reasoning is complete
  // Tool-specific additional fields
})
```

### Example Tool Input

```typescript
await agent.executeTool('first-principles', {
  problem: "How can we reduce costs?",
  step: "identify_assumptions",
  content: "We assume we need expensive infrastructure",
  nextThoughtNeeded: true
});
```

## Dependencies

### Production Dependencies

- `@tokenring-ai/app` (0.2.0) - Application framework and service management
- `@tokenring-ai/chat` (0.2.0) - Chat service and tool definitions
- `@tokenring-ai/agent` (0.2.0) - Agent system and state management
- `zod` (^4.3.6) - Schema validation

### Development Dependencies

- `vitest` (^4.0.18) - Testing framework
- `typescript` (^5.9.3) - TypeScript compiler

## License

MIT License - see [LICENSE](./LICENSE) file for details.
