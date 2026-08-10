import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.clear());
});

async function openApp(page: import("@playwright/test").Page, ariaLabel: string): Promise<void> {
    await page.getByRole("button", { name: "Open the app menu" }).click();
    await page.getByRole("button", { name: ariaLabel }).click();
}

async function enableComplexNumbers(
    page: import("@playwright/test").Page,
): Promise<void> {
    await page.getByRole("button", { name: "Open settings panel" }).click();
    await page
        .getByRole("switch", { name: "Enable complex numbers" })
        .click({ force: true });
    await page.getByRole("button", { name: "Close", exact: true }).click();
}

test("multiplies complex numbers in rectangular form", async ({ page }) => {
    await page.goto("/");
    await enableComplexNumbers(page);
    await openApp(page, "Complex app, number 2");

    await page.getByRole("textbox", { name: "A real part" }).fill("3");
    await page.getByRole("textbox", { name: "A imaginary part" }).fill("4");
    await page.getByRole("textbox", { name: "B real part" }).fill("1");
    await page.getByRole("textbox", { name: "B imaginary part" }).fill("-2");

    await page.getByRole("button", { name: "Multiply complex numbers" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("11 - 2i");
});

test("computes the conjugate of a complex number", async ({ page }) => {
    await page.goto("/");
    await enableComplexNumbers(page);
    await openApp(page, "Complex app, number 2");

    await page.getByRole("textbox", { name: "A real part" }).fill("3");
    await page.getByRole("textbox", { name: "A imaginary part" }).fill("4");

    await page.getByRole("button", { name: "Conjugate of A" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("3 - 4i");
});

test("computes the absolute value of a complex number", async ({ page }) => {
    await page.goto("/");
    await enableComplexNumbers(page);
    await openApp(page, "Complex app, number 2");

    await page.getByRole("textbox", { name: "A real part" }).fill("3");
    await page.getByRole("textbox", { name: "A imaginary part" }).fill("4");

    await page.getByRole("button", { name: "Absolute value of A" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("|A| = 5");
});

test("computes the argument of a complex number in radians", async ({ page }) => {
    await page.goto("/");
    await enableComplexNumbers(page);
    await openApp(page, "Complex app, number 2");

    await page.getByRole("textbox", { name: "A real part" }).fill("1");
    await page.getByRole("textbox", { name: "A imaginary part" }).fill("1");

    await page.getByRole("button", { name: "Argument of A" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("arg(A) = 0.7853981634 rad");
});

test("enters complex numbers in polar form", async ({ page }) => {
    await page.goto("/");
    await enableComplexNumbers(page);
    await openApp(page, "Complex app, number 2");

    await page.getByRole("button", { name: /A form/ }).click();
    await page.getByRole("option", { name: "Polar r ∠ θ" }).click();

    await page.getByRole("textbox", { name: "A radius" }).fill("5");
    await page.getByRole("textbox", { name: "A angle" }).fill("0");

    await page.getByRole("button", { name: "Absolute value of A" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("|A| = 5");
});

test("performs bitwise operations in base-n", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Base-N app, number 3");

    const status = page.getByRole("status");

    await page.getByRole("textbox", { name: "Value" }).fill("FF");
    await page.getByRole("textbox", { name: "Second operand" }).fill("0F");
    await page.getByRole("button", { name: /Number base/ }).click();
    await page.getByRole("option", { name: "HEX" }).click();
    await page.getByRole("button", { name: "Bitwise and base-n values" }).click();

    await expect(status).toContainText("A AND B:");
    await expect(status).toContainText("DEC: 15");
    await expect(status).toContainText("HEX: F");

    await page.getByRole("textbox", { name: "Value" }).fill("0");
    await page.getByRole("button", { name: "Bitwise not of the value" }).click();
    await expect(status).toContainText("HEX: FFFFFFFF");
});

test("adds base-n values with 32-bit wraparound", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Base-N app, number 3");

    const status = page.getByRole("status");

    await page.getByRole("textbox", { name: "Value" }).fill("7FFFFFFF");
    await page.getByRole("textbox", { name: "Second operand" }).fill("1");
    await page.getByRole("button", { name: /Number base/ }).click();
    await page.getByRole("option", { name: "HEX" }).click();
    await page.getByRole("button", { name: "Add base-n values" }).click();

    await expect(status).toContainText("HEX: 80000000");
});

test("computes a matrix determinant and transpose", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Matrix app, number 4");

    const status = page.getByRole("status");

    await page.getByRole("gridcell", { name: "MatA row 1 column 1" }).fill("1");
    await page.getByRole("gridcell", { name: "MatA row 1 column 2" }).fill("2");
    await page.getByRole("gridcell", { name: "MatA row 2 column 1" }).fill("3");
    await page.getByRole("gridcell", { name: "MatA row 2 column 2" }).fill("4");

    await page.getByRole("button", { name: /Matrix operation/ }).click();
    await page.getByRole("option", { name: "Determinant of A" }).click();
    await page.getByRole("button", { name: "Run the selected matrix operation" }).click();

    await expect(status).toContainText("det(A) = [[-2]]");

    await page.getByRole("button", { name: /Matrix operation/ }).click();
    await page.getByRole("option", { name: "Transpose A" }).click();
    await page.getByRole("button", { name: "Run the selected matrix operation" }).click();

    await expect(status).toContainText("Aᵀ = [[1, 3], [2, 4]]");
});

test("reports a matrix dimension mismatch error", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Matrix app, number 4");

    await page.getByRole("button", { name: /MatB rows/ }).click();
    await page.getByRole("option", { name: "3 rows" }).click();

    await page.getByRole("button", { name: "Run the selected matrix operation" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("dimension");
});

test("computes a vector cross product", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Vector app, number 5");

    const status = page.getByRole("status");

    await page.getByRole("textbox", { name: "VecA component 1" }).fill("1");
    await page.getByRole("textbox", { name: "VecA component 2" }).fill("0");
    await page.getByRole("textbox", { name: "VecA component 3" }).fill("0");
    await page.getByRole("textbox", { name: "VecB component 1" }).fill("0");
    await page.getByRole("textbox", { name: "VecB component 2" }).fill("1");
    await page.getByRole("textbox", { name: "VecB component 3" }).fill("0");

    await page.getByRole("button", { name: /Vector operation/ }).click();
    await page.getByRole("option", { name: "Cross product" }).click();
    await page.getByRole("button", { name: "Run the selected vector operation" }).click();

    await expect(status).toContainText("A × B = [0, 0, 1]");
});

test("computes a vector dot product", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Vector app, number 5");

    const status = page.getByRole("status");

    await page.getByRole("textbox", { name: "VecA component 1" }).fill("1");
    await page.getByRole("textbox", { name: "VecA component 2" }).fill("0");
    await page.getByRole("textbox", { name: "VecB component 1" }).fill("0");
    await page.getByRole("textbox", { name: "VecB component 2" }).fill("1");

    await page.getByRole("button", { name: "Run the selected vector operation" }).click();

    await expect(status).toContainText("A · B = 0");
});

test("computes a unit vector", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Vector app, number 5");

    const status = page.getByRole("status");

    await page.getByRole("button", { name: /VecA dimension/ }).click();
    await page.getByRole("option", { name: "2 components" }).click();

    await page.getByRole("textbox", { name: "VecA component 1" }).fill("3");
    await page.getByRole("textbox", { name: "VecA component 2" }).fill("4");

    await page.getByRole("button", { name: /Vector operation/ }).click();
    await page.getByRole("option", { name: "Unit vector of A" }).click();
    await page.getByRole("button", { name: "Run the selected vector operation" }).click();

    await expect(status).toContainText("Â = [0.6, 0.8]");
});

test("reports a two-component cross product error", async ({ page }) => {
    await page.goto("/");
    await openApp(page, "Vector app, number 5");

    await page.getByRole("button", { name: /VecA dimension/ }).click();
    await page.getByRole("option", { name: "2 components" }).click();
    await page.getByRole("button", { name: /VecB dimension/ }).click();
    await page.getByRole("option", { name: "2 components" }).click();

    await page.getByRole("textbox", { name: "VecA component 1" }).fill("1");
    await page.getByRole("textbox", { name: "VecA component 2" }).fill("0");
    await page.getByRole("textbox", { name: "VecB component 1" }).fill("0");
    await page.getByRole("textbox", { name: "VecB component 2" }).fill("1");

    await page.getByRole("button", { name: /Vector operation/ }).click();
    await page.getByRole("option", { name: "Cross product" }).click();
    await page.getByRole("button", { name: "Run the selected vector operation" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("3-component vectors");
});
