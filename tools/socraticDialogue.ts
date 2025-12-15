import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/types";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "socratic-dialogue";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<string> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.questions) session.data.questions = [];
    if (!session.data.assumptions) session.data.assumptions = [];
    if (!session.data.contradictions) session.data.contradictions = [];

    if (args.step === "question_formulation" || args.step === "challenge_assumption") {
      session.data.questions.push({ step: session.stepNumber, content: args.content });
    }
    if (args.step === "assumption_identification") {
      session.data.assumptions.push({ id: `a${session.data.assumptions.length + 1}`, text: args.content });
    }
    if (args.step === "explore_contradiction") {
      session.data.contradictions.push(args.content);
    }

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      problem: session.problem,
      questions: session.data.questions,
      assumptions: session.data.assumptions,
      contradictions: session.data.contradictions,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return JSON.stringify(result, null, 2);
}

const description = `Socratic dialogue tool for questioning assumptions through structured inquiry.

Steps: Question formulation → Assumption identification → Challenge assumption → Explore contradiction → Refine understanding → Synthesis`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["question_formulation", "assumption_identification", "challenge_assumption", "explore_contradiction", "refine_understanding", "synthesis"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, description, inputSchema, execute } as TokenRingToolDefinition<typeof inputSchema>;
