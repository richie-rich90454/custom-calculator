/**
 * Finds the symbols a CALC evaluation needs values for.
 */
export interface ExpressionVariablePromptService {
    /**
     * Returns the deduplicated names of identifiers in the expression that
     * are neither functions, constants, nor already-known variables.
     */
    resolveMissingVariableNames(
        expressionText: string,
        knownVariableNames: readonly string[],
    ): readonly string[];
}
