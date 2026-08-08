import { useState } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { AccessibleTextFieldComponent } from "../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CasPanelComponent.module.css";

export function CasPanelComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();
  const [variableName, setVariableName] = useState("x");

  const hasExpression = viewModel.expressionText.trim().length > 0;

  return (
    <div className={cssClass(styles.panel)}>
      {!viewModel.casEnabled ? (
        <p className={cssClass(styles.warningText)}>
          CAS mode is disabled. Enable it in settings to use symbolic
          operations.
        </p>
      ) : null}

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

      <p className={cssClass(styles.hintText)}>
        Operations act on the expression in the display. The result appears on
        the result line.
      </p>
    </div>
  );
}
