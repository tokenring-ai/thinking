import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition, type TokenRingToolJSONResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "design-thinking";
const displayName = "Thinking/designThinking";

async function execute(args: z.output<typeof inputSchema>, agent: Agent): Promise<TokenRingToolJSONResult<any>> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  return thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.userNeeds) session.data.userNeeds = [];
    if (!session.data.ideas) session.data.ideas = [];
    if (!session.data.prototypes) session.data.prototypes = [];
    if (!session.data.testResults) session.data.testResults = [];

    if (args.step === "empathize") session.data.userNeeds.push(args.content);
    if (args.step === "ideate") session.data.ideas.push(args.content);
    if (args.step === "prototype") session.data.prototypes.push(args.content);
    if (args.step === "test") session.data.testResults.push(args.content);

    return {
      type: "json",
      data: {
        stepNumber: session.stepNumber,
        currentStep: args.step,
        problem: session.problem,
        userNeeds: session.data.userNeeds,
        ideas: session.data.ideas,
        prototypes: session.data.prototypes,
        testResults: session.data.testResults,
        completedSteps: session.completedSteps,
        complete: session.complete,
      }
    };
  });
}

const description = `Design thinking tool for human-centered problem solving.

Steps: Empathize → Define problem → Ideate → Prototype → Test → Iterate`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["empathize", "define", "ideate", "prototype", "test", "iterate"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, displayName, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
