import type { ReactNode } from "react";
import type { PressEvent } from "react-aria-components";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import type { ButtonActivationKind } from "../services/FocusPreservationService";
import { defaultFocusPreservationService } from "../services/DefaultFocusPreservationService";
import type { KeyDefinition, KeyLayerDefinition } from "../services/KeyDefinition";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { cssClass, joinClassNames } from "../utils/classNames";
import styles from "../styles/CalculatorKeycapComponent.module.css";

interface CalculatorKeycapComponentProperties {
    readonly keyDefinition: KeyDefinition;
    readonly armedLayer: ModifierLayer;
    readonly customClassName?: string;
    readonly isExcludedFromTabOrder?: boolean;
    readonly onFocus: () => void;
    readonly onPress: (activationKind: ButtonActivationKind) => void;
    readonly registerItemRef: (element: HTMLButtonElement | null) => void;
    readonly children?: ReactNode;
}

export function CalculatorKeycapComponent(props: CalculatorKeycapComponentProperties) {
    const {
        keyDefinition,
        armedLayer,
        customClassName,
        isExcludedFromTabOrder = false,
        onFocus,
        onPress,
        registerItemRef,
    } = props;

    const activeLayer = resolveActiveLayer(keyDefinition, armedLayer);
    const hasShiftLayer = keyDefinition.shift !== undefined;
    const hasAlphaLayer = keyDefinition.alpha !== undefined;

    const handlePress = (event: PressEvent): void => {
        const activationKind = defaultFocusPreservationService.resolveActivationKind(
            event.pointerType,
        );

        onPress(activationKind);
    };

    return (
        <AccessibleButtonComponent
            ref={registerItemRef}
            customClassName={joinClassNames(styles.keycap, customClassName)}
            aria-label={resolveAriaLabel(keyDefinition, activeLayer, armedLayer)}
            excludeFromTabOrder={isExcludedFromTabOrder}
            preventFocusOnPress
            onFocus={onFocus}
            onPress={handlePress}
        >
            {hasShiftLayer ? (
                <span
                    className={joinClassNames(
                        styles.shiftLabel,
                        armedLayer === ModifierLayer.SHIFT ? styles.shiftLabelActive : undefined,
                    )}
                >
                    {keyDefinition.shift?.label}
                </span>
            ) : null}
            {hasAlphaLayer ? (
                <span
                    className={joinClassNames(
                        styles.alphaLabel,
                        armedLayer === ModifierLayer.ALPHA ? styles.alphaLabelActive : undefined,
                    )}
                >
                    {keyDefinition.alpha?.label}
                </span>
            ) : null}
            <span className={cssClass(styles.primaryLabel)}>{activeLayer.label}</span>
        </AccessibleButtonComponent>
    );
}

function resolveActiveLayer(
    keyDefinition: KeyDefinition,
    armedLayer: ModifierLayer,
): KeyLayerDefinition {
    if (armedLayer === ModifierLayer.SHIFT && keyDefinition.shift !== undefined) {
        return keyDefinition.shift;
    }

    if (armedLayer === ModifierLayer.ALPHA && keyDefinition.alpha !== undefined) {
        return keyDefinition.alpha;
    }

    return keyDefinition.primary;
}

function resolveAriaLabel(
    keyDefinition: KeyDefinition,
    activeLayer: KeyLayerDefinition,
    armedLayer: ModifierLayer,
): string {
    if (armedLayer === ModifierLayer.NONE || activeLayer === keyDefinition.primary) {
        return activeLayer.ariaLabel;
    }

    const layerName = armedLayer === ModifierLayer.SHIFT ? "shift" : "alpha";

    return `${activeLayer.ariaLabel}, ${layerName} layer`;
}
