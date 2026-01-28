import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition, type TokenRingToolJSONResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "root-cause-analysis";
const displayName = "Thinking/rootCauseAnalysis";

async function execute(args: z.output<typeof inputSchema>, agent: Agent): Promise<TokenRingToolJSONResult<any>> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  return thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.whyChain) session.data.whyChain = [];

    if (args.step === "ask_why") {
      session.data.whyChain.push({level: session.data.whyChain.length + 1, answer: args.content});
    }
    if (args.step === "identify_root_cause") {
      session.data.rootCause = args.content;
    }
    if (args.step === "propose_solution") {
      session.data.solution = args.content;
    }

    return {
      type: "json",
      data: {
        stepNumber: session.stepNumber,
        currentStep: args.step,
        problem: session.problem,
        whyChain: session.data.whyChain,
        rootCause: session.data.rootCause,
        solution: session.data.solution,
        completedSteps: session.completedSteps,
        complete: session.complete,
      }
    };
  });
}

const description = `Root cause analysis (5 Whys) tool for drilling down to fundamental causes.

Steps: State problem → Ask why → Record answer → Ask why again (repeat 5x) → Identify root cause → Propose solution`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["state_problem", "ask_why", "identify_root_cause", "propose_solution"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, displayName, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
