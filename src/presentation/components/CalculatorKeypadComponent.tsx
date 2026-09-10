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

const TOP_LAYOUT: readonly (readonly string[])[] = [
    ["menu", "shift", "alpha", "optn", "calc"],
    ["integral", "limit", "sum", "fraction", "sqrt"],
    ["square", "power", "log", "ln", "reciprocal"],
    ["pi", "sin", "cos", "tan", "hyp"],
    ["xy", "sto", "eng", "sd", "m-plus"],
    ["paren-open", "paren-close", "x10x", "del", "ac"],
];

const DIGIT_LAYOUT: readonly (readonly string[])[] = [
    ["7", "8", "9", "divide"],
    ["4", "5", "6", "multiply"],
    ["1", "2", "3", "subtract"],
    ["0", "decimal", "comma", "add"],
];

const EQUALS_KEY_ID = "equals";
const ANS_KEY_ID = "ans";
const TOP_COLUMN_COUNT = 5;
const DIGIT_COLUMN_COUNT = 4;

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

    const { topKeys, digitKeys, equalsKey, ansKey, directionalPadKeys } = useMemo(
        () => resolveLayout(keysById),
        [keysById],
    );

    const topIds = useMemo(() => topKeys.map((key) => key.id), [topKeys]);
    const digitIds = useMemo(() => digitKeys.map((key) => key.id), [digitKeys]);

    const topNavigation = useKeypadGridNavigation(topIds, TOP_COLUMN_COUNT);
    const digitNavigation = useKeypadGridNavigation(digitIds, DIGIT_COLUMN_COUNT);

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
                role="toolbar"
                aria-label="Calculator keypad"
                className={cssClass(styles.keyGrid)}
                tabIndex={-1}
                onKeyDown={topNavigation.handleGridKeyDown}
            >
                {topKeys.map((definition) => (
                    <CalculatorKeycapComponent
                        key={definition.id}
                        keyDefinition={definition}
                        customClassName={resolveKeycapClassName(definition)}
                        registerItemRef={(element) =>
                            topNavigation.registerItemRef(definition.id, element)
                        }
                        isExcludedFromTabOrder={topNavigation.getTabIndex(definition.id) === -1}
                        onFocus={() => topNavigation.handleItemFocus(definition.id)}
                        onPress={(activationKind) => handleKeyPressed(definition, activationKind)}
                        armedLayer={viewModel.activeModifierLayer}
                    />
                ))}
            </div>

            <div className={cssClass(styles.bottomSection)}>
                <div
                    role="toolbar"
                    aria-label="Calculator number keys"
                    className={cssClass(styles.digitGrid)}
                    tabIndex={-1}
                    onKeyDown={digitNavigation.handleGridKeyDown}
                >
                    {digitKeys.map((definition) => (
                        <CalculatorKeycapComponent
                            key={definition.id}
                            keyDefinition={definition}
                            customClassName={resolveKeycapClassName(definition)}
                            registerItemRef={(element) =>
                                digitNavigation.registerItemRef(definition.id, element)
                            }
                            isExcludedFromTabOrder={
                                digitNavigation.getTabIndex(definition.id) === -1
                            }
                            onFocus={() => digitNavigation.handleItemFocus(definition.id)}
                            onPress={(activationKind) =>
                                handleKeyPressed(definition, activationKind)
                            }
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
                    <CalculatorKeycapComponent
                        keyDefinition={ansKey}
                        customClassName={resolveKeycapClassName(ansKey)}
                        registerItemRef={() => undefined}
                        onFocus={() => undefined}
                        onPress={(activationKind) => handleKeyPressed(ansKey, activationKind)}
                        armedLayer={viewModel.activeModifierLayer}
                    />
                    <CalculatorKeycapComponent
                        keyDefinition={equalsKey}
                        customClassName={joinClassNames(
                            styles.equalsKey,
                            resolveKeycapClassName(equalsKey),
                        )}
                        registerItemRef={() => undefined}
                        onFocus={() => undefined}
                        onPress={(activationKind) => handleKeyPressed(equalsKey, activationKind)}
                        armedLayer={viewModel.activeModifierLayer}
                    />
                </div>
            </div>
        </div>
    );
}

function resolveLayout(keysById: ReadonlyMap<string, KeyDefinition>): {
    readonly topKeys: readonly KeyDefinition[];
    readonly digitKeys: readonly KeyDefinition[];
    readonly equalsKey: KeyDefinition;
    readonly ansKey: KeyDefinition;
    readonly directionalPadKeys: Readonly<Record<string, KeyDefinition>>;
} {
    const topKeys: KeyDefinition[] = [];

    for (const row of TOP_LAYOUT) {
        for (const keyId of row) {
            topKeys.push(requireKeyDefinition(keysById, keyId));
        }
    }

    const digitKeys: KeyDefinition[] = [];

    for (const row of DIGIT_LAYOUT) {
        for (const keyId of row) {
            digitKeys.push(requireKeyDefinition(keysById, keyId));
        }
    }

    const directionalPadKeys: Record<string, KeyDefinition> = {};
    for (const keyId of ["dpad-up", "dpad-left", "confirm", "dpad-right", "dpad-down"]) {
        directionalPadKeys[keyId] = requireKeyDefinition(keysById, keyId);
    }

    return {
        topKeys: topKeys,
        digitKeys: digitKeys,
        equalsKey: requireKeyDefinition(keysById, EQUALS_KEY_ID),
        ansKey: requireKeyDefinition(keysById, ANS_KEY_ID),
        directionalPadKeys: directionalPadKeys,
    };
}

function requireKeyDefinition(
    keysById: ReadonlyMap<string, KeyDefinition>,
    keyId: string,
): KeyDefinition {
    const key = keysById.get(keyId);

    if (key === undefined) {
        throw new Error(`Unknown key id in keypad layout: ${keyId}.`);
    }

    return key;
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
