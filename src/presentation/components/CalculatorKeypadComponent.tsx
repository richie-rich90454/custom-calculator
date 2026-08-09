import { useMemo } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { useKeypadGridNavigation } from "../hooks/useKeypadGridNavigation";
import { KeyActionKind } from "../services/KeyAction";
import { KeycapClass, type KeyDefinition } from "../services/KeyDefinition";
import type { ButtonActivationKind } from "../services/FocusPreservationService";
import { defaultFocusPreservationService } from "../services/DefaultFocusPreservationService";
import { CalculatorKeycapComponent } from "./CalculatorKeycapComponent";
import { CalculatorDirectionalPadComponent } from "./CalculatorDirectionalPadComponent";
import { cssClass, joinClassNames } from "../utils/classNames";
import styles from "../styles/CalculatorKeypadComponent.module.css";
import keycapStyles from "../styles/CalculatorKeycapComponent.module.css";

const KEYPAD_LAYOUT: readonly (readonly string[])[] = [
    ["menu", "shift", "alpha", "optn", "calc"],
    ["integral", "limit", "sum", "fraction", "sqrt"],
    ["square", "power", "log", "ln", "reciprocal"],
    ["pi", "sin", "cos", "tan", "hyp"],
    ["xy", "sto", "eng", "sd", "m-plus"],
    ["paren-open", "x10x", "del", "ac", "ans"],
    ["7", "8", "9", "divide", "equals"],
    ["4", "5", "6", "multiply", "equals"],
    ["1", "2", "3", "subtract", "equals"],
    ["0", "decimal", "comma", "add", "equals"],
];

const EQUALS_KEY_ID = "equals";
const KEYPAD_COLUMN_COUNT = 5;

export function CalculatorKeypadComponent() {
    const { store, compositionRoot } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();

    const keysById = useMemo(() => {
        const map = new Map<string, KeyDefinition>();

        for (const key of compositionRoot.keymapDefinitionService.getAllKeys()) {
            map.set(key.id, key);
        }

        return map;
    }, [compositionRoot]);

    const { layoutKeys, directionalPadKeys } = useMemo(() => resolveLayout(keysById), [keysById]);

    const layoutIds = useMemo(() => layoutKeys.map((key) => key.id), [layoutKeys]);

    const navigation = useKeypadGridNavigation(layoutIds, KEYPAD_COLUMN_COUNT);

    const handleKeyPressed = (key: KeyDefinition, activationKind: ButtonActivationKind): void => {
        const state = store.getState();
        const resolution = compositionRoot.keyActionDispatcherService.dispatchKeyPressed(
            key,
            state,
            state.activeModifierLayer,
        );

        const shouldConsumeModifier =
            resolution.usedLayer !== ModifierLayer.NONE &&
            resolution.actionKind !== KeyActionKind.ARM_SHIFT &&
            resolution.actionKind !== KeyActionKind.ARM_ALPHA;

        if (shouldConsumeModifier) {
            store.getState().onModifierDisarmed();
        }

        defaultFocusPreservationService.restoreFocusAfterButtonPress(activationKind);
    };

    return (
        <div className={cssClass(styles.keypad)}>
            <div
                role="grid"
                aria-label="Calculator keypad"
                className={cssClass(styles.keyGrid)}
                tabIndex={-1}
                onKeyDown={navigation.handleGridKeyDown}
            >
                {layoutKeys.map((definition) => (
                    <CalculatorKeycapComponent
                        key={definition.id}
                        keyDefinition={definition}
                        customClassName={joinClassNames(
                            resolveKeycapClassName(definition),
                            definition.id === EQUALS_KEY_ID ? styles.equalsKeySpan : undefined,
                        )}
                        registerItemRef={(element) =>
                            navigation.registerItemRef(definition.id, element)
                        }
                        isExcludedFromTabOrder={navigation.getTabIndex(definition.id) === -1}
                        onFocus={() => navigation.handleItemFocus(definition.id)}
                        onPress={(activationKind) => handleKeyPressed(definition, activationKind)}
                        armedLayer={viewModel.activeModifierLayer}
                    />
                ))}
            </div>

            <div className={cssClass(styles.sideCluster)}>
                <CalculatorDirectionalPadComponent
                    keys={directionalPadKeys}
                    armedLayer={viewModel.activeModifierLayer}
                    onKeyPressed={handleKeyPressed}
                />
            </div>
        </div>
    );
}

function resolveLayout(keysById: ReadonlyMap<string, KeyDefinition>): {
    readonly layoutKeys: readonly KeyDefinition[];
    readonly directionalPadKeys: Readonly<Record<string, KeyDefinition>>;
} {
    const seenIds = new Set<string>();
    const layoutKeys: KeyDefinition[] = [];

    for (const row of KEYPAD_LAYOUT) {
        for (const keyId of row) {
            if (seenIds.has(keyId)) {
                continue;
            }

            seenIds.add(keyId);
            layoutKeys.push(keysById.get(keyId) as KeyDefinition);
        }
    }

    const directionalPadKeys: Record<string, KeyDefinition> = {};
    for (const keyId of ["dpad-up", "dpad-left", "confirm", "dpad-right", "dpad-down"]) {
        directionalPadKeys[keyId] = keysById.get(keyId) as KeyDefinition;
    }

    return { layoutKeys: layoutKeys, directionalPadKeys: directionalPadKeys };
}

const KEYCAP_CLASS_NAMES: Readonly<Record<KeycapClass, string | undefined>> = {
    [KeycapClass.DIGIT]: keycapStyles.digitKey,
    [KeycapClass.OPERATOR]: keycapStyles.operatorKey,
    [KeycapClass.FUNCTION]: keycapStyles.functionKey,
    [KeycapClass.DELETE]: keycapStyles.deleteKey,
    [KeycapClass.CLEAR]: keycapStyles.clearKey,
    [KeycapClass.UTILITY]: keycapStyles.utilityKey,
    [KeycapClass.NAVIGATION]: keycapStyles.navigationKey,
    [KeycapClass.EVALUATE]: keycapStyles.evaluateKey,
};

function resolveKeycapClassName(key: KeyDefinition): string {
    return cssClass(KEYCAP_CLASS_NAMES[key.keycapClass]);
}
