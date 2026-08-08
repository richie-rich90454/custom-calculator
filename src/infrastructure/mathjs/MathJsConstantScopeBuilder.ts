import type { MathJsInstance } from "mathjs";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { ConstantCatalogService } from "../../domain/services/ConstantCatalogService";
import { MathJsEvaluationScopeBuilder } from "./MathJsEvaluationScopeBuilder";

export class MathJsConstantScopeBuilder
  implements MathJsEvaluationScopeBuilder
{
  public constructor(
    private readonly constantCatalogService: ConstantCatalogService
  ) {}

  public buildScope(
    math: MathJsInstance,
    sessionState: CalculatorSessionState
  ): Record<string, unknown> {
    const scope: Record<string, unknown> = {};

    this.populateConstants(scope, math);
    this.populateVariables(scope, math, sessionState);
    this.populateTrigonometricWrappers(scope, math, sessionState.angleMode);
    this.populatePreviousAnswer(scope, sessionState);

    if (sessionState.complexNumbersEnabled) {
      scope["i"] = math.complex(0, 1);
    }

    return scope;
  }

  private populateConstants(
    scope: Record<string, unknown>,
    math: MathJsInstance
  ): void {
    for (const constant of this.constantCatalogService.getAllConstants()) {
      scope[constant.id] = math.evaluate(constant.value);
    }
  }

  private populateVariables(
    scope: Record<string, unknown>,
    math: MathJsInstance,
    sessionState: CalculatorSessionState
  ): void {
    for (const variable of sessionState.variables) {
      scope[variable.name] = math.evaluate(variable.valueText);
    }
  }

  private populateTrigonometricWrappers(
    scope: Record<string, unknown>,
    math: MathJsInstance,
    angleMode: AngleMode
  ): void {
    const radiansPerUnit =
      angleMode === AngleMode.DEG
        ? math.divide(math.pi, 180)
        : angleMode === AngleMode.GON
          ? math.divide(math.pi, 200)
          : math.number(1);

    const toRadians = (value: unknown): unknown =>
      math.multiply(value, radiansPerUnit);
    const fromRadians = (value: unknown): unknown =>
      math.divide(value, radiansPerUnit);

    scope["sin"] = (value: unknown): unknown => math.sin(toRadians(value));
    scope["cos"] = (value: unknown): unknown => math.cos(toRadians(value));
    scope["tan"] = (value: unknown): unknown => math.tan(toRadians(value));
    scope["asin"] = (value: unknown): unknown =>
      fromRadians(math.asin(value));
    scope["acos"] = (value: unknown): unknown =>
      fromRadians(math.acos(value));
    scope["atan"] = (value: unknown): unknown =>
      fromRadians(math.atan(value));
  }

  private populatePreviousAnswer(
    scope: Record<string, unknown>,
    sessionState: CalculatorSessionState
  ): void {
    if (sessionState.lastResultValue !== null) {
      scope["ans"] = sessionState.lastResultValue;
    }
  }
}
