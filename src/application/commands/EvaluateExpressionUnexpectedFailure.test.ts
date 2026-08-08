import { describe, expect, it, vi } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { DefaultCasBlockParser } from "../cas/DefaultCasBlockParser";
import { DefaultCasExpressionRouterService } from "../cas/DefaultCasExpressionRouterService";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";
import { EvaluateExpressionCalculatorCommand } from "./EvaluateExpressionCalculatorCommand";

describe("EvaluateExpressionCalculatorCommand unexpected failure", () => {
  it("reports a generic failure when the gateway throws a non calculation error", () => {
    const root = new CalculatorCompositionRoot();
    const gateway: ExpressionEvaluationGateway = {
      evaluateExpression: vi.fn(() => {
        throw new Error("raw gateway failure");
      }),
    };

    const command = new EvaluateExpressionCalculatorCommand(
      root.expressionEditingService,
      root.expressionValidationService,
      gateway,
      new DefaultCasBlockParser(),
      new DefaultCasExpressionRouterService(),
      root.casService
    );

    const nextState = command.execute(
      CalculatorSessionState.createInitial().copyWith({
        expressionText: "2+3",
      })
    );

    expect(nextState.resultText).toBeNull();
    expect(nextState.errorText).toBe("Evaluation failed unexpectedly.");
  });
});
