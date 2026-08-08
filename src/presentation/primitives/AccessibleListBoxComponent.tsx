import type { ReactNode } from "react";
import { ListBox, ListBoxItem } from "react-aria-components";
import styles from "../styles/AccessibleListBoxComponent.module.css";

export interface AccessibleListBoxEntry {
  readonly id: string;
  readonly primaryText: string;
  readonly secondaryText?: string;
}

export interface AccessibleListBoxComponentProperties {
  readonly label: string;
  readonly entries: readonly AccessibleListBoxEntry[];
  readonly onEntrySelected: (entryId: string) => void;
  readonly renderEntryActions?: (entryId: string) => ReactNode;
}

export function AccessibleListBoxComponent(
  props: AccessibleListBoxComponentProperties
) {
  return (
    <ListBox
      aria-label={props.label}
      className={styles.listBox}
      selectionMode="single"
      onAction={(key) => {
        props.onEntrySelected(String(key));
      }}
    >
      {props.entries.map((entry) => (
        <ListBoxItem
          key={entry.id}
          id={entry.id}
          textValue={entry.primaryText}
          className={styles.item}
        >
          <div className={styles.itemContent}>
            <span className={styles.primaryText}>{entry.primaryText}</span>
            {entry.secondaryText !== undefined ? (
              <span className={styles.secondaryText}>
                {entry.secondaryText}
              </span>
            ) : null}
          </div>
          {props.renderEntryActions !== undefined
            ? props.renderEntryActions(entry.id)
            : null}
        </ListBoxItem>
      ))}
    </ListBox>
  );
}
