import { VariableAssignment } from "../model/VariableAssignment";

export interface VariablesRepository {
  loadVariables(): Promise<readonly VariableAssignment[]>;
  saveVariable(variable: VariableAssignment): Promise<void>;
  deleteVariable(variableName: string): Promise<void>;
  clearVariables(): Promise<void>;
}
