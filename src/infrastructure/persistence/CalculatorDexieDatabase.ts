import Dexie, { type Table } from "dexie";
import { HistoryEntry } from "../../domain/model/HistoryEntry";
import { VariableAssignment } from "../../domain/model/VariableAssignment";

export interface HistoryEntryRecord {
  readonly id: string;
  readonly expressionText: string;
  readonly resultText: string;
  readonly angleMode: string;
  readonly numericMode: string;
  readonly complexNumbersEnabled: boolean;
  readonly createdAt: string;
}

export interface VariableAssignmentRecord {
  readonly name: string;
  readonly valueText: string;
  readonly numericMode: string;
  readonly updatedAt: string;
}

export class CalculatorDexieDatabase extends Dexie {
  public readonly history!: Table<HistoryEntryRecord, string>;
  public readonly variables!: Table<VariableAssignmentRecord, string>;

  public constructor(databaseName: string) {
    super(databaseName);

    this.version(1).stores({
      history: "id, createdAt",
      variables: "name",
    });
  }

  public toHistoryEntryRecord(entry: HistoryEntry): HistoryEntryRecord {
    return {
      id: entry.id,
      expressionText: entry.expressionText,
      resultText: entry.resultText,
      angleMode: entry.angleMode,
      numericMode: entry.numericMode,
      complexNumbersEnabled: entry.complexNumbersEnabled,
      createdAt: entry.createdAt,
    };
  }

  public fromHistoryEntryRecord(
    record: HistoryEntryRecord
  ): HistoryEntry {
    return new HistoryEntry(
      record.id,
      record.expressionText,
      record.resultText,
      record.angleMode as HistoryEntry["angleMode"],
      record.numericMode as HistoryEntry["numericMode"],
      record.complexNumbersEnabled,
      record.createdAt
    );
  }

  public toVariableAssignmentRecord(
    variable: VariableAssignment
  ): VariableAssignmentRecord {
    return {
      name: variable.name,
      valueText: variable.valueText,
      numericMode: variable.numericMode,
      updatedAt: variable.updatedAt,
    };
  }

  public fromVariableAssignmentRecord(
    record: VariableAssignmentRecord
  ): VariableAssignment {
    return new VariableAssignment(
      record.name,
      record.valueText,
      record.numericMode as VariableAssignment["numericMode"],
      record.updatedAt
    );
  }
}
