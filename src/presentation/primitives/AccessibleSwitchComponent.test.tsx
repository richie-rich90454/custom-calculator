import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AccessibleSwitchComponent } from "./AccessibleSwitchComponent";

describe("AccessibleSwitchComponent", () => {
  it("uses the label as the accessible text when children are omitted", () => {
    render(
      <AccessibleSwitchComponent
        label="Complex numbers"
        isSelected={false}
        onChange={() => undefined}
      />
    );

    expect(
      screen.getByRole("switch", { name: "Complex numbers" })
    ).toBeInTheDocument();
  });

  it("uses the children as the accessible text when provided", () => {
    render(
      <AccessibleSwitchComponent
        label="Complex numbers"
        isSelected={true}
        onChange={() => undefined}
      >
        Enable complex numbers
      </AccessibleSwitchComponent>
    );

    expect(
      screen.getByRole("switch", { name: "Enable complex numbers" })
    ).toBeInTheDocument();
  });

  it("fires the change handler when activated", async () => {
    const onChange = vi.fn();

    render(
      <AccessibleSwitchComponent
        label="CAS mode"
        isSelected={false}
        onChange={onChange}
      >
        CAS mode
      </AccessibleSwitchComponent>
    );

    const { default: userEvent } = await import("@testing-library/user-event");

    await userEvent.setup().click(screen.getByRole("switch", { name: "CAS mode" }));

    expect(onChange).toHaveBeenCalledOnce();
  });
});
