import { ModifierLayer } from "../../domain/model/ModifierLayer";
import type { ButtonActivationKind } from "../services/FocusPreservationService";
import type { KeyDefinition } from "../services/KeyDefinition";
import { CalculatorKeycapComponent } from "./CalculatorKeycapComponent";
import { cssClass, joinClassNames } from "../utils/classNames";
import styles from "../styles/CalculatorDirectionalPadComponent.module.css";
import keycapStyles from "../styles/CalculatorKeycapComponent.module.css";

interface CalculatorDirectionalPadComponentProperties {
    readonly keys: Readonly<Record<string, KeyDefinition>>;
    readonly armedLayer: ModifierLayer;
    readonly onKeyPressed: (key: KeyDefinition, activationKind: ButtonActivationKind) => void;
}

/**
 * Cross-shaped directional pad with a center confirm key.
 *
 * The four arrows and the center key form an original cross geometry. The
 * pad shares the keycap press pipeline so focus never leaves the editor.
 */
export function CalculatorDirectionalPadComponent(
    props: CalculatorDirectionalPadComponentProperties,
) {
    const { keys, armedLayer, onKeyPressed } = props;

    return (
        <div className={cssClass(styles.directionalPad)} role="group" aria-label="Directional pad">
            <PadKey
                definition={keys["dpad-up"]}
                className={cssClass(styles.up)}
                armedLayer={armedLayer}
                onKeyPressed={onKeyPressed}
            />
            <PadKey
                definition={keys["dpad-left"]}
                className={cssClass(styles.left)}
                armedLayer={armedLayer}
                onKeyPressed={onKeyPressed}
            />
            <PadKey
                definition={keys["confirm"]}
                className={cssClass(styles.confirm)}
                armedLayer={armedLayer}
                onKeyPressed={onKeyPressed}
            />
            <PadKey
                definition={keys["dpad-right"]}
                className={cssClass(styles.right)}
                armedLayer={armedLayer}
                onKeyPressed={onKeyPressed}
            />
            <PadKey
                definition={keys["dpad-down"]}
                className={cssClass(styles.down)}
                armedLayer={armedLayer}
                onKeyPressed={onKeyPressed}
            />
        </div>
    );
}

interface PadKeyProperties {
    readonly definition: KeyDefinition | undefined;
    readonly className: string;
    readonly armedLayer: ModifierLayer;
    readonly onKeyPressed: (key: KeyDefinition, activationKind: ButtonActivationKind) => void;
}

function PadKey(props: PadKeyProperties) {
    const { definition, className, armedLayer, onKeyPressed } = props;

    if (definition === undefined) {
        return <span aria-hidden="true" className={cssClass(styles.emptyCell)} />;
    }

    return (
        <CalculatorKeycapComponent
            customClassName={joinClassNames(keycapStyles.navigationKey, className)}
            key={definition.id}
            keyDefinition={definition}
            registerItemRef={() => undefined}
            onFocus={() => undefined}
            onPress={(activationKind) => onKeyPressed(definition, activationKind)}
            armedLayer={armedLayer}
        />
    );
}
