import { describe, it, expect, beforeEach, vi } from "vitest";
import * as scientificMethodModule from "../tools/scientificMethod";

vi.mock("zod", () => {
  const createDescribableSchema = () => ({
    describe: vi.fn().mockReturnValue({
      optional: () => ({ describe: vi.fn().mockReturnValue({}) }),
    }),
    optional: () => ({ describe: vi.fn().mockReturnValue({}) }),
  });

  return {
    z: {
      object: vi.fn().mockReturnValue({
        parse: vi.fn(),
        describe: vi.fn().mockReturnValue(createDescribableSchema()),
        optional: vi.fn().mockReturnValue({ describe: vi.fn().mockReturnValue({}) }),
        shape: {
          problem: { _def: { type: "void" } },
          step: { _def: { type: "enum", values: ["question_observation", "background_research", "hypothesis_formulation", "prediction", "testing_experimentation", "analysis", "conclusion"] } },
          content: { _def: { type: "void" } },
          targets_hypothesis_id: { _def: { type: "void" } },
          hypothesis_update: { _def: { type: "void" } },
          nextThoughtNeeded: { _def: { type: "boolean" } },
          final_answer: { _def: { type: "void" } },
        },
      }),
      string: () => createDescribableSchema(),
      array: vi.fn().mockReturnValue(createDescribableSchema()),
      boolean: () => createDescribableSchema(),
      enum: vi.fn().mockReturnValue(createDescribableSchema()),
    },
  };
});

// Mock Agent module
vi.mock("@tokenring-ai/agent/Agent", () => ({ default: {} }));
vi.mock("@tokenring-ai/chat/types", () => ({ TokenRingToolDefinition: {} }));

const scientificMethod = scientificMethodModule.default;

// Mock Agent
const createMockAgent = () => {
  const mockThinkingService = {
    processStep: vi.fn(),
  };

  const agent = {
    requireServiceByType: vi.fn().mockReturnValue(mockThinkingService),
  } as any;

  return { agent, mockThinkingService };
};

