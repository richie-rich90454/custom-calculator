import type { HistoryEntry } from "../../domain/model/HistoryEntry";

export interface HistoryReplayResolution {
    readonly expressionText: string;
    readonly replayIndex: number | null;
    readonly changed: boolean;
}

/**
 * Resolves the next expression text and replay index when the user steps
 * through history with the replay arrow keys.
 *
 * History is newest-first. Back moves toward older entries (higher index),
 * forward moves toward newer entries (lower index). Stepping from the live
 * expression replaces it with the boundary entry; once replaying, moving
 * between distinct entries replaces the expression, while pressing the same
 * direction repeatedly past the newest or oldest entry inserts the boundary
 * entry text into the current expression as a multi-replay.
 */
export interface ReplayHistoryService {
    resolveBack(
        expressionText: string,
        historyEntries: readonly HistoryEntry[],
        replayIndex: number | null,
    ): HistoryReplayResolution;
    resolveForward(
        expressionText: string,
        historyEntries: readonly HistoryEntry[],
        replayIndex: number | null,
    ): HistoryReplayResolution;
}
