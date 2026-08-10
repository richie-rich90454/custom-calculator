import { create } from "zustand";
import { HistoryEntry } from "../domain/model/HistoryEntry";
import type { CalculatorSessionState } from "../domain/model/CalculatorSessionState";
import { AngleMode } from "../domain/model/AngleMode";
import { ModifierLayer } from "../domain/model/ModifierLayer";
import { ModifierLayerState } from "../domain/model/ModifierLayerState";
import { ResultFormatMode } from "../domain/model/ResultFormatMode";
import { VariableAssignment } from "../domain/model/VariableAssignment";
import type { CalculatorCompositionRoot } from "../app/CalculatorCompositionRoot";
import { CalculatorPanelName, type CalculatorUiState } from "./CalculatorUiState";
import type { CalculatorUiStore, CalculatorUiStoreApi } from "./CalculatorUiStore";
import type { CalculatorViewModelMapper } from "../presentation/viewmodels/CalculatorViewModelMapper";
import { DefaultButtonInsertionTemplateService } from "../presentation/services/DefaultButtonInsertionTemplateService";
import { DefaultExpressionCursorService } from "../presentation/services/DefaultExpressionCursorService";
import { DefaultExpressionInsertionService } from "../presentation/services/DefaultExpressionInsertionService";
import type { CalculatorButtonTemplate } from "../presentation/services/CalculatorButtonTemplate";
import { CursorMoveDirection } from "../domain/model/CursorMoveDirection";

const ACTIVE_APP_MODE_STORAGE_KEY = "calculator.activeAppMode";

