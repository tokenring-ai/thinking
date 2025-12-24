import { describe, it, expect } from "vitest";
import tools from "../tools";

describe("Tools Module", () => {
  describe("Export Structure", () => {
    it("should export all thinking tools", () => {
      const expectedTools = [
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

      expectedTools.forEach(toolName => {
        expect(tools).toHaveProperty(toolName);
      });

      expect(Object.keys(tools).length).toBe(expectedTools.length);
    });
  });

  describe("Tool Properties", () => {
    it("should have name, description, inputSchema, and execute for each tool", () => {
      Object.values(tools).forEach((tool, index) => {
        const toolName = Object.keys(tools)[index];
        
        expect(tool).toHaveProperty("name");
        expect(tool).toHaveProperty("description");
        expect(tool).toHaveProperty("inputSchema");
        expect(tool).toHaveProperty("execute");
        expect(typeof tool.execute).toBe("function");
        
        // Name should be a non-empty string
        expect(typeof tool.name).toBe("string");
        expect(tool.name.length).toBeGreaterThan(0);
        
        // Description should be comprehensive
        expect(typeof tool.description).toBe("string");
        expect(tool.description.length).toBeGreaterThan(10);
        
        // inputSchema should be a Zod schema
        expect(tool.inputSchema).toHaveProperty("parse");
      });
    });
  });

  describe("Tool Names", () => {
    it("should have correct tool names", () => {
      expect(tools.scientificMethod.name).toBe("scientific-method-reasoning");
      expect(tools.decisionMatrix.name).toBe("decision-matrix");
      expect(tools.firstPrinciples.name).toBe("first-principles");
    });

    it("should have unique names for all tools", () => {
      const names = Object.values(tools).map(tool => tool.name);
      const uniqueNames = [...new Set(names)];
      
      expect(uniqueNames.length).toBe(names.length);
    });
  });

  describe("Tool Descriptions", () => {
    it("should have descriptive descriptions", () => {
      Object.values(tools).forEach(tool => {
        expect(tool.description.length).toBeGreaterThan(50);
      });
    });

    it("should mention key concepts in descriptions", () => {
      expect(tools.scientificMethod.description.toLowerCase()).toContain("hypothesis");
      expect(tools.scientificMethod.description.toLowerCase()).toContain("scientific");
      
      expect(tools.decisionMatrix.description).toContain("decision");
      expect(tools.decisionMatrix.description.toLowerCase()).toContain("criteria");
      
      expect(tools.firstPrinciples.description.toLowerCase()).toContain("fundamental");
      expect(tools.firstPrinciples.description.toLowerCase()).toContain("principles");
    });
  });

  describe("Input Schemas", () => {
    it("should have valid Zod schemas", () => {
      Object.values(tools).forEach(tool => {
        expect(tool.inputSchema).toHaveProperty("parse");
        expect(tool.inputSchema.shape).toHaveProperty("step");
        expect(tool.inputSchema.shape).toHaveProperty("content");
        expect(tool.inputSchema.shape).toHaveProperty("nextThoughtNeeded");
      });
    });

    it("should have required fields in schemas", () => {
      Object.values(tools).forEach(tool => {
        const schema = tool.inputSchema;
        
        // Most tools should require step, content, and nextThoughtNeeded
        expect(schema.shape).toHaveProperty("step");
        expect(schema.shape).toHaveProperty("content");
        expect(schema.shape).toHaveProperty("nextThoughtNeeded");
        
        // Step should be an enum
        expect(schema.shape.step._def.type).toBe("enum");
        
        // nextThoughtNeeded should be boolean
        expect(schema.shape.nextThoughtNeeded._def.type).toBe("boolean");
      });
    });

    it("should have appropriate step enums for each tool", () => {
      expect(tools.scientificMethod.inputSchema.shape.step).toBeDefined();
      expect(tools.decisionMatrix.inputSchema.shape.step).toBeDefined();
      expect(tools.firstPrinciples.inputSchema.shape.step).toBeDefined();
    });
  });

  describe("Tool Integration", () => {
    it("should be compatible with ThinkingService", () => {
      Object.values(tools).forEach(tool => {
        // This is a basic compatibility check - the actual integration
        // is tested in the integration tests
        expect(tool.execute).toBeDefined();
        expect(typeof tool.execute).toBe("function");
      });
    });
  });

  describe("Plugin Compatibility", () => {
    it("should be compatible with plugin system", () => {
      // Check that tools can be used in the plugin context
      Object.values(tools).forEach(tool => {
        expect(tool).toHaveProperty("name");
        expect(tool).toHaveProperty("description");
        expect(tool).toHaveProperty("inputSchema");
        expect(tool).toHaveProperty("execute");
      });
    });

    it("should have export compatibility", () => {
      // Verify the tools object has the right structure
      expect(typeof tools).toBe("object");
      expect(tools).not.toBeNull();
      
      // Verify it's not a default export that might cause issues
      expect(tools).toHaveProperty("scientificMethod");
      expect(tools).toHaveProperty("decisionMatrix");
      expect(tools).toHaveProperty("firstPrinciples");
    });
  });
});