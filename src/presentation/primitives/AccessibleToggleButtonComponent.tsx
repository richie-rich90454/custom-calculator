import type { ReactNode } from "react";
import { ToggleButton, type ToggleButtonProps } from "react-aria-components";
import styles from "../styles/AccessibleToggleButtonComponent.module.css";

export interface AccessibleToggleButtonComponentProperties
  extends Omit<ToggleButtonProps, "className"> {
  readonly children: ReactNode;
  readonly customClassName?: string;
}

export function AccessibleToggleButtonComponent(
  props: AccessibleToggleButtonComponentProperties
) {
  const { children, customClassName, ...toggleButtonProperties } = props;

  const mergedClassName = [styles.toggleButton, customClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <ToggleButton
      {...toggleButtonProperties}
      className={mergedClassName}
    >
      {children}
    </ToggleButton>
  );
}
