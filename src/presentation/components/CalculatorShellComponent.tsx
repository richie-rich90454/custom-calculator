import type { ReactNode } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import { useCalculatorTheme } from "../hooks/useCalculatorTheme";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleDialogComponent } from "../primitives/AccessibleDialogComponent";
import { CalculatorStatusBarComponent } from "./CalculatorStatusBarComponent";
import { CalculatorDisplayComponent } from "./CalculatorDisplayComponent";
import { CalculatorKeypadComponent } from "./CalculatorKeypadComponent";
import { CalculatorAppViewComponent } from "./apps/CalculatorAppViewComponent";
import { CasPanelComponent } from "./CasPanelComponent";
import { CalculusPanelComponent } from "./CalculusPanelComponent";
import { ConstantsPanelComponent } from "./ConstantsPanelComponent";
import { CalculatorFixSciMenuComponent } from "./CalculatorFixSciMenuComponent";
import { CalculatorHomeMenuComponent } from "./CalculatorHomeMenuComponent";
import { CalculatorHyperbolicMenuComponent } from "./CalculatorHyperbolicMenuComponent";
import { CalculatorOptnPanelComponent } from "./CalculatorOptnPanelComponent";
import { CalculatorVariablePromptComponent } from "./CalculatorVariablePromptComponent";
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

    const handlePanelClose = (): void => {
        if (viewModel.activePanel === CalculatorPanelName.VARIABLE_PROMPT) {
            store.getState().onVariablePromptCancelled();
            return;
        }

        store.getState().onPanelOpened(viewModel.activePanel);
    };

    return (
        <div className={cssClass(styles.shell)}>
            <div className={cssClass(styles.calculator)}>
                <CalculatorStatusBarComponent />

                <div className={cssClass(styles.main)}>
                    {viewModel.activeAppMode === "calculate" ? (
                        <>
                            <CalculatorDisplayComponent />
                            <CalculatorKeypadComponent />
                        </>
                    ) : (
                        <CalculatorAppViewComponent />
                    )}
                </div>
            </div>

            <AccessibleDialogComponent
                title={panelDescriptor.title}
                isOpen={viewModel.activePanel !== CalculatorPanelName.NONE}
                onClose={handlePanelClose}
            >
                {panelDescriptor.content}
            </AccessibleDialogComponent>
        </div>
    );
}

function resolvePanelDescriptor(activePanel: CalculatorPanelName): PanelDescriptor {
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
        case CalculatorPanelName.CALCULUS:
            return { title: "Calculus", content: <CalculusPanelComponent /> };
        case CalculatorPanelName.HOME_MENU:
            return { title: "Apps", content: <CalculatorHomeMenuComponent /> };
        case CalculatorPanelName.OPTN:
            return { title: "Options", content: <CalculatorOptnPanelComponent /> };
        case CalculatorPanelName.VARIABLE_PROMPT:
            return {
                title: "Enter Variable Values",
                content: <CalculatorVariablePromptComponent />,
            };
        case CalculatorPanelName.HYPERBOLIC:
            return {
                title: "Hyperbolic Functions",
                content: <CalculatorHyperbolicMenuComponent />,
            };
        case CalculatorPanelName.FIX_SCI:
            return { title: "Display Format", content: <CalculatorFixSciMenuComponent /> };
        default:
            return { title: "Panel", content: null };
    }
}
