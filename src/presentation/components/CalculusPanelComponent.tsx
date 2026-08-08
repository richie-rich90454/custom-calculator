import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { PanelComponent } from "../primitives/PanelComponent";
import { PanelSectionComponent } from "../primitives/PanelSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculusPanelComponent.module.css";

export function CalculusPanelComponent() {
  const { store, compositionRoot } = useCalculatorApplicationContext();
  const operations = compositionRoot.calculusOperationCatalogService
    .getOperations();

  return (
    <PanelComponent title="Calculus">
      <p className={cssClass(styles.hintText)}>
        Calculus operations act on typed blocks such as derivative(x^2, x) or
        integral(x^2, x, 0, 1). Select a block below to insert its syntax.
      </p>

      <PanelSectionComponent heading="Operations">
        <ul className={cssClass(styles.operationList)}>
          {operations.map((operation) => (
            <li key={operation.functionName}>
              <AccessibleButtonComponent
                customClassName={cssClass(styles.operationButton)}
                onPress={() =>
                  store.getState().onFunctionPressed(operation.functionName)
                }
              >
                {operation.label}
              </AccessibleButtonComponent>
              <span className={cssClass(styles.operationDescription)}>
                {operation.description}
              </span>
            </li>
          ))}
        </ul>
      </PanelSectionComponent>
    </PanelComponent>
  );
}
