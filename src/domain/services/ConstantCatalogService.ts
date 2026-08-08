import { ScientificConstant } from "../model/ScientificConstant";

export interface ConstantCatalogService {
    getAllConstants(): readonly ScientificConstant[];
    getConstantById(constantId: string): ScientificConstant | null;
    getConstantInsertText(constantId: string): string | null;
    hasIdentifier(identifier: string): boolean;
    getConstantIdentifiers(): readonly string[];
}
