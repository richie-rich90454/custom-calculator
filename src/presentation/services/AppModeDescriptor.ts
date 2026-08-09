/**
 * Describes one of the instrument's apps shown on the home icon menu.
 */
export interface AppModeDescriptor {
    readonly id: string;
    readonly name: string;
    /**
     * Numeric badge printed on the menu icon. Apps are numbered 1-9 and 0.
     */
    readonly badge: string;
    readonly ariaLabel: string;
    readonly isAvailable: boolean;
    readonly availabilityReason: string | null;
    readonly iconId: string;
}
