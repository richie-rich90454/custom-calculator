import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { MatrixAppComponent } from "./MatrixAppComponent";

describe("MatrixAppComponent", () => {
    async function fillMatrixCell(
        user: ReturnType<typeof userEvent.setup>,
        label: string,
        value: string,
    ): Promise<void> {
        const cell = screen.getByLabelText(label) as HTMLInputElement;
        await user.clear(cell);
        await user.type(cell, value);
    }

    it("computes the determinant of a 2x2 matrix", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await user.click(screen.getByRole("button", { name: /Matrix operation/ }));
        await user.click(screen.getByRole("option", { name: "Determinant of A" }));

        await fillMatrixCell(user, "MatA row 1 column 1", "1");
        await fillMatrixCell(user, "MatA row 1 column 2", "2");
        await fillMatrixCell(user, "MatA row 2 column 1", "3");
        await fillMatrixCell(user, "MatA row 2 column 2", "4");

        await user.click(screen.getByRole("button", { name: "Run the selected matrix operation" }));

        expect(screen.getByText(/det\(A\) = \[\[-2\]\]/)).toBeInTheDocument();
    });

    it("computes a matrix multiplication and surfaces dimension errors", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await user.click(screen.getByRole("button", { name: /Matrix operation/ }));
        await user.click(screen.getByRole("option", { name: "A × B" }));

        await fillMatrixCell(user, "MatA row 1 column 1", "1");
        await fillMatrixCell(user, "MatA row 1 column 2", "2");
        await fillMatrixCell(user, "MatA row 2 column 1", "3");
        await fillMatrixCell(user, "MatA row 2 column 2", "4");

        await fillMatrixCell(user, "MatB row 1 column 1", "5");
        await fillMatrixCell(user, "MatB row 1 column 2", "6");
        await fillMatrixCell(user, "MatB row 2 column 1", "7");
        await fillMatrixCell(user, "MatB row 2 column 2", "8");

        await user.click(screen.getByRole("button", { name: "Run the selected matrix operation" }));

        expect(screen.getByText(/A × B = \[\[19, 22\], \[43, 50\]\]/)).toBeInTheDocument();
    });

    it("surfaces a clear error on a dimension mismatch", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await fillMatrixCell(user, "MatA row 1 column 1", "1");
        await fillMatrixCell(user, "MatA row 1 column 2", "2");
        await fillMatrixCell(user, "MatA row 2 column 1", "3");
        await fillMatrixCell(user, "MatA row 2 column 2", "4");

        await user.click(screen.getByRole("button", { name: /MatB rows/ }));
        await user.click(screen.getByRole("option", { name: "3 rows" }));
        await fillMatrixCell(user, "MatB row 1 column 1", "1");
        await fillMatrixCell(user, "MatB row 1 column 2", "2");
        await fillMatrixCell(user, "MatB row 2 column 1", "3");
        await fillMatrixCell(user, "MatB row 2 column 2", "4");

        await user.click(screen.getByRole("button", { name: "Run the selected matrix operation" }));

        expect(screen.getByText(/dimensions do not match/)).toBeInTheDocument();
    });

    it("clears a matrix", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await fillMatrixCell(user, "MatA row 1 column 1", "7");

        await user.click(screen.getByRole("button", { name: "Clear MatA" }));

        expect((screen.getByLabelText("MatA row 1 column 1") as HTMLInputElement).value).toBe("");
    });

    it("transposes a matrix", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await user.click(screen.getByRole("button", { name: /Matrix operation/ }));
        await user.click(screen.getByRole("option", { name: "Transpose A" }));

        await fillMatrixCell(user, "MatA row 1 column 1", "1");
        await fillMatrixCell(user, "MatA row 1 column 2", "2");
        await fillMatrixCell(user, "MatA row 2 column 1", "3");
        await fillMatrixCell(user, "MatA row 2 column 2", "4");

        await user.click(screen.getByRole("button", { name: "Run the selected matrix operation" }));

        expect(screen.getByText(/Aᵀ = \[\[1, 3\], \[2, 4\]\]/)).toBeInTheDocument();
    });

    it("computes the inverse of a matrix", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await user.click(screen.getByRole("button", { name: /Matrix operation/ }));
        await user.click(screen.getByRole("option", { name: "Inverse of A" }));

        await fillMatrixCell(user, "MatA row 1 column 1", "1");
        await fillMatrixCell(user, "MatA row 1 column 2", "2");
        await fillMatrixCell(user, "MatA row 2 column 1", "3");
        await fillMatrixCell(user, "MatA row 2 column 2", "4");

        await user.click(screen.getByRole("button", { name: "Run the selected matrix operation" }));

        expect(screen.getByText(/A⁻¹ = \[\[-2, 1\], \[1\.5, -0\.5\]\]/)).toBeInTheDocument();
    });

    it("creates an identity matrix", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await user.click(screen.getByRole("button", { name: /Matrix operation/ }));
        await user.click(screen.getByRole("option", { name: "Identity (3×3)" }));

        await user.click(screen.getByRole("button", { name: "Run the selected matrix operation" }));

        expect(
            screen.getByText(/I₃ = \[\[1, 0, 0\], \[0, 1, 0\], \[0, 0, 1\]\]/),
        ).toBeInTheDocument();
    });

    it("resizes a matrix and keeps existing cells", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await fillMatrixCell(user, "MatA row 1 column 1", "7");

        await user.click(screen.getByRole("button", { name: /MatA columns/ }));
        await user.click(screen.getByRole("option", { name: "3 columns" }));

        expect((screen.getByLabelText("MatA row 1 column 1") as HTMLInputElement).value).toBe("7");
    });

    it("subtracts two matrices", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await user.click(screen.getByRole("button", { name: /Matrix operation/ }));
        await user.click(screen.getByRole("option", { name: "A − B" }));

        await fillMatrixCell(user, "MatA row 1 column 1", "5");
        await fillMatrixCell(user, "MatA row 1 column 2", "6");
        await fillMatrixCell(user, "MatA row 2 column 1", "7");
        await fillMatrixCell(user, "MatA row 2 column 2", "8");

        await fillMatrixCell(user, "MatB row 1 column 1", "1");
        await fillMatrixCell(user, "MatB row 1 column 2", "2");
        await fillMatrixCell(user, "MatB row 2 column 1", "3");
        await fillMatrixCell(user, "MatB row 2 column 2", "4");

        await user.click(screen.getByRole("button", { name: "Run the selected matrix operation" }));

        expect(screen.getByText(/A − B = \[\[4, 4\], \[4, 4\]\]/)).toBeInTheDocument();
    });

    it("reports an error for a determinant of a non-square matrix", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <MatrixAppComponent />);

        await user.click(screen.getByRole("button", { name: /Matrix operation/ }));
        await user.click(screen.getByRole("option", { name: "Determinant of A" }));

        await user.click(screen.getByRole("button", { name: /MatA columns/ }));
        await user.click(screen.getByRole("option", { name: "3 columns" }));

        await fillMatrixCell(user, "MatA row 1 column 1", "1");
        await fillMatrixCell(user, "MatA row 1 column 2", "2");
        await fillMatrixCell(user, "MatA row 1 column 3", "3");

        await user.click(screen.getByRole("button", { name: "Run the selected matrix operation" }));

        expect(screen.getByText(/square matrix/)).toBeInTheDocument();
    });
});
