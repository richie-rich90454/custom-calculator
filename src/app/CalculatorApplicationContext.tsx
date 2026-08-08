import { createContext, useContext, type ReactNode } from "react";
import type { CalculatorCompositionRoot } from "./CalculatorCompositionRoot";
import type { CalculatorUiStoreApi } from "../state/CalculatorUiStore";

export interface CalculatorApplicationContextValue {
  readonly compositionRoot: CalculatorCompositionRoot;
  readonly store: CalculatorUiStoreApi;
}

export const CalculatorApplicationContext =
  createContext<CalculatorApplicationContextValue | null>(null);

export interface CalculatorApplicationContextProviderProperties {
  readonly compositionRoot: CalculatorCompositionRoot;
  readonly store: CalculatorUiStoreApi;
  readonly children: ReactNode;
}

export function CalculatorApplicationContextProvider(
  props: CalculatorApplicationContextProviderProperties
) {
  const contextValue: CalculatorApplicationContextValue = {
    compositionRoot: props.compositionRoot,
    store: props.store,
  };

  return (
    <CalculatorApplicationContext.Provider value={contextValue}>
      {props.children}
    </CalculatorApplicationContext.Provider>
  );
}

export function useCalculatorApplicationContext(): CalculatorApplicationContextValue {
  const contextValue = useContext(CalculatorApplicationContext);

  if (contextValue === null) {
    throw new Error(
      "CalculatorApplicationContext is not available. Wrap the application in CalculatorApplicationContextProvider."
    );
  }

  return contextValue;
}
