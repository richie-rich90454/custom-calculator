import { VariableAssignment } from "../../domain/model/VariableAssignment";
import type { VariablesRepository } from "../../domain/repositories/VariablesRepository";
import { CalculatorDexieDatabase } from "./CalculatorDexieDatabase";

export class IndexedDbVariablesRepository implements VariablesRepository {
    public constructor(private readonly database: CalculatorDexieDatabase) {}

    public async loadVariables(): Promise<readonly VariableAssignment[]> {
        const records = await this.database.variables.toArray();

        return records.map((record) => this.database.fromVariableAssignmentRecord(record));
    }

    public async saveVariable(variable: VariableAssignment): Promise<void> {
        await this.database.variables.put(this.database.toVariableAssignmentRecord(variable));
    }

    public async deleteVariable(variableName: string): Promise<void> {
        await this.database.variables.delete(variableName);
    }

    public async clearVariables(): Promise<void> {
        await this.database.variables.clear();
    }
}
