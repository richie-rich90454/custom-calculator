import type {
  MathJsInstance,
  MathType,
  Unit,
  Complex,
  BigNumber,
} from "mathjs";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ConstantCatalogService } from "../../domain/services/ConstantCatalogService";
import type { MathJsFractionValueFactory } from "./MathJsFractionValueFactory";
import type { MathJsEvaluationScopeBuilder } from "./MathJsEvaluationScopeBuilder";

export class MathJsConstantScopeBuilder
  implements MathJsEvaluationScopeBuilder
{
  public constructor(
    private readonly constantCatalogService: ConstantCatalogService,
    private readonly fractionValueFactory: MathJsFractionValueFactory
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
    const numberType = math.config({}).number!;

    for (const constant of this.constantCatalogService.getAllConstants()) {
      const value = this.createConfiguredValue(math, constant.value, numberType);

      if (value !== null) {
        scope[constant.id] = value;
      }
    }
  }

  private populateVariables(
    scope: Record<string, unknown>,
    math: MathJsInstance,
    sessionState: CalculatorSessionState
  ): void {
    const numberType = math.config({}).number!;

    for (const variable of sessionState.variables) {
      const value = this.createConfiguredValue(math, variable.valueText, numberType);

      if (value !== null) {
        scope[variable.name] = value;
      }
    }
  }

  private createConfiguredValue(
    math: MathJsInstance,
    valueText: string,
    numberType: string
  ): unknown {
    if (numberType === "Fraction") {
      try {
        return this.fractionValueFactory.createFractionFromValueText(
          math,
          valueText
        );
      } catch {
        return null;
      }
    }

    let numericValue: number;

    try {
      numericValue = this.evaluateValueTextAsNumber(math, valueText);
    } catch {
      return null;
    }

    if (Number.isNaN(numericValue)) {
      return null;
    }

    return this.convertNumberToConfiguredType(math, numericValue, numberType);
  }

  private evaluateValueTextAsNumber(
    math: MathJsInstance,
    valueText: string
  ): number {
    const originalNumberType = math.config({}).number!;

    math.config({ number: "number" });

    try {
      return math.evaluate(valueText) as number;
    } finally {
      math.config({ number: originalNumberType });
    }
  }

  private convertNumberToConfiguredType(
    math: MathJsInstance,
    numericValue: number,
    numberType: string
  ): unknown {
    if (numberType === "BigNumber") {
      return math.bignumber(numericValue);
    }

    if (numberType === "bigint") {
      if (Number.isInteger(numericValue)) {
        return globalThis.BigInt(numericValue);
      }

      return numericValue;
    }

    return numericValue;
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

    type TrigArgument = number | Unit | Complex | BigNumber;
    type InverseTrigArgument = number | Complex | BigNumber;

    const sinValue = (value: unknown): MathType =>
      math.sin(value as never);
    const cosValue = (value: unknown): MathType =>
      math.cos(value as never);
    const tanValue = (value: unknown): MathType =>
      math.tan(value as never);
    const asinValue = (value: unknown): MathType =>
      math.asin(value as never);
    const acosValue = (value: unknown): MathType =>
      math.acos(value as never);
    const atanValue = (value: unknown): MathType =>
      math.atan(value as never);

    scope["sin"] = (value: TrigArgument): MathType => sinValue(toRadians(value));
    scope["cos"] = (value: TrigArgument): MathType => cosValue(toRadians(value));
    scope["tan"] = (value: TrigArgument): MathType => tanValue(toRadians(value));
    scope["asin"] = (value: InverseTrigArgument): MathType =>
      fromRadians(asinValue(value));
    scope["acos"] = (value: InverseTrigArgument): MathType =>
      fromRadians(acosValue(value));
    scope["atan"] = (value: InverseTrigArgument): MathType =>
      fromRadians(atanValue(value));
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
