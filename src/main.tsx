import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./presentation/styles/themes.css";
import "./presentation/styles/global.css";
import { CalculatorApplicationBootstrap } from "./app/CalculatorApplicationBootstrap";
import { CalculatorApplicationContextProvider } from "./app/CalculatorApplicationContext";
import { CalculatorCompositionRoot } from "./app/CalculatorCompositionRoot";
import { useCalculatorKeyboardBindings } from "./presentation/hooks/useCalculatorKeyboardBindings";
import { CalculatorShellComponent } from "./presentation/components/CalculatorShellComponent";
import { CalculatorViewModelMapper } from "./presentation/viewmodels/CalculatorViewModelMapper";
import { createCalculatorUiStore } from "./state/createCalculatorUiStore";
import { createInitialCalculatorUiState } from "./state/createInitialCalculatorUiState";
import type { CalculatorUiStoreApi } from "./state/CalculatorUiStore";

function CalculatorApplication() {
  useCalculatorKeyboardBindings();

  return <CalculatorShellComponent />;
}

function bootstrapCalculatorApplication(): void {
  const compositionRoot = new CalculatorCompositionRoot();
  const bootstrap = new CalculatorApplicationBootstrap(compositionRoot);
  const bootstrapResult = bootstrap.bootstrap();

  const initialUiState = createInitialCalculatorUiState(
    bootstrapResult.settings,
    bootstrapResult.bigIntSupported,
    bootstrapResult.statusMessage
  );

  const store = createCalculatorUiStore(
    compositionRoot,
    initialUiState,
    new CalculatorViewModelMapper()
  );

  void hydratePersistedState(compositionRoot, store);

  const rootElement = document.getElementById("root");

  if (rootElement === null) {
    throw new Error("Root element not found.");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <CalculatorApplicationContextProvider
        compositionRoot={compositionRoot}
        store={store}
      >
        <CalculatorApplication />
      </CalculatorApplicationContextProvider>
    </StrictMode>
  );
}

async function hydratePersistedState(
  compositionRoot: CalculatorCompositionRoot,
  store: CalculatorUiStoreApi
): Promise<void> {
  const orchestration = compositionRoot.orchestrationService;

  const [historyEntries, variables] = await Promise.all([
    orchestration.refreshHistoryEntries(),
    orchestration.refreshVariables(),
  ]);

  store.setState({
    historyEntries: historyEntries,
    variables: variables,
  });
}

bootstrapCalculatorApplication();
