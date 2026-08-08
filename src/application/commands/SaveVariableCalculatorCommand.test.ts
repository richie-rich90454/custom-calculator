import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import { NumericMode } from "../../domain/model/NumericMode";
import { VariableAssignment } from "../../domain/model/VariableAssignment";
import { SaveVariableCalculatorCommand } from "./SaveVariableCalculatorCommand";

describe("SaveVariableCalculatorCommand", () => {
    const compositionRoot = new CalculatorCompositionRoot();

    function buildStateWithResult(): CalculatorSessionState {
        return CalculatorSessionState.createInitial().copyWith({
            resultText: "42",
        });
    }

    function saveVariable(
        currentState: CalculatorSessionState,
        variableName: string,
    ): CalculatorSessionState {
        return new SaveVariableCalculatorCommand(
            compositionRoot.functionCatalogService,
            compositionRoot.constantCatalogService,
            variableName,
        ).execute(currentState);
    }

    it("saves the current result under a valid variable name", () => {
        const nextState = saveVariable(buildStateWithResult(), "x");

        expect(nextState.variables).toHaveLength(1);
        expect(nextState.variables[0]?.name).toBe("x");
        expect(nextState.variables[0]?.valueText).toBe("42");
    });

    it("rejects a name that collides with a reserved function", () => {
        const nextState = saveVariable(buildStateWithResult(), "sin");

        expect(nextState.variables).toHaveLength(0);
        expect(nextState.errorText).not.toBeNull();
    });

    it("rejects a name that collides with a constant", () => {
        const nextState = saveVariable(buildStateWithResult(), "pi");

        expect(nextState.variables).toHaveLength(0);
        expect(nextState.errorText).not.toBeNull();
    });

    it("rejects an invalid variable name", () => {
        const nextState = saveVariable(buildStateWithResult(), "1invalid");

        expect(nextState.variables).toHaveLength(0);
        expect(nextState.errorText).not.toBeNull();
    });

    it("does nothing when there is no result to save", () => {
        const nextState = saveVariable(CalculatorSessionState.createInitial(), "x");

        expect(nextState.variables).toHaveLength(0);
        expect(nextState.errorText).not.toBeNull();
    });

    it("replaces an existing variable with the same name", () => {
        const initialState = buildStateWithResult().copyWith({
            variables: [
                new VariableAssignment("x", "7", NumericMode.STANDARD, new Date().toISOString()),
            ],
        });

        const nextState = saveVariable(initialState, "x");

        expect(nextState.variables).toHaveLength(1);
        expect(nextState.variables[0]?.valueText).toBe("42");
    });
});
