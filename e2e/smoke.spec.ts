import { expect, test } from "@playwright/test";

test("evaluates a basic expression from the keypad", async ({ page }) => {
    await page.goto("/");

    const input = page.getByLabel("Calculator expression input");

    await expect(input).toBeVisible();

    await page.getByRole("button", { name: "Digit two" }).click();
    await page.getByRole("button", { name: "Addition" }).click();
    await page.getByRole("button", { name: "Digit three" }).click();
    await page.getByRole("button", { name: "Evaluate", exact: true }).click();

    await expect(page.locator("output")).toHaveText("= 5");
});
