import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { AccessibleDialogComponent } from "./AccessibleDialogComponent";

describe("AccessibleDialogComponent", () => {
  it("renders the dialog content when open", () => {
    render(
      <AccessibleDialogComponent title="History" isOpen={true} onClose={() => undefined}>
        <p>Dialog body</p>
      </AccessibleDialogComponent>
    );

    expect(screen.getByText("Dialog body")).toBeInTheDocument();
  });

  it("exposes the dialog title as an accessible name", () => {
    render(
      <AccessibleDialogComponent title="History" isOpen={true} onClose={() => undefined}>
        <p>Dialog body</p>
      </AccessibleDialogComponent>
    );

    expect(screen.getByRole("dialog", { name: "History" })).toBeInTheDocument();
  });

  it("closes through the close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AccessibleDialogComponent title="History" isOpen={true} onClose={onClose}>
        <p>Dialog body</p>
      </AccessibleDialogComponent>
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes when dismissed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AccessibleDialogComponent title="History" isOpen={true} onClose={onClose}>
        <p>Dialog body</p>
      </AccessibleDialogComponent>
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });
});
