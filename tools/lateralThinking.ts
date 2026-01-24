import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "lateral-thinking";
const displayName = "Thinking/lateralThinking";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.stimuli) session.data.stimuli = [];
    if (!session.data.connections) session.data.connections = [];
    if (!session.data.insights) session.data.insights = [];

    if (args.step === "generate_stimulus") session.data.stimuli.push(args.content);
    if (args.step === "force_connection") session.data.connections.push(args.content);
    if (args.step === "extract_insight") session.data.insights.push(args.content);
    if (args.step === "apply_to_problem") session.data.application = args.content;

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      problem: session.problem,
      stimuli: session.data.stimuli,
      connections: session.data.connections,
      insights: session.data.insights,
      application: session.data.application,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return result;
}

const description = `Lateral thinking tool for creative problem reframing.

Steps: State problem → Generate random stimulus → Force connection → Explore tangent → Extract insight → Apply to original problem`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["state_problem", "generate_stimulus", "force_connection", "explore_tangent", "extract_insight", "apply_to_problem"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, displayName, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
