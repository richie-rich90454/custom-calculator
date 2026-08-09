import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { DefaultKeymapDefinitionService } from "../services/DefaultKeymapDefinitionService";
import { CalculatorKeycapComponent } from "./CalculatorKeycapComponent";
import styles from "../styles/CalculatorKeycapComponent.module.css";

describe("CalculatorKeycapComponent", () => {
    const keymap = new DefaultKeymapDefinitionService();

    function requireKey(keyId: string) {
        const key = keymap.getKey(keyId);

        if (key === null) {
            throw new Error(`Missing key: ${keyId}`);
        }

        return key;
    }

    it("resolves the alpha layer when alpha is armed", () => {
        const { container } = render(
            <CalculatorKeycapComponent
                keyDefinition={requireKey("sin")}
                armedLayer={ModifierLayer.ALPHA}
                registerItemRef={() => undefined}
                onFocus={() => undefined}
                onPress={() => undefined}
            />,
        );

        expect(
            screen.getByRole("button", { name: "Insert the variable A, alpha layer" }),
        ).toHaveTextContent("A");
        expect(container.querySelector(`.${styles.alphaLabelActive}`)).not.toBeNull();
    });

    it("resolves the shift layer when shift is armed", () => {
        render(
            <CalculatorKeycapComponent
                keyDefinition={requireKey("cos")}
                armedLayer={ModifierLayer.SHIFT}
                registerItemRef={() => undefined}
                onFocus={() => undefined}
                onPress={() => undefined}
            />,
        );

        expect(
            screen.getByRole("button", { name: "Insert an arccosine, shift layer" }),
        ).toBeInTheDocument();
    });

    it("resolves the primary layer when no modifier is armed", () => {
        render(
            <CalculatorKeycapComponent
                keyDefinition={requireKey("7")}
                armedLayer={ModifierLayer.NONE}
                registerItemRef={() => undefined}
                onFocus={() => undefined}
                onPress={() => undefined}
            />,
        );

        expect(screen.getByRole("button", { name: "Digit seven" })).toBeInTheDocument();
    });
});
