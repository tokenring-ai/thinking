# @tokenring-ai/thinking

Structured reasoning service with 13 specialized thinking tools for disciplined problem-solving and persistent state management.

## Overview

The `@tokenring-ai/thinking` package provides a comprehensive suite of 13 structured reasoning tools that implement various thinking methodologies with persistent state management. Each tool guides AI agents through disciplined problem-solving using proven human cognitive frameworks and maintains reasoning sessions across multiple steps.

## Key Features

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
thinkingService.name = "ThinkingService";
thinkingService.description = "Provides structured reasoning functionality";
```

**Key Methods:**

- `attach(agent: Agent)`: Initializes thinking state for an agent
- `processStep(toolName, args, agent, processor)`: Processes reasoning steps
- `clearSession(toolName, agent)`: Clears specific tool session
- `clearAll(agent)`: Clears all reasoning sessions

### ThinkingState

Agent state slice that manages reasoning session persistence.

```typescript
import { ThinkingState } from "@tokenring-ai/thinking";

interface ReasoningSession {
  tool: string;                  // Tool name
  problem: string;               // Problem being investigated
  stepNumber: number;            // Current step count
  data: Record<string, any>;     // Tool-specific data storage
  completedSteps: string[];      // Steps completed
  complete: boolean;             // Whether reasoning is complete
}

class ThinkingState implements AgentStateSlice {
  name = "ThinkingState";
  sessions: Map<string, ReasoningSession> = new Map();

  constructor(data?: Partial<ThinkingState>);

  transferStateFromParent(parent: Agent): void;
  reset(what: ResetWhat[]): void;
  serialize(): object;
  deserialize(data: any): void;
  show(): string[];
}
```

### ReasoningSession

Individual reasoning session state.

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

## Available Reasoning Tools

### 1. Scientific Method (`scientific-method-reasoning`)

Enforces strict scientific method reasoning with 7 core steps:

```typescript
await agent.executeTool('scientific-method-reasoning', {
  problem: "Why does water boil at different temperatures at different altitudes?",
  step: "question_observation",
  content: "Water boils at 100°C at sea level but at lower temperatures at higher altitudes.",
  nextThoughtNeeded: true
});

// Available steps: question_observation, background_research, hypothesis_formulation,
// prediction, testing_experimentation, analysis, conclusion
```

### 2. Socratic Dialogue (`socratic-dialogue`)

Questions assumptions through structured inquiry:

```typescript
await agent.executeTool('socratic-dialogue', {
  problem: "Is democracy the best form of government?",
  step: "question_formulation",
  content: "What makes a form of government 'best'?",
  nextThoughtNeeded: true
});

// Available steps: question_formulation, assumption_identification,
// challenge_assumption, explore_contradiction, refine_understanding, synthesis
```

### 3. Design Thinking (`design-thinking`)

Human-centered design process:

```typescript
await agent.executeTool('design-thinking', {
  problem: "Design a better mobile app for task management",
  step: "empathize",
  content: "Users need simple, intuitive task organization with minimal cognitive load",
  nextThoughtNeeded: true
});

// Available steps: empathize, define, ideate, prototype, test, iterate
```

### 4. Root Cause Analysis (`root-cause-analysis`)

5 Whys methodology for finding fundamental causes:

```typescript
await agent.executeTool('root-cause-analysis', {
  problem: "Customer complaints about slow response times",
  step: "ask_why",
  content: "Why are response times slow? Because support team is understaffed",
  nextThoughtNeeded: true
});

// Available steps: state_problem, ask_why, identify_root_cause, propose_solution
```

### 5. SWOT Analysis (`swot-analysis`)

Strategic planning through strengths, weaknesses, opportunities, threats:

```typescript
await agent.executeTool('swot-analysis', {
  problem: "Expanding our startup into international markets",
  step: "strengths",
  content: "We have strong technical expertise and proven product-market fit",
  nextThoughtNeeded: true
});

// Available steps: define_objective, strengths, weaknesses,
// opportunities, threats, synthesize_strategy
```

### 6. Pre-Mortem (`pre-mortem`)

Imagines failure to prevent it:

```typescript
await agent.executeTool('pre-mortem', {
  problem: "Launching our new product feature",
  step: "list_failure_reasons",
  content: "Users don't understand how to use the new feature",
  likelihood: "high",
  nextThoughtNeeded: true
});

