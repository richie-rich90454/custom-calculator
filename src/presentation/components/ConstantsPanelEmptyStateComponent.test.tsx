import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConstantsPanelEmptyStateComponent } from "./ConstantsPanelEmptyStateComponent";

describe("ConstantsPanelEmptyStateComponent", () => {
  it("shows the no results message when a search query is present", () => {
    render(<ConstantsPanelEmptyStateComponent hasSearchQuery={true} />);

    expect(screen.getByText("No constants match your search.")).toBeInTheDocument();
  });

  it("shows the generic message when no search query is present", () => {
    render(<ConstantsPanelEmptyStateComponent hasSearchQuery={false} />);

    expect(screen.getByText("No constants are available.")).toBeInTheDocument();
  });
});
