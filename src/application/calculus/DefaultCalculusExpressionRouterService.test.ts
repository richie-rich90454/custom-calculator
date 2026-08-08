import { describe, expect, it } from "vitest";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculusOperationKind } from "./CalculusOperationKind";
import {
  CalculusBlockDescriptor,
  LimitDirection,
} from "./CalculusBlockDescriptor";
import { DefaultCalculusAngleModePolicyService } from "./DefaultCalculusAngleModePolicyService";
import { DefaultCalculusExpressionRouterService } from "./DefaultCalculusExpressionRouterService";
import { DefaultFiniteProductService } from "./DefaultFiniteProductService";
import { DefaultFiniteSummationService } from "./DefaultFiniteSummationService";
import { DefaultLimitEstimationService } from "./DefaultLimitEstimationService";
import { DefaultNumericDifferentiationService } from "./DefaultNumericDifferentiationService";
import { DefaultNumericIntegrationService } from "./DefaultNumericIntegrationService";
import { DefaultResultFormattingService } from "../../domain/services/DefaultResultFormattingService";
import { MathJsCalculusExpressionEvaluator } from "../../infrastructure/calculus/MathJsCalculusExpressionEvaluator";
import { DefaultMathJsInstanceProvider } from "../../infrastructure/mathjs/DefaultMathJsInstanceProvider";
import { DefaultSymbolicDifferentiationService } from "../../infrastructure/calculus/DefaultSymbolicDifferentiationService";
import { DefaultSymbolicIntegrationService } from "../../infrastructure/calculus/DefaultSymbolicIntegrationService";
import { DefaultTaylorSeriesService } from "../../infrastructure/calculus/DefaultTaylorSeriesService";

const instanceProvider = new DefaultMathJsInstanceProvider();
const evaluator = new MathJsCalculusExpressionEvaluator(instanceProvider);
const resultFormattingService = new DefaultResultFormattingService();
const angleModePolicyService = new DefaultCalculusAngleModePolicyService();
const numericDifferentiationService = new DefaultNumericDifferentiationService(
  evaluator
);
const numericIntegrationService = new DefaultNumericIntegrationService(
  evaluator
);
const limitEstimationService = new DefaultLimitEstimationService(evaluator);
const finiteSummationService = new DefaultFiniteSummationService(evaluator);
const finiteProductService = new DefaultFiniteProductService(evaluator);
const symbolicDifferentiationService = new DefaultSymbolicDifferentiationService(
  instanceProvider,
  angleModePolicyService,
  resultFormattingService
);
const symbolicIntegrationService = new DefaultSymbolicIntegrationService(
  instanceProvider,
  resultFormattingService
);
const taylorSeriesService = new DefaultTaylorSeriesService(
  instanceProvider,
  symbolicDifferentiationService,
  evaluator,
  resultFormattingService
);

function createRouter(): DefaultCalculusExpressionRouterService {
  return new DefaultCalculusExpressionRouterService(
    numericDifferentiationService,
    numericIntegrationService,
    limitEstimationService,
    finiteSummationService,
    finiteProductService,
    symbolicDifferentiationService,
    symbolicIntegrationService,
    taylorSeriesService,
    angleModePolicyService,
    resultFormattingService
  );
}

