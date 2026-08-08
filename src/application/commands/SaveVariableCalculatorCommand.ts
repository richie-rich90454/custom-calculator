import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { VariableAssignment } from "../../domain/model/VariableAssignment";
import type { ConstantCatalogService } from "../../domain/services/ConstantCatalogService";
import type { ScientificFunctionCatalogService } from "../../domain/services/ScientificFunctionCatalogService";
import { AbstractCalculatorCommand } from "./AbstractCalculatorCommand";

export class SaveVariableCalculatorCommand extends AbstractCalculatorCommand {
    private static readonly VARIABLE_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

    public constructor(
        private readonly functionCatalogService: ScientificFunctionCatalogService,
        private readonly constantCatalogService: ConstantCatalogService,
        private readonly variableName: string,
    ) {
        super();
    }

    public override execute(currentState: CalculatorSessionState): CalculatorSessionState {
        if (currentState.resultText === null) {
            return currentState.copyWith({
                errorText: "There is no result to save as a variable.",
            });
        }

        if (!SaveVariableCalculatorCommand.VARIABLE_NAME_PATTERN.test(this.variableName)) {
            return currentState.copyWith({
                errorText: "Invalid variable name. Use letters, digits, or underscores.",
            });
        }

        if (this.isReservedName(this.variableName)) {
            return currentState.copyWith({
                errorText: `The name "${this.variableName}" is reserved.`,
            });
        }

        const updatedVariables = currentState.variables
            .filter((variable) => variable.name !== this.variableName)
            .concat([
                new VariableAssignment(
                    this.variableName,
                    currentState.resultText,
                    currentState.numericMode,
                    new Date().toISOString(),
                ),
            ]);

        return currentState.copyWith({
            variables: updatedVariables,
            errorText: null,
        });
    }

    private isReservedName(variableName: string): boolean {
        if (variableName === "ans") {
            return true;
        }

        if (this.functionCatalogService.hasFunction(variableName)) {
            return true;
        }

        return this.constantCatalogService.hasIdentifier(variableName);
    }
}
