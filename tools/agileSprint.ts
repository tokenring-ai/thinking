import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/types";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "agile-sprint";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.backlog) session.data.backlog = [];
    if (!session.data.currentSprint) session.data.currentSprint = [];
    if (!session.data.completed) session.data.completed = [];
    if (!session.data.retrospectives) session.data.retrospectives = [];

    if (args.step === "break_into_stories") session.data.backlog.push({ story: args.content, estimate: args.estimate });
    if (args.step === "plan_sprint") session.data.currentSprint.push(args.content);
    if (args.step === "execute") session.data.completed.push(args.content);
    if (args.step === "retrospect") session.data.retrospectives.push(args.content);

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      goal: session.problem,
      backlog: session.data.backlog,
      currentSprint: session.data.currentSprint,
      completed: session.data.completed,
      retrospectives: session.data.retrospectives,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return result;
}

const description = `Agile sprint planning tool for iterative development.

Steps: Define goal → Break into stories → Estimate effort → Prioritize → Plan sprint → Execute → Review → Retrospect`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["define_goal", "break_into_stories", "estimate_effort", "prioritize", "plan_sprint", "execute", "review", "retrospect"]),
  content: z.string(),
  estimate: z.number().optional(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
