import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { cssClass, joinClassNames } from "../utils/classNames";
import styles from "../styles/CalculatorStatusBarComponent.module.css";

interface PanelButtonDefinition {
  readonly panelName: string;
  readonly label: string;
  readonly ariaLabel: string;
}

const PANEL_BUTTONS: readonly PanelButtonDefinition[] = [
  { panelName: "HISTORY", label: "History", ariaLabel: "Open history panel" },
  { panelName: "CONSTANTS", label: "Constants", ariaLabel: "Open constants panel" },
  { panelName: "VARIABLES", label: "Variables", ariaLabel: "Open variables panel" },
  { panelName: "MEMORY", label: "Memory", ariaLabel: "Open memory panel" },
  { panelName: "SETTINGS", label: "Settings", ariaLabel: "Open settings panel" },
  { panelName: "CAS", label: "CAS", ariaLabel: "Open CAS panel" },
  { panelName: "CALCULUS", label: "Calculus", ariaLabel: "Open calculus panel" },
];

export function CalculatorStatusBarComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();

  return (
    <div className={cssClass(styles.statusBar)}>
      <div className={cssClass(styles.modes)}>
        <AccessibleButtonComponent
          customClassName={cssClass(styles.angleButton)}
          aria-label="Cycle angle mode"
          onPress={() => store.getState().onAngleModeTogglePressed()}
        >
          {viewModel.angleMode}
        </AccessibleButtonComponent>

        <span className={cssClass(styles.modeLabel)} aria-label="Numeric mode">
          {viewModel.numericMode}
        </span>

        {viewModel.hasMemory ? (
          <span className={cssClass(styles.memoryIndicator)} aria-label="Memory contains a value">
            M
          </span>
        ) : null}
      </div>

      <div className={cssClass(styles.panelButtons)}>
        {PANEL_BUTTONS.map((button) => {
          const isActive = viewModel.activePanel === button.panelName;

          return (
            <AccessibleButtonComponent
              key={button.panelName}
              customClassName={joinClassNames(
                styles.panelButton,
                isActive ? styles.panelButtonActive : undefined
              )}
              aria-label={button.ariaLabel}
              aria-pressed={isActive}
              onPress={() =>
                store.getState().onPanelOpened(button.panelName)
              }
            >
              {button.label}
            </AccessibleButtonComponent>
          );
        })}
      </div>

      {viewModel.statusMessage !== null ? (
        <p className={cssClass(styles.statusMessage)} role="status">
          {viewModel.statusMessage}
        </p>
      ) : null}
    </div>
  );
}
