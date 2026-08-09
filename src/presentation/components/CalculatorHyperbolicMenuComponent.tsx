import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorHyperbolicMenuComponent.module.css";

interface HyperbolicFunctionDefinition {
    readonly functionName: string;
    readonly label: string;
}

const HYPERBOLIC_FUNCTIONS: readonly HyperbolicFunctionDefinition[] = [
    { functionName: "sinh", label: "sinh" },
    { functionName: "cosh", label: "cosh" },
    { functionName: "tanh", label: "tanh" },
    { functionName: "csch", label: "csch" },
    { functionName: "sech", label: "sech" },
    { functionName: "coth", label: "coth" },
];

const INVERSE_HYPERBOLIC_FUNCTIONS: readonly HyperbolicFunctionDefinition[] = [
    { functionName: "asinh", label: "asinh" },
    { functionName: "acosh", label: "acosh" },
    { functionName: "atanh", label: "atanh" },
    { functionName: "acsch", label: "acsch" },
    { functionName: "asech", label: "asech" },
    { functionName: "acoth", label: "acoth" },
];

export function CalculatorHyperbolicMenuComponent() {
    const { store } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();

    const functions = viewModel.hyperbolicMenuInverse
        ? INVERSE_HYPERBOLIC_FUNCTIONS
        : HYPERBOLIC_FUNCTIONS;

    const handleFunctionSelected = (functionName: string): void => {
        store.getState().onInsertFunctionPressed(functionName);
        store.getState().onPanelOpened(CalculatorPanelName.HYPERBOLIC);
    };

    return (
        <div className={cssClass(styles.menu)}>
            <h3 className={cssClass(styles.heading)}>
                {viewModel.hyperbolicMenuInverse
                    ? "Inverse hyperbolic functions"
                    : "Hyperbolic functions"}
            </h3>
            <div className={cssClass(styles.grid)}>
                {functions.map((definition) => (
                    <AccessibleButtonComponent
                        key={definition.functionName}
                        customClassName={cssClass(styles.functionButton)}
                        aria-label={`Insert ${definition.functionName}`}
                        onPress={() => handleFunctionSelected(definition.functionName)}
                    >
                        {definition.label}
                    </AccessibleButtonComponent>
                ))}
            </div>
        </div>
    );
}
