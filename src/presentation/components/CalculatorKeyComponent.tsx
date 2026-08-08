import type { ReactNode } from "react";
import type { PressEvent } from "react-aria-components";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import type { ButtonActivationKind } from "../services/FocusPreservationService";
import { defaultFocusPreservationService } from "../services/DefaultFocusPreservationService";

interface CalculatorKeyComponentProperties {
    readonly ariaLabel: string;
    readonly customClassName: string;
    readonly isExcludedFromTabOrder: boolean;
    readonly onFocus: () => void;
    readonly onPress: (activationKind: ButtonActivationKind) => void;
    readonly registerItemRef: (element: HTMLButtonElement | null) => void;
    readonly children: ReactNode;
}

export function CalculatorKeyComponent(props: CalculatorKeyComponentProperties) {
    const {
        ariaLabel,
        customClassName,
        isExcludedFromTabOrder,
        onFocus,
        onPress,
        registerItemRef,
        children,
    } = props;

    const handlePress = (event: PressEvent): void => {
        const activationKind = defaultFocusPreservationService.resolveActivationKind(
            event.pointerType,
        );

        onPress(activationKind);
    };

    return (
        <AccessibleButtonComponent
            ref={registerItemRef}
            customClassName={customClassName}
            aria-label={ariaLabel}
            excludeFromTabOrder={isExcludedFromTabOrder}
            onFocus={onFocus}
            onPress={handlePress}
        >
            {children}
        </AccessibleButtonComponent>
    );
}