export function createCalculatorUiStore(
    compositionRoot: CalculatorCompositionRoot,
    initialUiState: CalculatorUiState,
    viewModelMapper: CalculatorViewModelMapper,
): CalculatorUiStoreApi {
    const { calculatorApplicationController: controller, orchestrationService } = compositionRoot;

    const buttonInsertionTemplateService = new DefaultButtonInsertionTemplateService();
    const expressionCursorService = new DefaultExpressionCursorService();
    const expressionInsertionService = new DefaultExpressionInsertionService(
        expressionCursorService,
    );

    return create<CalculatorUiStore>()((set, get) => {
        const recordHistoryEntry = async (sessionState: CalculatorSessionState): Promise<void> => {
            const entry = new HistoryEntry(
                compositionRoot.uniqueIdentifierFactory.createUniqueIdentifier(),
                sessionState.expressionText,
                sessionState.resultText as string,
                sessionState.angleMode,
                sessionState.numericMode,
                sessionState.complexNumbersEnabled,
                new Date().toISOString(),
            );

            await orchestrationService.recordHistoryEntry(entry);

            const updatedEntries = await orchestrationService.refreshHistoryEntries();

            set({ historyEntries: updatedEntries });
        };

        const applyInsertion = (
            sessionState: CalculatorSessionState,
            template: CalculatorButtonTemplate,
        ): CalculatorSessionState => {
            const edit = expressionInsertionService.insertTemplate(
                template,
                sessionState.expressionText,
                sessionState.selectionStart,
                sessionState.selectionEnd,
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

        const insertToken = (token: string): void => {
            const baseState = resolveInsertionBaseState();
            const nextSessionState = applyInsertion(
                baseState,
                buttonInsertionTemplateService.resolveTokenTemplate(token),
            );
            set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
        };

        const handleVariableKey = (variableName: string): void => {
            const state = get();

            if (state.isStoreModeArmed) {
                const sessionState = viewModelMapper.mapUiStateToSessionState(state);
                const nextSessionState = controller.saveVariable(sessionState, variableName);
                set({
                    ...viewModelMapper.mapSessionStateToUiState(nextSessionState, get()),
                    isStoreModeArmed: false,
                    statusMessage: `Stored the result into ${variableName}.`,
                });

                const savedVariable = nextSessionState.variables.find(
                    (variable) => variable.name === variableName,
                );

                if (savedVariable !== undefined) {
                    void orchestrationService.saveVariable(savedVariable);
                }

                return;
            }

            if (state.isRecallModeArmed) {
                set({ isRecallModeArmed: false });
            }

            insertToken(variableName);
        };

        const applyHistoryEntry = (entry: HistoryEntry, replayIndex: number): void => {
            const sessionState = viewModelMapper.mapUiStateToSessionState(get());
            const nextSessionState = controller.setExpressionText(
                sessionState,
                entry.expressionText,
            );
            set({
                ...viewModelMapper.mapSessionStateToUiState(nextSessionState, get()),
                historyReplayIndex: replayIndex,
            });
        };

        const stepHistory = (direction: "back" | "forward"): void => {
            const state = get();
            const resolution =
                direction === "back"
                    ? compositionRoot.replayHistoryService.resolveBack(
                          state.expressionText,
                          state.historyEntries,
                          state.historyReplayIndex,
                      )
                    : compositionRoot.replayHistoryService.resolveForward(
                          state.expressionText,
                          state.historyEntries,
                          state.historyReplayIndex,
                      );

            if (!resolution.changed) {
                return;
            }

            set({
                expressionText: resolution.expressionText,
                cursorPosition: resolution.expressionText.length,
                selectionStart: resolution.expressionText.length,
                selectionEnd: resolution.expressionText.length,
                historyReplayIndex: resolution.replayIndex,
                resultText: null,
                errorText: null,
            });
        };

        const submitEvaluatedResult = (nextSessionState: CalculatorSessionState): void => {
            set({
                ...viewModelMapper.mapSessionStateToUiState(nextSessionState, get()),
                isFractionResultDisplayed: false,
                isApproximateResult: false,
                statusMessage: resolveCalculusAngleNotice(
                    nextSessionState.expressionText,
                    nextSessionState.angleMode,
                    compositionRoot.calculusOperationCatalogService.getOperationNames(),
                ),
            });

            if (nextSessionState.resultText !== null) {
                void recordHistoryEntry(nextSessionState);
            }
        };

        return {
            ...initialUiState,

            onDigitPressed: (digit) => {
                const baseState = resolveInsertionBaseState();
                const nextSessionState = applyInsertion(
                    baseState,
                    buttonInsertionTemplateService.resolveDigitTemplate(digit),
                );
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
            },

            onOperatorPressed: (operator) => {
                const sessionState = viewModelMapper.mapUiStateToSessionState(get());
                const baseState =
                    sessionState.expressionText.length === 0 && sessionState.lastResultText !== null
                        ? controller.insertVariable(sessionState, "ans")
                        : sessionState;
                const nextSessionState = applyInsertion(
                    baseState,
                    buttonInsertionTemplateService.resolveOperatorTemplate(operator),
                );
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
            },

            onFunctionPressed: (functionName) => {
                const baseState = resolveInsertionBaseState();
                const nextSessionState = applyInsertion(
                    baseState,
                    buttonInsertionTemplateService.resolveFunctionTemplate(functionName),
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
                    buttonInsertionTemplateService.resolveTokenTemplate(constantText),
                );
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
            },

            onVariablePressed: (variableName) => {
                const baseState = resolveInsertionBaseState();
                const nextSessionState = applyInsertion(
                    baseState,
                    buttonInsertionTemplateService.resolveTokenTemplate(variableName),
                );
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
            },

            onParenthesisPressed: (parenthesis) => {
                const baseState = resolveInsertionBaseState();
                const nextSessionState = applyInsertion(
                    baseState,
                    buttonInsertionTemplateService.resolveCharacterTemplate(parenthesis),
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
                submitEvaluatedResult(nextSessionState);
            },

            onAngleModeTogglePressed: () => {
                const sessionState = viewModelMapper.mapUiStateToSessionState(get());
                const nextSessionState = controller.cycleAngleMode(sessionState);
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
                orchestrationService.saveSettings(viewModelMapper.mapUiStateToSettings(get()));
            },

            onAngleModeChanged: (angleMode) => {
                set({
                    angleMode: angleMode,
                    resultText: null,
                    errorText: null,
                });
                orchestrationService.saveSettings(viewModelMapper.mapUiStateToSettings(get()));
            },

            onNumericModeChanged: (numericMode) => {
                const sessionState = viewModelMapper.mapUiStateToSessionState(get());
                const nextSessionState = controller.changeNumericMode(sessionState, numericMode);
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
                orchestrationService.saveSettings(viewModelMapper.mapUiStateToSettings(get()));
            },

            onComplexNumbersTogglePressed: () => {
                const sessionState = viewModelMapper.mapUiStateToSessionState(get());
                const nextSessionState = controller.toggleComplexNumbers(sessionState);
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
                orchestrationService.saveSettings(viewModelMapper.mapUiStateToSettings(get()));
            },

            onCasTogglePressed: () => {
                const sessionState = viewModelMapper.mapUiStateToSessionState(get());
                const nextSessionState = controller.toggleCasMode(sessionState);
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
                orchestrationService.saveSettings(viewModelMapper.mapUiStateToSettings(get()));
            },

            onThemeChanged: (themePreference) => {
                set({ themePreference: themePreference });
                orchestrationService.saveSettings(viewModelMapper.mapUiStateToSettings(get()));
            },

            onExpressionTextChanged: (
                expressionText,
                cursorPosition,
                selectionStart,
                selectionEnd,
            ) => {
                const currentState = get();

                const isUnchanged =
                    currentState.expressionText === expressionText &&
                    currentState.cursorPosition === cursorPosition &&
                    currentState.selectionStart === selectionStart &&
                    currentState.selectionEnd === selectionEnd;

                if (isUnchanged) {
                    return;
                }

                set({
                    expressionText: expressionText,
                    cursorPosition: cursorPosition,
                    selectionStart: selectionStart,
                    selectionEnd: selectionEnd,
                    resultText: null,
                    errorText: null,
                    historyReplayIndex: null,
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
                    (candidate) => candidate.id === historyEntryId,
                );

                if (entry === undefined) {
                    return;
                }

                applyHistoryEntry(entry, get().historyEntries.indexOf(entry));
                set({ activePanel: CalculatorPanelName.NONE });
            },

            onHistoryEntryDeleted: (historyEntryId) => {
                void orchestrationService.removeHistoryEntry(historyEntryId);

                set({
                    historyEntries: get().historyEntries.filter(
                        (entry) => entry.id !== historyEntryId,
                    ),
                    historyReplayIndex: null,
                });
            },

            onHistoryCleared: () => {
                void orchestrationService.clearHistoryEntries();
                set({ historyEntries: [], historyReplayIndex: null });
            },

            onSaveVariablePressed: (variableName) => {
                const sessionState = viewModelMapper.mapUiStateToSessionState(get());
                const nextSessionState = controller.saveVariable(sessionState, variableName);
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));

                const savedVariable = nextSessionState.variables.find(
                    (variable) => variable.name === variableName,
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
                    variableName,
                );
                set(viewModelMapper.mapSessionStateToUiState(nextSessionState, get()));
            },

            onShiftPressed: () => {
                const current = ModifierLayerState.armed(get().activeModifierLayer);
                set({
                    activeModifierLayer:
                        compositionRoot.modifierLayerService.armShift(current).armedLayer,
                });
            },

            onAlphaPressed: () => {
                const current = ModifierLayerState.armed(get().activeModifierLayer);
                set({
                    activeModifierLayer:
                        compositionRoot.modifierLayerService.armAlpha(current).armedLayer,
                });
            },

            onModifierDisarmed: () => {
                set({ activeModifierLayer: ModifierLayer.NONE });
            },

            onInsertTextPressed: (value) => {
                if (value === "(" || value === ")") {
                    get().onParenthesisPressed(value);
                    return;
                }

                if (/^[0-9.]$/.test(value)) {
                    get().onDigitPressed(value);
                    return;
                }

                if (/^[+\-*/^%!,]$/.test(value)) {
                    get().onOperatorPressed(value);
                    return;
                }

                if (/^[A-Za-z]$/.test(value)) {
                    handleVariableKey(value);
                    return;
                }

                if (value === "pi" || value === "e") {
                    get().onConstantPressed(value);
                    return;
                }

                get().onVariablePressed(value);
            },

            onInsertFunctionPressed: (functionName) => {
                get().onFunctionPressed(functionName);
            },

            onInsertTemplatePressed: (templateName) => {
                get().onFunctionPressed(templateName);
            },

            onInsertExponent10Pressed: () => {
                insertToken("*10^");
            },

            onEvaluateApproximatePressed: () => {
                get().onEvaluatePressed();

                const state = get();

                if (state.resultText !== null && state.lastResultValue !== null) {
                    const conversion = compositionRoot.resultFormatService.convertToDecimal(
                        state.lastResultValue,
                    );
                    set({ resultText: conversion.text, isFractionResultDisplayed: false });
                }
            },

            onMenuOpened: () => {
                get().onPanelOpened(CalculatorPanelName.HOME_MENU);
            },

            onOptnOpened: () => {
                get().onPanelOpened(CalculatorPanelName.OPTN);
            },

            onCalcPressed: () => {
                const state = get();

                if (state.expressionText.trim().length === 0) {
                    set({ errorText: "Enter an expression before pressing CALC." });
                    return;
                }

                const missingNames =
                    compositionRoot.expressionVariablePromptService.resolveMissingVariableNames(
                        state.expressionText,
                        state.variables.map((variable) => variable.name),
                    );

                if (missingNames.length === 0) {
                    get().onEvaluatePressed();
                    return;
                }

                set({
                    pendingVariablePrompts: missingNames,
                    activePanel: CalculatorPanelName.VARIABLE_PROMPT,
                });
            },

            onSolvePressed: () => {
                const state = get();
                const expression = state.expressionText.trim();

                if (expression.length === 0) {
                    set({ errorText: "Enter an equation to solve before pressing SOLVE." });
                    return;
                }

                const variableName = resolveSolveVariable(
                    expression,
                    state.variables.map((variable) => variable.name),
                );

                if (variableName === null) {
                    set({
                        errorText: "SOLVE needs an equation containing a variable such as x.",
                    });
                    return;
                }

                const variableValue = state.variables.find(
                    (variable) => variable.name === variableName,
                );
                const parsedGuess =
                    variableValue === undefined ? NaN : Number(variableValue.valueText);
                const initialGuess = Number.isFinite(parsedGuess) ? parsedGuess : 1;

                const result = compositionRoot.equationSolvingService.solve(
                    expression,
                    variableName,
                    initialGuess,
                );

                if (result.converged && result.root !== null) {
                    const formattedRoot = formatSolveRoot(result.root);
                    set({
                        resultText: `${variableName} = ${formattedRoot} (${result.iterationCount} iterations)`,
                        lastResultText: `${variableName} = ${formattedRoot}`,
                        lastResultValue: result.root,
                        errorText: null,
                        isFractionResultDisplayed: false,
                        isApproximateResult: false,
                    });
                } else {
                    set({
                        errorText: result.errorMessage,
                    });
                }
            },

            onSDCyclePressed: () => {
                const state = get();

                if (state.lastResultValue === null) {
                    return;
                }

                if (state.isFractionResultDisplayed) {
                    const conversion = compositionRoot.resultFormatService.convertToDecimal(
                        state.lastResultValue,
                    );
                    set({
                        resultText: conversion.text,
                        isFractionResultDisplayed: false,
                        isApproximateResult: !conversion.isExact,
                    });
                    return;
                }

                const conversion = compositionRoot.resultFormatService.convertToFraction(
                    state.lastResultValue,
                );
                set({
                    resultText: conversion.text,
                    isFractionResultDisplayed: true,
                    isApproximateResult: !conversion.isExact,
                });
            },

            onEngTogglePressed: (_direction) => {
                const state = get();
                const nextEnabled = !state.isEngineeringEnabled;
                let nextResultText = state.resultText;

                if (state.lastResultValue !== null) {
                    nextResultText = nextEnabled
                        ? compositionRoot.resultFormatService.formatEngineering(
                              state.lastResultValue,
                          )
                        : compositionRoot.resultFormatService.convertToDecimal(
                              state.lastResultValue,
                          ).text;
                }

                set({ isEngineeringEnabled: nextEnabled, resultText: nextResultText });
            },

            onFixSciMenuOpened: () => {
                get().onPanelOpened(CalculatorPanelName.FIX_SCI);
            },

            onStoreModeArmed: () => {
                set({ isStoreModeArmed: true, isRecallModeArmed: false });
            },

            onRecallModeArmed: () => {
                set({ isRecallModeArmed: true, isStoreModeArmed: false });
            },

            onHyperbolicMenuOpened: (inverse) => {
                set({ hyperbolicMenuInverse: inverse });
                get().onPanelOpened(CalculatorPanelName.HYPERBOLIC);
            },

            onCursorMovePressed: (direction) => {
                const state = get();

                if (state.activePanel !== CalculatorPanelName.NONE) {
                    return;
                }

                const length = state.expressionText.length;
                let position = state.cursorPosition;

                switch (direction) {
                    case CursorMoveDirection.LEFT:
                        position = Math.max(0, position - 1);
                        break;
                    case CursorMoveDirection.RIGHT:
                        position = Math.min(length, position + 1);
                        break;
                    case CursorMoveDirection.UP:
                        position = 0;
                        break;
                    case CursorMoveDirection.DOWN:
                        position = length;
                        break;
                }

                if (position === state.cursorPosition) {
                    return;
                }

                set({
                    cursorPosition: position,
                    selectionStart: position,
                    selectionEnd: position,
                });
            },

            onConfirmPressed: () => {
                if (get().activePanel !== CalculatorPanelName.NONE) {
                    return;
                }

                get().onEvaluatePressed();
            },

            onHistoryStepBackPressed: () => {
                stepHistory("back");
            },

            onHistoryStepForwardPressed: () => {
                stepHistory("forward");
            },

            onAppModeSelected: (appModeId) => {
                const app = compositionRoot.appModeRegistryService.getApp(appModeId);

                if (app === null) {
                    return;
                }

                set({
                    activeAppMode: appModeId,
                    activePanel: CalculatorPanelName.NONE,
                    statusMessage: app.isAvailable ? null : app.availabilityReason,
                });

                try {
                    globalThis.localStorage?.setItem(ACTIVE_APP_MODE_STORAGE_KEY, appModeId);
                } catch {
                    // Storage may be unavailable; the active app still works for the session.
                }
            },

            onResultFormatChanged: (resultFormatMode, digits) => {
                const state = get();
                let nextResultText = state.resultText;

                if (state.lastResultValue !== null) {
                    const formatService = compositionRoot.resultFormatService;

                    if (resultFormatMode === ResultFormatMode.FIX) {
                        nextResultText = formatService.formatFixed(state.lastResultValue, digits);
                    } else if (resultFormatMode === ResultFormatMode.SCI) {
                        nextResultText = formatService.formatSignificant(
                            state.lastResultValue,
                            digits,
                        );
                    } else {
                        nextResultText = formatService.convertToDecimal(state.lastResultValue).text;
                    }
                }

                set({
                    resultFormatMode: resultFormatMode,
                    resultFormatDigits: digits,
                    resultText: nextResultText,
                });
            },

            onVariablePromptSubmitted: (values) => {
                const sessionState = viewModelMapper.mapUiStateToSessionState(get());
                const mergedVariables = mergePromptedVariables(sessionState, values);

                const nextSessionState = controller.evaluateExpression(
                    sessionState.copyWith({ variables: mergedVariables }),
                );

                set({
                    ...viewModelMapper.mapSessionStateToUiState(nextSessionState, get()),
                    pendingVariablePrompts: [],
                    activePanel: CalculatorPanelName.NONE,
                    isFractionResultDisplayed: false,
                    isApproximateResult: false,
                });

                if (nextSessionState.resultText !== null) {
                    void recordHistoryEntry(nextSessionState);
                }
            },

            onVariablePromptCancelled: () => {
                set({ pendingVariablePrompts: [], activePanel: CalculatorPanelName.NONE });
            },

            onKaTeXPreviewToggled: () => {
                set({ isKaTeXPreviewEnabled: !get().isKaTeXPreviewEnabled });
            },
        };
    });
}

function resolveSolveVariable(
    expression: string,
    knownVariableNames: readonly string[],
): string | null {
    const identifiers = [...expression.matchAll(/[a-zA-Z][a-zA-Z0-9_]*/g)].map((match) => match[0]);

    if (identifiers.includes("x")) {
        return "x";
    }

    const knownSymbols = new Set(knownVariableNames);

    const candidate = identifiers.find(
        (identifier) =>
            identifier !== "x" &&
            identifier !== "y" &&
            identifier !== "ans" &&
            !knownSymbols.has(identifier) &&
            identifier.length > 1,
    );

    if (candidate !== undefined) {
        return candidate;
    }

    return identifiers.find((identifier) => identifier.length === 1) ?? null;
}

function formatSolveRoot(root: number): string {
    return parseFloat(root.toPrecision(10)).toString();
}

function mergePromptedVariables(
    sessionState: CalculatorSessionState,
    values: Readonly<Record<string, string>>,
): readonly VariableAssignment[] {
    const promptedVariables = Object.entries(values)
        .filter(([, valueText]) => valueText.trim().length > 0)
        .map(
            ([name, valueText]) =>
                new VariableAssignment(
                    name,
                    valueText,
                    sessionState.numericMode,
                    new Date().toISOString(),
                ),
        );

    const promptedNames = new Set(promptedVariables.map((variable) => variable.name));

    const existingVariables = sessionState.variables.filter(
        (variable) => !promptedNames.has(variable.name),
    );

    return [...existingVariables, ...promptedVariables];
}

function resolveCalculusAngleNotice(
    expressionText: string,
    angleMode: AngleMode,
    calculusOperationNames: readonly string[],
): string | null {
    if (angleMode === AngleMode.RAD) {
        return null;
    }

    const isCalculusBlock = calculusOperationNames.some((operationName) =>
        expressionText.includes(`${operationName}(`),
    );

    if (!isCalculusBlock) {
        return null;
    }

    const modeLabel = angleMode === AngleMode.DEG ? "DEG" : "GON";

    return `Trig assumed in radians; input converted from ${modeLabel}.`;
}
