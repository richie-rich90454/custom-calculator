import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { RatioAppComponent } from "./RatioAppComponent";

describe("RatioAppComponent", () => {
    async function fillTerms(
        user: ReturnType<typeof userEvent.setup>,
        terms: readonly [string, string, string, string],
    ): Promise<void> {
        const labels = ["First term", "Second term", "Third term", "Fourth term"];

        for (let index = 0; index < labels.length; index += 1) {
            const field = screen.getByLabelText(labels[index] as string) as HTMLInputElement;
            await user.clear(field);

            const value = terms[index] ?? "";

            if (value !== "") {
                await user.type(field, value);
            }
        }
    }

    it("solves for a missing fourth term", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <RatioAppComponent />);

        await fillTerms(user, ["2", "3", "4", ""]);

        await user.click(screen.getByRole("button", { name: "Solve the ratio" }));

        expect(screen.getByRole("status")).toHaveTextContent("missing term = 6");
    });

    it("solves for a missing first term", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <RatioAppComponent />);

        await fillTerms(user, ["", "3", "4", "6"]);

        await user.click(screen.getByRole("button", { name: "Solve the ratio" }));

        expect(screen.getByRole("status")).toHaveTextContent("missing term = 2");
    });

    it("reports an error when more than one term is missing", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <RatioAppComponent />);

        await fillTerms(user, ["", "3", "", "6"]);

        await user.click(screen.getByRole("button", { name: "Solve the ratio" }));

        expect(screen.getByRole("status")).toHaveTextContent("Exactly one term");
    });

    it("reports an error for an invalid number", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <RatioAppComponent />);

        await fillTerms(user, ["2", "x", "4", "6"]);

        await user.click(screen.getByRole("button", { name: "Solve the ratio" }));

        expect(screen.getByRole("status")).toHaveTextContent("valid numbers");
    });

    it("reports an error for a zero term", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <RatioAppComponent />);

        await fillTerms(user, ["2", "0", "4", ""]);

        await user.click(screen.getByRole("button", { name: "Solve the ratio" }));

        expect(screen.getByRole("status")).toHaveTextContent("positive numbers");
    });
});
