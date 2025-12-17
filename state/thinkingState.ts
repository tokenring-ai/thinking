import type {ResetWhat} from "@tokenring-ai/agent/AgentEvents";
import type {AgentStateSlice} from "@tokenring-ai/agent/types";

export interface ReasoningSession {
  tool: string;
  problem: string;
  stepNumber: number;
  data: Record<string, any>;
  completedSteps: string[];
  complete: boolean;
}

export class ThinkingState implements AgentStateSlice {
  name = "ThinkingState";
  sessions: Map<string, ReasoningSession> = new Map();
  persistToSubAgents = false;

  constructor(data: Partial<ThinkingState> = {}) {
    if (data.sessions) {
      this.sessions = new Map(Object.entries(data.sessions));
    }
  }

  reset(what: ResetWhat[]): void {
    if (what.includes("chat")) {
      this.sessions.clear();
    }
  }

  serialize(): object {
    return {
      sessions: Object.fromEntries(this.sessions),
    };
  }

  deserialize(data: any): void {
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
