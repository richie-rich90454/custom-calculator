import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { NumericMode } from "../../domain/model/NumericMode";
import type { NumericModePolicyService } from "../../domain/services/NumericModePolicyService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class ChangeNumericModeCalculatorCommand extends AbstractCalculatorCommand {
    public constructor(
        private readonly numericModePolicyService: NumericModePolicyService,
        private readonly requestedNumericMode: NumericMode,
    ) {
        super();
    }

    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        const effectiveNumericMode = this.numericModePolicyService.resolveEffectiveNumericMode(
            this.requestedNumericMode,
        );

        return currentState.copyWith({
            numericMode: effectiveNumericMode,
            resultText: null,
            errorText: null,
            lastResultValue: null,
            lastResultText: null,
        });
    }
}
