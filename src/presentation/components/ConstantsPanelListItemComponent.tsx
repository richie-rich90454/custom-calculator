import type { ScientificConstant } from "../../domain/model/ScientificConstant";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/ConstantsPanelComponent.module.css";

interface ConstantsPanelListItemComponentProperties {
  readonly constant: ScientificConstant;
  readonly onInsert: (constantId: string) => void;
}

export function ConstantsPanelListItemComponent(
  props: ConstantsPanelListItemComponentProperties
) {
  const { constant, onInsert } = props;
  const valuePreview = `${constant.value}${
    constant.unit !== null ? ` ${constant.unit}` : ""
  }`;

  return (
    <li className={cssClass(styles.constantEntry)}>
      <div className={cssClass(styles.constantText)}>
        <span className={cssClass(styles.constantSymbol)}>
          {constant.symbol}
        </span>
        <span className={cssClass(styles.constantName)}>{constant.name}</span>
        <span className={cssClass(styles.constantValue)}>{valuePreview}</span>
      </div>
      <AccessibleButtonComponent
        customClassName={cssClass(styles.insertButton)}
        aria-label={`Insert constant ${constant.name}`}
        onPress={() => onInsert(constant.id)}
      >
        Insert
      </AccessibleButtonComponent>
    </li>
  );
}
