import { useMemo } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { CalculatorKeyCommandDispatcherService } from "../services/CalculatorKeyCommandDispatcherService";
import type { CalculatorKeyDefinition } from "../services/CalculatorKeyDefinition";
import type { ButtonActivationKind } from "../services/FocusPreservationService";
import { defaultFocusPreservationService } from "../services/DefaultFocusPreservationService";
import { DefaultKeypadDefinitionRepository } from "../services/DefaultKeypadDefinitionRepository";
import { CalculatorCasControlPadComponent } from "./CalculatorCasControlPadComponent";
import { CalculatorCalculusControlPadComponent } from "./CalculatorCalculusControlPadComponent";
import { CalculatorCorePadComponent } from "./CalculatorCorePadComponent";
import { CalculatorScientificFunctionPadComponent } from "./CalculatorScientificFunctionPadComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/CalculatorKeypadComponent.module.css";

export function CalculatorKeypadComponent() {
    const { store, compositionRoot } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();

    const keypadRepository = useMemo(
        () =>
            new DefaultKeypadDefinitionRepository(
                compositionRoot.casOperationCatalogService,
                compositionRoot.calculusOperationCatalogService,
            ),
        [compositionRoot],
    );

    const keyDispatcher = useMemo(() => new CalculatorKeyCommandDispatcherService(), []);

    const handleKeyPressed = (
        key: CalculatorKeyDefinition,
        activationKind: ButtonActivationKind,
    ): void => {
        keyDispatcher.dispatchKeyPressed(key, store.getState());
        defaultFocusPreservationService.restoreFocusAfterButtonPress(activationKind);
    };

    return (
        <div className={cssClass(styles.keypad)}>
            <CalculatorScientificFunctionPadComponent
                keys={keypadRepository.getScientificFunctionKeys()}
                onKeyPressed={handleKeyPressed}
            />
            {viewModel.casEnabled ? (
                <CalculatorCasControlPadComponent
                    keys={keypadRepository.getCasOperationKeys()}
                    onKeyPressed={handleKeyPressed}
                />
            ) : null}
            <CalculatorCalculusControlPadComponent
                keys={keypadRepository.getCalculusOperationKeys()}
                onKeyPressed={handleKeyPressed}
            />
            <CalculatorCorePadComponent
                keys={keypadRepository.getCoreKeys()}
                onKeyPressed={handleKeyPressed}
            />
        </div>
    );
}
