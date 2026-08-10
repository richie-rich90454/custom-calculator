import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../../test/calculatorTestHarness";
import { StatisticsAppComponent } from "./StatisticsAppComponent";

describe("StatisticsAppComponent", () => {
    async function fillColumn(
        user: ReturnType<typeof userEvent.setup>,
        label: "x" | "y",
        values: readonly string[],
    ): Promise<void> {
        for (let index = 0; index < values.length; index += 1) {
            await user.clear(screen.getByLabelText(`${label} value ${index + 1}`));
            await user.type(
                screen.getByLabelText(`${label} value ${index + 1}`),
                values[index] ?? "",
            );
        }
    }

    it("computes one-variable statistics", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await user.click(screen.getByRole("button", { name: "Add a data row" }));
        await fillColumn(user, "x", ["1", "2", "3", "4", "5"]);

        await user.click(screen.getByRole("button", { name: "Compute statistics" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("n = 5");
        expect(status).toHaveTextContent("Σx = 15");
        expect(status).toHaveTextContent("Σx² = 55");
        expect(status).toHaveTextContent("mean = 3");
        expect(status).toHaveTextContent("population σ = 1.414214");
        expect(status).toHaveTextContent("sample s = 1.581139");
        expect(status).toHaveTextContent("min = 1");
        expect(status).toHaveTextContent("max = 5");
    });

    it("fits a linear regression and predicts a value", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await fillColumn(user, "x", ["1", "2", "3"]);
        await fillColumn(user, "y", ["2", "4", "6"]);

        await user.type(screen.getByLabelText("Prediction x value"), "4");

        await user.click(screen.getByRole("button", { name: "Compute regression" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("y = 2x + 0");
        expect(status).toHaveTextContent("r = 1");
        expect(status).toHaveTextContent("f(4) = 8");
    });

    it("fits a linear regression without a prediction input", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await fillColumn(user, "x", ["1", "2", "3"]);
        await fillColumn(user, "y", ["2", "4", "6"]);

        await user.click(screen.getByRole("button", { name: "Compute regression" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("y = 2x + 0");
        expect(status).not.toHaveTextContent("f(");
    });

    it("fits a quadratic regression and predicts a value", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await user.click(screen.getByRole("button", { name: /Regression mode/ }));
        await user.click(screen.getByRole("option", { name: "Quadratic" }));

        await fillColumn(user, "x", ["-1", "0", "1"]);
        await fillColumn(user, "y", ["1", "0", "1"]);

        await user.type(screen.getByLabelText("Prediction x value"), "2");

        await user.click(screen.getByRole("button", { name: "Compute regression" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("y = 1x² + 0x + 0");
        expect(status).toHaveTextContent("f(2) = 4");
    });

    it("reports a regression error for degenerate data", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await fillColumn(user, "x", ["2", "2", "2"]);
        await fillColumn(user, "y", ["1", "2", "3"]);

        await user.click(screen.getByRole("button", { name: "Compute regression" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("no variance");
    });

    it("fits a quadratic regression", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await user.click(screen.getByRole("button", { name: /Regression mode/ }));
        await user.click(screen.getByRole("option", { name: "Quadratic" }));

        await fillColumn(user, "x", ["-1", "0", "1"]);
        await fillColumn(user, "y", ["1", "0", "1"]);

        await user.click(screen.getByRole("button", { name: "Compute regression" }));

        const status = screen.getByRole("status");
        expect(status).toHaveTextContent("y = 1x² + 0x + 0");
        expect(status).not.toHaveTextContent("f(");
    });

    it("reports an error for empty data", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await user.click(screen.getByRole("button", { name: "Compute statistics" }));

        expect(screen.getByRole("status")).toHaveTextContent("Enter at least one data value");
    });

    it("reports an error for a single value in statistics", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await fillColumn(user, "x", ["7"]);

        await user.click(screen.getByRole("button", { name: "Compute statistics" }));

        expect(screen.getByRole("status")).toHaveTextContent("at least two values");
    });

    it("reports an error for regression without paired data", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await fillColumn(user, "x", ["1", "2"]);

        await user.click(screen.getByRole("button", { name: "Compute regression" }));

        expect(screen.getByRole("status")).toHaveTextContent("paired data");
    });

    it("adds an extra data row", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        await user.click(screen.getByRole("button", { name: "Add a data row" }));

        expect(screen.getByLabelText("x value 5")).toBeInTheDocument();
    });

    it("stops adding rows at the maximum", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(harness, <StatisticsAppComponent />);

        for (let index = 0; index < 6; index += 1) {
            await user.click(screen.getByRole("button", { name: "Add a data row" }));
        }

        expect(screen.queryByLabelText("x value 9")).not.toBeInTheDocument();
    });
});
