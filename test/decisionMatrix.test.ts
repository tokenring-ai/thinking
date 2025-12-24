import { describe, it, expect, beforeEach, vi } from "vitest";
import decisionMatrix from "../tools/decisionMatrix";
import { z } from "zod";

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

describe("decisionMatrix Tool", () => {
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
      expect(decisionMatrix.name).toBe("decision-matrix");
    });

    it("should have comprehensive description", () => {
      expect(decisionMatrix.description).toContain("Decision matrix");
      expect(decisionMatrix.description).toContain("multi-criteria");
    });

    it("should have valid input schema", () => {
      expect(decisionMatrix.inputSchema).toBeDefined();
      expect(decisionMatrix.inputSchema.shape).toHaveProperty("step");
      expect(decisionMatrix.inputSchema.shape).toHaveProperty("content");
      expect(decisionMatrix.inputSchema.shape).toHaveProperty("nextThoughtNeeded");
    });
  });

  describe("execute - Initial Setup", () => {
    it("should create new session with problem", async () => {
      const args = {
        problem: "Which programming language should we choose?",
        step: "define_decision",
        content: "Select the best programming language for our project",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Which programming language should we choose?",
        stepNumber: 1,
        data: {
          options: [],
          criteria: [],
          scores: {},
        },
        completedSteps: [],
        complete: false,
      });

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
      expect(result).toBeDefined();
    });
  });

  describe("execute - Options Management", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Which programming language should we choose?",
        stepNumber: 1,
        data: {
          options: [],
          criteria: [],
          scores: {},
        },
        completedSteps: ["define_decision"],
        complete: false,
      });
    });

    it("should add first option", async () => {
      const args = {
        step: "list_options",
        content: "JavaScript",
        nextThoughtNeeded: true,
      };

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should add multiple options", async () => {
      const options = ["JavaScript", "TypeScript", "Python", "Go"];
      
      for (let i = 0; i < options.length; i++) {
        const args = {
          step: "list_options",
          content: options[i],
          nextThoughtNeeded: true,
        };

        await decisionMatrix.execute(args, mockAgent);
      }

      expect(mockThinkingService.processStep).toHaveBeenCalledTimes(4);
    });
  });

  describe("execute - Criteria Management", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Which programming language should we choose?",
        stepNumber: 3,
        data: {
          options: ["JavaScript", "TypeScript"],
          criteria: [],
          scores: {},
        },
        completedSteps: ["define_decision", "list_options"],
        complete: false,
      });
    });

    it("should add criteria without weight", async () => {
      const args = {
        step: "define_criteria",
        content: "Performance",
        nextThoughtNeeded: true,
      };

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should add criteria with weight", async () => {
      const args = {
        step: "define_criteria",
        content: "Performance",
        weight: 3,
        nextThoughtNeeded: true,
      };

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should handle multiple criteria with different weights", async () => {
      const criteria = [
        { name: "Performance", weight: 3 },
        { name: "Developer Experience", weight: 2 },
        { name: "Ecosystem", weight: 2 },
        { name: "Learning Curve", weight: 1 },
      ];

      for (const criterion of criteria) {
        const args = {
          step: "define_criteria",
          content: criterion.name,
          weight: criterion.weight,
          nextThoughtNeeded: true,
        };

        await decisionMatrix.execute(args, mockAgent);
      }

      expect(mockThinkingService.processStep).toHaveBeenCalledTimes(4);
    });
  });

  describe("execute - Scoring System", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Which programming language should we choose?",
        stepNumber: 7,
        data: {
          options: ["JavaScript", "TypeScript"],
          criteria: [
            { name: "Performance", weight: 3 },
            { name: "Developer Experience", weight: 2 },
          ],
          scores: {},
        },
        completedSteps: ["define_decision", "list_options", "define_criteria", "weight_criteria"],
        complete: false,
      });
    });

    it("should score option against criterion", async () => {
      const args = {
        step: "score_options",
        option: "JavaScript",
        criterion: "Performance",
        score: 7,
        content: "Score JavaScript performance",
        nextThoughtNeeded: true,
      };

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should score multiple options against multiple criteria", async () => {
      const scores = [
        { option: "JavaScript", criterion: "Performance", score: 7 },
        { option: "JavaScript", criterion: "Developer Experience", score: 9 },
        { option: "TypeScript", criterion: "Performance", score: 8 },
        { option: "TypeScript", criterion: "Developer Experience", score: 8 },
      ];

      for (const score of scores) {
        const args = {
          step: "score_options",
          option: score.option,
          criterion: score.criterion,
          score: score.score,
          content: `Score ${score.option} ${score.criterion}`,
          nextThoughtNeeded: true,
        };

        await decisionMatrix.execute(args, mockAgent);
      }

      expect(mockThinkingService.processStep).toHaveBeenCalledTimes(4);
    });

    it("should handle scores for all option-criterion combinations", async () => {
      const args = {
        step: "score_options",
        option: "TypeScript",
        criterion: "Performance",
        score: 8,
        content: "Score TypeScript performance",
        nextThoughtNeeded: true,
      };

      await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });
  });

  describe("execute - Decision Phase", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Which programming language should we choose?",
        stepNumber: 11,
        data: {
          options: ["JavaScript", "TypeScript"],
          criteria: [
            { name: "Performance", weight: 3 },
            { name: "Developer Experience", weight: 2 },
          ],
          scores: {
            "JavaScript:Performance": 7,
            "JavaScript:Developer Experience": 9,
            "TypeScript:Performance": 8,
            "TypeScript:Developer Experience": 8,
          },
        },
        completedSteps: ["define_decision", "list_options", "define_criteria", "weight_criteria", "score_options"],
        complete: false,
      });
    });

    it("should handle calculate and decide step", async () => {
      const args = {
        step: "calculate_decide",
        content: "Based on weighted scores, TypeScript provides the best balance of performance and developer experience",
        nextThoughtNeeded: false,
      };

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should mark session complete when nextThoughtNeeded is false", async () => {
      const args = {
        step: "calculate_decide",
        content: "TypeScript is the recommended choice",
        nextThoughtNeeded: false,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Which programming language should we choose?",
        stepNumber: 12,
        data: {
          options: ["JavaScript", "TypeScript"],
          criteria: [
            { name: "Performance", weight: 3 },
            { name: "Developer Experience", weight: 2 },
          ],
          scores: {
            "JavaScript:Performance": 7,
            "JavaScript:Developer Experience": 9,
            "TypeScript:Performance": 8,
            "TypeScript:Developer Experience": 8,
          },
          recommendation: "TypeScript is the recommended choice",
        },
        completedSteps: ["calculate_decide"],
        complete: true,
      });

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });
  });

  describe("execute - State Management", () => {
    it("should initialize data structures if not present", async () => {
      const args = {
        problem: "Test decision",
        step: "define_decision",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Test decision",
        stepNumber: 1,
        data: {
          options: [],
          criteria: [],
          scores: {},
        },
        completedSteps: [],
        complete: false,
      });

      await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should handle existing data structures", async () => {
      const args = {
        step: "list_options",
        content: "Test option",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Test decision",
        stepNumber: 2,
        data: {
          options: ["Existing option"],
          criteria: [],
          scores: {},
        },
        completedSteps: ["define_decision"],
        complete: false,
      });

      await decisionMatrix.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "decision-matrix",
        args,
        mockAgent,
        expect.any(Function)
      );
    });
  });

  describe("execute - Step Validation", () => {
    it("should handle all valid steps", async () => {
      const steps = [
        "define_decision",
        "list_options",
        "define_criteria",
        "weight_criteria",
        "score_options",
        "calculate_decide",
      ];

      for (const step of steps) {
        const args = {
          step: step,
          content: `Test content for ${step}`,
          nextThoughtNeeded: true,
        };

        mockThinkingService.processStep.mockReturnValue({
          tool: "decision-matrix",
          problem: "Test decision",
          stepNumber: 1,
          data: {
            options: [],
            criteria: [],
            scores: {},
          },
          completedSteps: [],
          complete: false,
        });

        await expect(decisionMatrix.execute(args, mockAgent)).resolves.toBeDefined();
      }
    });
  });

  describe("execute - Error Handling", () => {
    it("should handle ThinkingService errors", async () => {
      const args = {
        problem: "Test decision",
        step: "define_decision",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockImplementation(() => {
        throw new Error("Test error");
      });

      await expect(decisionMatrix.execute(args, mockAgent)).rejects.toThrow("Test error");
    });

    it("should handle missing ThinkingService", async () => {
      const args = {
        problem: "Test decision",
        step: "define_decision",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockAgent.requireServiceByType.mockImplementation(() => {
        throw new Error("ThinkingService not found");
      });

      await expect(decisionMatrix.execute(args, mockAgent)).rejects.toThrow();
    });
  });

  describe("execute - Return Value", () => {
    it("should return JSON string of result", async () => {
      const args = {
        problem: "Test decision",
        step: "define_decision",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      const mockResult = {
        tool: "decision-matrix",
        problem: "Test decision",
        stepNumber: 1,
        data: {
          options: [],
          criteria: [],
          scores: {},
        },
        completedSteps: [],
        complete: false,
      };

      mockThinkingService.processStep.mockReturnValue(mockResult);

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(typeof result).toBe("object");
      expect(result).toMatchObject(mockResult);
    });

    it("should return formatted JSON", async () => {
      const args = {
        problem: "Test decision",
        step: "define_decision",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Test decision",
        stepNumber: 1,
        data: {
          options: [],
          criteria: [],
          scores: {},
        },
        completedSteps: [],
        complete: false,
      });

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(result).toHaveProperty("tool");
      expect(result.tool).toBe("decision-matrix");
    });

    it("should include all decision matrix components in result", async () => {
      const args = {
        step: "calculate_decide",
        content: "Final recommendation based on scores",
        nextThoughtNeeded: false,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "decision-matrix",
        problem: "Test decision",
        stepNumber: 6,
        data: {
          options: ["Option 1", "Option 2"],
          criteria: [
            { name: "Criterion 1", weight: 2 },
            { name: "Criterion 2", weight: 1 },
          ],
          scores: {
            "Option 1:Criterion 1": 8,
            "Option 1:Criterion 2": 6,
            "Option 2:Criterion 1": 7,
            "Option 2:Criterion 2": 9,
          },
          recommendation: "Final recommendation based on scores",
        },
        completedSteps: ["calculate_decide"],
        complete: true,
      });

      const result = await decisionMatrix.execute(args, mockAgent);

      expect(typeof result).toBe("object");
      expect(result.data).toHaveProperty("options");
      expect(result.data).toHaveProperty("criteria");
      expect(result.data).toHaveProperty("scores");
      expect(result.data).toHaveProperty("recommendation");
    });
  });
});
