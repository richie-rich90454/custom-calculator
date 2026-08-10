import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.clear());
});

async function openApp(page: import("@playwright/test").Page, ariaLabel: string): Promise<void> {
    await page.getByRole("button", { name: "Open the app menu" }).click();
    await page.getByRole("button", { name: ariaLabel }).click();
}

test("computes one-variable statistics", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Statistics app, number 6");

    const status = page.getByRole("status");

    for (const [index, value] of ["1", "2", "3", "4", "5"].entries()) {
        if (index >= 4) {
            await page.getByRole("button", { name: "Add a data row" }).click();
        }
        await page.getByRole("textbox", { name: `x value ${index + 1}` }).fill(value);
    }

    await page.getByRole("button", { name: "Compute statistics" }).click();

    await expect(status).toContainText("n = 5");
    await expect(status).toContainText("Σx = 15");
    await expect(status).toContainText("Σx² = 55");
    await expect(status).toContainText("mean = 3");
    await expect(status).toContainText("population σ = 1.414214");
    await expect(status).toContainText("sample s = 1.581139");
    await expect(status).toContainText("min = 1");
    await expect(status).toContainText("max = 5");
});

test("fits a linear regression and predicts a value", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Statistics app, number 6");

    const status = page.getByRole("status");

    for (const [index, value] of ["1", "2", "3"].entries()) {
        await page.getByRole("textbox", { name: `x value ${index + 1}` }).fill(value);
    }
    for (const [index, value] of ["2", "4", "6"].entries()) {
        await page.getByRole("textbox", { name: `y value ${index + 1}` }).fill(value);
    }

    await page.getByRole("textbox", { name: "Prediction x value" }).fill("4");
    await page.getByRole("button", { name: "Compute regression" }).click();

    await expect(status).toContainText("y = 2x + 0");
    await expect(status).toContainText("r = 1");
    await expect(status).toContainText("r² = 1");
    await expect(status).toContainText("f(4) = 8");
});

test("navigates the statistics data grid with the keyboard", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Statistics app, number 6");

    await page.getByRole("textbox", { name: "x value 1" }).focus();
    await expect(page.getByRole("textbox", { name: "x value 1" })).toBeFocused();

    await page.keyboard.type("12");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("textbox", { name: "x value 2" })).toBeFocused();

    await page.keyboard.type("24");
    await expect(page.getByRole("textbox", { name: "x value 2" })).toHaveValue("24");
});

test("generates a function table", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Table app, number 7");

    await page.getByRole("textbox", { name: "f(x)" }).fill("x^2");
    await page.getByRole("textbox", { name: "Start" }).fill("1");
    await page.getByRole("textbox", { name: "End" }).fill("3");
    await page.getByRole("textbox", { name: "Step" }).fill("1");
    await page.getByRole("button", { name: "Generate the table" }).click();

    const table = page.getByRole("grid", { name: "Function table" });
    await expect(table).toContainText("1");
    await expect(table).toContainText("4");
    await expect(table).toContainText("9");
    await expect(table).not.toContainText("16");
});

test("rejects an invalid table range", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Table app, number 7");

    await page.getByRole("textbox", { name: "f(x)" }).fill("x^2");
    await page.getByRole("textbox", { name: "Start" }).fill("5");
    await page.getByRole("textbox", { name: "End" }).fill("1");
    await page.getByRole("textbox", { name: "Step" }).fill("1");
    await page.getByRole("button", { name: "Generate the table" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("below the start value");
});

test("solves a quadratic equation", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Equation app, number 8");

    const status = page.getByRole("status");

    await page.getByRole("textbox", { name: "Coefficient of x^2" }).fill("1");
    await page.getByRole("textbox", { name: "Coefficient of x^1" }).fill("-3");
    await page.getByRole("textbox", { name: "Coefficient of x^0" }).fill("2");
    await page.getByRole("button", { name: "Solve the equation" }).click();

    await expect(status).toContainText("x1 = 1");
    await expect(status).toContainText("x2 = 2");
});

test("solves a cubic equation", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Equation app, number 8");

    const status = page.getByRole("status");

    await page.getByRole("button", { name: /Polynomial degree/ }).click();
    await page.getByRole("option", { name: "Degree 3" }).click();

    await page.getByRole("textbox", { name: "Coefficient of x^3" }).fill("1");
    await page.getByRole("textbox", { name: "Coefficient of x^2" }).fill("-6");
    await page.getByRole("textbox", { name: "Coefficient of x^1" }).fill("11");
    await page.getByRole("textbox", { name: "Coefficient of x^0" }).fill("-6");
    await page.getByRole("button", { name: "Solve the equation" }).click();

    await expect(status).toContainText("x1 = 1");
    await expect(status).toContainText("x2 = 2");
    await expect(status).toContainText("x3 = 3");
});

test("solves simultaneous equations", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Equation app, number 8");

    const status = page.getByRole("status");

    await page.getByRole("button", { name: /Equation mode/ }).click();
    await page.getByRole("option", { name: "Simultaneous" }).click();

    await page.getByRole("gridcell", { name: "Equation 1 coefficient 1" }).fill("2");
    await page.getByRole("gridcell", { name: "Equation 1 coefficient 2" }).fill("3");
    await page.getByRole("textbox", { name: "Equation 1 constant" }).fill("8");
    await page.getByRole("gridcell", { name: "Equation 2 coefficient 1" }).fill("1");
    await page.getByRole("gridcell", { name: "Equation 2 coefficient 2" }).fill("-1");
    await page.getByRole("textbox", { name: "Equation 2 constant" }).fill("1");
    await page.getByRole("button", { name: "Solve the equation" }).click();

    await expect(status).toContainText("x1 = 2.2");
    await expect(status).toContainText("x2 = 1.2");
});

test("reports a singular simultaneous system error", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Equation app, number 8");

    await page.getByRole("button", { name: /Equation mode/ }).click();
    await page.getByRole("option", { name: "Simultaneous" }).click();

    await page.getByRole("gridcell", { name: "Equation 1 coefficient 1" }).fill("1");
    await page.getByRole("gridcell", { name: "Equation 1 coefficient 2" }).fill("2");
    await page.getByRole("textbox", { name: "Equation 1 constant" }).fill("3");
    await page.getByRole("gridcell", { name: "Equation 2 coefficient 1" }).fill("2");
    await page.getByRole("gridcell", { name: "Equation 2 coefficient 2" }).fill("4");
    await page.getByRole("textbox", { name: "Equation 2 constant" }).fill("6");
    await page.getByRole("button", { name: "Solve the equation" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("singular");
});

test("solves a ratio with one missing term", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Ratio app, number 0");

    const status = page.getByRole("status");

    await page.getByRole("textbox", { name: "First term" }).fill("2");
    await page.getByRole("textbox", { name: "Second term" }).fill("3");
    await page.getByRole("textbox", { name: "Third term" }).fill("4");
    await page.getByRole("button", { name: "Solve the ratio" }).click();

    await expect(status).toContainText("missing term = 6");
});

test("rejects a ratio with multiple missing terms", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Ratio app, number 0");

    await page.getByRole("textbox", { name: "First term" }).fill("2");
    await page.getByRole("textbox", { name: "Third term" }).fill("4");
    await page.getByRole("button", { name: "Solve the ratio" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("Exactly one term");
});
