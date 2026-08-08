import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorCaretIndicatorComponent.module.css";

/**
 * Renders a blinking block caret used by the expression editor.
 *
 * The indicator is purely decorative and aria-hidden because the native
 * input caret remains the authoritative editing cursor.
 */
export function CalculatorCaretIndicatorComponent() {
  return (
    <span
      aria-hidden="true"
      className={cssClass(styles.caretIndicator)}
    />
  );
}
