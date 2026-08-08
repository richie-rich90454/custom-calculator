import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { NumericMode } from "../../domain/model/NumericMode";
import { VariableAssignment } from "../../domain/model/VariableAssignment";
import { MathJsConstantScopeBuilder } from "./MathJsConstantScopeBuilder";
import { DefaultMathJsFractionValueFactory } from "./MathJsFractionValueFactory";

function buildScopeBuilder(): MathJsConstantScopeBuilder {
  const root = new CalculatorCompositionRoot();

  return new MathJsConstantScopeBuilder(
    root.constantCatalogService,
    new DefaultMathJsFractionValueFactory()
  );
}

function buildVariable(name: string, valueText: string): VariableAssignment {
  return new VariableAssignment(
    name,
    valueText,
    NumericMode.STANDARD,
    "2026-01-01T00:00:00.000Z"
  );
}

describe("MathJsConstantScopeBuilder", () => {
  it("skips a variable that cannot be parsed as a number", () => {
    const root = new CalculatorCompositionRoot();
    const scopeBuilder = new MathJsConstantScopeBuilder(
      root.constantCatalogService,
      new DefaultMathJsFractionValueFactory()
    );
    const math = root.mathJsInstanceProvider.getInstance();
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      variables: [buildVariable("broken", "1/")],
    });

    const scope = scopeBuilder.buildScope(math, sessionState);

    expect(scope["broken"]).toBeUndefined();
  });

  it("skips a variable whose value evaluates to NaN", () => {
    const root = new CalculatorCompositionRoot();
    const scopeBuilder = new MathJsConstantScopeBuilder(
      root.constantCatalogService,
      new DefaultMathJsFractionValueFactory()
    );
    const math = root.mathJsInstanceProvider.getInstance();
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      variables: [buildVariable("nanValue", "0/0")],
    });

    const scope = scopeBuilder.buildScope(math, sessionState);

    expect(scope["nanValue"]).toBeUndefined();
  });

  it("skips a fraction variable whose text cannot be converted", () => {
    const scopeBuilder = buildScopeBuilder();
    const root = new CalculatorCompositionRoot();
    const math = root.mathJsInstanceProvider.getInstance();

    math.config({ number: "Fraction" });

    const sessionState = CalculatorSessionState.createInitial().copyWith({
      variables: [buildVariable("badFraction", "not-a-number")],
    });

    const scope = scopeBuilder.buildScope(math, sessionState);

    expect(scope["badFraction"]).toBeUndefined();
  });

  it("places the imaginary unit in scope when complex numbers are enabled", () => {
    const scopeBuilder = buildScopeBuilder();
    const root = new CalculatorCompositionRoot();
    const math = root.mathJsInstanceProvider.getInstance();
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      complexNumbersEnabled: true,
    });

    const scope = scopeBuilder.buildScope(math, sessionState);

    expect(scope["i"]).not.toBeUndefined();
  });

  it("places the previous answer in scope when a last result exists", () => {
    const scopeBuilder = buildScopeBuilder();
    const root = new CalculatorCompositionRoot();
    const math = root.mathJsInstanceProvider.getInstance();
    const sessionState = CalculatorSessionState.createInitial().copyWith({
      lastResultValue: 42,
    });

    const scope = scopeBuilder.buildScope(math, sessionState);

    expect(scope["ans"]).toBe(42);
  });
});
