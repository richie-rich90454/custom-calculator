import { HistoryEntry } from "../../domain/model/HistoryEntry";
import type { HistoryRepository } from "../../domain/repositories/HistoryRepository";

export class InMemoryHistoryRepository implements HistoryRepository {
    private readonly entries: HistoryEntry[] = [];

    public async loadHistoryEntries(): Promise<readonly HistoryEntry[]> {
        return [...this.entries].reverse();
    }

    public async saveHistoryEntry(entry: HistoryEntry): Promise<void> {
        this.entries.push(entry);
    }

    public async deleteHistoryEntry(historyEntryId: string): Promise<void> {
        const index = this.entries.findIndex((entry) => entry.id === historyEntryId);

        if (index >= 0) {
            this.entries.splice(index, 1);
        }
    }

    public async clearHistory(): Promise<void> {
        this.entries.length = 0;
    }
}
