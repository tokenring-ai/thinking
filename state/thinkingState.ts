import type { Agent } from "@tokenring-ai/agent";
import { AgentStateSlice } from "@tokenring-ai/agent/types";
import deepClone from "@tokenring-ai/utility/object/deepClone";
import markdownList from "@tokenring-ai/utility/string/markdownList";
import { z } from "zod";

const ReasoningSessionSchema = z.object({
  tool: z.string(),
  problem: z.string(),
  stepNumber: z.number(),
  data: z.record(z.string(), z.any()),
  completedSteps: z.array(z.string()),
  complete: z.boolean(),
});

export type ReasoningSession = z.infer<typeof ReasoningSessionSchema>;

const serializationSchema = z.object({
  sessions: z.record(z.string(), ReasoningSessionSchema),
});

export class ThinkingState extends AgentStateSlice<typeof serializationSchema> {
  sessions: Map<string, z.infer<typeof ReasoningSessionSchema>> = new Map();

  constructor() {
    super("ThinkingState", serializationSchema);
  }

  transferStateFromParent(parent: Agent): void {
    const parentState = parent.getState(ThinkingState);
    this.sessions = new Map([...parentState.sessions.entries()].map(([key, session]) => [key, deepClone(session)]));
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

  show(): string {
    return `Active Sessions: ${this.sessions.size}
${markdownList(Array.from(this.sessions.entries()).map(([tool, s]) => `${tool}: ${s.stepNumber} steps, ${s.complete ? "complete" : "in progress"}`))}`;
  }
}
