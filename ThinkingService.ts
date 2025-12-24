import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingService} from "@tokenring-ai/app/types";
import {ThinkingState, type ReasoningSession} from "./state/thinkingState.ts";

export default class ThinkingService implements TokenRingService {
  name = "ThinkingService";
  description = "Provides structured reasoning functionality";

  async attach(agent: Agent): Promise<void> {
    agent.initializeState(ThinkingState, {});
  }

  processStep(toolName: string, args: any, agent: Agent, processor: (session: ReasoningSession, args: any) => any): any {
    const state = agent.getState(ThinkingState);
    let session = state.sessions.get(toolName);

    if (!session) {
      if (!args.problem) {
        throw new Error("Problem must be defined on first call");
      }
      session = {
        tool: toolName,
        problem: args.problem,
        stepNumber: 0,
        data: {},
        completedSteps: [],
        complete: false,
      };
    }

    agent.mutateState(ThinkingState, (s: ThinkingState) => {
      session!.stepNumber++;
      if (args.step && !session!.completedSteps.includes(args.step)) {
        session!.completedSteps.push(args.step);
      }
      const result = processor(session!, args);
      session!.complete = args.nextThoughtNeeded === false || args.complete === true;
      s.sessions.set(toolName, session!);
      return result;
    });

    return agent.getState(ThinkingState).sessions.get(toolName);
  }

  clearSession(toolName: string, agent: Agent): void {
    agent.mutateState(ThinkingState, (state: ThinkingState) => {
      state.sessions.delete(toolName);
    });
  }

  clearAll(agent: Agent): void {
    agent.mutateState(ThinkingState, (state: ThinkingState) => {
      state.sessions.clear();
    });
  }
}
