import Agent from "@tokenring-ai/agent/Agent";
import createTestingAgent from "@tokenring-ai/agent/test/createTestingAgent";
import TokenRingApp from "@tokenring-ai/app";
import createTestingApp from "@tokenring-ai/app/test/createTestingApp";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {ThinkingState} from "../state/thinkingState";
import ThinkingService from "../ThinkingService";
import tools from "../tools";

describe("Integration Tests", () => {
  let app: TokenRingApp;
  let thinkingService: ThinkingService;
  let agent: Agent;

  beforeEach(() => {
    app = createTestingApp();
    thinkingService = new ThinkingService();

    app.addServices(thinkingService);

    agent = createTestingAgent(app);
    thinkingService.attach(agent);
  });

  describe("Plugin Integration", () => {
    it("should export all thinking tools", () => {
      const toolNames = [
        "scientificMethod",
        "socraticDialogue",
        "designThinking",
        "rootCauseAnalysis",
        "swotAnalysis",
        "preMortem",
        "dialecticalReasoning",
        "firstPrinciples",
        "decisionMatrix",
        "lateralThinking",
        "agileSprint",
        "feynmanTechnique",
        "sixThinkingHats",
      ];

      toolNames.forEach(name => {
        expect(tools).toHaveProperty(name);
        expect(tools[name as keyof typeof tools]).toBeDefined();
      });
    });

    it("should have correct tool properties", () => {
      Object.values(tools).forEach(tool => {
        expect(tool).toHaveProperty("name");
        expect(tool).toHaveProperty("description");
        expect(tool).toHaveProperty("inputSchema");
        expect(tool).toHaveProperty("execute");
        expect(typeof tool.execute).toBe("function");
      });
    });
  });

  describe("End-to-End Scientific Method Workflow", () => {
    it("should complete full scientific method process", async () => {
      const scientificMethod = tools.scientificMethod;

      // Step 1: Question/Observation
      const step1Args = {
        problem: "What causes website slow performance?",
        step: "question_observation",
        content: "User reports indicate website loading times exceed 5 seconds",
        nextThoughtNeeded: true,
      };
      const step1Result = await scientificMethod.execute(step1Args, agent);
      expect(typeof step1Result).toBe("object");

      // Step 2: Background Research
      const step2Args = {
        step: "background_research",
        content: "Historical performance data shows gradual degradation over 6 months",
        nextThoughtNeeded: true,
      };

      const step2Result = await scientificMethod.execute(step2Args, agent);
      expect(typeof step2Result).toBe("object");

      // Step 3: Hypothesis Formation
      const step3Args = {
        step: "hypothesis_formulation",
        content: "Database queries are becoming inefficient due to growing data volume",
        hypothesis_update: {
          new_hypothesis_text: "Database queries are becoming inefficient due to growing data volume",
          action: "propose",
        },
        nextThoughtNeeded: true,
      };

      const step3Result = await scientificMethod.execute(step3Args, agent);
      expect(typeof step3Result).toBe("object");

      // Step 4: Testing/Experimentation
      const step4Args = {
        step: "testing_experimentation",
        content: "Database query analysis reveals N+1 query pattern in ORM",
        targets_hypothesis_id: ["h1"],
        nextThoughtNeeded: true,
      };

      const step4Result = await scientificMethod.execute(step4Args, agent);
      expect(typeof step4Result).toBe("object");

      // Step 5: Analysis
      const step5Args = {
        step: "analysis",
        content: "Evidence strongly supports the hypothesis",
        targets_hypothesis_id: ["h1"],
        hypothesis_update: {
          hypothesis_id: "h1",
          action: "support",
        },
        nextThoughtNeeded: true,
      };

      const step5Result = await scientificMethod.execute(step5Args, agent);
      expect(typeof step5Result).toBe("object");

      // Step 6: Conclusion
      const step6Args = {
        step: "conclusion",
        content: "Database optimization is required to improve performance",
        nextThoughtNeeded: false,
        final_answer: "Database queries are the primary cause of slow performance and require optimization",
      };

      const step6Result = await scientificMethod.execute(step6Args, agent);
      expect(typeof step6Result).toBe("object");
    });
  });

  describe("End-to-End Decision Matrix Workflow", () => {
    it("should complete full decision matrix process", async () => {
      const decisionMatrix = tools.decisionMatrix;

      // Step 1: Define Decision
      const step1Args = {
        problem: "Which database optimization strategy should we implement?",
        step: "define_decision",
        content: "Select the most effective database optimization approach",
        nextThoughtNeeded: true,
      };

      const step1Result = await decisionMatrix.execute(step1Args, agent);
      expect(typeof step1Result).toBe("object");

      const options = ["Query Optimization", "Index Optimization", "Caching Layer", "Database Sharding"];
      for (const option of options) {
        const args = {
          step: "list_options",
          content: option,
          nextThoughtNeeded: true,
        };
        const result = await decisionMatrix.execute(args, agent);
        expect(typeof result).toBe("object");
      }

      const criteria = [
        { name: "Implementation Complexity", weight: 2 },
        { name: "Performance Impact", weight: 3 },
        { name: "Cost", weight: 1 },
      ];
      for (const criterion of criteria) {
        const args = {
          step: "define_criteria",
          content: criterion.name,
          weight: criterion.weight,
          nextThoughtNeeded: true,
        };
        const result = await decisionMatrix.execute(args, agent);
        expect(typeof result).toBe("object");
      }

      // Step 4: Score Options
      const scores = [
        { option: "Query Optimization", criterion: "Implementation Complexity", score: 8 },
        { option: "Query Optimization", criterion: "Performance Impact", score: 7 },
        { option: "Query Optimization", criterion: "Cost", score: 9 },
        { option: "Index Optimization", criterion: "Implementation Complexity", score: 6 },
        { option: "Index Optimization", criterion: "Performance Impact", score: 8 },
        { option: "Index Optimization", criterion: "Cost", score: 8 },
        { option: "Caching Layer", criterion: "Implementation Complexity", score: 4 },
        { option: "Caching Layer", criterion: "Performance Impact", score: 9 },
        { option: "Caching Layer", criterion: "Cost", score: 5 },
        { option: "Database Sharding", criterion: "Implementation Complexity", score: 2 },
        { option: "Database Sharding", criterion: "Performance Impact", score: 10 },
        { option: "Database Sharding", criterion: "Cost", score: 3 },
      ];

      for (const score of scores) {
        const args = {
          step: "score_options",
          option: score.option,
          criterion: score.criterion,
          score: score.score,
          content: `Score ${score.option} for ${score.criterion}`,
          nextThoughtNeeded: true,
        };
        const result = await decisionMatrix.execute(args, agent);
        expect(typeof result).toBe("object");
      }

      const finalArgs = {
        step: "calculate_decide",
        content: "Based on weighted scoring, caching layer provides the best balance of impact and feasibility",
        nextThoughtNeeded: false,
      };

      const finalResult = await decisionMatrix.execute(finalArgs, agent);
      expect(typeof finalResult).toBe("object");
    });
  });

  describe("End-to-End First Principles Workflow", () => {
    it("should complete full first principles process", async () => {
      const firstPrinciples = tools.firstPrinciples;

      // Step 1: State Problem
      const step1Args = {
        problem: "How to achieve 99.9% uptime for critical system?",
        step: "state_problem",
        content: "Current system uptime is 95%, target is 99.9%",
        nextThoughtNeeded: true,
      };

      const step1Result = await firstPrinciples.execute(step1Args, agent);
      expect(typeof step1Result).toBe("object");

      // Step 2: Identify Assumptions
      const assumptions = [
        "Current infrastructure is properly configured",
        "Hardware failures are the main cause of downtime",
        "Software bugs are minimal",
        "Network connectivity is stable",
      ];
      for (const assumption of assumptions) {
        const args = {
          step: "identify_assumptions",
          content: assumption,
          nextThoughtNeeded: true,
        };
        const result = await firstPrinciples.execute(args, agent);
        expect(typeof result).toBe("object");
      }

      // Step 3: Challenge Assumptions
      const challenges = [
        "Analysis reveals misconfigured load balancer causing 60% of downtime",
        "Database connection pool exhaustion during peak hours",
      ];
      for (const challenge of challenges) {
        const args = {
          step: "challenge_assumptions",
          content: challenge,
          nextThoughtNeeded: true,
        };
        const result = await firstPrinciples.execute(args, agent);
        expect(typeof result).toBe("object");
      }

      // Step 4: Break to Fundamentals
      const fundamentals = [
        "System uptime depends on: infrastructure reliability, application stability, and maintenance procedures",
        "Uptime = (Total Time - Downtime) / Total Time",
        "Downtime causes: hardware failures, software crashes, human error, and planned maintenance",
      ];
      for (const fundamental of fundamentals) {
        const args = {
          step: "break_to_fundamentals",
          content: fundamental,
          nextThoughtNeeded: true,
        };
        const result = await firstPrinciples.execute(args, agent);
        expect(typeof result).toBe("object");
      }

      // Step 5: Rebuild from Basics
      const rebuildSteps = [
        "Implement redundant infrastructure with automatic failover",
        "Add comprehensive monitoring and alerting",
        "Establish clear maintenance procedures and schedules",
        "Implement automated testing and deployment pipelines",
      ];
      for (const step of rebuildSteps) {
        const args = {
          step: "rebuild_from_basics",
          content: step,
          nextThoughtNeeded: true,
        };
        const result = await firstPrinciples.execute(args, agent);
        expect(typeof result).toBe("object");
      }

      // Step 6: Novel Solution
      const solutionArgs = {
        step: "novel_solution",
        content: "Implement comprehensive redundancy strategy with automated monitoring, failover, and maintenance procedures",
        nextThoughtNeeded: false,
      };

      const solutionResult = await firstPrinciples.execute(solutionArgs, agent);
      expect(typeof solutionResult).toBe("object");
    });
  });

  describe("State Persistence", () => {
    it("should maintain state across multiple executions", async () => {
      vi.spyOn(agent, "mutateState");
      const decisionMatrix = tools.decisionMatrix;

      const args1 = {
        problem: "Test decision",
        step: "define_decision",
        content: "Initial decision",
        nextThoughtNeeded: true,
      };

      const result1 = await decisionMatrix.execute(args1, agent);
      expect(typeof result1).toBe("object");

      const args2 = {
        step: "list_options",
        content: "Option 1",
        nextThoughtNeeded: true,
      };

      const result2 = await decisionMatrix.execute(args2, agent);
      expect(typeof result2).toBe("object");

      expect(agent.mutateState).toHaveBeenCalledTimes(2);
    });

    it("should serialize and deserialize state correctly", () => {
      // Add sessions to state
      const session1 = {
        tool: "test-tool-1",
        problem: "Problem 1",
        stepNumber: 1,
        data: { key: "value1" },
        completedSteps: ["step1"],
        complete: false,
      };

      const session2 = {
        tool: "test-tool-2",
        problem: "Problem 2",
        stepNumber: 2,
        data: { key: "value2" },
        completedSteps: ["step1", "step2"],
        complete: true,
      };

      agent.mutateState(ThinkingState, (thinkingState) => {
        thinkingState.sessions.set("test-tool-1", session1);
        thinkingState.sessions.set("test-tool-2", session2);
      });

      // Test serialization
      const serialized = agent.getState(ThinkingState).serialize();
      expect(serialized).toEqual({
        sessions: {
          "test-tool-1": session1,
          "test-tool-2": session2,
        },
      });

      // Test deserialization
      const newData = {
        sessions: {
          "test-tool-3": {
            tool: "test-tool-3",
            problem: "Problem 3",
            stepNumber: 1,
            data: {},
            completedSteps: [],
            complete: false,
          },
        },
      };

      agent.getState(ThinkingState).deserialize(newData);
      expect(agent.getState(ThinkingState).sessions.has("test-tool-3")).toBe(true);
    });
  });

  describe("Error Recovery", () => {
    it("should handle ThinkingService errors gracefully", async () => {
      const scientificMethod = tools.scientificMethod;

      // Mock ThinkingService to return error
      agent.requireServiceByType = vi.fn(() => {
        throw new Error("ThinkingService not available");
      });

      const args = {
        problem: "Test problem",
        step: "question_observation",
        content: "Test content",
        nextThoughtNeeded: true,
      };

      await expect(scientificMethod.execute(args, agent)).rejects.toThrow();
    });

    it("should handle malformed arguments", async () => {
      const decisionMatrix = tools.decisionMatrix;

      // Missing required fields
      const invalidArgs = {
        step: "define_decision",
        // missing content and nextThoughtNeeded
      };

      await expect(decisionMatrix.execute(invalidArgs, agent)).rejects.toThrow();
    });
  });
});
