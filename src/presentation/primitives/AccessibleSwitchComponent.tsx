import type { ReactNode } from "react";
import { Switch, type SwitchProps } from "react-aria-components";
import styles from "../styles/AccessibleSwitchComponent.module.css";

export interface AccessibleSwitchComponentProperties
  extends Omit<SwitchProps, "className"> {
  readonly label: string;
  readonly children?: ReactNode;
}

export function AccessibleSwitchComponent(
  props: AccessibleSwitchComponentProperties
) {
  const { label, children, ...switchProperties } = props;

  return (
    <Switch {...switchProperties} className={styles.switch}>
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span className={styles.label}>{children ?? label}</span>
    </Switch>
  );
}
