import Agent from "@tokenring-ai/agent/Agent";
import createTestingAgent from "@tokenring-ai/agent/test/createTestingAgent";
import TokenRingApp from "@tokenring-ai/app";
import createTestingApp from "@tokenring-ai/app/test/createTestingApp";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {ThinkingState} from "../state/thinkingState";
import ThinkingService from "../ThinkingService";

describe("ThinkingService", () => {
  let thinkingService: ThinkingService;
  let app: TokenRingApp;
  let agent: Agent;

  beforeEach(async () => {
    thinkingService = new ThinkingService();
    app = createTestingApp();
    app.addServices(thinkingService);
    agent = createTestingAgent(app);
    await thinkingService.attach(agent);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Service Properties", () => {
    it("should have correct name and description", () => {
      expect(thinkingService.name).toBe("ThinkingService");
      expect(thinkingService.description).toBe("Provides structured reasoning functionality");
    });
  });

  describe("attach", () => {
    it("should initialize ThinkingState on agent", async () => {
      const newAgent = createTestingAgent(app);
      await thinkingService.attach(newAgent);
      
      expect(newAgent.getState(ThinkingState)).toBeDefined();
    });
  });

  describe("processStep", () => {
    const toolName = "test-tool";
    const mockProcessor = vi.fn((session, args) => ({ result: "processed" }));

    it("should create new session when none exists", () => {
      const args = {
        problem: "Test problem",
        step: "test-step",
        content: "Test content",
        nextThoughtNeeded: true
      };

      const result = thinkingService.processStep(toolName, args, agent, mockProcessor);

      expect(result.tool).toBe(toolName);
      expect(result.problem).toBe("Test problem");
      expect(result.stepNumber).toBe(1);
      expect(result.complete).toBe(false);
      const state = agent.getState(ThinkingState);
      expect(state.sessions.has(toolName)).toBe(true);
    });

    it("should return error when problem not provided on first call", () => {
      const args = {
        step: "test-step",
        content: "Test content",
        nextThoughtNeeded: true
      };

      expect(() => {
        thinkingService.processStep(toolName, args, agent, mockProcessor);
      }).toThrow("Problem must be defined on first call");
    });

    it("should increment step number for existing session", () => {
      const args = {
        problem: "Test problem",
        step: "test-step-2",
        content: "Test content",
        nextThoughtNeeded: true
      };

      const result1 = thinkingService.processStep(toolName, args, agent, mockProcessor);
      expect(result1.stepNumber).toBe(1);

      const result2 = thinkingService.processStep(toolName, args, agent, mockProcessor);
      expect(result2.stepNumber).toBe(2);
    });

    it("should add completed steps when provided", () => {
      const args = {
        problem: "Test problem",
        step: "completed-step",
        content: "Test content",
        nextThoughtNeeded: true
      };

      const result = thinkingService.processStep(toolName, args, agent, mockProcessor);

      expect(result.completedSteps).toContain("completed-step");
    });

    it("should mark session complete when nextThoughtNeeded is false", () => {
      const args = {
        problem: "Test problem",
        step: "test-step",
        content: "Test content",
        nextThoughtNeeded: false
      };

      const result = thinkingService.processStep(toolName, args, agent, mockProcessor);

      expect(result.complete).toBe(true);
    });

    it("should mark session complete when complete flag is true", () => {
      const args = {
        problem: "Test problem",
        step: "test-step",
        content: "Test content",
        complete: true,
        nextThoughtNeeded: true
      };

      const result = thinkingService.processStep(toolName, args, agent, mockProcessor);

      expect(result.complete).toBe(true);
    });

    it("should call processor with session and args", () => {
      const testProcessor = vi.fn((session, args) => ({ processed: true }));
      const args = {
        problem: "Test problem",
        step: "test-step",
        content: "Test content",
        nextThoughtNeeded: true
      };

      thinkingService.processStep(toolName, args, agent, testProcessor);

      expect(testProcessor).toHaveBeenCalledWith(expect.any(Object), args);
    });
  });

  describe("clearSession", () => {
    it("should remove specific session", () => {
      const mockProcessor = vi.fn((session, args) => ({}));
      
      thinkingService.processStep("tool1", { problem: "Problem 1", step: "step1", nextThoughtNeeded: true }, agent, mockProcessor);
      thinkingService.processStep("tool2", { problem: "Problem 2", step: "step1", nextThoughtNeeded: true }, agent, mockProcessor);

      const state = agent.getState(ThinkingState);
      expect(state.sessions.has("tool1")).toBe(true);
      expect(state.sessions.has("tool2")).toBe(true);

      thinkingService.clearSession("tool1", agent);

      const updatedState = agent.getState(ThinkingState);
      expect(updatedState.sessions.has("tool1")).toBe(false);
      expect(updatedState.sessions.has("tool2")).toBe(true);
    });
  });

  describe("clearAll", () => {
    it("should clear all sessions", () => {
      const mockProcessor = vi.fn((session, args) => ({}));
      
      thinkingService.processStep("tool1", { problem: "Problem 1", step: "step1", nextThoughtNeeded: true }, agent, mockProcessor);
      thinkingService.processStep("tool2", { problem: "Problem 2", step: "step1", nextThoughtNeeded: true }, agent, mockProcessor);
      thinkingService.processStep("tool3", { problem: "Problem 3", step: "step1", nextThoughtNeeded: true }, agent, mockProcessor);

      const state = agent.getState(ThinkingState);
      expect(state.sessions.size).toBe(3);

      thinkingService.clearAll(agent);

      const updatedState = agent.getState(ThinkingState);
      expect(updatedState.sessions.size).toBe(0);
    });
  });

  describe("Error Handling", () => {
    it("should handle processor errors gracefully", () => {
      const faultyProcessor = () => {
        throw new Error("Processor error");
      };
      
      const args = {
        problem: "Test problem",
        step: "test-step",
        content: "Test content",
        nextThoughtNeeded: true
      };

      expect(() => {
        thinkingService.processStep("test-tool", args, agent, faultyProcessor);
      }).toThrow();
    });
  });
});
