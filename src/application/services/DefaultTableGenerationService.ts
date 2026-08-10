import type { EquationSolvingGateway } from "../../domain/services/EquationSolvingGateway";
import type {
    TableGenerationResult,
    TableGenerationService,
    TableRow,
} from "./TableGenerationService";

const MAX_ROW_COUNT = 200;

/**
 * Generates a table of f(x) values over a range.
 *
 * Both expressions are evaluated through the equation-solving gateway so no
 * math.js import escapes the infrastructure layer.
 */
export class DefaultTableGenerationService implements TableGenerationService {
    public constructor(private readonly gateway: EquationSolvingGateway) {}

    public generate(
        expressionText: string,
        start: number,
        end: number,
        step: number,
        secondExpressionText?: string,
    ): TableGenerationResult {
        if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(step)) {
            return { rows: [], errorMessage: "Start, end, and step must be finite numbers." };
        }

        if (step <= 0) {
            return { rows: [], errorMessage: "The step must be greater than zero." };
        }

        if (end < start) {
            return { rows: [], errorMessage: "The end value must not be below the start value." };
        }

        const rowCount = Math.floor((end - start) / step) + 1;

        if (rowCount > MAX_ROW_COUNT) {
            return {
                rows: [],
                errorMessage: `The range generates ${rowCount} rows, above the limit of ${MAX_ROW_COUNT}.`,
            };
        }

        const rows: TableRow[] = [];

        for (let index = 0; index < rowCount; index += 1) {
            const x = start + index * step;
            const fx = this.evaluateOrNull(expressionText, x);
            const gx =
                secondExpressionText === undefined || secondExpressionText.trim() === ""
                    ? undefined
                    : this.evaluateOrNull(secondExpressionText, x);

            rows.push({ x, fx, ...(gx === undefined ? {} : { gx }) });
        }

        return { rows, errorMessage: null };
    }

    private evaluateOrNull(expressionText: string, x: number): number | null {
        const value = this.gateway.evaluate(expressionText, "x", x);

        return Number.isFinite(value) ? value : null;
    }
}
