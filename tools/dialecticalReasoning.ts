import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition} from "@tokenring-ai/chat/types";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "dialectical-reasoning";

async function execute(args: z.infer<typeof inputSchema>, agent: Agent): Promise<string> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (args.step === "state_thesis") session.data.thesis = args.content;
    if (args.step === "develop_antithesis") session.data.antithesis = args.content;
    if (args.step === "identify_contradictions") {
      if (!session.data.contradictions) session.data.contradictions = [];
      session.data.contradictions.push(args.content);
    }
    if (args.step === "find_common_ground") session.data.commonGround = args.content;
    if (args.step === "synthesize") session.data.synthesis = args.content;

    return {
      stepNumber: session.stepNumber,
      currentStep: args.step,
      problem: session.problem,
      thesis: session.data.thesis,
      antithesis: session.data.antithesis,
      contradictions: session.data.contradictions || [],
      commonGround: session.data.commonGround,
      synthesis: session.data.synthesis,
      completedSteps: session.completedSteps,
      complete: session.complete,
    };
  });

  return JSON.stringify(result, null, 2);
}

const description = `Dialectical reasoning tool for considering opposing views.

Steps: State thesis → Develop antithesis → Identify contradictions → Find common ground → Synthesize higher understanding`;

const inputSchema = z.object({
  problem: z.string().optional(),
  step: z.enum(["state_thesis", "develop_antithesis", "identify_contradictions", "find_common_ground", "synthesize"]),
  content: z.string(),
  nextThoughtNeeded: z.boolean(),
});

export default { name, description, inputSchema, execute } as TokenRingToolDefinition<typeof inputSchema>;
