import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorResultLineComponent.module.css";

interface CalculatorResultLineComponentProperties {
  readonly resultText: string | null;
}

export function CalculatorResultLineComponent(
  props: CalculatorResultLineComponentProperties
) {
  const { resultText } = props;

  return (
    <div className={cssClass(styles.resultRow)}>
      {resultText !== null ? (
        <output className={cssClass(styles.result)} aria-live="polite">
          = {resultText}
        </output>
      ) : null}
    </div>
  );
}
