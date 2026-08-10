import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.clear());
});

test("evaluates expressions typed via the physical keyboard", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("12*5");
    await page.keyboard.press("Enter");

    await expect(page.locator("output")).toHaveText("= 60");
});

test("cycles a decimal result to a fraction and back with S-D", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("0.5");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 0.5");

    await page.getByRole("button", { name: "Cycle between decimal and fraction result" }).click();
    await expect(page.locator("output")).toHaveText("= 1/2");

    await page.getByRole("button", { name: "Cycle between decimal and fraction result" }).click();
    await expect(page.locator("output")).toHaveText("= 0.5");
});

test("toggles engineering notation for a large result", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("12345");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 12345");

    await page.getByRole("button", { name: "Toggle engineering format" }).click();
    await expect(page.locator("output")).toHaveText("= 12.345×10^3");
});

test("formats pi with four fixed decimal places", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("pi");
    await page.keyboard.press("Enter");

    await page.getByRole("button", { name: "Arm the shift layer" }).click();
    await page
        .getByRole("button", { name: "Open the display format menu, shift layer" })
        .click();

    await page.getByRole("button", { name: "Fix decimal places" }).click();

    const digits = page.getByRole("button", { name: /Result format digits/ });
    await digits.click();
    await page.getByRole("option", { name: "4", exact: true }).click();

    await expect(page.locator("output")).toHaveText("= 3.1416");
});

test("honors the degree angle mode for trigonometric functions", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("sin(30)");
    await page.keyboard.press("Enter");

    await expect(page.locator("output")).toHaveText("= 0.5");
});

test("stores memory and recalls it into the expression", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("2+2");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 4");

    await page.getByRole("button", { name: "Open memory panel" }).click();
    await page.getByRole("button", { name: "Add current result to memory" }).click();
    await expect(page.getByLabel("Memory contains a value")).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).click();

    await input.fill("10");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 10");

    await page.getByRole("button", { name: "Open memory panel" }).click();
    await page.getByRole("button", { name: "Recall memory value" }).click();
    await expect(input).toHaveValue("104");
});

test("replays history from the history panel", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("1+1");
    await page.keyboard.press("Enter");
    await input.fill("2+3");
    await page.keyboard.press("Enter");

    await page.getByRole("button", { name: "Open history panel" }).click();

    const historyList = page.getByRole("list", { name: "Calculation history" });
    await expect(historyList).toContainText("2+3");

    await page.getByRole("button", { name: "Insert expression 2+3" }).click();
    await expect(input).toHaveValue("2+3");

    await page.getByRole("button", { name: "Open history panel" }).click();
    await page.getByRole("button", { name: "Delete history entry 1+1" }).click();
    await expect(page.getByRole("list", { name: "Calculation history" })).not.toContainText(
        "1+1",
    );
});

test("simplifies an expression with the CAS panel", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open settings panel" }).click();
    await page
        .getByRole("switch", { name: "Enable CAS-style symbolic operations" })
        .click({ force: true });
    await page.getByRole("button", { name: "Close", exact: true }).click();

    const input = page.getByLabel("Calculator expression input");
    await input.fill("x+x");
    await page.keyboard.press("Enter");

    await page.getByRole("button", { name: "Open CAS panel" }).click();
    await page.getByRole("button", { name: "Simplify", exact: true }).click();

    await expect(page.locator("output")).toHaveText("= 2*x");
});

test("calculates with a variable prompt through CALC", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("a+1");
    await page.getByRole("button", { name: "Evaluate with a variable prompt" }).click();

    const dialog = page.getByRole("dialog");
    const valueField = page.getByRole("textbox", { name: "Value for a" });
    await expect(valueField).toBeVisible();
    await valueField.fill("2");
    await dialog.getByRole("button", { name: "Evaluate", exact: true }).click();

    await expect(page.locator("output")).toHaveText("= 3");
});

test("solves an equation numerically with SOLVE", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("x^2-4");
    await page.getByRole("button", { name: "Arm the shift layer" }).click();
    await page.getByRole("button", { name: "Solve an equation numerically, shift layer" }).click();

    await expect(page.locator("output")).toContainText("x = 2");
    await expect(page.locator("output")).toContainText("iterations");
});

test("toggles the pretty preview off and on", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");
    await input.fill("2+3");

    await page.getByRole("button", { name: "Open the options catalog" }).click();
    await page.getByRole("tab", { name: "Display Format" }).click();
    await page.getByRole("button", { name: "Toggle pretty expression preview" }).click();

    const preview = page.getByLabel("Pretty preview");
    await expect(preview).toHaveCount(0);

    await page.getByRole("button", { name: "Toggle pretty expression preview" }).click();
    await expect(preview).toBeVisible();
});

test("approximates an irrational result with the S-D key", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("sqrt(2)");
    await page.keyboard.press("Enter");

    await page.getByRole("button", { name: "Cycle between decimal and fraction result" }).click();

    await expect(page.locator("output")).toContainText("≈");
});

test("drives a calculation with the keyboard alone", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await expect(input).toBeFocused();

    await input.fill("1+1");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 2");

    await page.getByRole("button", { name: "Digit seven" }).focus();
    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("7");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("78");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("782");
});
