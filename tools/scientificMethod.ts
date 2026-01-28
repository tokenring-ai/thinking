import Agent from "@tokenring-ai/agent/Agent";
import {TokenRingToolDefinition, type TokenRingToolJSONResult} from "@tokenring-ai/chat/schema";
import {z} from "zod";
import ThinkingService from "../ThinkingService.ts";

const name = "scientific-method-reasoning";
const displayName = "Thinking/scientificMethod";

async function execute(
  args: z.output<typeof inputSchema>,
  agent: Agent,
): Promise<any> {
  const thinkingService = agent.requireServiceByType(ThinkingService);
  const result = thinkingService.processStep(name, args, agent, (session, args) => {
    if (!session.data.hypotheses) session.data.hypotheses = [];
    if (!session.data.thoughts) session.data.thoughts = [];

    session.data.thoughts.push({
      thoughtNumber: session.stepNumber,
      step: args.step,
      content: args.content,
      targetsHypothesisId: args.targets_hypothesis_id,
    });

    if (args.hypothesis_update) {
      const update = args.hypothesis_update;
      if (update.hypothesis_id) {
        const hyp = session.data.hypotheses.find((h: any) => h.id === update.hypothesis_id);
        if (hyp) {
          hyp.linkedThoughts.push(session.stepNumber);
          if (update.new_hypothesis_text) hyp.text = update.new_hypothesis_text;
          if (update.action === "refute") hyp.status = "refuted";
          if (update.action === "support") hyp.status = "supported";
          if (update.action === "refine") hyp.status = "refined";
        }
      } else if (update.new_hypothesis_text) {
        session.data.hypotheses.push({
          id: `h${session.data.hypotheses.length + 1}`,
          text: update.new_hypothesis_text,
          status: "proposed",
          linkedThoughts: [session.stepNumber],
        });
      }
    }

    return {
      type: "json",
      data: {
        thoughtNumber: session.stepNumber,
        currentStep: args.step,
        nextThoughtNeeded: args.nextThoughtNeeded,
        problem: session.problem,
        hypotheses: session.data.hypotheses,
        completedSteps: session.completedSteps,
        conclusionReached: session.complete,
        thoughtHistoryLength: session.data.thoughts.length,
      }
    };
  });

  if (result.error) {
    throw new Error(`[${name}] ${result.error}`);
  }

  return result;
}

const description = `A strictly disciplined reasoning tool that enforces exact adherence to the scientific method.

The tool maintains persistent state anchored to a single, fixed problem/question. Every contribution must explicitly advance one of the core steps of the scientific method. No free-form thoughts, confidence scores, summaries, or extraneous features are permitted—only direct contributions to the defined steps.

Core scientific method steps enforced:
1. Question/Observation: Clearly state the problem and relevant observations.
2. Background Research: Gather and restate existing knowledge, constraints, or facts.
3. Hypothesis: Formulate testable hypotheses (one or more; each must be falsifiable).
4. Prediction: State specific, testable predictions derived from a hypothesis.
5. Testing/Experimentation: Perform tests (deductive reasoning, calculations, counterexamples, or external verification) to gather evidence.
6. Analysis: Interpret evidence objectively—does it support, refute, or require refinement of the hypothesis?
7. Conclusion: Draw evidence-based conclusion; if unresolved, iterate by revising earlier steps.

The process is iterative and self-correcting. Continue until a hypothesis is conclusively supported or refuted, or the question is fully answered.

Rules:
- First call must define the problem and begin with step 1 or 2.
- Every subsequent call must specify exactly one step and contribute only to it.
- Hypotheses are tracked explicitly; testing and analysis must reference them.
- Only set nextThoughtNeeded: false when a final, evidence-based conclusion is reached.
- Ignore all irrelevant information.
- Final answer must directly follow from the completed scientific process.`;

const inputSchema = z.object({
  problem: z.string().optional().describe("The exact question or problem to investigate—required on first call only"),
  step: z.enum([
    "question_observation",
    "background_research",
    "hypothesis_formulation",
    "prediction",
    "testing_experimentation",
    "analysis",
    "conclusion"
  ]).describe("The specific scientific method step this contribution advances"),
  content: z.string().describe("Clear, focused contribution to the chosen step"),
  targets_hypothesis_id: z.array(z.string()).optional().describe("Hypothesis ID(s) this step references (e.g., ['h1'])—required for prediction, testing, analysis"),
  hypothesis_update: z.object({
    hypothesis_id: z.string().optional().describe("Existing ID to modify/refute (omit for new hypothesis)"),
    new_hypothesis_text: z.string().optional().describe("Text of a new or revised hypothesis (must be testable)"),
    action: z.enum(["propose", "refine", "refute", "support"]).optional().describe("Action taken on the hypothesis in this step")
  }).optional().describe("Create or update a hypothesis in hypothesis_formulation or analysis steps"),
  nextThoughtNeeded: z.boolean().describe("False only when conclusion step provides a final, evidence-based answer"),
  final_answer: z.string().optional().describe("The concluded answer—required when nextThoughtNeeded is false; must be justified by prior steps")
});

export default {
  name,
  displayName,
  description,
  inputSchema,
  execute,
} satisfies TokenRingToolDefinition<typeof inputSchema>;
