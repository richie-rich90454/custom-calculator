import type { ConstantCatalogService } from "../../domain/services/ConstantCatalogService";
import type { ScientificFunctionCatalogService } from "../../domain/services/ScientificFunctionCatalogService";
import type { ExpressionVariablePromptService } from "./ExpressionVariablePromptService";

const IDENTIFIER_PATTERN = /[a-zA-Z][a-zA-Z0-9_]*/g;
const MATHJS_RESERVED_SYMBOLS = new Set([
    "i",
    "true",
    "false",
    "null",
    "undefined",
    "Infinity",
    "NaN",
]);

/**
 * Default CALC variable prompt service.
 *
 * Identifiers in the expression that are not functions, constants, math.js
 * reserved symbols, or known variables are reported as missing so CALC can
 * ask the user for their values.
 */
export class DefaultExpressionVariablePromptService implements ExpressionVariablePromptService {
    private readonly knownSymbols: ReadonlySet<string>;

    public constructor(
        functionCatalogService: ScientificFunctionCatalogService,
        constantCatalogService: ConstantCatalogService,
    ) {
        this.knownSymbols = new Set([
            ...functionCatalogService.getFunctionNames(),
            ...constantCatalogService.getConstantIdentifiers(),
            ...MATHJS_RESERVED_SYMBOLS,
            "ans",
            "pi",
            "e",
        ]);
    }

    public resolveMissingVariableNames(
        expressionText: string,
        knownVariableNames: readonly string[],
    ): readonly string[] {
        const missingNames = new Set<string>();
        const knownVariables = new Set(knownVariableNames);

        for (const match of expressionText.matchAll(IDENTIFIER_PATTERN)) {
            const identifier = match[0];

            if (this.knownSymbols.has(identifier) || knownVariables.has(identifier)) {
                continue;
            }

            missingNames.add(identifier);
        }

        return [...missingNames];
    }
}