describe("DefaultCalculusExpressionRouterService", () => {
  it("routes a symbolic derivative block", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createUnary(
        CalculusOperationKind.DERIVATIVE,
        "x^2",
        "x"
      ),
      AngleMode.RAD
    );

    expect(resolution.routed).toBe(true);
    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("2*x");
  });

  it("routes a numeric derivative block", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createLimit(
        CalculusOperationKind.NUMERIC_DERIVATIVE,
        "sin(x)",
        "x",
        0,
        LimitDirection.BOTH
      ),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(Number(resolution.resultText)).toBeCloseTo(1, 3);
  });

  it("routes a numeric integral block", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createBounded(
        CalculusOperationKind.INTEGRAL,
        "x^2",
        "x",
        0,
        1
      ),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(Number(resolution.resultText)).toBeCloseTo(1 / 3, 6);
  });

  it("routes a symbolic integrate block", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createUnary(
        CalculusOperationKind.INTEGRATE,
        "x",
        "x"
      ),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("x^2/2");
  });

  it("routes a limit block", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createLimit(
        CalculusOperationKind.LIMIT,
        "sin(x)/x",
        "x",
        0,
        LimitDirection.BOTH
      ),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(Number(resolution.resultText)).toBeCloseTo(1, 3);
  });

  it("routes a taylor block", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createTaylor("sin(x)", "x", 0, 5),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toContain("x^5/120");
  });

  it("routes a sum block", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createBounded(
        CalculusOperationKind.SUM,
        "n^2",
        "n",
        1,
        10
      ),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("385");
  });

  it("routes a product block", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createBounded(
        CalculusOperationKind.PRODUCT,
        "n",
        "n",
        1,
        5
      ),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("120");
  });

  it("returns a radians only warning for symbolic blocks under degree mode", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createUnary(
        CalculusOperationKind.DERIVATIVE,
        "x^2",
        "x"
      ),
      AngleMode.DEG
    );

    expect(resolution.resultText).toBe("2*x");
    expect(resolution.warningText).toContain("radians");
  });

  it("omits the warning for numeric blocks under degree mode", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createBounded(
        CalculusOperationKind.INTEGRAL,
        "x^2",
        "x",
        0,
        1
      ),
      AngleMode.DEG
    );

    expect(resolution.warningText).toBeNull();
  });

  it("surfaces service errors inline", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createUnary(
        CalculusOperationKind.INTEGRATE,
        "sec(x)",
        "x"
      ),
      AngleMode.RAD
    );

    expect(resolution.resultText).toBeNull();
    expect(resolution.errorText).toContain("not supported");
  });

  it("formats a negative infinite one sided limit", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createLimit(
        CalculusOperationKind.LIMIT,
        "1/x",
        "x",
        0,
        LimitDirection.LEFT
      ),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("-∞");
  });

  it("formats a positive infinite one sided limit", () => {
    const resolution = createRouter().routeBlock(
      CalculusBlockDescriptor.createLimit(
        CalculusOperationKind.LIMIT,
        "1/x",
        "x",
        0,
        LimitDirection.RIGHT
      ),
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("∞");
  });

  it("routes an unknown operation kind to symbolic differentiation", () => {
    const resolution = createRouter().routeBlock(
      {
        operationKind: "UNKNOWN" as CalculusOperationKind,
        innerExpressionText: "x^2",
        variableName: "x",
        lowerBound: null,
        upperBound: null,
        limitTarget: null,
        limitDirection: LimitDirection.BOTH,
        center: null,
        order: null,
      },
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("2*x");
  });

  it("falls back to zero for missing numeric operands", () => {
    const resolution = createRouter().routeBlock(
      {
        operationKind: CalculusOperationKind.NUMERIC_DERIVATIVE,
        innerExpressionText: "sin(x)",
        variableName: "x",
        lowerBound: null,
        upperBound: null,
        limitTarget: null,
        limitDirection: LimitDirection.BOTH,
        center: null,
        order: null,
      },
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(Number(resolution.resultText)).toBeCloseTo(1, 3);
  });

  it("falls back to zero bounds for a null integral block", () => {
    const resolution = createRouter().routeBlock(
      {
        operationKind: CalculusOperationKind.INTEGRAL,
        innerExpressionText: "x^2",
        variableName: "x",
        lowerBound: null,
        upperBound: null,
        limitTarget: null,
        limitDirection: LimitDirection.BOTH,
        center: null,
        order: null,
      },
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(Number(resolution.resultText)).toBeCloseTo(0, 3);
  });

  it("falls back to a zero target for a null limit block", () => {
    const resolution = createRouter().routeBlock(
      {
        operationKind: CalculusOperationKind.LIMIT,
        innerExpressionText: "sin(x)/x",
        variableName: "x",
        lowerBound: null,
        upperBound: null,
        limitTarget: null,
        limitDirection: LimitDirection.BOTH,
        center: null,
        order: null,
      },
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(Number(resolution.resultText)).toBeCloseTo(1, 3);
  });

  it("falls back to zero center and order for a null taylor block", () => {
    const resolution = createRouter().routeBlock(
      {
        operationKind: CalculusOperationKind.TAYLOR,
        innerExpressionText: "exp(x)",
        variableName: "x",
        lowerBound: null,
        upperBound: null,
        limitTarget: null,
        limitDirection: LimitDirection.BOTH,
        center: null,
        order: null,
      },
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("1");
  });

  it("falls back to zero bounds for a null sum block", () => {
    const resolution = createRouter().routeBlock(
      {
        operationKind: CalculusOperationKind.SUM,
        innerExpressionText: "n",
        variableName: "n",
        lowerBound: null,
        upperBound: null,
        limitTarget: null,
        limitDirection: LimitDirection.BOTH,
        center: null,
        order: null,
      },
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(Number(resolution.resultText)).toBeCloseTo(0, 3);
  });

  it("falls back to zero bounds for a null product block", () => {
    const resolution = createRouter().routeBlock(
      {
        operationKind: CalculusOperationKind.PRODUCT,
        innerExpressionText: "n",
        variableName: "n",
        lowerBound: null,
        upperBound: null,
        limitTarget: null,
        limitDirection: LimitDirection.BOTH,
        center: null,
        order: null,
      },
      AngleMode.RAD
    );

    expect(resolution.errorText).toBeNull();
    expect(resolution.resultText).toBe("0");
  });

  it("stringifies a non error thrown value", () => {
    const router = new DefaultCalculusExpressionRouterService(
      {
        estimateDerivative: () => {
          throw "raw failure";
        },
      } as never,
      numericIntegrationService,
      limitEstimationService,
      finiteSummationService,
      finiteProductService,
      symbolicDifferentiationService,
      symbolicIntegrationService,
      taylorSeriesService,
      angleModePolicyService,
      resultFormattingService
    );

    const resolution = router.routeBlock(
      CalculusBlockDescriptor.createLimit(
        CalculusOperationKind.NUMERIC_DERIVATIVE,
        "sin(x)",
        "x",
        0,
        LimitDirection.BOTH
      ),
      AngleMode.RAD
    );

    expect(resolution.resultText).toBeNull();
    expect(resolution.errorText).toContain("raw failure");
  });
});
