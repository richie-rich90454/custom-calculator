import { describe, expect, it } from "vitest";
import { MathJsFunctionWhitelist } from "./MathJsFunctionWhitelist";

describe("MathJsFunctionWhitelist", () => {
  const whitelist = new MathJsFunctionWhitelist(["sin", "cos", "sqrt"]);

  it("allows a known function", () => {
    expect(whitelist.isFunctionAllowed("sin")).toBe(true);
  });

  it("rejects an unknown function", () => {
    expect(whitelist.isFunctionAllowed("mystery")).toBe(false);
  });

  it("lists the allowed function names", () => {
    expect(whitelist.getAllowedFunctionNames()).toEqual(["sin", "cos", "sqrt"]);
  });
});
