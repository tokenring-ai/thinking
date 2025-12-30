import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "feynman-technique";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<any> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.explanations) session.data.explanations = [];
    if (!session.data.gaps) session.data.gaps = [];
    if (!session.data.analogies) session.data.analogies = [];

    if (args.step === "explain_simply") session.data.explanations.push({ iteration: session.stepNumber, text: args.content });
    if (args.step === "identify_gaps") session.data.gaps.push(args.content);
    if (args.step === "use_analogies") session.data.analogies.push(args.content);

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      concept: session.problem,
      explanations: session.data.explanations,
      gaps: session.data.gaps,
      analogies: session.data.analogies,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return result;
}

const description = `Feynman technique for learning through explanation.

Steps: Choose concept → Explain simply → Identify gaps → Review source → Simplify further → Use analogies`;

const inputSchema = z.object({
  problem: z.string().optional().describe("The concept to understand"),
  step: z.enum(["choose_concept", "explain_simply", "identify_gaps", "review_source", "simplify_further", "use_analogies"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, description, inputSchema, execute } satisfies TokenRingToolDefinition<typeof inputSchema>;
