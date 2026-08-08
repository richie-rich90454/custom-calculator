import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { ScientificConstantCategory } from "../../domain/model/ScientificConstantCategory";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleListBoxComponent, type AccessibleListBoxEntry } from "../primitives/AccessibleListBoxComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/ConstantsPanelComponent.module.css";

interface ConstantCategoryGroup {
  readonly category: ScientificConstantCategory;
  readonly heading: string;
}

const CATEGORY_GROUPS: readonly ConstantCategoryGroup[] = [
  { category: ScientificConstantCategory.MATHEMATICS, heading: "Mathematics" },
  {
    category: ScientificConstantCategory.UNIVERSAL_PHYSICS,
    heading: "Universal physics",
  },
  {
    category: ScientificConstantCategory.ATOMIC_AND_PARTICLE,
    heading: "Atomic and particle",
  },
  { category: ScientificConstantCategory.CHEMISTRY, heading: "Chemistry" },
];

export function ConstantsPanelComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();

  return (
    <div className={cssClass(styles.panel)}>
      <p className={cssClass(styles.helpText)}>
        Select a constant to insert it into the expression.
      </p>

      {CATEGORY_GROUPS.map((group) => {
        const constantsInCategory = viewModel.constants.filter(
          (constant) => constant.category === group.category
        );

        if (constantsInCategory.length === 0) {
          return null;
        }

        const entries: readonly AccessibleListBoxEntry[] =
          constantsInCategory.map((constant) => ({
            id: constant.id,
            primaryText: `${constant.symbol}  ${constant.name}`,
            secondaryText: `${constant.value}${constant.unit !== null ? ` ${constant.unit}` : ""}`,
          }));

        return (
          <section key={group.category} className={cssClass(styles.group)}>
            <h3 className={cssClass(styles.groupHeading)}>{group.heading}</h3>
            <AccessibleListBoxComponent
              label={`${group.heading} constants`}
              entries={entries}
              onEntrySelected={(constantId) =>
                store.getState().onConstantPressed(constantId)
              }
            />
          </section>
        );
      })}
    </div>
  );
}
