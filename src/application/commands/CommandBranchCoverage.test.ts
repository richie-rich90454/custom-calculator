import { describe, expect, it, vi } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { CalculatorSessionState } from "../../domain/model/CalculatorSessionState";
import type { ConstantCatalogService } from "../../domain/services/ConstantCatalogService";
import type { ExpressionEditingService } from "../../domain/services/ExpressionEditingService";
import { InsertConstantCalculatorCommand } from "./InsertConstantCalculatorCommand";
import { SaveVariableCalculatorCommand } from "./SaveVariableCalculatorCommand";
import { SetExpressionTextCalculatorCommand } from "./SetExpressionTextCalculatorCommand";

function buildConstantCatalog(insertText: string | null): ConstantCatalogService {
    return {
        getAllConstants: () => [],
        getConstantById: () => null,
        getConstantInsertText: vi.fn(() => insertText),
        hasIdentifier: vi.fn(() => false),
        getConstantIdentifiers: () => [],
    };
}

function buildEditingService(): ExpressionEditingService {
    return {
        insertText: vi.fn(() => ({
            text: "pi",
            cursorPosition: 2,
            selectionStart: 2,
            selectionEnd: 2,
        })),
        deleteBackward: vi.fn(),
        deleteForward: vi.fn(),
        deleteWordBackward: vi.fn(),
        autoCloseParentheses: vi.fn((text: string) => text),
    };
}

describe("InsertConstantCalculatorCommand", () => {
    it("inserts a known constant", () => {
        const command = new InsertConstantCalculatorCommand(
            buildEditingService(),
            buildConstantCatalog("pi"),
            "pi",
        );

        const nextState = command.execute(CalculatorSessionState.createInitial());

        expect(nextState.expressionText).toBe("pi");
    });

    it("returns the state unchanged for an unknown constant", () => {
        const command = new InsertConstantCalculatorCommand(
            buildEditingService(),
            buildConstantCatalog(null),
            "missing",
        );

        const state = CalculatorSessionState.createInitial();

        expect(command.execute(state)).toBe(state);
    });
});

describe("SaveVariableCalculatorCommand", () => {
    const compositionRoot = new CalculatorCompositionRoot();

    function buildCommand(variableName: string): SaveVariableCalculatorCommand {
        return new SaveVariableCalculatorCommand(
            compositionRoot.functionCatalogService,
            compositionRoot.constantCatalogService,
            variableName,
        );
    }

    it("reports an error when there is no result to save", () => {
        const nextState = buildCommand("a").execute(CalculatorSessionState.createInitial());

        expect(nextState.errorText).toContain("no result to save");
    });

    it("rejects an invalid variable name", () => {
        const nextState = buildCommand("1abc").execute(
            CalculatorSessionState.createInitial().copyWith({ resultText: "4" }),
        );

        expect(nextState.errorText).toContain("Invalid variable name");
    });

    it("rejects the reserved answer name", () => {
        const nextState = buildCommand("ans").execute(
            CalculatorSessionState.createInitial().copyWith({ resultText: "4" }),
        );

        expect(nextState.errorText).toContain("reserved");
    });

    it("rejects a function name as a variable", () => {
        const nextState = buildCommand("sin").execute(
            CalculatorSessionState.createInitial().copyWith({ resultText: "4" }),
        );

        expect(nextState.errorText).toContain("reserved");
    });

    it("rejects a constant identifier as a variable", () => {
        const nextState = buildCommand("pi").execute(
            CalculatorSessionState.createInitial().copyWith({ resultText: "4" }),
        );

        expect(nextState.errorText).toContain("reserved");
    });

    it("saves a valid variable and replaces an existing one", () => {
        const initial = CalculatorSessionState.createInitial().copyWith({
            resultText: "9",
        });

        const first = buildCommand("a").execute(initial);
        const second = buildCommand("a").execute(initial);

        expect(first.variables).toHaveLength(1);
        expect(second.variables).toHaveLength(1);
    });
});

describe("SetExpressionTextCalculatorCommand", () => {
    it("sets the expression text and moves the cursor to the end", () => {
        const command = new SetExpressionTextCalculatorCommand("1+2");

        const nextState = command.execute(CalculatorSessionState.createInitial());

        expect(nextState.expressionText).toBe("1+2");
        expect(nextState.cursorPosition).toBe(3);
        expect(nextState.selectionStart).toBe(3);
        expect(nextState.selectionEnd).toBe(3);
    });
});

describe("DefaultConstantCatalogService behavior via composition root", () => {
    it("resolves identifiers and insert text from the catalog", () => {
        const root = new CalculatorCompositionRoot();
        const catalog = root.constantCatalogService;

        expect(catalog.getConstantById("pi")?.symbol).toBe("π");
        expect(catalog.getConstantById("missing")).toBeNull();
        expect(catalog.getConstantInsertText("pi")).toBe("pi");
        expect(catalog.getConstantInsertText("missing")).toBeNull();
        expect(catalog.hasIdentifier("pi")).toBe(true);
        expect(catalog.hasIdentifier("missing")).toBe(false);
        expect(catalog.getConstantIdentifiers().length).toBeGreaterThan(0);
    });
});
