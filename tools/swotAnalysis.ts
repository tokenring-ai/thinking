import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition, type TokenRingToolJSONResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "swot-analysis";
const displayName = "Thinking/swotAnalysis";

async function execute(args: z.output<typeof inputSchema>, agent: Agent): Promise<TokenRingToolJSONResult<any>> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  return thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.strengths) session.data.strengths = [];
    if (!session.data.weaknesses) session.data.weaknesses = [];
    if (!session.data.opportunities) session.data.opportunities = [];
    if (!session.data.threats) session.data.threats = [];

    if (args.step === "strengths") session.data.strengths.push(args.content);
    if (args.step === "weaknesses") session.data.weaknesses.push(args.content);
    if (args.step === "opportunities") session.data.opportunities.push(args.content);
    if (args.step === "threats") session.data.threats.push(args.content);
    if (args.step === "synthesize_strategy") session.data.strategy = args.content;

    return {
      type: "json",
      data: {
        stepNumber: session.stepNumber,
        currentStep: args.step,
        objective: session.problem,
        strengths: session.data.strengths,
        weaknesses: session.data.weaknesses,
        opportunities: session.data.opportunities,
        threats: session.data.threats,
        strategy: session.data.strategy,
        completedSteps: session.completedSteps,
        complete: session.complete,
      }
    };
  });
}

const description = `SWOT analysis tool for structured strategic planning.

Steps: Define objective → Identify strengths → Identify weaknesses → Identify opportunities → Identify threats → Synthesize strategy`;

const inputSchema = z.object({
  problem: z.string().optional().describe("The objective or goal to analyze"),
  step: z.enum(["define_objective", "strengths", "weaknesses", "opportunities", "threats", "synthesize_strategy"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, displayName, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
