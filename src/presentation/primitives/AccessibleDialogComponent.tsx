import type { ReactNode } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { AccessibleButtonComponent } from "./AccessibleButtonComponent";
import styles from "../styles/AccessibleDialogComponent.module.css";

export interface AccessibleDialogComponentProperties {
  readonly title: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

export function AccessibleDialogComponent(
  props: AccessibleDialogComponentProperties
) {
  return (
    <ModalOverlay
      isOpen={props.isOpen}
      className={styles.overlay}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          props.onClose();
        }
      }}
    >
      <Modal className={styles.modal}>
        <Dialog className={styles.dialog} aria-label={props.title}>
          <h2 className={styles.title}>{props.title}</h2>
          <div className={styles.content}>{props.children}</div>
          <div className={styles.footer}>
            <AccessibleButtonComponent
              customClassName={styles.closeButton}
              onPress={props.onClose}
            >
              Close
            </AccessibleButtonComponent>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
