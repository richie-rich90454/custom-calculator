import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorCaretIndicatorComponent.module.css";

interface CalculatorCaretIndicatorComponentProperties {
  readonly offsetX: number;
}

/**
 * Renders a blinking block caret used by the expression editor.
 *
 * The indicator is positioned at the offset of the text that precedes the
 * cursor, so the synthetic caret always matches the logical cursor position.
 * It is aria-hidden because the native input caret remains the authoritative
 * editing cursor whenever the editor is focused.
 */
export function CalculatorCaretIndicatorComponent(
  props: CalculatorCaretIndicatorComponentProperties
) {
  return (
    <span
      aria-hidden="true"
      data-testid="caret-indicator"
      className={cssClass(styles.caretIndicator)}
      style={{ left: props.offsetX }}
    />
  );
}
