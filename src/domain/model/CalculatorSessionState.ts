import { AngleMode } from "./AngleMode";
import { NumericMode } from "./NumericMode";
import { VariableAssignment } from "./VariableAssignment";

export class CalculatorSessionState {
    public constructor(
        public readonly expressionText: string,
        public readonly cursorPosition: number,
        public readonly selectionStart: number,
        public readonly selectionEnd: number,
        public readonly resultText: string | null,
        public readonly errorText: string | null,
        public readonly lastResultText: string | null,
        public readonly lastResultValue: unknown,
        public readonly angleMode: AngleMode,
        public readonly numericMode: NumericMode,
        public readonly complexNumbersEnabled: boolean,
        public readonly casEnabled: boolean,
        public readonly variables: readonly VariableAssignment[],
        public readonly memoryValueText: string | null,
    ) {}

    public static createInitial(): CalculatorSessionState {
        return new CalculatorSessionState(
            "",
            0,
            0,
            0,
            null,
            null,
            null,
            null,
            AngleMode.DEG,
            NumericMode.STANDARD,
            false,
            false,
            [],
            null,
        );
    }

    public copyWith(overrides: Partial<CalculatorSessionState>): CalculatorSessionState {
        return new CalculatorSessionState(
            overrides.expressionText ?? this.expressionText,
            overrides.cursorPosition ?? this.cursorPosition,
            overrides.selectionStart ?? this.selectionStart,
            overrides.selectionEnd ?? this.selectionEnd,
            overrides.resultText !== undefined ? overrides.resultText : this.resultText,
            overrides.errorText !== undefined ? overrides.errorText : this.errorText,
            overrides.lastResultText !== undefined ? overrides.lastResultText : this.lastResultText,
            overrides.lastResultValue !== undefined
                ? overrides.lastResultValue
                : this.lastResultValue,
            overrides.angleMode ?? this.angleMode,
            overrides.numericMode ?? this.numericMode,
            overrides.complexNumbersEnabled ?? this.complexNumbersEnabled,
            overrides.casEnabled ?? this.casEnabled,
            overrides.variables ?? this.variables,
            overrides.memoryValueText !== undefined
                ? overrides.memoryValueText
                : this.memoryValueText,
        );
    }
}
