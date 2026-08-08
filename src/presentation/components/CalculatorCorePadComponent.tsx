import type { CalculatorKeyDefinition } from "../services/CalculatorKeyDefinition";
import { CalculatorKeyKind } from "../services/CalculatorKeyDefinition";
import type { ButtonActivationKind } from "../services/FocusPreservationService";
import { CalculatorKeypadGridSectionComponent } from "./CalculatorKeypadGridSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorKeypadComponent.module.css";

interface CalculatorCorePadComponentProperties {
    readonly keys: readonly CalculatorKeyDefinition[];
    readonly onKeyPressed: (
        key: CalculatorKeyDefinition,
        activationKind: ButtonActivationKind,
    ) => void;
}

export function CalculatorCorePadComponent(props: CalculatorCorePadComponentProperties) {
    return (
        <CalculatorKeypadGridSectionComponent
            sectionClassName={cssClass(styles.coreArea)}
            gridLabel="Calculator keypad"
            keys={props.keys}
            columnCount={5}
            resolveKeyClassName={resolveCoreKeyClassName}
            onKeyPressed={props.onKeyPressed}
        />
    );
}

function resolveCoreKeyClassName(key: CalculatorKeyDefinition): string {
    if (key.kind === CalculatorKeyKind.EVALUATE) {
        return cssClass(styles.equalsKey);
    }

    if (
        key.kind === CalculatorKeyKind.CLEAR ||
        key.kind === CalculatorKeyKind.DELETE_BACKWARD ||
        key.kind === CalculatorKeyKind.MEMORY_RECALL
    ) {
        return cssClass(styles.utilityKey);
    }

    if (key.kind === CalculatorKeyKind.OPERATOR) {
        return cssClass(styles.operatorKey);
    }

    if (key.kind === CalculatorKeyKind.CONSTANT || key.kind === CalculatorKeyKind.ANS) {
        return cssClass(styles.symbolKey);
    }

    return cssClass(styles.digitKey);
}
