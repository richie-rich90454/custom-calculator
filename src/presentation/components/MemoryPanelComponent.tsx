import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { PanelComponent } from "../primitives/PanelComponent";
import { PanelEmptyStateComponent } from "../primitives/PanelEmptyStateComponent";
import { PanelSectionComponent } from "../primitives/PanelSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/MemoryPanelComponent.module.css";

export function MemoryPanelComponent() {
    const { store } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();

    return (
        <PanelComponent title="Memory">
            <PanelSectionComponent heading="Stored value">
                {viewModel.hasMemory ? (
                    <div className={cssClass(styles.valueBox)} aria-live="polite">
                        <span className={cssClass(styles.memoryValue)}>
                            {viewModel.memoryValueText}
                        </span>
                    </div>
                ) : (
                    <PanelEmptyStateComponent message="Memory is empty." />
                )}
            </PanelSectionComponent>

            <PanelSectionComponent heading="Memory operations">
                <div className={cssClass(styles.buttonGrid)}>
                    <AccessibleButtonComponent
                        customClassName={cssClass(styles.memoryButton)}
                        aria-label="Add current result to memory"
                        onPress={() => store.getState().onMemoryAddPressed()}
                        isDisabled={viewModel.resultText === null}
                    >
                        M+
                    </AccessibleButtonComponent>
                    <AccessibleButtonComponent
                        customClassName={cssClass(styles.memoryButton)}
                        aria-label="Subtract current result from memory"
                        onPress={() => store.getState().onMemorySubtractPressed()}
                        isDisabled={viewModel.resultText === null}
                    >
                        M−
                    </AccessibleButtonComponent>
                    <AccessibleButtonComponent
                        customClassName={cssClass(styles.memoryButton)}
                        aria-label="Recall memory value"
                        onPress={() => store.getState().onMemoryRecallPressed()}
                        isDisabled={!viewModel.hasMemory}
                    >
                        MR
                    </AccessibleButtonComponent>
                    <AccessibleButtonComponent
                        customClassName={cssClass(styles.memoryButton)}
                        aria-label="Clear memory"
                        onPress={() => store.getState().onMemoryClearPressed()}
                        isDisabled={!viewModel.hasMemory}
                    >
                        MC
                    </AccessibleButtonComponent>
                </div>
            </PanelSectionComponent>

            <p className={cssClass(styles.hintText)}>
                M+ adds the current result to memory. M− subtracts it. MR inserts the memory value
                into the expression.
            </p>
        </PanelComponent>
    );
}
