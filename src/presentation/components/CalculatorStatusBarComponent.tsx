import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { NumericMode } from "../../domain/model/NumericMode";
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

    const status = viewModel.status;

    return (
        <div className={cssClass(styles.statusBar)}>
            <div className={cssClass(styles.indicators)}>
                <span className={cssClass(styles.appName)} aria-label="Active app">
                    {status.activeAppName}
                </span>

                <AccessibleButtonComponent
                    customClassName={cssClass(styles.angleButton)}
                    aria-label="Cycle angle mode"
                    onPress={() => store.getState().onAngleModeTogglePressed()}
                >
                    {status.angleModeLabel}
                </AccessibleButtonComponent>

                <span className={cssClass(styles.modeLabel)} aria-label="Numeric format">
                    {resolveNumericModeLabel(status.numericMode)}
                </span>

                <span
                    className={joinClassNames(
                        styles.modifierIndicator,
                        status.shiftArmed ? styles.modifierIndicatorActive : undefined,
                    )}
                    aria-label={status.shiftArmed ? "Shift layer armed" : "Shift layer"}
                >
                    △ SHIFT
                </span>

                <span
                    className={joinClassNames(
                        styles.modifierIndicator,
                        status.alphaArmed ? styles.modifierIndicatorActive : undefined,
                    )}
                    aria-label={status.alphaArmed ? "Alpha layer armed" : "Alpha layer"}
                >
                    α ALPHA
                </span>

                {status.hasMemory ? (
                    <span
                        className={cssClass(styles.flagIndicator)}
                        aria-label="Memory contains a value"
                    >
                        M
                    </span>
                ) : null}

                {status.casEnabled ? (
                    <span className={cssClass(styles.flagIndicator)} aria-label="CAS enabled">
                        CAS
                    </span>
                ) : null}

                {status.complexNumbersEnabled ? (
                    <span
                        className={cssClass(styles.flagIndicator)}
                        aria-label="Complex numbers enabled"
                    >
                        CMPLX
                    </span>
                ) : null}

                {!status.bigIntSupported ? (
                    <span className={cssClass(styles.warningIndicator)} role="status">
                        BIG-INT UNAVAILABLE
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
                                isActive ? styles.panelButtonActive : undefined,
                            )}
                            aria-label={button.ariaLabel}
                            aria-pressed={isActive}
                            onPress={() => store.getState().onPanelOpened(button.panelName)}
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

function resolveNumericModeLabel(numericMode: NumericMode): string {
    switch (numericMode) {
        case NumericMode.EXACT_DECIMAL:
            return "EXACT";
        case NumericMode.FRACTION:
            return "FRAC";
        case NumericMode.BIGINT:
            return "BIG";
        default:
            return "NORM";
    }
}
