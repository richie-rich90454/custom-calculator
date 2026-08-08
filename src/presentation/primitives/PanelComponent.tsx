import type { ReactNode } from "react";
import { cssClass } from "../utils/classNames";
import styles from "../styles/PanelPrimitives.module.css";

interface PanelComponentProperties {
    readonly title: string;
    readonly children: ReactNode;
}

/**
 * Shared panel shell used by every calculator side panel.
 *
 * All panels share the same surface, spacing, header, and scroll behavior so
 * the app reads as one coherent instrument rather than a collection of ad hoc
 * dialogs.
 */
export function PanelComponent(props: PanelComponentProperties) {
    return (
        <section className={cssClass(styles.panel)} aria-label={props.title}>
            <header className={cssClass(styles.panelHeader)}>
                <h2 className={cssClass(styles.panelTitle)}>{props.title}</h2>
            </header>
            <div className={cssClass(styles.panelBody)}>{props.children}</div>
        </section>
    );
}
