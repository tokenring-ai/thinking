# @tokenring-ai/thinking

Structured reasoning tools for AI agents within the TokenRing framework.

## Overview

The `@tokenring-ai/thinking` package provides 13 structured reasoning tools that guide AI agents through disciplined problem-solving using proven human cognitive frameworks. Each tool enforces specific thinking patterns through structured steps and state management.

### Key Features

- **13 Reasoning Frameworks**: Scientific method, Socratic dialogue, design thinking, root cause analysis, SWOT, pre-mortem, dialectical reasoning, first principles, decision matrix, lateral thinking, agile sprint, Feynman technique, and six thinking hats
- **State Tracking**: Maintains separate session state for each reasoning tool
- **Iterative Process**: Supports self-correcting, iterative reasoning until conclusions are reached
- **State Management**: Built-in serialization/deserialization for persistence

## Installation

```bash
npm install @tokenring-ai/thinking
```

## Usage

The package is automatically registered when the TokenRing application initializes.

### Available Tools

#### 1. scientific-method-reasoning
Enforces scientific method: Question/Observation → Background Research → Hypothesis → Prediction → Testing → Analysis → Conclusion

#### 2. socratic-dialogue
Questions assumptions: Question formulation → Assumption identification → Challenge assumption → Explore contradiction → Refine understanding → Synthesis

#### 3. design-thinking
Human-centered design: Empathize → Define → Ideate → Prototype → Test → Iterate

#### 4. root-cause-analysis
5 Whys method: State problem → Ask why (5x) → Identify root cause → Propose solution

#### 5. swot-analysis
Strategic planning: Define objective → Strengths → Weaknesses → Opportunities → Threats → Synthesize strategy

#### 6. pre-mortem
Failure prevention: Define goal → Assume failure → List failure reasons → Assess likelihood → Develop mitigations → Revise plan

#### 7. dialectical-reasoning
Opposing views: State thesis → Develop antithesis → Identify contradictions → Find common ground → Synthesize

#### 8. first-principles
Fundamental thinking: State problem → Identify assumptions → Challenge assumptions → Break to fundamentals → Rebuild → Novel solution

#### 9. decision-matrix
Multi-criteria decisions: Define decision → List options → Define criteria → Weight criteria → Score options → Calculate → Decide

#### 10. lateral-thinking
Creative reframing: State problem → Generate stimulus → Force connection → Explore tangent → Extract insight → Apply

#### 11. agile-sprint
Iterative development: Define goal → Break into stories → Estimate → Prioritize → Plan sprint → Execute → Review → Retrospect

#### 12. feynman-technique
Learning through explanation: Choose concept → Explain simply → Identify gaps → Review source → Simplify → Use analogies

#### 13. six-thinking-hats
Parallel perspectives: White (facts) → Red (emotions) → Black (risks) → Yellow (benefits) → Green (creativity) → Blue (process) → Synthesize

### Example

```typescript
await agent.executeTool('scientific-method-reasoning', {
  problem: "Why does water boil at different temperatures at different altitudes?",
  step: "question_observation",
  content: "Water boils at 100°C at sea level but at lower temperatures at higher altitudes.",
  nextThoughtNeeded: true
});

await agent.executeTool('first-principles', {
  problem: "How can we reduce battery costs?",
  step: "identify_assumptions",
  content: "Assumption: Batteries must use current lithium-ion technology",
  nextThoughtNeeded: true
});
```

## API Reference

### ThinkingService

Main service class implementing structured reasoning.

**Methods:**
- `processStep(toolName, args, agent, processor)`: Process a reasoning step for any tool
- `clearSession(toolName, agent)`: Clear specific tool session
- `clearAll(agent)`: Clear all reasoning sessions

### ThinkingState

Agent state slice storing reasoning sessions.

**Properties:**
- `sessions: Map<string, ReasoningSession>`: Active reasoning sessions by tool name

### ReasoningSession

Individual reasoning session state.

**Properties:**
- `tool: string`: Tool name
- `problem: string`: Problem being investigated
- `stepNumber: number`: Current step count
- `data: Record<string, any>`: Tool-specific data
- `completedSteps: string[]`: Steps completed
- `complete: boolean`: Whether reasoning is complete

## License

MIT
