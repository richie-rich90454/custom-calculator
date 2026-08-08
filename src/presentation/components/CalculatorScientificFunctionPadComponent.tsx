import type { CalculatorKeyDefinition } from "../services/CalculatorKeyDefinition";
import type { ButtonActivationKind } from "../services/FocusPreservationService";
import { CalculatorKeypadGridSectionComponent } from "./CalculatorKeypadGridSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorKeypadComponent.module.css";

interface CalculatorScientificFunctionPadComponentProperties {
    readonly keys: readonly CalculatorKeyDefinition[];
    readonly onKeyPressed: (
        key: CalculatorKeyDefinition,
        activationKind: ButtonActivationKind,
    ) => void;
}

export function CalculatorScientificFunctionPadComponent(
    props: CalculatorScientificFunctionPadComponentProperties,
) {
    return (
        <CalculatorKeypadGridSectionComponent
            sectionClassName={cssClass(styles.functionArea)}
            gridLabel="Scientific functions"
            keys={props.keys}
            columnCount={6}
            resolveKeyClassName={() => cssClass(styles.functionKey)}
            onKeyPressed={props.onKeyPressed}
        />
    );
}