describe("scientificMethod Tool", () => {
  let mockAgent: any;
  let mockThinkingService: any;

  beforeEach(() => {
    const mocks = createMockAgent();
    mockAgent = mocks.agent;
    mockThinkingService = mocks.mockThinkingService;
    vi.clearAllMocks();
  });

  describe("Tool Definition", () => {
    it("should have correct name", () => {
      expect(scientificMethod.name).toBe("scientific-method-reasoning");
    });

    it("should have comprehensive description", () => {
      expect(scientificMethod.description).toContain("scientific method");
      expect(scientificMethod.description).toContain("hypothesis");
      expect(scientificMethod.description).toContain("testing");
    });

    it("should have valid input schema", () => {
      expect(scientificMethod).toHaveProperty("inputSchema");
    });
  });

  describe("execute - Initial Problem Setup", () => {
    it("should create new session with problem", async () => {
      const args = {
        problem: "What causes climate change?",
        step: "question_observation",
        content: "We need to investigate the factors contributing to global temperature rise",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "scientific-method-reasoning",
        problem: "What causes climate change?",
        stepNumber: 1,
        data: {
          thoughts: [],
          hypotheses: [],
        },
        completedSteps: [],
        complete: false,
      });

      const result = await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
      expect(result).toBeDefined();
    });

    it("should return error when problem not provided on first call", async () => {
      const args = {
        step: "question_observation",
        content: "We need to investigate the factors contributing to global temperature rise",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        error: "Problem must be defined on first call",
      });

      await expect(scientificMethod.execute(args, mockAgent)).rejects.toThrow(
        "[scientific-method-reasoning] Problem must be defined on first call"
      );
    });
  });

  describe("execute - Hypothesis Management", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "scientific-method-reasoning",
        problem: "What causes climate change?",
        stepNumber: 2,
        data: {
          hypotheses: [
            {
              id: "h1",
              text: "Human activities increase CO2 levels",
              status: "proposed",
              linkedThoughts: [1],
            },
          ],
          thoughts: [],
        },
        completedSteps: ["question_observation"],
        complete: false,
      });
    });

    it("should handle new hypothesis creation", async () => {
      const args = {
        step: "hypothesis_formulation",
        content: "Industrial emissions are the primary driver",
        hypothesis_update: {
          new_hypothesis_text: "Industrial emissions are the primary driver",
          action: "propose",
        },
        nextThoughtNeeded: true,
      };

      await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should handle hypothesis update with refine action", async () => {
      const args = {
        step: "analysis",
        content: "Data shows strong correlation",
        targets_hypothesis_id: ["h1"],
        hypothesis_update: {
          hypothesis_id: "h1",
          new_hypothesis_text: "Human activities significantly increase CO2 levels",
          action: "refine",
        },
        nextThoughtNeeded: true,
      };

      await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should handle hypothesis refute action", async () => {
      const args = {
        step: "analysis",
        content: "Evidence contradicts hypothesis",
        targets_hypothesis_id: ["h1"],
        hypothesis_update: {
          hypothesis_id: "h1",
          action: "refute",
        },
        nextThoughtNeeded: true,
      };

      await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should handle hypothesis support action", async () => {
      const args = {
        step: "testing_experimentation",
        content: "Experimental data confirms hypothesis",
        targets_hypothesis_id: ["h1"],
        hypothesis_update: {
          hypothesis_id: "h1",
          action: "support",
        },
        nextThoughtNeeded: true,
      };

      await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });
  });

  describe("execute - Scientific Method Steps", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "scientific-method-reasoning",
        problem: "What causes climate change?",
        stepNumber: 1,
        data: {
          thoughts: [],
          hypotheses: [],
        },
        completedSteps: [],
        complete: false,
      });
    });

    it("should process question_observation step", async () => {
      const args = {
        problem: "What causes climate change?",
        step: "question_observation",
        content: "Global temperatures have risen significantly since the 1980s",
        nextThoughtNeeded: true,
      };

      const result = await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should process background_research step", async () => {
      const args = {
        step: "background_research",
        content: "Historical temperature records show consistent warming trend",
        nextThoughtNeeded: true,
      };

      const result = await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should process prediction step", async () => {
      const args = {
        step: "prediction",
        content: "If CO2 causes warming, then increasing CO2 should correlate with temperature rise",
        targets_hypothesis_id: ["h1"],
        nextThoughtNeeded: true,
      };

      const result = await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should process testing_experimentation step", async () => {
      const args = {
        step: "testing_experimentation",
        content: "Laboratory experiments show CO2 traps heat effectively",
        targets_hypothesis_id: ["h1"],
        nextThoughtNeeded: true,
      };

      const result = await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should process analysis step", async () => {
      const args = {
        step: "analysis",
        content: "Data strongly supports the hypothesis",
        targets_hypothesis_id: ["h1"],
        hypothesis_update: {
          hypothesis_id: "h1",
          action: "support",
        },
        nextThoughtNeeded: true,
      };

      const result = await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should process conclusion step", async () => {
      const args = {
        step: "conclusion",
        content: "Human activities are the primary cause of recent climate change",
        nextThoughtNeeded: false,
        final_answer: "Based on extensive evidence, human activities are the primary cause of recent climate change",
      };

      const result = await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });
  });

  describe("execute - State Management", () => {
    it("should initialize data structures if not present", async () => {
      const args = {
        problem: "Test problem",
        step: "question_observation",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "scientific-method-reasoning",
        problem: "Test problem",
        stepNumber: 1,
        data: {
          thoughts: [],
          hypotheses: [],
        },
        completedSteps: [],
        complete: false,
      });

      await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should handle existing data structures", async () => {
      const args = {
        step: "hypothesis_formulation",
        content: "Test hypothesis",
        hypothesis_update: {
          new_hypothesis_text: "Test hypothesis",
          action: "propose",
        },
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "scientific-method-reasoning",
        problem: "Test problem",
        stepNumber: 2,
        data: {
          thoughts: [{ thoughtNumber: 1, step: "question_observation", content: "Initial observation", targetsHypothesisId: undefined }],
          hypotheses: [
            {
              id: "h1",
              text: "Previous hypothesis",
              status: "proposed",
              linkedThoughts: [1],
            },
          ],
        },
        completedSteps: ["question_observation"],
        complete: false,
      });

      await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should track thought history", async () => {
      const args = {
        step: "background_research",
        content: "Research findings",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "scientific-method-reasoning",
        problem: "Test problem",
        stepNumber: 2,
        data: {
          thoughts: [
            {
              thoughtNumber: 1,
              step: "question_observation",
              content: "Initial observation",
              targetsHypothesisId: undefined,
            },
          ],
          hypotheses: [],
        },
        completedSteps: ["question_observation"],
        complete: false,
      });

      await scientificMethod.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "scientific-method-reasoning",
        args,
        mockAgent,
        expect.any(Function)
      );
    });
  });

  describe("execute - Error Handling", () => {
    it("should throw error when ThinkingService returns error", async () => {
      const args = {
        problem: "Test problem",
        step: "question_observation",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        error: "Test error",
      });

      await expect(scientificMethod.execute(args, mockAgent)).rejects.toThrow(
        "[scientific-method-reasoning] Test error"
      );
    });

    it("should handle missing ThinkingService gracefully", async () => {
      const args = {
        problem: "Test problem",
        step: "question_observation",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockAgent.requireServiceByType.mockImplementation(() => {
        throw new Error("ThinkingService not found");
      });

      await expect(scientificMethod.execute(args, mockAgent)).rejects.toThrow();
    });
  });

  describe("execute - Return Value", () => {
    it("should return JSON string of result", async () => {
      const args = {
        problem: "Test problem",
        step: "question_observation",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      const mockResult = {
        tool: "scientific-method-reasoning",
        problem: "Test problem",
        stepNumber: 1,
        data: {
          thoughts: [],
          hypotheses: [],
        },
        completedSteps: [],
        complete: false,
      };

      mockThinkingService.processStep.mockReturnValue(mockResult);

      const result = await scientificMethod.execute(args, mockAgent);

      expect(typeof result).toBe("object");
      expect(result).toEqual(mockResult);
    });

  });
});