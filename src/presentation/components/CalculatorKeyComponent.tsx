import type { ReactNode } from "react";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";

interface CalculatorKeyComponentProperties {
  readonly ariaLabel: string;
  readonly customClassName: string;
  readonly isExcludedFromTabOrder: boolean;
  readonly onFocus: () => void;
  readonly onPress: () => void;
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

  return (
    <AccessibleButtonComponent
      ref={registerItemRef}
      customClassName={customClassName}
      aria-label={ariaLabel}
      excludeFromTabOrder={isExcludedFromTabOrder}
      onFocus={onFocus}
      onPress={onPress}
    >
      {children}
    </AccessibleButtonComponent>
  );
}