// Available steps: define_goal, assume_failure, list_failure_reasons,
// assess_likelihood, develop_mitigations, revise_plan
```

### 7. Dialectical Reasoning (`dialectical-reasoning`)

Considers opposing views:

```typescript
await agent.executeTool('dialectical-reasoning', {
  problem: "Should we prioritize growth or profitability?",
  step: "state_thesis",
  content: "We should prioritize growth to capture market share",
  nextThoughtNeeded: true
});

// Available steps: state_thesis, develop_antithesis, identify_contradictions,
// find_common_ground, synthesize
```

### 8. First Principles (`first-principles`)

Breaks down to fundamental truths:

```typescript
await agent.executeTool('first-principles', {
  problem: "How can we reduce battery costs?",
  step: "identify_assumptions",
  content: "Assumption: Batteries must use current lithium-ion technology",
  nextThoughtNeeded: true
});

// Available steps: state_problem, identify_assumptions, challenge_assumptions,
// break_to_fundamentals, rebuild_from_basics, novel_solution
```

### 9. Decision Matrix (`decision-matrix`)

Structured multi-criteria decision making:

```typescript
await agent.executeTool('decision-matrix', {
  problem: "Which cloud provider should we choose?",
  step: "list_options",
  content: "AWS",
  nextThoughtNeeded: true
});

// Available steps: define_decision, list_options, define_criteria,
// weight_criteria, score_options, calculate_decide
```

### 10. Lateral Thinking (`lateral-thinking`)

Creative problem reframing:

```typescript
await agent.executeTool('lateral-thinking', {
  problem: "How to reduce office space usage?",
  step: "generate_stimulus",
  content: "Coffee shops have high productivity per square foot",
  nextThoughtNeeded: true
});

// Available steps: state_problem, generate_stimulus, force_connection,
// explore_tangent, extract_insight, apply_to_problem
```

### 11. Agile Sprint (`agile-sprint`)

Iterative development planning:

```typescript
await agent.executeTool('agile-sprint', {
  problem: "Build a customer portal in 2 weeks",
  step: "break_into_stories",
  content: "User authentication module",
  estimate: 3,
  nextThoughtNeeded: true
});

// Available steps: define_goal, break_into_stories, estimate_effort,
// prioritize, plan_sprint, execute, review, retrospect
```

### 12. Feynman Technique (`feynman-technique`)

Learning through explanation:

```typescript
await agent.executeTool('feynman-technique', {
  problem: "Understand blockchain technology",
  step: "explain_simply",
  content: "Blockchain is like a shared notebook that multiple people can write in, but no one can erase what's already written",
  nextThoughtNeeded: true
});

// Available steps: choose_concept, explain_simply, identify_gaps,
// review_source, simplify_further, use_analogies
```

### 13. Six Thinking Hats (`six-thinking-hats`)

Parallel thinking from different perspectives:

```typescript
await agent.executeTool('six-thinking-hats', {
  problem: "Should we implement mandatory remote work?",
  step: "think",
  hat: "white",
  content: "Facts: 70% of employees prefer remote work options",
  nextThoughtNeeded: true
});

// Available hats: white, red, black, yellow, green, blue
// Available steps: think, synthesize
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

// Deserialize from saved state
const newState = new ThinkingState(serialized);
```

### State Reset

State can be reset based on what needs to be cleared:

```typescript
const state = agent.getState(ThinkingState);

// Reset only chat-related state
state.reset(['chat']);

// Reset all state
state.reset(['all']);
```

## Configuration

No additional configuration required. The package uses sensible defaults and automatically integrates with the Token Ring framework.

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
  name: string;
  description: string;

  attach(agent: Agent): void;
  processStep(toolName: string, args: any, agent: Agent, processor: (session: ReasoningSession, args: any) => any): any;
  clearSession(toolName: string, agent: Agent): void;
  clearAll(agent: Agent): void;
}
```

### ThinkingState

```typescript
class ThinkingState implements AgentStateSlice<typeof serializationSchema> {
  name: string;
  serializationSchema: typeof serializationSchema;
  sessions: Map<string, ReasoningSession>;

  constructor(data?: Partial<ThinkingState>);
  transferStateFromParent(parent: Agent): void;
  reset(what: ResetWhat[]): void;
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

## License

MIT License - see [LICENSE](./LICENSE) file for details.
