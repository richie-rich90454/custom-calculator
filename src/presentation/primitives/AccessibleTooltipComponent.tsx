import type { ReactNode } from "react";
import { Tooltip, TooltipTrigger, OverlayArrow } from "react-aria-components";
import styles from "./AccessibleTooltipComponent.module.css";

export interface AccessibleTooltipComponentProperties {
  readonly children: ReactNode;
  readonly content: string;
}

export function AccessibleTooltipComponent(
  props: AccessibleTooltipComponentProperties
) {
  return (
    <TooltipTrigger>
      {props.children}
      <Tooltip className={styles.tooltip} placement="top">
        <OverlayArrow className={styles.arrow}>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        {props.content}
      </Tooltip>
    </TooltipTrigger>
  );
}
