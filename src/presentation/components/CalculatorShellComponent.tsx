import type { ReactNode } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import { useCalculatorTheme } from "../hooks/useCalculatorTheme";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleDialogComponent } from "../primitives/AccessibleDialogComponent";
import { CalculatorStatusBarComponent } from "./CalculatorStatusBarComponent";
import { CalculatorDisplayComponent } from "./CalculatorDisplayComponent";
import { CalculatorKeypadComponent } from "./CalculatorKeypadComponent";
import { CasPanelComponent } from "./CasPanelComponent";
import { ConstantsPanelComponent } from "./ConstantsPanelComponent";
import { HistoryPanelComponent } from "./HistoryPanelComponent";
import { MemoryPanelComponent } from "./MemoryPanelComponent";
import { SettingsPanelComponent } from "./SettingsPanelComponent";
import { VariablesPanelComponent } from "./VariablesPanelComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorShellComponent.module.css";

interface PanelDescriptor {
  readonly title: string;
  readonly content: ReactNode;
}

export function CalculatorShellComponent() {
  useCalculatorTheme();

  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();

  const panelDescriptor = resolvePanelDescriptor(viewModel.activePanel);

  return (
    <div className={cssClass(styles.shell)}>
      <div className={cssClass(styles.calculator)}>
        <CalculatorStatusBarComponent />

        <div className={cssClass(styles.main)}>
          <CalculatorDisplayComponent />
          <CalculatorKeypadComponent />
        </div>
      </div>

      <AccessibleDialogComponent
        title={panelDescriptor.title}
        isOpen={viewModel.activePanel !== CalculatorPanelName.NONE}
        onClose={() =>
          store.getState().onPanelOpened(viewModel.activePanel)
        }
      >
        {panelDescriptor.content}
      </AccessibleDialogComponent>
    </div>
  );
}

function resolvePanelDescriptor(
  activePanel: CalculatorPanelName
): PanelDescriptor {
  switch (activePanel) {
    case CalculatorPanelName.HISTORY:
      return { title: "History", content: <HistoryPanelComponent /> };
    case CalculatorPanelName.CONSTANTS:
      return { title: "Constants", content: <ConstantsPanelComponent /> };
    case CalculatorPanelName.VARIABLES:
      return { title: "Variables", content: <VariablesPanelComponent /> };
    case CalculatorPanelName.MEMORY:
      return { title: "Memory", content: <MemoryPanelComponent /> };
    case CalculatorPanelName.SETTINGS:
      return { title: "Settings", content: <SettingsPanelComponent /> };
    case CalculatorPanelName.CAS:
      return { title: "CAS", content: <CasPanelComponent /> };
    default:
      return { title: "Panel", content: null };
  }
}
