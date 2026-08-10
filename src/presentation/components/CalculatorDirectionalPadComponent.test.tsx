import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModifierLayer } from "../../domain/model/ModifierLayer";
import { DefaultKeymapDefinitionService } from "../services/DefaultKeymapDefinitionService";
import type { KeyDefinition } from "../services/KeyDefinition";
import {
    createCalculatorTestHarness,
    renderWithCalculatorContext,
} from "../../test/calculatorTestHarness";
import { CalculatorDirectionalPadComponent } from "./CalculatorDirectionalPadComponent";

function buildPadKeys(): Readonly<Record<string, KeyDefinition>> {
    const keymap = new DefaultKeymapDefinitionService();
    const keys: Record<string, KeyDefinition> = {};

    for (const keyId of ["dpad-up", "dpad-left", "confirm", "dpad-right", "dpad-down"]) {
        const key = keymap.getKey(keyId);

        if (key !== null) {
            keys[keyId] = key;
        }
    }

    return keys;
}

describe("CalculatorDirectionalPadComponent", () => {
    it("renders the cross-shaped pad with a confirm key", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(
            harness,
            <CalculatorDirectionalPadComponent
                keys={buildPadKeys()}
                armedLayer={ModifierLayer.NONE}
                onKeyPressed={() => undefined}
            />,
        );

        expect(
            screen.getByRole("button", { name: "Step back through history" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Step forward through history" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Move left" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Move right" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    });

    it("forwards an arrow press with its key definition", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();
        const pressedIds: string[] = [];

        renderWithCalculatorContext(
            harness,
            <CalculatorDirectionalPadComponent
                keys={buildPadKeys()}
                armedLayer={ModifierLayer.NONE}
                onKeyPressed={(key) => {
                    pressedIds.push(key.id);
                }}
            />,
        );

        await user.click(screen.getByRole("button", { name: "Move left" }));

        expect(pressedIds).toEqual(["dpad-left"]);
    });

    it("forwards the confirm press", async () => {
        const user = userEvent.setup();
        const harness = createCalculatorTestHarness();
        const pressedIds: string[] = [];

        renderWithCalculatorContext(
            harness,
            <CalculatorDirectionalPadComponent
                keys={buildPadKeys()}
                armedLayer={ModifierLayer.NONE}
                onKeyPressed={(key) => {
                    pressedIds.push(key.id);
                }}
            />,
        );

        await user.click(screen.getByRole("button", { name: "Confirm" }));

        expect(pressedIds).toEqual(["confirm"]);
    });

    it("fills missing pad slots with empty cells", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(
            harness,
            <CalculatorDirectionalPadComponent
                keys={{}}
                armedLayer={ModifierLayer.NONE}
                onKeyPressed={() => undefined}
            />,
        );

        expect(
            screen.queryByRole("button", { name: "Step back through history" }),
        ).not.toBeInTheDocument();
    });

    it("reports focus on a pad button", () => {
        const harness = createCalculatorTestHarness();

        renderWithCalculatorContext(
            harness,
            <CalculatorDirectionalPadComponent
                keys={buildPadKeys()}
                armedLayer={ModifierLayer.NONE}
                onKeyPressed={() => undefined}
            />,
        );

        screen.getByRole("button", { name: "Confirm" }).focus();

        expect(screen.getByRole("button", { name: "Confirm" })).toHaveFocus();
    });
});
