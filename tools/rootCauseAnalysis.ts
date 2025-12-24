import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/types";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "root-cause-analysis";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.whyChain) session.data.whyChain = [];

    if (args.step === "ask_why") {
      session.data.whyChain.push({ level: session.data.whyChain.length + 1, answer: args.content });
    }
    if (args.step === "identify_root_cause") {
      session.data.rootCause = args.content;
    }
    if (args.step === "propose_solution") {
      session.data.solution = args.content;
    }

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      problem: session.problem,
      whyChain: session.data.whyChain,
      rootCause: session.data.rootCause,
      solution: session.data.solution,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return result;
}

const description = `Root cause analysis (5 Whys) tool for drilling down to fundamental causes.

Steps: State problem → Ask why → Record answer → Ask why again (repeat 5x) → Identify root cause → Propose solution`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["state_problem", "ask_why", "identify_root_cause", "propose_solution"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
