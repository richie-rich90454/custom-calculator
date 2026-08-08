import type { CasBlockDescriptor } from "./CasBlockDescriptor";

export interface CasBlockParser {
    parseBlock(expressionText: string): CasBlockDescriptor | null;
}
