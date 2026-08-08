import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { ThemePreference } from "../../domain/model/ThemePreference";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { useCalculatorTheme } from "./useCalculatorTheme";

function ThemeProbe() {
  useCalculatorTheme();

  return <div>theme probe</div>;
}

describe("useCalculatorTheme", () => {
  it("applies the light theme preference to the document", () => {
    const harness = createCalculatorTestHarness({ themePreference: ThemePreference.LIGHT });

    renderWithCalculatorContext(harness, <ThemeProbe />);

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("applies the dark theme preference to the document", () => {
    const harness = createCalculatorTestHarness({ themePreference: ThemePreference.DARK });

    renderWithCalculatorContext(harness, <ThemeProbe />);

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("applies the system theme preference to the document", () => {
    const harness = createCalculatorTestHarness({ themePreference: ThemePreference.SYSTEM });

    renderWithCalculatorContext(harness, <ThemeProbe />);

    expect(
      ["light", "dark"].includes(
        document.documentElement.getAttribute("data-theme") as string
      )
    ).toBe(true);
  });

  it("renders without crashing", () => {
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(harness, <ThemeProbe />);

    expect(screen.getByText("theme probe")).toBeInTheDocument();
  });
});
