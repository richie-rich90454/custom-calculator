import type { HistoryEntry } from "../../domain/model/HistoryEntry";
import type { HistoryReplayResolution, ReplayHistoryService } from "./ReplayHistoryService";

/**
 * Default replay resolution for stepping through newest-first history.
 *
 * Back moves toward older entries, forward toward newer ones. Stepping from
 * the live expression replaces it with the target entry. While replaying,
 * moving between distinct entries replaces the expression; pressing the same
 * direction repeatedly past the newest or oldest entry inserts the boundary
 * entry text into the current expression as a multi-replay.
 */
export class DefaultReplayHistoryService implements ReplayHistoryService {
    public resolveBack(
        expressionText: string,
        historyEntries: readonly HistoryEntry[],
        replayIndex: number | null,
    ): HistoryReplayResolution {
        if (historyEntries.length === 0) {
            return { expressionText: expressionText, replayIndex: null, changed: false };
        }

        const nextIndex = Math.min(historyEntries.length - 1, (replayIndex ?? -1) + 1);

        return this.resolve(expressionText, historyEntries, replayIndex, nextIndex);
    }

    public resolveForward(
        expressionText: string,
        historyEntries: readonly HistoryEntry[],
        replayIndex: number | null,
    ): HistoryReplayResolution {
        if (historyEntries.length === 0) {
            return { expressionText: expressionText, replayIndex: null, changed: false };
        }

        const nextIndex = replayIndex === null ? 0 : Math.max(0, replayIndex - 1);

        return this.resolve(expressionText, historyEntries, replayIndex, nextIndex);
    }

    private resolve(
        expressionText: string,
        historyEntries: readonly HistoryEntry[],
        replayIndex: number | null,
        nextIndex: number,
    ): HistoryReplayResolution {
        const targetEntry = historyEntries[nextIndex]!;

        if (replayIndex === null || nextIndex !== replayIndex) {
            return {
                expressionText: targetEntry.expressionText,
                replayIndex: nextIndex,
                changed: true,
            };
        }

        return {
            expressionText: expressionText + targetEntry.expressionText,
            replayIndex: nextIndex,
            changed: true,
        };
    }
}
