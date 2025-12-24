import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/types";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "decision-matrix";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  return thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.options) session.data.options = [];
    if (!session.data.criteria) session.data.criteria = [];
    if (!session.data.scores) session.data.scores = {};

    if (args.step === "list_options") session.data.options.push(args.content);
    if (args.step === "define_criteria") {
      session.data.criteria.push({name: args.content, weight: args.weight || 1});
    }
    if (args.step === "score_options" && args.option && args.criterion) {
      const key = `${args.option}:${args.criterion}`;
      session.data.scores[key] = args.score;
    }
    if (args.step === "calculate_decide") session.data.recommendation = args.content;

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      decision: session.problem,
      options: session.data.options,
      criteria: session.data.criteria,
      scores: session.data.scores,
      recommendation: session.data.recommendation,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });
}

const description = `Decision matrix tool for structured multi-criteria decision making.

Steps: Define decision → List options → Define criteria → Weight criteria → Score each option → Calculate totals → Decide`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["define_decision", "list_options", "define_criteria", "weight_criteria", "score_options", "calculate_decide"]),
  content: z.string(),
  weight: z.number().optional(),
  option: z.string().optional(),
  criterion: z.string().optional(),
  score: z.number().optional(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
