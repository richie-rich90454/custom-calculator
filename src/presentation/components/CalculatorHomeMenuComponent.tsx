import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { CalculatorAppIconComponent } from "./CalculatorAppIconComponent";
import { cssClass, joinClassNames } from "../utils/classNames";
import styles from "../styles/CalculatorHomeMenuComponent.module.css";

export function CalculatorHomeMenuComponent() {
    const { store } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();

    return (
        <div className={cssClass(styles.homeMenu)} role="group" aria-label="App menu">
            {viewModel.appModes.map((app) => {
                const isActive = app.id === viewModel.activeAppMode;

                return (
                    <AccessibleButtonComponent
                        key={app.id}
                        customClassName={joinClassNames(
                            styles.appCell,
                            isActive ? styles.appCellActive : undefined,
                        )}
                        aria-label={app.ariaLabel}
                        aria-pressed={isActive}
                        onPress={() => store.getState().onAppModeSelected(app.id)}
                    >
                        <span className={cssClass(styles.badge)}>{app.badge}</span>
                        <span className={cssClass(styles.icon)}>
                            <CalculatorAppIconComponent iconId={app.iconId} />
                        </span>
                        <span className={cssClass(styles.appName)}>{app.name}</span>
                    </AccessibleButtonComponent>
                );
            })}
        </div>
    );
}
