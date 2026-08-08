import { useMemo } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { CalculatorKeyCommandDispatcherService } from "../services/CalculatorKeyCommandDispatcherService";
import type { CalculatorKeyDefinition } from "../services/CalculatorKeyDefinition";
import { DefaultKeypadDefinitionRepository } from "../services/DefaultKeypadDefinitionRepository";
import { CalculatorCasControlPadComponent } from "./CalculatorCasControlPadComponent";
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
        compositionRoot.casOperationCatalogService
      ),
    [compositionRoot]
  );

  const keyDispatcher = useMemo(
    () => new CalculatorKeyCommandDispatcherService(),
    []
  );

  const handleKeyPressed = (key: CalculatorKeyDefinition): void => {
    keyDispatcher.dispatchKeyPressed(key, store.getState());
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
      <CalculatorCorePadComponent
        keys={keypadRepository.getCoreKeys()}
        onKeyPressed={handleKeyPressed}
      />
    </div>
  );
}
