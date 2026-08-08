import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { CasService } from "../../domain/services/CasService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export abstract class AbstractCasCalculatorCommand extends AbstractCalculatorCommand {
    protected constructor(protected readonly casService: CasService) {
        super();
    }

    protected executeCasOperation(
        currentState: CalculatorSessionState,
        operation: (casService: CasService) => string,
    ): CalculatorSessionState {
        if (!currentState.casEnabled) {
            return currentState.copyWith({
                errorText: "CAS mode is disabled. Enable CAS mode in settings.",
                resultText: null,
            });
        }

        try {
            const symbolicResult = operation(this.casService);

            return currentState.copyWith({
                resultText: symbolicResult,
                lastResultText: symbolicResult,
                lastResultValue: null,
                errorText: null,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            return currentState.copyWith({
                resultText: null,
                errorText: message,
            });
        }
    }
}
