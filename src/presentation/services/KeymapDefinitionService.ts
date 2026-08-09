import type { KeyDefinition } from "./KeyDefinition";

/**
 * Supplies the frozen, full keymap of the instrument.
 *
 * The catalog is the single source of truth for every keycap in every layer.
 * It is frozen at construction time so the definition cannot drift at runtime.
 */
export interface KeymapDefinitionService {
    getAllKeys(): readonly KeyDefinition[];
    getKey(keyId: string): KeyDefinition | null;
}
