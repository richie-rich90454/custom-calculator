import { create } from "zustand";
import { HistoryEntry } from "../domain/model/HistoryEntry";
import type { CalculatorSessionState } from "../domain/model/CalculatorSessionState";
import type { CalculatorCompositionRoot } from "../app/CalculatorCompositionRoot";
import { CalculatorPanelName, type CalculatorUiState } from "./CalculatorUiState";
import type { CalculatorUiStore, CalculatorUiStoreApi } from "./CalculatorUiStore";
import type { CalculatorViewModelMapper } from "../presentation/viewmodels/CalculatorViewModelMapper";

export function createCalculatorUiStore(
  compositionRoot: CalculatorCompositionRoot,
  initialUiState: CalculatorUiState,
  viewModelMapper: CalculatorViewModelMapper
): CalculatorUiStoreApi {
  const { calculatorApplicationController: controller, orchestrationService } =
    compositionRoot;

  return create<CalculatorUiStore>()((set, get) => {
    const recordHistoryEntry = async (
      sessionState: CalculatorSessionState
    ): Promise<void> => {
      const entry = new HistoryEntry(
        compositionRoot.uniqueIdentifierFactory.createUniqueIdentifier(),
        sessionState.expressionText,
        sessionState.resultText as string,
        sessionState.angleMode,
        sessionState.numericMode,
        sessionState.complexNumbersEnabled,
        new Date().toISOString()
      );

      await orchestrationService.recordHistoryEntry(entry);

      const updatedEntries = await orchestrationService.refreshHistoryEntries();

      set({ historyEntries: updatedEntries });
    };

    return {
    ...initialUiState,

    onDigitPressed: (digit) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.insertDigit(sessionState, digit);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onOperatorPressed: (operator) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.insertOperator(sessionState, operator);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onFunctionPressed: (functionName) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.insertFunction(sessionState, functionName);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onConstantPressed: (constantId) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.insertConstant(sessionState, constantId);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onVariablePressed: (variableName) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.insertVariable(sessionState, variableName);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onParenthesisPressed: (parenthesis) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.insertParenthesis(sessionState, parenthesis);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onDeleteBackwardPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.deleteBackward(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onDeleteForwardPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.deleteForward(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onDeleteWordBackwardPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.deleteWordBackward(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onClearPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.clearSession(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onEvaluatePressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.evaluateExpression(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));

      if (nextSessionState.resultText !== null) {
        void recordHistoryEntry(nextSessionState);
      }
    },

    onAngleModeTogglePressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.cycleAngleMode(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
      orchestrationService.saveSettings(
        viewModelMapper.mapUiStateToSettings(get())
      );
    },

    onNumericModeChanged: (numericMode) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.changeNumericMode(sessionState, numericMode);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
      orchestrationService.saveSettings(
        viewModelMapper.mapUiStateToSettings(get())
      );
    },

    onComplexNumbersTogglePressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.toggleComplexNumbers(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
      orchestrationService.saveSettings(
        viewModelMapper.mapUiStateToSettings(get())
      );
    },

    onCasTogglePressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.toggleCasMode(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
      orchestrationService.saveSettings(
        viewModelMapper.mapUiStateToSettings(get())
      );
    },

    onThemeChanged: (themePreference) => {
      set({ themePreference: themePreference });
      orchestrationService.saveSettings(
        viewModelMapper.mapUiStateToSettings(get())
      );
    },

    onExpressionTextChanged: (
      expressionText,
      cursorPosition,
      selectionStart,
      selectionEnd
    ) => {
      set({
        expressionText: expressionText,
        cursorPosition: cursorPosition,
        selectionStart: selectionStart,
        selectionEnd: selectionEnd,
        resultText: null,
        errorText: null,
      });
    },

    onPanelOpened: (panelName) => {
      const requestedPanel = panelName as CalculatorPanelName;

      set({
        activePanel:
          get().activePanel === requestedPanel
            ? CalculatorPanelName.NONE
            : requestedPanel,
      });
    },

    onHistoryEntrySelected: (historyEntryId) => {
      const entry = get().historyEntries.find(
        (candidate) => candidate.id === historyEntryId
      );

      if (entry === undefined) {
        return;
      }

      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.setExpressionText(
        sessionState,
        entry.expressionText
      );
      set({
        ...viewModelMapper.mapSessionStateToUiState(nextSessionState, get()),
        activePanel: CalculatorPanelName.NONE,
      });
    },

    onHistoryEntryDeleted: (historyEntryId) => {
      void orchestrationService.removeHistoryEntry(historyEntryId);

      set({
        historyEntries: get().historyEntries.filter(
          (entry) => entry.id !== historyEntryId
        ),
      });
    },

    onHistoryCleared: () => {
      void orchestrationService.clearHistoryEntries();
      set({ historyEntries: [] });
    },

    onSaveVariablePressed: (variableName) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.saveVariable(sessionState, variableName);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));

      const savedVariable = nextSessionState.variables.find(
        (variable) => variable.name === variableName
      );

      if (savedVariable !== undefined) {
        void orchestrationService.saveVariable(savedVariable);
      }
    },

    onVariableDeleted: (variableName) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.deleteVariable(sessionState, variableName);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
      void orchestrationService.removeVariable(variableName);
    },

    onMemoryAddPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.memoryAdd(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onMemorySubtractPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.memorySubtract(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onMemoryRecallPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.memoryRecall(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onMemoryClearPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.memoryClear(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onSimplifyPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.simplifyExpression(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onExpandPressed: () => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.expandExpression(sessionState);
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onDifferentiatePressed: (variableName) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const nextSessionState = controller.differentiateExpression(
        sessionState,
        variableName
      );
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },
  };
});
}
