import { useState } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { AccessibleTextFieldComponent } from "../primitives/AccessibleTextFieldComponent";
import { PanelComponent } from "../primitives/PanelComponent";
import { PanelEmptyStateComponent } from "../primitives/PanelEmptyStateComponent";
import { PanelSectionComponent } from "../primitives/PanelSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/VariablesPanelComponent.module.css";

export function VariablesPanelComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();
  const [variableName, setVariableName] = useState("");

  const handleSaveVariable = (): void => {
    store.getState().onSaveVariablePressed(variableName.trim());
    setVariableName("");
  };

  const handleInsertVariable = (name: string): void => {
    store.getState().onVariablePressed(name);
  };

  return (
    <PanelComponent title="Variables">
      <PanelSectionComponent heading="Save current result">
        <div className={cssClass(styles.saveRow)}>
          <AccessibleTextFieldComponent
            label="Variable name"
            value={variableName}
            onChange={setVariableName}
            isDisabled={viewModel.resultText === null}
          />
          <AccessibleButtonComponent
            customClassName={cssClass(styles.saveButton)}
            onPress={handleSaveVariable}
            isDisabled={
              viewModel.resultText === null || variableName.trim().length === 0
            }
          >
            Save
          </AccessibleButtonComponent>
        </div>
        {viewModel.resultText === null ? (
          <p className={cssClass(styles.hintText)}>
            Evaluate an expression first to have a result to save.
          </p>
        ) : null}
      </PanelSectionComponent>

      <PanelSectionComponent heading="Saved variables">
        {viewModel.variables.length === 0 ? (
          <PanelEmptyStateComponent message="No variables saved yet." />
        ) : (
          <ul className={cssClass(styles.variableList)} aria-label="Saved variables">
            {viewModel.variables.map((variable) => (
              <li key={variable.name} className={cssClass(styles.variableEntry)}>
                <div className={cssClass(styles.variableText)}>
                  <span className={cssClass(styles.variableName)}>
                    {variable.name}
                  </span>
                  <span className={cssClass(styles.variableValue)}>
                    = {variable.valueText}
                  </span>
                </div>
                <div className={cssClass(styles.entryActions)}>
                  <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label={`Insert variable ${variable.name}`}
                    onPress={() => handleInsertVariable(variable.name)}
                  >
                    Insert
                  </AccessibleButtonComponent>
                  <AccessibleButtonComponent
                    customClassName={cssClass(styles.deleteButton)}
                    aria-label={`Delete variable ${variable.name}`}
                    onPress={() =>
                      store.getState().onVariableDeleted(variable.name)
                    }
                  >
                    Delete
                  </AccessibleButtonComponent>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelSectionComponent>
    </PanelComponent>
  );
}
