import type { ReactNode } from "react";
import { Switch, type SwitchProps } from "react-aria-components";
import { cssClass } from "../utils/classNames";
import styles from "../styles/AccessibleSwitchComponent.module.css";

export interface AccessibleSwitchComponentProperties extends Omit<SwitchProps, "className"> {
    readonly label: string;
    readonly children?: ReactNode;
}

export function AccessibleSwitchComponent(props: AccessibleSwitchComponentProperties) {
    const { label, children, ...switchProperties } = props;

    return (
        <Switch {...switchProperties} className={cssClass(styles.switch)}>
            <span className={cssClass(styles.track)}>
                <span className={cssClass(styles.thumb)} />
            </span>
            <span className={cssClass(styles.label)}>{children ?? label}</span>
        </Switch>
    );
}
