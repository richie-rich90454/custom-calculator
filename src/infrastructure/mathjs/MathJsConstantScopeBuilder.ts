import type { MathJsInstance, MathType } from "mathjs";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ConstantCatalogService } from "../../domain/services/ConstantCatalogService";
import type { MathJsEvaluationScopeBuilder } from "./MathJsEvaluationScopeBuilder";

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
    const radiansPerUnit: MathType =
      angleMode === AngleMode.DEG
        ? math.divide(math.pi, 180)
        : angleMode === AngleMode.GON
          ? math.divide(math.pi, 200)
          : math.number(1);

    const toRadians = (value: MathType): MathType =>
      math.multiply(value, radiansPerUnit);
    const fromRadians = (value: MathType): MathType =>
      math.divide(value, radiansPerUnit);

    scope["sin"] = (value: MathType): MathType => math.sin(toRadians(value));
    scope["cos"] = (value: MathType): MathType => math.cos(toRadians(value));
    scope["tan"] = (value: MathType): MathType => math.tan(toRadians(value));
    scope["asin"] = (value: MathType): MathType =>
      fromRadians(math.asin(value));
    scope["acos"] = (value: MathType): MathType =>
      fromRadians(math.acos(value));
    scope["atan"] = (value: MathType): MathType =>
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
