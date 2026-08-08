import { describe, expect, it, vi } from "vitest";
import { CasOperationKind } from "./CasOperationKind";
import type { CasBlockDescriptor } from "./CasBlockDescriptor";
import { DefaultCasExpressionRouterService } from "./DefaultCasExpressionRouterService";
import type { CasService } from "../../domain/services/CasService";
import type { CasRouteResolution } from "./CasExpressionRouterService";

function buildCasService(): CasService {
  return {
    simplifyExpression: vi.fn(() => "2 * x"),
    expandExpression: vi.fn(() => "x^2 + 2*x + 1"),
    differentiateExpression: vi.fn(() => "2 * x + 1"),
  };
}

function buildDescriptor(
  overrides: Partial<CasBlockDescriptor> = {}
): CasBlockDescriptor {
  return {
    operationKind: CasOperationKind.SIMPLIFY,
    innerExpressionText: "x+x",
    derivativeVariableName: null,
    ...overrides,
  };
}

describe("DefaultCasExpressionRouterService", () => {
  const router = new DefaultCasExpressionRouterService();

  it("returns a disabled error when CAS is disabled", () => {
    const resolution: CasRouteResolution = router.routeBlock(
      buildDescriptor(),
      false,
      buildCasService()
    );

    expect(resolution.routed).toBe(true);
    expect(resolution.resultText).toBeNull();
    expect(resolution.errorText).toBe("CAS is disabled.");
  });

  it("simplifies a simplify block when CAS is enabled", () => {
    const casService = buildCasService();

    const resolution = router.routeBlock(
      buildDescriptor({ operationKind: CasOperationKind.SIMPLIFY }),
      true,
      casService
    );

    expect(resolution.resultText).toBe("2 * x");
    expect(resolution.errorText).toBeNull();
    expect(casService.simplifyExpression).toHaveBeenCalledWith("x+x");
  });

  it("expands an expand block when CAS is enabled", () => {
    const casService = buildCasService();

    const resolution = router.routeBlock(
      buildDescriptor({
        operationKind: CasOperationKind.EXPAND,
        innerExpressionText: "(x+1)^2",
      }),
      true,
      casService
    );

    expect(resolution.resultText).toBe("x^2 + 2*x + 1");
    expect(casService.expandExpression).toHaveBeenCalledWith("(x+1)^2");
  });

  it("differentiates a derivative block with its variable", () => {
    const casService = buildCasService();

    const resolution = router.routeBlock(
      buildDescriptor({
        operationKind: CasOperationKind.DERIVATIVE,
        innerExpressionText: "x^2+x",
        derivativeVariableName: "x",
      }),
      true,
      casService
    );

    expect(resolution.resultText).toBe("2 * x + 1");
    expect(casService.differentiateExpression).toHaveBeenCalledWith(
      "x^2+x",
      "x"
    );
  });

  it("defaults the derivative variable to x when not provided", () => {
    const casService = buildCasService();

    router.routeBlock(
      buildDescriptor({
        operationKind: CasOperationKind.DERIVATIVE,
        innerExpressionText: "x^2",
        derivativeVariableName: null,
      }),
      true,
      casService
    );

    expect(casService.differentiateExpression).toHaveBeenCalledWith("x^2", "x");
  });

  it("surfaces CAS engine errors as inline errors", () => {
    const failingCasService: CasService = {
      simplifyExpression: vi.fn(() => {
        throw new Error("Symbolic operation failed: boom");
      }),
      expandExpression: vi.fn(() => ""),
      differentiateExpression: vi.fn(() => ""),
    };

    const resolution = router.routeBlock(
      buildDescriptor(),
      true,
      failingCasService
    );

    expect(resolution.resultText).toBeNull();
    expect(resolution.errorText).toContain("boom");
  });
});
