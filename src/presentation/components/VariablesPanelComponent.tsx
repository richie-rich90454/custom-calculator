import { useState } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { AccessibleTextFieldComponent } from "../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/VariablesPanelComponent.module.css";

export function VariablesPanelComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();
  const [variableName, setVariableName] = useState("");

  const handleSaveVariable = (): void => {
    const trimmedName = variableName.trim();

    if (trimmedName.length === 0) {
      return;
    }

    store.getState().onSaveVariablePressed(trimmedName);
    setVariableName("");
  };

  const handleInsertVariable = (name: string): void => {
    store.getState().onVariablePressed(name);
  };

  return (
    <div className={cssClass(styles.panel)}>
      <section className={cssClass(styles.saveSection)}>
        <h3 className={cssClass(styles.sectionHeading)}>Save current result</h3>
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
      </section>

      <section className={cssClass(styles.listSection)}>
        <h3 className={cssClass(styles.sectionHeading)}>Saved variables</h3>
        {viewModel.variables.length === 0 ? (
          <p className={cssClass(styles.emptyMessage)}>
            No variables saved yet.
          </p>
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
      </section>
    </div>
  );
}
