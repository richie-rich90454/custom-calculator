import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  type SelectProps,
} from "react-aria-components";
import styles from "../styles/AccessibleSelectComponent.module.css";

export interface AccessibleSelectOption {
  readonly id: string;
  readonly label: string;
}

export interface AccessibleSelectComponentProperties
  extends Omit<SelectProps<string>, "className"> {
  readonly label: string;
  readonly options: readonly AccessibleSelectOption[];
}

export function AccessibleSelectComponent(
  props: AccessibleSelectComponentProperties
) {
  const { label, options, ...selectProperties } = props;

  return (
    <Select {...selectProperties} className={styles.select}>
      <Label className={styles.label}>{label}</Label>
      <Button className={styles.trigger}>
        <SelectValue className={styles.value} />
        <span aria-hidden="true" className={styles.indicator}>
          ▾
        </span>
      </Button>
      <Popover className={styles.popover}>
        <ListBox className={styles.listBox}>
          {options.map((option) => (
            <ListBoxItem
              key={option.id}
              id={option.id}
              className={styles.item}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}
