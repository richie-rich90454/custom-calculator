import { VariableAssignment } from "../../domain/model/VariableAssignment";
import type { VariablesRepository } from "../../domain/repositories/VariablesRepository";

export class InMemoryVariablesRepository implements VariablesRepository {
  private readonly variables: VariableAssignment[] = [];

  public async loadVariables(): Promise<readonly VariableAssignment[]> {
    return [...this.variables];
  }

  public async saveVariable(variable: VariableAssignment): Promise<void> {
    const existingIndex = this.variables.findIndex(
      (candidate) => candidate.name === variable.name
    );

    if (existingIndex >= 0) {
      this.variables.splice(existingIndex, 1, variable);
    } else {
      this.variables.push(variable);
    }
  }

  public async deleteVariable(variableName: string): Promise<void> {
    const existingIndex = this.variables.findIndex(
      (candidate) => candidate.name === variableName
    );

    if (existingIndex >= 0) {
      this.variables.splice(existingIndex, 1);
    }
  }

  public async clearVariables(): Promise<void> {
    this.variables.length = 0;
  }
}
