import type { AppModeDescriptor } from "./AppModeDescriptor";
import type { AppModeRegistryService } from "./AppModeRegistryService";

/**
 * Registers the ten apps of the instrument.
 *
 * Apps that are delivered in later phases are registered as unavailable so
 * the home menu can render them with a clear reason instead of a dead entry.
 */
export class DefaultAppModeRegistryService implements AppModeRegistryService {
    private static readonly APPS: readonly AppModeDescriptor[] = [
        {
            id: "calculate",
            name: "Calculate",
            badge: "1",
            ariaLabel: "Calculate app, number 1",
            isAvailable: true,
            availabilityReason: null,
            iconId: "calculate",
        },
        {
            id: "complex",
            name: "Complex",
            badge: "2",
            ariaLabel: "Complex app, number 2",
            isAvailable: true,
            availabilityReason: null,
            iconId: "complex",
        },
        {
            id: "base-n",
            name: "Base-N",
            badge: "3",
            ariaLabel: "Base-N app, number 3",
            isAvailable: true,
            availabilityReason: null,
            iconId: "base-n",
        },
        {
            id: "matrix",
            name: "Matrix",
            badge: "4",
            ariaLabel: "Matrix app, number 4",
            isAvailable: true,
            availabilityReason: null,
            iconId: "matrix",
        },
        {
            id: "vector",
            name: "Vector",
            badge: "5",
            ariaLabel: "Vector app, number 5",
            isAvailable: true,
            availabilityReason: null,
            iconId: "vector",
        },
        {
            id: "statistics",
            name: "Statistics",
            badge: "6",
            ariaLabel: "Statistics app, number 6",
            isAvailable: false,
            availabilityReason: "The statistics app arrives in a later release.",
            iconId: "statistics",
        },
        {
            id: "table",
            name: "Table",
            badge: "7",
            ariaLabel: "Table app, number 7",
            isAvailable: false,
            availabilityReason: "The table app arrives in a later release.",
            iconId: "table",
        },
        {
            id: "equation",
            name: "Equation",
            badge: "8",
            ariaLabel: "Equation app, number 8",
            isAvailable: false,
            availabilityReason: "The equation app arrives in a later release.",
            iconId: "equation",
        },
        {
            id: "calculus",
            name: "Calculus",
            badge: "9",
            ariaLabel: "Calculus app, number 9",
            isAvailable: false,
            availabilityReason: "The calculus app arrives in a later release.",
            iconId: "calculus",
        },
        {
            id: "ratio",
            name: "Ratio",
            badge: "0",
            ariaLabel: "Ratio app, number 0",
            isAvailable: false,
            availabilityReason: "The ratio app arrives in a later release.",
            iconId: "ratio",
        },
    ];

    public getAllApps(): readonly AppModeDescriptor[] {
        return DefaultAppModeRegistryService.APPS;
    }

    public getApp(appId: string): AppModeDescriptor | null {
        return DefaultAppModeRegistryService.APPS.find((app) => app.id === appId) ?? null;
    }

    public getDefaultAppId(): string {
        return "calculate";
    }
}
