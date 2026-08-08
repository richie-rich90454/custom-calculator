import { cssClass } from "../utils/classNames";
import styles from "../styles/PanelPrimitives.module.css";

interface PanelEmptyStateComponentProperties {
  readonly message: string;
}

/**
 * Consistent empty state message shown when a panel has no content.
 */
export function PanelEmptyStateComponent(
  props: PanelEmptyStateComponentProperties
) {
  return (
    <div className={cssClass(styles.emptyState)}>
      <p className={cssClass(styles.emptyMessage)}>{props.message}</p>
    </div>
  );
}
