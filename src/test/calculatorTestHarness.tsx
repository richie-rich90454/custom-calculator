import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { CalculatorApplicationBootstrap } from "../app/CalculatorApplicationBootstrap";
import { CalculatorApplicationContextProvider } from "../app/CalculatorApplicationContext";
import { CalculatorCompositionRoot } from "../app/CalculatorCompositionRoot";
import { CalculatorViewModelMapper } from "../presentation/viewmodels/CalculatorViewModelMapper";
import { createCalculatorUiStore } from "../state/createCalculatorUiStore";
import { createInitialCalculatorUiState } from "../state/createInitialCalculatorUiState";
import type { CalculatorUiState } from "../state/CalculatorUiState";
import type { CalculatorUiStoreApi } from "../state/CalculatorUiStore";

export interface CalculatorTestHarness {
  readonly compositionRoot: CalculatorCompositionRoot;
  readonly store: CalculatorUiStoreApi;
  readonly viewModelMapper: CalculatorViewModelMapper;
}

export function createCalculatorTestHarness(
  initialStateOverrides?: Partial<CalculatorUiState>
): CalculatorTestHarness {
  try {
    globalThis.localStorage.clear();
  } catch {
    // Storage may be unavailable in some test environments.
  }

  const compositionRoot = new CalculatorCompositionRoot();
  const bootstrap = new CalculatorApplicationBootstrap(compositionRoot);
  const bootstrapResult = bootstrap.bootstrap();

  const initialUiState = createInitialCalculatorUiState(
    bootstrapResult.settings,
    bootstrapResult.bigIntSupported,
    bootstrapResult.statusMessage
  );

  const viewModelMapper = new CalculatorViewModelMapper();

  const store = createCalculatorUiStore(
    compositionRoot,
    {
      ...initialUiState,
      ...initialStateOverrides,
    },
    viewModelMapper
  );

  return {
    compositionRoot: compositionRoot,
    store: store,
    viewModelMapper: viewModelMapper,
  };
}

export function renderWithCalculatorContext(
  harness: CalculatorTestHarness,
  children: ReactNode
) {
  return render(
    <CalculatorApplicationContextProvider
      compositionRoot={harness.compositionRoot}
      store={harness.store}
    >
      {children}
    </CalculatorApplicationContextProvider>
  );
}
