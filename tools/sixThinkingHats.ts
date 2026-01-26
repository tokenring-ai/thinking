import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "six-thinking-hats";
const displayName = "Thinking/sixThinkingHats";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  return thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.hats) session.data.hats = {white: [], red: [], black: [], yellow: [], green: [], blue: []};

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

export default { name, displayName, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
