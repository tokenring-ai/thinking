import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/types";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "six-thinking-hats";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<string> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.hats) session.data.hats = { white: [], red: [], black: [], yellow: [], green: [], blue: [] };

    if (args.hat) {
      session.data.hats[args.hat].push(args.content);
    }
    if (args.step === "synthesize") session.data.synthesis = args.content;

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      currentHat: args.hat,
      problem: session.problem,
      hats: session.data.hats,
      synthesis: session.data.synthesis,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return JSON.stringify(result, null, 2);
}

const description = `Six thinking hats tool for parallel thinking from different perspectives.

Hats: White (facts) → Red (emotions) → Black (risks) → Yellow (benefits) → Green (creativity) → Blue (process)`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["think", "synthesize"]),
  hat: z.enum(["white", "red", "black", "yellow", "green", "blue"]).optional(),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, description, inputSchema, execute } as TokenRingToolDefinition<typeof inputSchema>;
