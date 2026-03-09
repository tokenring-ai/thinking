import {Agent} from "@tokenring-ai/agent";
import {AgentStateSlice} from "@tokenring-ai/agent/types";
import {z} from "zod";

export interface ReasoningSession {
  tool: string;
  problem: string;
  stepNumber: number;
  data: Record<string, any>;
  completedSteps: string[];
  complete: boolean;
}

const serializationSchema = z.object({
  sessions: z.any()
});

export class ThinkingState extends AgentStateSlice<typeof serializationSchema> {
  sessions: Map<string, ReasoningSession> = new Map();

  constructor(data: Partial<ThinkingState> = {}) {
    super("ThinkingState", serializationSchema);
    if (data.sessions) {
      this.sessions = new Map(data.sessions.entries());
    }
  }

  transferStateFromParent(parent: Agent): void {
    const parentState = parent.getState(ThinkingState);
    this.deserialize(parentState.serialize());
  }


  reset(): void {
          this.sessions.clear();
  }

  serialize(): z.output<typeof serializationSchema> {
    return {
      sessions: Object.fromEntries(this.sessions),
    };
  }

  deserialize(data: z.output<typeof serializationSchema>): void {
    this.sessions = data.sessions ? new Map(Object.entries(data.sessions)) : new Map();
  }

  show(): string[] {
    return [
      `Active Sessions: ${this.sessions.size}`,
      ...Array.from(this.sessions.entries()).map(([tool, s]) =>
        `  ${tool}: ${s.stepNumber} steps, ${s.complete ? "complete" : "in progress"}`
      )
    ];
  }
}
