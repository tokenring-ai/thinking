import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "first-principles";
const displayName = "Thinking/firstPrinciples";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.assumptions) session.data.assumptions = [];
    if (!session.data.fundamentalTruths) session.data.fundamentalTruths = [];
    if (!session.data.reconstructionSteps) session.data.reconstructionSteps = [];

    if (args.step === "identify_assumptions") session.data.assumptions.push(args.content);
    if (args.step === "break_to_fundamentals") session.data.fundamentalTruths.push(args.content);
    if (args.step === "rebuild_from_basics") session.data.reconstructionSteps.push(args.content);
    if (args.step === "novel_solution") session.data.solution = args.content;

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      problem: session.problem,
      assumptions: session.data.assumptions,
      fundamentalTruths: session.data.fundamentalTruths,
      reconstructionSteps: session.data.reconstructionSteps,
      solution: session.data.solution,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return result;
}

const description = `First principles thinking tool for breaking down to fundamental truths.

Steps: State problem → Identify assumptions → Challenge assumptions → Break to fundamental truths → Rebuild from basics → Novel solution`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["state_problem", "identify_assumptions", "challenge_assumptions", "break_to_fundamentals", "rebuild_from_basics", "novel_solution"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, displayName, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
