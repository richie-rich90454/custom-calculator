import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.clear());
});

test("renders every key exactly once without duplicated labels", async ({ page }) => {
    await page.goto("/");

    const grid = page.getByRole("grid", { name: "Calculator keypad" });
    const digitGrid = page.getByRole("grid", { name: "Calculator number keys" });

    for (const [label, count] of [
        ["Digit seven", 1],
        ["Digit eight", 1],
        ["Digit nine", 1],
        ["Digit four", 1],
        ["Digit five", 1],
        ["Digit six", 1],
        ["Digit one", 1],
        ["Digit two", 1],
        ["Digit three", 1],
        ["Digit zero", 1],
        ["Addition", 1],
        ["Subtraction", 1],
        ["Multiplication", 1],
        ["Division", 1],
    ] as const) {
        await expect(grid.locator("button")).toHaveCount(30);
        await expect(digitGrid.locator("button")).toHaveCount(16);
        await expect(
            page.getByRole("button", { name: label, exact: true }),
        ).toHaveCount(count);
    }
});

test("shows both parenthesis keys and the ans key", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Open parenthesis" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close parenthesis" })).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Insert the previous answer" }),
    ).toBeVisible();
});

test("aligns the digit rows and the equals key in the fifth column", async ({ page }) => {
    await page.goto("/");

    const digitGrid = page.getByRole("grid", { name: "Calculator number keys" });

    const seven = digitGrid.getByRole("button", { name: "Digit seven" });
    const four = digitGrid.getByRole("button", { name: "Digit four" });
    const one = digitGrid.getByRole("button", { name: "Digit one" });
    const zero = digitGrid.getByRole("button", { name: "Digit zero" });

    await expect(seven).toBeVisible();
    await expect(four).toBeVisible();
    await expect(one).toBeVisible();
    await expect(zero).toBeVisible();

    const boxSeven = (await seven.boundingBox())!;
    const boxFour = (await four.boundingBox())!;
    const boxOne = (await one.boundingBox())!;
    const boxZero = (await zero.boundingBox())!;

    expect(boxFour.y).toBeGreaterThan(boxSeven.y);
    expect(boxOne.y).toBeGreaterThan(boxFour.y);
    expect(boxZero.y).toBeGreaterThan(boxOne.y);

    expect(Math.abs(boxSeven.x - boxFour.x)).toBeLessThan(2);
    expect(Math.abs(boxSeven.x - boxOne.x)).toBeLessThan(2);
    expect(Math.abs(boxSeven.x - boxZero.x)).toBeLessThan(2);
});
