import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.clear());
});

test("exposes keycap layer labels on the shift and alpha layers", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Arm the shift layer" }).click();
    await expect(
        page.getByRole("button", { name: "Solve an equation numerically, shift layer" }),
    ).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Insert an arcsine, shift layer" }),
    ).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Insert a cube root, shift layer" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Arm the alpha layer" }).click();
    await expect(page.getByRole("button", { name: "Insert the variable A, alpha layer" })).toBeVisible();
});

test("disarms a modifier with Escape", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Arm the shift layer" }).click();
    await expect(page.getByLabel("Shift layer armed")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByLabel("Shift layer", { exact: true })).toBeVisible();
});

test("closes an open panel with Escape", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open memory panel" }).click();
    await expect(page.getByRole("dialog")).toContainText("Memory");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("traps focus inside the variable prompt dialog", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");
    await input.fill("a+1");
    await page.getByRole("button", { name: "Evaluate with a variable prompt" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const valueField = page.getByRole("textbox", { name: "Value for a" });
    await expect(valueField).toBeFocused();

    await page.keyboard.press("Tab");
    const focusedAfterTab = await page.evaluate(() =>
        document.activeElement?.closest('[role="dialog"]') !== null,
    );
    expect(focusedAfterTab).toBe(true);
});

test("navigates the app menu and opens the matrix app", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open the app menu" }).click();
    await expect(page.getByRole("button", { name: "Calculate app, number 1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Complex app, number 2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Matrix app, number 4" })).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Calculus app, number 9" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Matrix app, number 4" }).click();

    await expect(page.getByRole("heading", { name: "MatA" })).toBeVisible();
    await expect(page.getByLabel("Active app")).toHaveText("Matrix");
});

test("shows the unavailable calculus app with its reason", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open the app menu" }).click();
    await page.getByRole("button", { name: "Calculus app, number 9" }).click();

    await expect(page.getByRole("status")).toContainText(
        "The calculus app arrives in a later release.",
    );
});

test("keeps every keycap keyboard accessible with visible focus", async ({ page }) => {
    await page.goto("/");

    const sevenButton = page.getByRole("button", { name: "Digit seven" });
    await sevenButton.focus();

    await expect(sevenButton).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByLabel("Calculator expression input")).toHaveValue("7");
});

test("activates the equals key with Space", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");
    await input.fill("2+3");

    const equalsButton = page.getByRole("button", { name: "Evaluate", exact: true });
    await equalsButton.focus();
    await page.keyboard.press("Space");

    await expect(page.locator("output")).toHaveText("= 5");
});
