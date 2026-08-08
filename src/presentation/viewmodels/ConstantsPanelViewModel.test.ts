import { describe, expect, it } from "vitest";
import { ScientificConstant } from "../../domain/model/ScientificConstant";
import { ScientificConstantCategory } from "../../domain/model/ScientificConstantCategory";
import { ConstantsPanelViewModel } from "./ConstantsPanelViewModel";

function buildConstant(
  id: string,
  name: string,
  category: ScientificConstantCategory
): ScientificConstant {
  return new ScientificConstant(
    id,
    id,
    name,
    category,
    "1",
    null,
    "A test constant.",
    "Test source",
    []
  );
}

const constants: readonly ScientificConstant[] = [
  buildConstant("pi", "Pi", ScientificConstantCategory.MATHEMATICS),
  buildConstant("speedOfLight", "Speed of light", ScientificConstantCategory.UNIVERSAL_PHYSICS),
  buildConstant("planckConstant", "Planck constant", ScientificConstantCategory.UNIVERSAL_PHYSICS),
];

describe("ConstantsPanelViewModel", () => {
  it("shows every constant with the all categories filter", () => {
    const viewModel = new ConstantsPanelViewModel(
      constants,
      "",
      ConstantsPanelViewModel.ALL_CATEGORIES_ID
    );

    expect(viewModel.filteredConstants).toHaveLength(3);
  });

  it("filters constants by selected category", () => {
    const viewModel = new ConstantsPanelViewModel(
      constants,
      "",
      ScientificConstantCategory.UNIVERSAL_PHYSICS
    );

    expect(viewModel.filteredConstants.map((constant) => constant.id)).toEqual([
      "speedOfLight",
      "planckConstant",
    ]);
  });

  it("filters constants by search text", () => {
    const viewModel = new ConstantsPanelViewModel(
      constants,
      "planck",
      ConstantsPanelViewModel.ALL_CATEGORIES_ID
    );

    expect(viewModel.filteredConstants.map((constant) => constant.id)).toEqual([
      "planckConstant",
    ]);
  });

  it("filters search text case insensitively", () => {
    const viewModel = new ConstantsPanelViewModel(
      constants,
      "SPEED",
      ConstantsPanelViewModel.ALL_CATEGORIES_ID
    );

    expect(viewModel.filteredConstants.map((constant) => constant.id)).toEqual([
      "speedOfLight",
    ]);
  });

  it("combines category and search filters", () => {
    const viewModel = new ConstantsPanelViewModel(
      constants,
      "pi",
      ScientificConstantCategory.UNIVERSAL_PHYSICS
    );

    expect(viewModel.filteredConstants).toHaveLength(0);
  });

  it("reports whether a search query is present", () => {
    expect(
      new ConstantsPanelViewModel(constants, " ", ConstantsPanelViewModel.ALL_CATEGORIES_ID).hasSearchQuery
    ).toBe(false);
    expect(
      new ConstantsPanelViewModel(constants, "pi", ConstantsPanelViewModel.ALL_CATEGORIES_ID).hasSearchQuery
    ).toBe(true);
  });

  it("offers an all categories option plus one per category", () => {
    const viewModel = new ConstantsPanelViewModel(
      constants,
      "",
      ConstantsPanelViewModel.ALL_CATEGORIES_ID
    );

    expect(viewModel.categoryOptions).toHaveLength(5);
    expect(viewModel.categoryOptions[0]?.id).toBe(
      ConstantsPanelViewModel.ALL_CATEGORIES_ID
    );
  });
});
