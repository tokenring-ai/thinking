import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/types";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "pre-mortem";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<string> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.failureScenarios) session.data.failureScenarios = [];
    if (!session.data.mitigations) session.data.mitigations = [];

    if (args.step === "list_failure_reasons") {
      session.data.failureScenarios.push({
        reason: args.content,
        likelihood: args.likelihood,
      });
    }
    if (args.step === "develop_mitigations") {
      session.data.mitigations.push({
        scenario: args.targets_scenario,
        mitigation: args.content,
      });
    }
    if (args.step === "revise_plan") {
      session.data.revisedPlan = args.content;
    }

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      goal: session.problem,
      failureScenarios: session.data.failureScenarios,
      mitigations: session.data.mitigations,
      revisedPlan: session.data.revisedPlan,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return JSON.stringify(result, null, 2);
}

const description = `Pre-mortem analysis tool for imagining failure to prevent it.

Steps: Define goal → Assume failure → List reasons for failure → Assess likelihood → Develop mitigations → Revise plan`;

const inputSchema = z.object({
  problem: z.string().optional().describe("The goal or plan to analyze"),
  step: z.enum(["define_goal", "assume_failure", "list_failure_reasons", "assess_likelihood", "develop_mitigations", "revise_plan"]),
  content: z.string(),
  likelihood: z.enum(["low", "medium", "high"]).optional(),
  targets_scenario: z.string().optional(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
