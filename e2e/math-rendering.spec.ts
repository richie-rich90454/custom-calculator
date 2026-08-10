import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.clear());
});

test("renders a logarithm with a base subscript in the pretty preview", async ({
    page,
}) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await page.getByRole("button", { name: "Insert a logarithm with base a" }).click();
    await input.press("Control+a");
    await input.fill("log(2,3)");

    const preview = page.getByLabel("Pretty preview");

    await expect(preview).toBeVisible();
    await expect(preview.locator("math")).toBeAttached();
    await expect(preview.locator("msub")).toBeAttached();
});

test("renders a square root with a radical sign", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Calculator expression input").fill("sqrt(2)");

    const preview = page.getByLabel("Pretty preview");

    await expect(preview.locator("msqrt")).toBeAttached();
});

test("evaluates log as base ten and log with an explicit base", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("log(100)");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 2");

    await input.fill("log(2,8)");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 3");

    await input.fill("ln(e)");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 1");
});

test("replays history with the directional pad up and down keys", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await input.fill("1+1");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 2");

    await input.fill("2+2");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 4");

    await input.fill("3+3");
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("= 6");

    await input.fill("0");

    await page.getByRole("button", { name: "Step back through history" }).click();
    await expect(input).toHaveValue("3+3");

    await page.getByRole("button", { name: "Step back through history" }).click();
    await expect(input).toHaveValue("2+2");

    await page.getByRole("button", { name: "Step forward through history" }).click();
    await expect(input).toHaveValue("3+3");
});
