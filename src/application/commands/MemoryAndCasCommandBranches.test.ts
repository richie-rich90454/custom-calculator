import { describe, expect, it, vi } from "vitest";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { EvaluationResult } from "../../domain/model/EvaluationResult";
import type { ExpressionEvaluationGateway } from "../../domain/services/ExpressionEvaluationGateway";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import type { CasService } from "../../domain/services/CasService";
import { MemoryAddCalculatorCommand } from "./MemoryAddCalculatorCommand";
import { MemoryClearCalculatorCommand } from "./MemoryClearCalculatorCommand";
import { MemoryRecallCalculatorCommand } from "./MemoryRecallCalculatorCommand";
import { MemorySubtractCalculatorCommand } from "./MemorySubtractCalculatorCommand";
import { SimplifyExpressionCalculatorCommand } from "./SimplifyExpressionCalculatorCommand";

function buildThrowingGateway(): ExpressionEvaluationGateway {
  return {
    evaluateExpression: vi.fn(() => {
      throw new Error("gateway failure");
    }),
  };
}

function buildWorkingGateway(resultText: string): ExpressionEvaluationGateway {
  return {
    evaluateExpression: vi.fn(() => {
      return new EvaluationResult("(0) + (5)", resultText, resultText);
    }),
  };
}

describe("MemoryAddCalculatorCommand", () => {
  it("returns the state unchanged when there is no current result", () => {
    const command = new MemoryAddCalculatorCommand(buildThrowingGateway());
    const state = CalculatorSessionState.createInitial().copyWith({
      resultText: null,
    });

    expect(command.execute(state)).toBe(state);
  });

  it("returns the state unchanged when evaluation fails", () => {
    const command = new MemoryAddCalculatorCommand(buildThrowingGateway());
    const state = CalculatorSessionState.createInitial().copyWith({
      resultText: "5",
    });

    expect(command.execute(state)).toBe(state);
  });
});

describe("MemorySubtractCalculatorCommand", () => {
  it("returns the state unchanged when there is no current result", () => {
    const command = new MemorySubtractCalculatorCommand(buildThrowingGateway());
    const state = CalculatorSessionState.createInitial().copyWith({
      resultText: null,
    });

    expect(command.execute(state)).toBe(state);
  });

  it("returns the state unchanged when evaluation fails", () => {
    const command = new MemorySubtractCalculatorCommand(buildThrowingGateway());
    const state = CalculatorSessionState.createInitial().copyWith({
      resultText: "5",
    });

    expect(command.execute(state)).toBe(state);
  });

  it("evaluates memory minus the current result", () => {
    const command = new MemorySubtractCalculatorCommand(buildWorkingGateway("2"));
    const state = CalculatorSessionState.createInitial().copyWith({
      memoryValueText: "7",
      resultText: "5",
    });

    const nextState = command.execute(state);

    expect(nextState.memoryValueText).toBe("2");
  });
});

describe("MemoryClearCalculatorCommand", () => {
  it("clears the memory value", () => {
    const command = new MemoryClearCalculatorCommand();
    const state = CalculatorSessionState.createInitial().copyWith({
      memoryValueText: "42",
    });

    expect(command.execute(state).memoryValueText).toBeNull();
  });
});

describe("MemoryRecallCalculatorCommand", () => {
  it("returns the state unchanged when memory is empty", () => {
    const editingService = {} as unknown as ExpressionEditingService;
    const command = new MemoryRecallCalculatorCommand(editingService);
    const state = CalculatorSessionState.createInitial().copyWith({
      memoryValueText: null,
    });

    expect(command.execute(state)).toBe(state);
  });

  it("recalls the memory value into the expression", () => {
    const editingService = {
      insertText: vi.fn(() => ({
        text: "42",
        cursorPosition: 2,
        selectionStart: 2,
        selectionEnd: 2,
      })),
    } as unknown as ExpressionEditingService;

    const command = new MemoryRecallCalculatorCommand(editingService);
    const state = CalculatorSessionState.createInitial().copyWith({
      memoryValueText: "42",
    });

    const nextState = command.execute(state);

    expect(nextState.expressionText).toBe("42");
  });
});

describe("SimplifyExpressionCalculatorCommand", () => {
  it("reports an inline error when CAS is disabled", () => {
    const command = new SimplifyExpressionCalculatorCommand(
      buildCasService()
    );
    const state = CalculatorSessionState.createInitial().copyWith({
      casEnabled: false,
    });

    const nextState = command.execute(state);

    expect(nextState.resultText).toBeNull();
    expect(nextState.errorText).toContain("CAS mode is disabled");
  });

  it("reports an inline error when the CAS operation fails", () => {
    const casService = buildCasService(true);
    const command = new SimplifyExpressionCalculatorCommand(casService);
    const state = CalculatorSessionState.createInitial().copyWith({
      casEnabled: true,
      expressionText: "x+x",
    });

    const nextState = command.execute(state);

    expect(nextState.resultText).toBeNull();
    expect(nextState.errorText).toContain("boom");
  });

  it("stringifies a non error thrown value", () => {
    const casService: CasService = {
      simplifyExpression: vi.fn(() => {
        throw "raw failure";
      }),
      expandExpression: vi.fn(() => ""),
      differentiateExpression: vi.fn(() => ""),
    };
    const command = new SimplifyExpressionCalculatorCommand(casService);
    const state = CalculatorSessionState.createInitial().copyWith({
      casEnabled: true,
      expressionText: "x+x",
    });

    const nextState = command.execute(state);

    expect(nextState.resultText).toBeNull();
    expect(nextState.errorText).toContain("raw failure");
  });
});

function buildCasService(throws: boolean = false): CasService {
  return {
    simplifyExpression: vi.fn(() => {
      if (throws) {
        throw new Error("boom");
      }

      return "2 * x";
    }),
    expandExpression: vi.fn(() => ""),
    differentiateExpression: vi.fn(() => ""),
  };
}
