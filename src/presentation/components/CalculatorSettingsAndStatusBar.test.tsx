import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AngleMode } from "../../domain/model/AngleMode";
import { createCalculatorTestHarness, renderWithCalculatorContext } from "../../test/calculatorTestHarness";
import { CalculatorStatusBarComponent } from "./CalculatorStatusBarComponent";
import { SettingsPanelComponent } from "./SettingsPanelComponent";

describe("CalculatorStatusBarComponent", () => {
  it("cycles the angle mode when the angle button is pressed", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorStatusBarComponent />
    );

    const angleButton = screen.getByRole("button", { name: "Cycle angle mode" });

    expect(angleButton).toHaveTextContent(AngleMode.DEG);

    await user.click(angleButton);

    expect(harness.store.getState().angleMode).toBe(AngleMode.RAD);
  });

  it("opens the history panel via the panel button", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <CalculatorStatusBarComponent />
    );

    await user.click(screen.getByRole("button", { name: "Open history panel" }));

    expect(harness.store.getState().activePanel).toBe("HISTORY");
  });
});

describe("SettingsPanelComponent", () => {
  it("toggles the complex numbers setting", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <SettingsPanelComponent />
    );

    await user.click(
      screen.getByRole("switch", { name: "Enable complex numbers" })
    );

    expect(harness.store.getState().complexNumbersEnabled).toBe(true);
  });

  it("toggles the CAS setting", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <SettingsPanelComponent />
    );

    await user.click(
      screen.getByRole("switch", { name: "Enable CAS-style symbolic operations" })
    );

    expect(harness.store.getState().casEnabled).toBe(true);
  });

  it("changes the angle mode through the select", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <SettingsPanelComponent />
    );

    await user.click(
      screen.getByRole("button", { name: /angle mode/i })
    );
    await user.click(
      await screen.findByRole("option", { name: "Radians (RAD)" })
    );

    expect(harness.store.getState().angleMode).toBe(AngleMode.RAD);
  });

  it("changes the theme through the select", async () => {
    const user = userEvent.setup();
    const harness = createCalculatorTestHarness();

    renderWithCalculatorContext(
      harness,
      <SettingsPanelComponent />
    );

    await user.click(screen.getByRole("button", { name: /theme/i }));
    await user.click(await screen.findByRole("option", { name: "Dark" }));

    expect(harness.store.getState().themePreference).toBe("DARK");
  });
});
