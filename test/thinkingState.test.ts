import { describe, it, expect, beforeEach } from "vitest";
import { ThinkingState, ReasoningSession } from "../state/thinkingState";

describe("ThinkingState", () => {
  let state: ThinkingState;

  beforeEach(() => {
    state = new ThinkingState();
  });

  describe("Constructor", () => {
    it("should initialize with empty sessions map", () => {
      expect(state.sessions).toBeInstanceOf(Map);
      expect(state.sessions.size).toBe(0);
    });

    it("should initialize with provided data", () => {
      const data = {
        sessions: {
          "tool1": {
            tool: "tool1",
            problem: "Problem 1",
            stepNumber: 1,
            data: {},
            completedSteps: [],
            complete: false
          }
        }
      };

      const stateWithData = new ThinkingState(data);
      expect(stateWithData.sessions.size).toBe(1);
      expect(stateWithData.sessions.has("tool1")).toBe(true);
    });
  });

  describe("name", () => {
    it("should return correct name", () => {
      expect(state.name).toBe("ThinkingState");
    });
  });

  describe("serialize", () => {
    it("should serialize sessions correctly", () => {
      const session1: ReasoningSession = {
        tool: "tool1",
        problem: "Problem 1",
        stepNumber: 1,
        data: { key: "value" },
        completedSteps: ["step1", "step2"],
        complete: false,
      };

      const session2: ReasoningSession = {
        tool: "tool2",
        problem: "Problem 2",
        stepNumber: 2,
        data: {},
        completedSteps: [],
        complete: true,
      };

      state.sessions.set("tool1", session1);
      state.sessions.set("tool2", session2);

      const serialized = state.serialize();
      
      expect(serialized).toEqual({
        sessions: {
          "tool1": session1,
          "tool2": session2
        }
      });
    });

    it("should handle empty sessions", () => {
      const serialized = state.serialize();
      expect(serialized).toEqual({ sessions: {} });
    });
  });

  describe("deserialize", () => {
    it("should deserialize sessions correctly", () => {
      const data = {
        sessions: {
          "tool1": {
            tool: "tool1",
            problem: "Problem 1",
            stepNumber: 1,
            data: { key: "value" },
            completedSteps: ["step1"],
            complete: false,
          },
          "tool2": {
            tool: "tool2",
            problem: "Problem 2",
            stepNumber: 2,
            data: {},
            completedSteps: [],
            complete: true,
          }
        }
      };

      state.deserialize(data);

      expect(state.sessions.size).toBe(2);
      expect(state.sessions.get("tool1")).toEqual(data.sessions.tool1);
      expect(state.sessions.get("tool2")).toEqual(data.sessions.tool2);
    });

    it("should handle empty data", () => {
      const data = { sessions: null };

      state.deserialize(data);

      expect(state.sessions).toBeInstanceOf(Map);
      expect(state.sessions.size).toBe(0);
    });

    it("should handle undefined data", () => {
      state.deserialize({ sessions: undefined });

      expect(state.sessions).toBeInstanceOf(Map);
      expect(state.sessions.size).toBe(0);
    });

    it("should handle null sessions", () => {
      const data = { sessions: null };

      state.deserialize(data);

      expect(state.sessions).toBeInstanceOf(Map);
      expect(state.sessions.size).toBe(0);
    });
  });

  describe("reset", () => {
    it("should clear sessions when 'chat' is included", () => {
      state.sessions.set("tool1", {} as ReasoningSession);
      state.sessions.set("tool2", {} as ReasoningSession);

      state.reset(["chat"]);

      expect(state.sessions.size).toBe(0);
    });

    it("should not clear sessions when 'chat' is not included", () => {
      state.sessions.set("tool1", {} as ReasoningSession);

      state.reset(["other"]);

      expect(state.sessions.size).toBe(1);
    });

    it("should handle empty reset list", () => {
      state.sessions.set("tool1", {} as ReasoningSession);

      state.reset([]);

      expect(state.sessions.size).toBe(1);
    });
  });

  describe("show", () => {
    it("should return correct summary for empty state", () => {
      const summary = state.show();

      expect(summary).toEqual(["Active Sessions: 0"]);
    });

    it("should return correct summary with sessions", () => {
      const session1: ReasoningSession = {
        tool: "tool1",
        problem: "Problem 1",
        stepNumber: 3,
        data: {},
        completedSteps: [],
        complete: false,
      };

      const session2: ReasoningSession = {
        tool: "tool2",
        problem: "Problem 2",
        stepNumber: 5,
        data: {},
        completedSteps: [],
        complete: true,
      };

      state.sessions.set("tool1", session1);
      state.sessions.set("tool2", session2);

      const summary = state.show();

      expect(summary).toEqual([
        "Active Sessions: 2",
        "  tool1: 3 steps, in progress",
        "  tool2: 5 steps, complete"
      ]);
    });

    it("should handle sessions with zero steps", () => {
      const session: ReasoningSession = {
        tool: "tool1",
        problem: "Problem 1",
        stepNumber: 0,
        data: {},
        completedSteps: [],
        complete: false,
      };

      state.sessions.set("tool1", session);

      const summary = state.show();

      expect(summary).toEqual([
        "Active Sessions: 1",
        "  tool1: 0 steps, in progress"
      ]);
    });
  });

  describe("transferStateFromParent", () => {
    it("should deserialize state from parent", () => {
      const parentState = new ThinkingState();
      const session: ReasoningSession = {
        tool: "parent-tool",
        problem: "Parent Problem",
        stepNumber: 1,
        data: {},
        completedSteps: [],
        complete: false,
      };

      parentState.sessions.set("parent-tool", session);

      // Mock parent agent
      const mockParent = {
        getState: () => parentState
      } as any;

      state.transferStateFromParent(mockParent);

      expect(state.sessions.size).toBe(1);
      expect(state.sessions.get("parent-tool")).toEqual(session);
    });
  });
});