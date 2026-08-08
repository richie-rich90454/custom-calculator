import type { ReactNode } from "react";
import { cssClass } from "../utils/classNames";
import styles from "../styles/PanelPrimitives.module.css";

interface PanelSectionComponentProperties {
  readonly heading: string;
  readonly children: ReactNode;
}

/**
 * Consistent titled section used to group content inside a panel.
 */
export function PanelSectionComponent(
  props: PanelSectionComponentProperties
) {
  return (
    <section className={cssClass(styles.section)}>
      <h3 className={cssClass(styles.sectionHeading)}>{props.heading}</h3>
      {props.children}
    </section>
  );
}
