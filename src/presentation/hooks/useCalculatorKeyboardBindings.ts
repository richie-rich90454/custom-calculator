import { useEffect } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { CalculatorPanelName } from "../../state/CalculatorUiState";
import type { KeyAction } from "../services/KeyAction";
import { CalculatorKeyboardShortcutRegistry } from "../services/CalculatorKeyboardShortcutRegistry";
import { PhysicalKeyboardEscapeAction } from "../services/PhysicalKeyboardBindingService";

const keyboardShortcutRegistry = new CalculatorKeyboardShortcutRegistry();

export function useCalculatorKeyboardBindings(): void {
    const { store, compositionRoot } = useCalculatorApplicationContext();

    useEffect(() => {
        const dispatcher = compositionRoot.keyActionDispatcherService;

        const handleKeyDown = (event: KeyboardEvent): void => {
            const actions = store.getState();
            const target = event.target as HTMLElement | null;
            const isTypingContext =
                target !== null &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable);

            if (event.ctrlKey || event.metaKey) {
                const resolution = keyboardShortcutRegistry.resolveKeyDown(event, {
                    activePanel: actions.activePanel,
                    isTypingContext: isTypingContext,
                    onPanelOpened: actions.onPanelOpened,
                    onClearPressed: actions.onClearPressed,
                    onEvaluatePressed: actions.onEvaluatePressed,
                    onAngleModeTogglePressed: actions.onAngleModeTogglePressed,
                });

                if (resolution.handled) {
                    event.preventDefault();
                }

                return;
            }

            const resolution = compositionRoot.physicalKeyboardBindingService.resolveKeyDown(
                event,
                {
                    isTypingContext: isTypingContext,
                    activePanelOpen: actions.activePanel !== CalculatorPanelName.NONE,
                    modifierArmed: actions.activeModifierLayer !== ModifierLayer.NONE,
                },
            );

            if (!resolution.handled) {
                return;
            }

            if (event.key === "Enter" && isInteractiveTarget(target)) {
                return;
            }

            if (event.key === "Escape" && isInsideDialog(target)) {
                return;
            }

            event.preventDefault();

            if (resolution.escapeAction === PhysicalKeyboardEscapeAction.CLOSE_PANEL) {
                actions.onPanelOpened(actions.activePanel);
                return;
            }

            dispatcher.dispatchKeyAction(resolution.keyAction as KeyAction, actions);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [store, compositionRoot]);
}

function isInteractiveTarget(target: HTMLElement | null): boolean {
    return (
        target !== null &&
        (target.tagName === "BUTTON" || target.tagName === "SELECT" || target.tagName === "A")
    );
}

function isInsideDialog(target: HTMLElement | null): boolean {
    return target !== null && target.closest('[role="dialog"]') !== null;
}
