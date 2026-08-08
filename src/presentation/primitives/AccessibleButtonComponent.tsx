import type { ReactNode, Ref } from "react";
import { Button, type ButtonProps } from "react-aria-components";
import styles from "../styles/AccessibleButtonComponent.module.css";

export interface AccessibleButtonComponentProperties
  extends Omit<ButtonProps, "className"> {
  readonly children: ReactNode;
  readonly customClassName?: string;
  readonly ref?: Ref<HTMLButtonElement>;
}

export function AccessibleButtonComponent(
  props: AccessibleButtonComponentProperties
) {
  const { children, customClassName, ref, ...buttonProperties } = props;

  const mergedClassName = [styles.button, customClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <Button {...buttonProperties} ref={ref} className={mergedClassName}>
      {children}
    </Button>
  );
}
