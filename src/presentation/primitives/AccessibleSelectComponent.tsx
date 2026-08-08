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
import { cssClass } from "../utils/classNames";
import styles from "../styles/AccessibleSelectComponent.module.css";

export interface AccessibleSelectOption {
    readonly id: string;
    readonly label: string;
}

export interface AccessibleSelectComponentProperties extends Omit<
    SelectProps<string>,
    "className"
> {
    readonly label: string;
    readonly options: readonly AccessibleSelectOption[];
}

export function AccessibleSelectComponent(props: AccessibleSelectComponentProperties) {
    const { label, options, ...selectProperties } = props;

    return (
        <Select {...selectProperties} className={cssClass(styles.select)}>
            <Label className={cssClass(styles.label)}>{label}</Label>
            <Button className={cssClass(styles.trigger)}>
                <SelectValue className={cssClass(styles.value)} />
                <span aria-hidden="true" className={cssClass(styles.indicator)}>
                    ▾
                </span>
            </Button>
            <Popover className={cssClass(styles.popover)}>
                <ListBox className={cssClass(styles.listBox)}>
                    {options.map((option) => (
                        <ListBoxItem
                            key={option.id}
                            id={option.id}
                            className={cssClass(styles.item)}
                        >
                            {option.label}
                        </ListBoxItem>
                    ))}
                </ListBox>
            </Popover>
        </Select>
    );
}
