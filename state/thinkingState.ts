import {Agent} from "@tokenring-ai/agent";
import type {ResetWhat} from "@tokenring-ai/agent/AgentEvents";
import type {AgentStateSlice} from "@tokenring-ai/agent/types";
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

export class ThinkingState implements AgentStateSlice<typeof serializationSchema> {
  readonly name = "ThinkingState";
  serializationSchema = serializationSchema;
  sessions: Map<string, ReasoningSession> = new Map();

  constructor(data: Partial<ThinkingState> = {}) {
    if (data.sessions) {
      this.sessions = new Map(Object.entries(data.sessions));
    }
  }

  transferStateFromParent(parent: Agent): void {
    const parentState = parent.getState(ThinkingState);
    this.deserialize(parentState.serialize());
  }


  reset(what: ResetWhat[]): void {
    if (what.includes("chat")) {
      this.sessions.clear();
    }
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
