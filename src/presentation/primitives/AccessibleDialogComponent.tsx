import type { ReactNode } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { AccessibleButtonComponent } from "./AccessibleButtonComponent";
import { cssClass } from "../utils/classNames";
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
      className={cssClass(styles.overlay)}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          props.onClose();
        }
      }}
    >
      <Modal className={cssClass(styles.modal)}>
        <Dialog className={cssClass(styles.dialog)} aria-label={props.title}>
          <div className={cssClass(styles.content)}>{props.children}</div>
          <div className={cssClass(styles.footer)}>
            <AccessibleButtonComponent
              customClassName={cssClass(styles.closeButton)}
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
