import { describe, expect, it } from "vitest";
import { DefaultAppModeRegistryService } from "./DefaultAppModeRegistryService";

describe("DefaultAppModeRegistryService", () => {
    const registry = new DefaultAppModeRegistryService();

    it("registers the ten apps with badges one through nine and zero", () => {
        const apps = registry.getAllApps();

        expect(apps).toHaveLength(10);
        expect(apps.map((app) => app.badge)).toEqual([
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "0",
        ]);
    });

    it("numbers the app ids in the required order", () => {
        const ids = registry.getAllApps().map((app) => app.id);

        expect(ids).toEqual([
            "calculate",
            "complex",
            "base-n",
            "matrix",
            "vector",
            "statistics",
            "table",
            "equation",
            "calculus",
            "ratio",
        ]);
    });

    it("defaults to the calculate app", () => {
        expect(registry.getDefaultAppId()).toBe("calculate");
    });

    it("makes only the calculate app available", () => {
        const unavailable = registry.getAllApps().filter((app) => !app.isAvailable);

        expect(unavailable.length).toBe(9);
        for (const app of unavailable) {
            expect(app.availabilityReason).not.toBeNull();
        }

        expect(registry.getApp("calculate")?.isAvailable).toBe(true);
    });

    it("looks up an app by id", () => {
        expect(registry.getApp("matrix")?.name).toBe("Matrix");
        expect(registry.getApp("missing")).toBeNull();
    });
});
