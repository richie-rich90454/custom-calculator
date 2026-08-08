import { ScientificFunctionDefinition } from "./ScientificFunctionDefinition";

export interface ScientificFunctionCatalogService {
    getAllFunctions(): readonly ScientificFunctionDefinition[];
    getFunction(functionName: string): ScientificFunctionDefinition | null;
    hasFunction(functionName: string): boolean;
    getFunctionNames(): readonly string[];
}
