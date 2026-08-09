import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { VectorAppComponent } from "./VectorAppComponent";

describe("VectorAppComponent", () => {
    async function fillComponent(
        user: ReturnType<typeof userEvent.setup>,
        label: string,
        value: string,
    ): Promise<void> {
        const field = screen.getByLabelText(label) as HTMLInputElement;
        await user.clear(field);
        await user.type(field, value);
    }

    it("computes a dot product", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <VectorAppComponent />);

        await fillComponent(user, "VecA component 1", "1");
        await fillComponent(user, "VecA component 2", "0");
        await fillComponent(user, "VecA component 3", "0");
        await fillComponent(user, "VecB component 1", "0");
        await fillComponent(user, "VecB component 2", "1");
        await fillComponent(user, "VecB component 3", "0");

        await user.click(screen.getByRole("button", { name: "Run the selected vector operation" }));

        expect(screen.getByText("A · B = 0")).toBeInTheDocument();
    });

    it("computes a cross product and shows the vector", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <VectorAppComponent />);

        await user.click(screen.getByRole("button", { name: /Vector operation/ }));
        await user.click(screen.getByRole("option", { name: "Cross product" }));

        await fillComponent(user, "VecA component 1", "1");
        await fillComponent(user, "VecA component 2", "0");
        await fillComponent(user, "VecA component 3", "0");
        await fillComponent(user, "VecB component 1", "0");
        await fillComponent(user, "VecB component 2", "1");
        await fillComponent(user, "VecB component 3", "0");

        await user.click(screen.getByRole("button", { name: "Run the selected vector operation" }));

        expect(screen.getByText("A × B = [0, 0, 1]")).toBeInTheDocument();
    });

    it("computes a unit vector", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <VectorAppComponent />);

        await user.click(screen.getByRole("button", { name: /Vector operation/ }));
        await user.click(screen.getByRole("option", { name: "Unit vector of A" }));

        await fillComponent(user, "VecA component 1", "3");
        await fillComponent(user, "VecA component 2", "4");
        await fillComponent(user, "VecA component 3", "0");

        await user.click(screen.getByRole("button", { name: "Run the selected vector operation" }));

        expect(screen.getByText(/Â = \[0\.6, 0\.8, 0\]/)).toBeInTheDocument();
    });

    it("computes a magnitude", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <VectorAppComponent />);

        await user.click(screen.getByRole("button", { name: /Vector operation/ }));
        await user.click(screen.getByRole("option", { name: "Magnitude of A" }));

        await fillComponent(user, "VecA component 1", "3");
        await fillComponent(user, "VecA component 2", "4");
        await fillComponent(user, "VecA component 3", "0");

        await user.click(screen.getByRole("button", { name: "Run the selected vector operation" }));

        expect(screen.getByText("|A| = 5")).toBeInTheDocument();
    });

    it("computes the angle between two vectors", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <VectorAppComponent />);

        await user.click(screen.getByRole("button", { name: /Vector operation/ }));
        await user.click(screen.getByRole("option", { name: "Angle between A and B" }));

        await fillComponent(user, "VecA component 1", "1");
        await fillComponent(user, "VecA component 2", "0");
        await fillComponent(user, "VecA component 3", "0");
        await fillComponent(user, "VecB component 1", "0");
        await fillComponent(user, "VecB component 2", "1");
        await fillComponent(user, "VecB component 3", "0");

        await user.click(screen.getByRole("button", { name: "Run the selected vector operation" }));

        expect(screen.getByText(/angle = 1\.5707/)).toBeInTheDocument();
    });

    it("reports a clear error for a cross product of two-component vectors", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <VectorAppComponent />);

        await user.click(screen.getByRole("button", { name: /Vector operation/ }));
        await user.click(screen.getByRole("option", { name: "Cross product" }));

        await user.click(screen.getByRole("button", { name: /VecA dimension/ }));
        await user.click(screen.getByRole("option", { name: "2 components" }));

        await fillComponent(user, "VecA component 1", "1");
        await fillComponent(user, "VecA component 2", "0");

        await user.click(screen.getByRole("button", { name: "Run the selected vector operation" }));

        expect(screen.getByText(/3-component vectors/)).toBeInTheDocument();
    });

    it("restores a larger vector dimension with empty components", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <VectorAppComponent />);

        await user.click(screen.getByRole("button", { name: /VecA dimension/ }));
        await user.click(screen.getByRole("option", { name: "2 components" }));
        await user.click(screen.getByRole("button", { name: /VecA dimension/ }));
        await user.click(screen.getByRole("option", { name: "3 components" }));

        expect(screen.getByLabelText("VecA component 3")).toBeInTheDocument();
    });
});
