import {beforeEach, describe, expect, it, vi} from "vitest";
import firstPrinciples from "../tools/firstPrinciples";

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

describe("firstPrinciples Tool", () => {
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
      expect(firstPrinciples.name).toBe("first-principles");
    });

    it("should have comprehensive description", () => {
      expect(firstPrinciples.description).toContain("First principles");
      expect(firstPrinciples.description).toContain("fundamental truths");
    });

    it("should have valid input schema", () => {
      expect(firstPrinciples.inputSchema).toBeDefined();
      expect(firstPrinciples.inputSchema.shape).toHaveProperty("step");
      expect(firstPrinciples.inputSchema.shape).toHaveProperty("content");
      expect(firstPrinciples.inputSchema.shape).toHaveProperty("nextThoughtNeeded");
    });
  });

  describe("execute - Initial Problem Setup", () => {
    it("should create new session with problem", async () => {
      const args = {
        problem: "How can we improve website performance?",
        step: "state_problem",
        content: "Current website loading times are too slow",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "How can we improve website performance?",
        stepNumber: 1,
        data: {
          assumptions: [],
          fundamentalTruths: [],
          reconstructionSteps: [],
        },
        completedSteps: [],
        complete: false,
      });

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
        args,
        mockAgent,
        expect.any(Function)
      );
      expect(result).toBeDefined();
    });
  });

  describe("execute - Assumption Identification", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "How can we improve website performance?",
        stepNumber: 1,
        data: {
          assumptions: [],
          fundamentalTruths: [],
          reconstructionSteps: [],
        },
        completedSteps: ["state_problem"],
        complete: false,
      });
    });

    it("should identify first assumption", async () => {
      const args = {
        step: "identify_assumptions",
        content: "Server hardware is the bottleneck",
        nextThoughtNeeded: true,
      };

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should identify multiple assumptions", async () => {
      const assumptions = [
        "Server hardware is the bottleneck",
        "Database queries are optimized",
        "Frontend code is efficient",
        "Network bandwidth is sufficient",
        "Browser caching is working properly",
      ];

      for (let i = 0; i < assumptions.length; i++) {
        const args = {
          step: "identify_assumptions",
          content: assumptions[i],
          nextThoughtNeeded: true,
        };

        await firstPrinciples.execute(args, mockAgent);
      }

      expect(mockThinkingService.processStep).toHaveBeenCalledTimes(5);
    });
  });

  describe("execute - Challenge Assumptions", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "How can we improve website performance?",
        stepNumber: 6,
        data: {
          assumptions: [
            "Server hardware is the bottleneck",
            "Database queries are optimized",
            "Frontend code is efficient",
          ],
          fundamentalTruths: [],
          reconstructionSteps: [],
        },
        completedSteps: ["state_problem", "identify_assumptions"],
        complete: false,
      });
    });

    it("should challenge first assumption", async () => {
      const args = {
        step: "challenge_assumptions",
        content: "Testing shows server utilization is only at 40%, so hardware may not be the issue",
        nextThoughtNeeded: true,
      };

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should challenge multiple assumptions", async () => {
      const challenges = [
        "Testing shows server utilization is only at 40%",
        "Database query analysis reveals N+1 queries in ORM",
        "Frontend bundle size analysis shows unused dependencies",
      ];

      for (const challenge of challenges) {
        const args = {
          step: "challenge_assumptions",
          content: challenge,
          nextThoughtNeeded: true,
        };

        await firstPrinciples.execute(args, mockAgent);
      }

      expect(mockThinkingService.processStep).toHaveBeenCalledTimes(3);
    });
  });

  describe("execute - Break to Fundamentals", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "How can we improve website performance?",
        stepNumber: 9,
        data: {
          assumptions: [
            "Server hardware is the bottleneck",
            "Database queries are optimized",
            "Frontend code is efficient",
          ],
          fundamentalTruths: [],
          reconstructionSteps: [],
        },
        completedSteps: ["state_problem", "identify_assumptions", "challenge_assumptions"],
        complete: false,
      });
    });

    it("should identify first fundamental truth", async () => {
      const args = {
        step: "break_to_fundamentals",
        content: "Web performance fundamentally depends on: network latency, server processing time, database query time, and client-side rendering time",
        nextThoughtNeeded: true,
      };

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should identify multiple fundamental truths", async () => {
      const fundamentals = [
        "Web performance fundamentally depends on: network latency, server processing time, database query time, and client-side rendering time",
        "Each HTTP request requires: DNS lookup, TCP connection, TLS handshake, and data transfer",
        "Database performance depends on: query complexity, index efficiency, and connection pooling",
        "Frontend performance depends on: bundle size, render time, and event handling efficiency",
      ];

      for (const fundamental of fundamentals) {
        const args = {
          step: "break_to_fundamentals",
          content: fundamental,
          nextThoughtNeeded: true,
        };

        await firstPrinciples.execute(args, mockAgent);
      }

      expect(mockThinkingService.processStep).toHaveBeenCalledTimes(4);
    });
  });

  describe("execute - Rebuild from Basics", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "How can we improve website performance?",
        stepNumber: 13,
        data: {
          assumptions: [
            "Server hardware is the bottleneck",
            "Database queries are optimized",
            "Frontend code is efficient",
          ],
          fundamentalTruths: [
            "Web performance fundamentally depends on: network latency, server processing time, database query time, and client-side rendering time",
            "Each HTTP request requires: DNS lookup, TCP connection, TLS handshake, and data transfer",
          ],
          reconstructionSteps: [],
        },
        completedSteps: ["state_problem", "identify_assumptions", "challenge_assumptions", "break_to_fundamentals"],
        complete: false,
      });
    });

    it("should add first reconstruction step", async () => {
      const args = {
        step: "rebuild_from_basics",
        content: "Implement CDN for static assets to reduce network latency",
        nextThoughtNeeded: true,
      };

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should add multiple reconstruction steps", async () => {
      const steps = [
        "Implement CDN for static assets to reduce network latency",
        "Optimize database queries and add proper indexing",
        "Implement code splitting to reduce initial bundle size",
        "Add connection pooling to improve database performance",
        "Implement caching strategies for frequently accessed data",
      ];

      for (const step of steps) {
        const args = {
          step: "rebuild_from_basics",
          content: step,
          nextThoughtNeeded: true,
        };

        await firstPrinciples.execute(args, mockAgent);
      }

      expect(mockThinkingService.processStep).toHaveBeenCalledTimes(5);
    });
  });

  describe("execute - Novel Solution", () => {
    beforeEach(() => {
      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "How can we improve website performance?",
        stepNumber: 18,
        data: {
          assumptions: [
            "Server hardware is the bottleneck",
            "Database queries are optimized",
            "Frontend code is efficient",
          ],
          fundamentalTruths: [
            "Web performance fundamentally depends on: network latency, server processing time, database query time, and client-side rendering time",
            "Each HTTP request requires: DNS lookup, TCP connection, TLS handshake, and data transfer",
          ],
          reconstructionSteps: [
            "Implement CDN for static assets to reduce network latency",
            "Optimize database queries and add proper indexing",
            "Implement code splitting to reduce initial bundle size",
            "Add connection pooling to improve database performance",
            "Implement caching strategies for frequently accessed data",
          ],
        },
        completedSteps: ["state_problem", "identify_assumptions", "challenge_assumptions", "break_to_fundamentals", "rebuild_from_basics"],
        complete: false,
      });
    });

    it("should provide novel solution", async () => {
      const args = {
        step: "novel_solution",
        content: "Implement a comprehensive performance optimization strategy combining CDN, database optimization, code splitting, and intelligent caching",
        nextThoughtNeeded: false,
      };

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should mark session complete when solution is provided", async () => {
      const args = {
        step: "novel_solution",
        content: "Implement a comprehensive performance optimization strategy combining CDN, database optimization, code splitting, and intelligent caching",
        nextThoughtNeeded: false,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "How can we improve website performance?",
        stepNumber: 19,
        data: {
          assumptions: [
            "Server hardware is the bottleneck",
            "Database queries are optimized",
            "Frontend code is efficient",
          ],
          fundamentalTruths: [
            "Web performance fundamentally depends on: network latency, server processing time, database query time, and client-side rendering time",
          ],
          reconstructionSteps: [
            "Implement CDN for static assets to reduce network latency",
            "Optimize database queries and add proper indexing",
          ],
          solution: "Implement a comprehensive performance optimization strategy combining CDN, database optimization, code splitting, and intelligent caching",
        },
        completedSteps: ["novel_solution"],
        complete: true,
      });

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
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
        step: "state_problem",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "Test problem",
        stepNumber: 1,
        data: {
          assumptions: [],
          fundamentalTruths: [],
          reconstructionSteps: [],
        },
        completedSteps: [],
        complete: false,
      });

      await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
        args,
        mockAgent,
        expect.any(Function)
      );
    });

    it("should handle existing data structures", async () => {
      const args = {
        step: "identify_assumptions",
        content: "Test assumption",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "Test problem",
        stepNumber: 2,
        data: {
          assumptions: ["Existing assumption"],
          fundamentalTruths: [],
          reconstructionSteps: [],
        },
        completedSteps: ["state_problem"],
        complete: false,
      });

      await firstPrinciples.execute(args, mockAgent);

      expect(mockThinkingService.processStep).toHaveBeenCalledWith(
        "first-principles",
        args,
        mockAgent,
        expect.any(Function)
      );
    });
  });

  describe("execute - Step Validation", () => {
    it("should handle all valid steps", async () => {
      const steps = [
        "state_problem",
        "identify_assumptions",
        "challenge_assumptions",
        "break_to_fundamentals",
        "rebuild_from_basics",
        "novel_solution",
      ];

      for (const step of steps) {
        const args = {
          step: step,
          content: `Test content for ${step}`,
          nextThoughtNeeded: true,
        };

        mockThinkingService.processStep.mockReturnValue({
          tool: "first-principles",
          problem: "Test problem",
          stepNumber: 1,
          data: {
            assumptions: [],
            fundamentalTruths: [],
            reconstructionSteps: [],
          },
          completedSteps: [],
          complete: false,
        });

        await expect(firstPrinciples.execute(args, mockAgent)).resolves.toBeDefined();
      }
    });
  });

  describe("execute - Error Handling", () => {
    it("should handle ThinkingService errors", async () => {
      const args = {
        problem: "Test problem",
        step: "state_problem",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockThinkingService.processStep.mockImplementation(() => {
        throw new Error("Test error");
      });

      await expect(firstPrinciples.execute(args, mockAgent)).rejects.toThrow("Test error");
    });

    it("should handle missing ThinkingService", async () => {
      const args = {
        problem: "Test problem",
        step: "state_problem",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      mockAgent.requireServiceByType.mockImplementation(() => {
        throw new Error("ThinkingService not found");
      });

      await expect(firstPrinciples.execute(args, mockAgent)).rejects.toThrow();
    });
  });

  describe("execute - Return Value", () => {
    it("should return JSON result", async () => {
      const args = {
        problem: "Test problem",
        step: "state_problem",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      const mockResult = {
        tool: "first-principles",
        problem: "Test problem",
        stepNumber: 1,
        data: {
          assumptions: [],
          fundamentalTruths: [],
          reconstructionSteps: [],
        },
        completedSteps: [],
        complete: false,
      };

      mockThinkingService.processStep.mockReturnValue(mockResult);

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(typeof result).toBe("object");
      expect(result).toEqual(mockResult);
    });

    it("should include all first principles components in result", async () => {
      const args = {
        step: "novel_solution",
        content: "Comprehensive solution based on first principles",
        nextThoughtNeeded: false,
      };

      mockThinkingService.processStep.mockReturnValue({
        tool: "first-principles",
        problem: "Test problem",
        stepNumber: 6,
        data: {
          assumptions: ["Assumption 1", "Assumption 2"],
          fundamentalTruths: ["Fundamental truth 1", "Fundamental truth 2"],
          reconstructionSteps: ["Step 1", "Step 2"],
          solution: "Comprehensive solution based on first principles",
        },
        completedSteps: ["novel_solution"],
        complete: true,
      });

      const result = await firstPrinciples.execute(args, mockAgent);

      expect(typeof result).toBe("object");
      expect(result.data).toHaveProperty("assumptions");
      expect(result.data).toHaveProperty("fundamentalTruths");
      expect(result.data).toHaveProperty("reconstructionSteps");
      expect(result.data).toHaveProperty("solution");
    });
  });
});