import type { KeyAction } from "./KeyAction";

/**
 * One silkscreen layer printed on a keycap: the primary ink, the copper SHIFT
 * layer, or the teal ALPHA layer.
 */
export interface KeyLayerDefinition {
    readonly label: string;
    readonly ariaLabel: string;
    readonly action: KeyAction;
}

/**
 * Visual role of a keycap used to pick the base keycap color.
 */
export enum KeycapClass {
    DIGIT = "DIGIT",
    OPERATOR = "OPERATOR",
    FUNCTION = "FUNCTION",
    DELETE = "DELETE",
    CLEAR = "CLEAR",
    UTILITY = "UTILITY",
    NAVIGATION = "NAVIGATION",
    EVALUATE = "EVALUATE",
}

/**
 * A single keycap with up to three silkscreen layers.
 *
 * Every key in the instrument is described by this data model. The SHIFT and
 * ALPHA layers are optional and mirror the sticky modifier layers: pressing
 * the keycap with SHIFT armed resolves the shift layer, with ALPHA armed the
 * alpha layer, and otherwise the primary layer.
 */
export interface KeyDefinition {
    readonly id: string;
    readonly primary: KeyLayerDefinition;
    readonly shift?: KeyLayerDefinition;
    readonly alpha?: KeyLayerDefinition;
    readonly keycapClass: KeycapClass;
}
