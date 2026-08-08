import { create } from "zustand";
import { HistoryEntry } from "../domain/model/HistoryEntry";
import type { CalculatorSessionState } from "../domain/model/CalculatorSessionState";
import type { CalculatorCompositionRoot } from "../app/CalculatorCompositionRoot";
import { CalculatorPanelName, type CalculatorUiState } from "./CalculatorUiState";
import type { CalculatorUiStore, CalculatorUiStoreApi } from "./CalculatorUiStore";
import type { CalculatorViewModelMapper } from "../presentation/viewmodels/CalculatorViewModelMapper";
import { DefaultButtonInsertionTemplateService } from "../presentation/services/DefaultButtonInsertionTemplateService";
import { DefaultExpressionCursorService } from "../presentation/services/DefaultExpressionCursorService";
import { DefaultExpressionInsertionService } from "../presentation/services/DefaultExpressionInsertionService";
import type { CalculatorButtonTemplate } from "../presentation/services/CalculatorButtonTemplate";

export function createCalculatorUiStore(
  compositionRoot: CalculatorCompositionRoot,
  initialUiState: CalculatorUiState,
  viewModelMapper: CalculatorViewModelMapper
): CalculatorUiStoreApi {
  const { calculatorApplicationController: controller, orchestrationService } =
    compositionRoot;

  const buttonInsertionTemplateService = new DefaultButtonInsertionTemplateService();
  const expressionCursorService = new DefaultExpressionCursorService();
  const expressionInsertionService = new DefaultExpressionInsertionService(
    expressionCursorService
  );

  const applyInsertion = (
    sessionState: CalculatorSessionState,
    template: CalculatorButtonTemplate
  ): CalculatorSessionState => {
    const edit = expressionInsertionService.insertTemplate(
      template,
      sessionState.expressionText,
      sessionState.selectionStart,
      sessionState.selectionEnd
    );

    return controller.applyInsertion(sessionState, edit);
  };

  const resolveInsertionBaseState = (): CalculatorSessionState => {
    const sessionState = viewModelMapper.mapUiStateToSessionState(get());

    if (sessionState.resultText === null) {
      return sessionState;
    }

    return controller.clearSession(sessionState);
  };

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
      const baseState = resolveInsertionBaseState();
      const nextSessionState = applyInsertion(
        baseState,
        buttonInsertionTemplateService.resolveDigitTemplate(digit)
      );
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onOperatorPressed: (operator) => {
      const sessionState = viewModelMapper.mapUiStateToSessionState(get());
      const baseState =
        sessionState.expressionText.length === 0 &&
        sessionState.lastResultText !== null
          ? controller.insertVariable(sessionState, "ans")
          : sessionState;
      const nextSessionState = applyInsertion(
        baseState,
        buttonInsertionTemplateService.resolveOperatorTemplate(operator)
      );
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onFunctionPressed: (functionName) => {
      const baseState = resolveInsertionBaseState();
      const nextSessionState = applyInsertion(
        baseState,
        buttonInsertionTemplateService.resolveFunctionTemplate(functionName)
      );
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onConstantPressed: (constantId) => {
      const constantText =
        compositionRoot.constantCatalogService.getConstantInsertText(constantId);

      if (constantText === null) {
        return;
      }

      const baseState = resolveInsertionBaseState();
      const nextSessionState = applyInsertion(
        baseState,
        buttonInsertionTemplateService.resolveTokenTemplate(constantText)
      );
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onVariablePressed: (variableName) => {
      const baseState = resolveInsertionBaseState();
      const nextSessionState = applyInsertion(
        baseState,
        buttonInsertionTemplateService.resolveTokenTemplate(variableName)
      );
      set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
    },

    onParenthesisPressed: (parenthesis) => {
      const baseState = resolveInsertionBaseState();
      const nextSessionState = applyInsertion(
        baseState,
        buttonInsertionTemplateService.resolveCharacterTemplate(parenthesis)
      );
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

    onAngleModeChanged: (angleMode) => {
      set({
        angleMode: angleMode,
        resultText: null,
        errorText: null,
      });
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
