import { useState } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { AccessibleTextFieldComponent } from "../primitives/AccessibleTextFieldComponent";
import { PanelComponent } from "../primitives/PanelComponent";
import { PanelSectionComponent } from "../primitives/PanelSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CasPanelComponent.module.css";

export function CasPanelComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();
  const [variableName, setVariableName] = useState("x");

  const hasExpression = viewModel.expressionText.trim().length > 0;

  return (
    <PanelComponent title="CAS">
      {!viewModel.casEnabled ? (
        <p className={cssClass(styles.warningText)}>
          CAS mode is disabled. Enable it in settings to use symbolic
          operations.
        </p>
      ) : null}

      <PanelSectionComponent heading="Operations">
        <div className={cssClass(styles.buttonGrid)}>
          <AccessibleButtonComponent
            customClassName={cssClass(styles.casButton)}
            onPress={() => store.getState().onSimplifyPressed()}
            isDisabled={!viewModel.casEnabled || !hasExpression}
          >
            Simplify
          </AccessibleButtonComponent>
          <AccessibleButtonComponent
            customClassName={cssClass(styles.casButton)}
            onPress={() => store.getState().onExpandPressed()}
            isDisabled={!viewModel.casEnabled || !hasExpression}
          >
            Expand
          </AccessibleButtonComponent>
        </div>

        <div className={cssClass(styles.derivativeRow)}>
          <AccessibleTextFieldComponent
            label="Derivative variable"
            value={variableName}
            onChange={setVariableName}
          />
          <AccessibleButtonComponent
            customClassName={cssClass(styles.casButton)}
            onPress={() =>
              store.getState().onDifferentiatePressed(variableName.trim() || "x")
            }
            isDisabled={!viewModel.casEnabled || !hasExpression}
          >
            Differentiate
          </AccessibleButtonComponent>
        </div>
      </PanelSectionComponent>

      <p className={cssClass(styles.hintText)}>
        Operations act on the expression in the display. The result appears on
        the result line. You can also type cas(...) blocks directly.
      </p>
    </PanelComponent>
  );
}
