import type { MathJsInstance } from "mathjs";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";

export interface MathJsEvaluationScopeBuilder {
    buildScope(math: MathJsInstance, sessionState: CalculatorSessionState): Record<string, unknown>;
}
