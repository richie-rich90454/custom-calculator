import { describe, expect, it } from "vitest";
import { VariableAssignment } from "../../domain/model/VariableAssignment";
import { NumericMode } from "../../domain/model/NumericMode";
import { InMemoryVariablesRepository } from "./InMemoryVariablesRepository";

function buildVariable(name: string, valueText: string): VariableAssignment {
    return new VariableAssignment(
        name,
        valueText,
        NumericMode.STANDARD,
        "2026-01-01T00:00:00.000Z",
    );
}

describe("InMemoryVariablesRepository", () => {
    it("loads saved variables", async () => {
        const repository = new InMemoryVariablesRepository();

        await repository.saveVariable(buildVariable("x", "4"));

        const variables = await repository.loadVariables();

        expect(variables.map((variable) => variable.name)).toEqual(["x"]);
    });

    it("replaces an existing variable with the same name", async () => {
        const repository = new InMemoryVariablesRepository();

        await repository.saveVariable(buildVariable("x", "4"));
        await repository.saveVariable(buildVariable("x", "9"));

        const variables = await repository.loadVariables();

        expect(variables).toHaveLength(1);
        expect(variables[0]?.valueText).toBe("9");
    });

    it("deletes an existing variable", async () => {
        const repository = new InMemoryVariablesRepository();

        await repository.saveVariable(buildVariable("x", "4"));
        await repository.deleteVariable("x");

        expect(await repository.loadVariables()).toHaveLength(0);
    });

    it("ignores deleting an unknown variable", async () => {
        const repository = new InMemoryVariablesRepository();

        await repository.saveVariable(buildVariable("x", "4"));
        await repository.deleteVariable("missing");

        expect(await repository.loadVariables()).toHaveLength(1);
    });

    it("clears all variables", async () => {
        const repository = new InMemoryVariablesRepository();

        await repository.saveVariable(buildVariable("x", "4"));
        await repository.clearVariables();

        expect(await repository.loadVariables()).toHaveLength(0);
    });
});
