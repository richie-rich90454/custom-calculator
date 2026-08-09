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

    it("marks the shipped apps available and the rest unavailable", () => {
        const availableApps = ["calculate", "complex", "base-n", "matrix", "vector"];
        const apps = registry.getAllApps();

        for (const app of apps) {
            if (availableApps.includes(app.id)) {
                expect(app.isAvailable).toBe(true);
                expect(app.availabilityReason).toBeNull();
            } else {
                expect(app.isAvailable).toBe(false);
                expect(app.availabilityReason).not.toBeNull();
            }
        }
    });

    it("looks up an app by id", () => {
        expect(registry.getApp("matrix")?.name).toBe("Matrix");
        expect(registry.getApp("missing")).toBeNull();
    });
});
