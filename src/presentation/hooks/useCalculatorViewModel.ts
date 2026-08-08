import { useMemo } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { CalculatorViewModel } from "../viewmodels/CalculatorViewModel";

export function useCalculatorViewModel(): CalculatorViewModel {
  const { store, compositionRoot } = useCalculatorApplicationContext();

  const uiState = store();

  return useMemo(
    () => new CalculatorViewModel(uiState, compositionRoot),
    [uiState, compositionRoot]
  );
}
