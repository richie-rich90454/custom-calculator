import type { ScientificConstant } from "../../domain/model/ScientificConstant";
import { ScientificConstantCategory } from "../../domain/model/ScientificConstantCategory";

export interface ConstantsPanelCategoryOption {
  readonly id: string;
  readonly label: string;
}

/**
 * Computes the filtered constant list and category options for the constants
 * panel. All filtering and matching logic lives here so the panel TSX stays a
 * thin presentation of derived data.
 */
export class ConstantsPanelViewModel {
  public static readonly ALL_CATEGORIES_ID = "all";

  private static readonly CATEGORY_LABELS: Readonly<
    Record<ScientificConstantCategory, string>
  > = {
    [ScientificConstantCategory.MATHEMATICS]: "Mathematics",
    [ScientificConstantCategory.UNIVERSAL_PHYSICS]: "Universal physics",
    [ScientificConstantCategory.ATOMIC_AND_PARTICLE]: "Atomic and particle",
    [ScientificConstantCategory.CHEMISTRY]: "Chemistry",
  };

  public constructor(
    private readonly constants: readonly ScientificConstant[],
    private readonly searchText: string,
    private readonly selectedCategoryId: string
  ) {}

  public get categoryOptions(): readonly ConstantsPanelCategoryOption[] {
    const categories = Object.values(ScientificConstantCategory);

    return [
      {
        id: ConstantsPanelViewModel.ALL_CATEGORIES_ID,
        label: "All categories",
      },
      ...categories.map((category) => ({
        id: category,
        label: ConstantsPanelViewModel.CATEGORY_LABELS[category],
      })),
    ];
  }

  public get filteredConstants(): readonly ScientificConstant[] {
    const normalizedSearchText = this.searchText.trim().toLowerCase();

    return this.constants.filter((constant) => {
      const matchesCategory =
        this.selectedCategoryId === ConstantsPanelViewModel.ALL_CATEGORIES_ID ||
        constant.category === this.selectedCategoryId;

      if (!matchesCategory) {
        return false;
      }

      if (normalizedSearchText.length === 0) {
        return true;
      }

      return this.matchesSearchText(constant, normalizedSearchText);
    });
  }

  public get hasSearchQuery(): boolean {
    return this.searchText.trim().length > 0;
  }

  private matchesSearchText(
    constant: ScientificConstant,
    normalizedSearchText: string
  ): boolean {
    const candidates = [
      constant.name,
      constant.symbol,
      constant.id,
      constant.unit ?? "",
      ...constant.aliases,
    ];

    return candidates.some((candidate) =>
      candidate.toLowerCase().includes(normalizedSearchText)
    );
  }
}
