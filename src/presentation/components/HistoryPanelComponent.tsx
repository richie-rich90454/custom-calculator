import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { PanelComponent } from "../primitives/PanelComponent";
import { PanelEmptyStateComponent } from "../primitives/PanelEmptyStateComponent";
import { PanelSectionComponent } from "../primitives/PanelSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/HistoryPanelComponent.module.css";

export function HistoryPanelComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();

  const handleInsertExpression = (expressionText: string): void => {
    store.getState().onExpressionTextChanged(
      expressionText,
      expressionText.length,
      expressionText.length,
      expressionText.length
    );
    store.getState().onPanelOpened("HISTORY");
  };

  const handleInsertResult = (resultText: string): void => {
    store.getState().onExpressionTextChanged(
      resultText,
      resultText.length,
      resultText.length,
      resultText.length
    );
    store.getState().onPanelOpened("HISTORY");
  };

  return (
    <PanelComponent title="History">
      <PanelSectionComponent heading="Recent calculations">
        {viewModel.historyEntries.length === 0 ? (
          <PanelEmptyStateComponent message="No calculations yet. Press equals to record history." />
        ) : (
          <ul className={cssClass(styles.entryList)} aria-label="Calculation history">
            {viewModel.historyEntries.map((entry) => (
              <li key={entry.id} className={cssClass(styles.entry)}>
                <div className={cssClass(styles.entryText)}>
                  <span className={cssClass(styles.expression)}>
                    {entry.expressionText}
                  </span>
                  <span className={cssClass(styles.result)}>
                    = {entry.resultText}
                  </span>
                </div>
                <div className={cssClass(styles.entryActions)}>
                  <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label={`Insert expression ${entry.expressionText}`}
                    onPress={() => handleInsertExpression(entry.expressionText)}
                  >
                    Insert
                  </AccessibleButtonComponent>
                  <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label={`Insert result ${entry.resultText}`}
                    onPress={() => handleInsertResult(entry.resultText)}
                  >
                    Use result
                  </AccessibleButtonComponent>
                  <AccessibleButtonComponent
                    customClassName={cssClass(styles.deleteButton)}
                    aria-label={`Delete history entry ${entry.expressionText}`}
                    onPress={() => store.getState().onHistoryEntryDeleted(entry.id)}
                  >
                    Delete
                  </AccessibleButtonComponent>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelSectionComponent>

      <div className={cssClass(styles.toolbar)}>
        <AccessibleButtonComponent
          customClassName={cssClass(styles.toolbarButton)}
          onPress={() => store.getState().onHistoryCleared()}
        >
          Clear history
        </AccessibleButtonComponent>
      </div>
    </PanelComponent>
  );
}
