import { describe, expect, it } from "vitest";
import { HistoryEntry } from "../../domain/model/HistoryEntry";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { DefaultReplayHistoryService } from "./DefaultReplayHistoryService";

function createEntry(id: string, expressionText: string): HistoryEntry {
    return new HistoryEntry(
        id,
        expressionText,
        "4",
        AngleMode.DEG,
        NumericMode.STANDARD,
        false,
        "2026-01-01T00:00:00.000Z",
    );
}

describe("DefaultReplayHistoryService", () => {
    const service = new DefaultReplayHistoryService();

    it("does not step when history is empty", () => {
        const resolution = service.resolveBack("live", [], null);

        expect(resolution.changed).toBe(false);
        expect(resolution.expressionText).toBe("live");
        expect(resolution.replayIndex).toBeNull();
    });

    it("does not step forward when history is empty", () => {
        const resolution = service.resolveForward("live", [], null);

        expect(resolution.changed).toBe(false);
        expect(resolution.expressionText).toBe("live");
        expect(resolution.replayIndex).toBeNull();
    });

    it("replaces the live expression with the newest entry on the first back", () => {
        const resolution = service.resolveBack(
            "live",
            [createEntry("a", "1+1"), createEntry("b", "2+2")],
            null,
        );

        expect(resolution.changed).toBe(true);
        expect(resolution.expressionText).toBe("1+1");
        expect(resolution.replayIndex).toBe(0);
    });

    it("moves back to an older entry by replacing the expression", () => {
        const resolution = service.resolveBack(
            "1+1",
            [createEntry("a", "1+1"), createEntry("b", "2+2")],
            0,
        );

        expect(resolution.changed).toBe(true);
        expect(resolution.expressionText).toBe("2+2");
        expect(resolution.replayIndex).toBe(1);
    });

    it("inserts the boundary entry text on repeated back past the oldest", () => {
        const resolution = service.resolveBack(
            "2+2",
            [createEntry("a", "1+1"), createEntry("b", "2+2")],
            1,
        );

        expect(resolution.changed).toBe(true);
        expect(resolution.expressionText).toBe("2+22+2");
        expect(resolution.replayIndex).toBe(1);
    });

    it("moves forward to a newer entry by replacing the expression", () => {
        const resolution = service.resolveForward(
            "2+2",
            [createEntry("a", "1+1"), createEntry("b", "2+2")],
            1,
        );

        expect(resolution.changed).toBe(true);
        expect(resolution.expressionText).toBe("1+1");
        expect(resolution.replayIndex).toBe(0);
    });

    it("replaces the live expression with the newest entry on first forward", () => {
        const resolution = service.resolveForward(
            "live",
            [createEntry("a", "1+1"), createEntry("b", "2+2")],
            null,
        );

        expect(resolution.changed).toBe(true);
        expect(resolution.expressionText).toBe("1+1");
        expect(resolution.replayIndex).toBe(0);
    });

    it("inserts the boundary entry text on repeated forward past the newest", () => {
        const resolution = service.resolveForward(
            "1+1",
            [createEntry("a", "1+1"), createEntry("b", "2+2")],
            0,
        );

        expect(resolution.changed).toBe(true);
        expect(resolution.expressionText).toBe("1+11+1");
        expect(resolution.replayIndex).toBe(0);
    });

    it("clamps back to the oldest entry when a single entry exists", () => {
        const resolution = service.resolveBack("live", [createEntry("a", "7*6")], null);

        expect(resolution.changed).toBe(true);
        expect(resolution.expressionText).toBe("7*6");
        expect(resolution.replayIndex).toBe(0);
    });
});
