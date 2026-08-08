import type { CalculatorKeyDefinition } from "../services/CalculatorKeyDefinition";
import { CalculatorKeypadGridSectionComponent } from "./CalculatorKeypadGridSectionComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorKeypadComponent.module.css";

interface CalculatorCalculusControlPadComponentProperties {
  readonly keys: readonly CalculatorKeyDefinition[];
  readonly onKeyPressed: (key: CalculatorKeyDefinition) => void;
}

/**
 * Renders the calculus shortcut keys on the main keypad.
 *
 * The pad is always rendered because calculus operations are always
 * available, unlike CAS operations which require an explicit setting.
 */
export function CalculatorCalculusControlPadComponent(
  props: CalculatorCalculusControlPadComponentProperties
) {
  return (
    <CalculatorKeypadGridSectionComponent
      sectionClassName={cssClass(styles.calculusArea)}
      gridLabel="Calculus operations"
      keys={props.keys}
      columnCount={4}
      resolveKeyClassName={() => cssClass(styles.calculusKey)}
      onKeyPressed={props.onKeyPressed}
    />
  );
}
