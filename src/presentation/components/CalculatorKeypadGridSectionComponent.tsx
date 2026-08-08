import type { CalculatorKeyDefinition } from "../services/CalculatorKeyDefinition";
import type { ButtonActivationKind } from "../services/FocusPreservationService";
import { useKeypadGridNavigation } from "../hooks/useKeypadGridNavigation";
import { CalculatorKeyComponent } from "./CalculatorKeyComponent";
import { cssClass } from "../utils/classNames";

interface CalculatorKeypadGridSectionComponentProperties {
    readonly sectionClassName: string;
    readonly gridLabel: string;
    readonly keys: readonly CalculatorKeyDefinition[];
    readonly columnCount: number;
    readonly resolveKeyClassName: (key: CalculatorKeyDefinition) => string;
    readonly onKeyPressed: (
        key: CalculatorKeyDefinition,
        activationKind: ButtonActivationKind,
    ) => void;
}

export function CalculatorKeypadGridSectionComponent(
    props: CalculatorKeypadGridSectionComponentProperties,
) {
    const itemIds = props.keys.map((key) => key.id);
    const navigation = useKeypadGridNavigation(itemIds, props.columnCount);

    return (
        <div
            role="grid"
            aria-label={props.gridLabel}
            className={cssClass(props.sectionClassName)}
            tabIndex={-1}
            onKeyDown={navigation.handleGridKeyDown}
        >
            {props.keys.map((key) => (
                <CalculatorKeyComponent
                    key={key.id}
                    registerItemRef={(element) => navigation.registerItemRef(key.id, element)}
                    customClassName={props.resolveKeyClassName(key)}
                    ariaLabel={key.ariaLabel}
                    isExcludedFromTabOrder={navigation.getTabIndex(key.id) === -1}
                    onFocus={() => navigation.handleItemFocus(key.id)}
                    onPress={(activationKind) => props.onKeyPressed(key, activationKind)}
                >
                    {key.label}
                </CalculatorKeyComponent>
            ))}
        </div>
    );
}
