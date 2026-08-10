import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";

export interface ExpressionTexConversionResult {
    readonly tex: string | null;
}

export interface MathJsExpressionTexConverter {
    convertToTex(expressionText: string): ExpressionTexConversionResult;
}

/**
 * Converts a typed expression into LaTeX for the pretty preview.
 *
 * math.js parses the expression and renders its node tree to TeX. Custom
 * handlers make `log(a, b)` render as `\log_{a}(b)` (base first, the
 * scientific-calculator convention) and `ln` as `\ln`. Expressions that do
 * not parse (incomplete input such as `2+` or `sin(`) return null so the
 * preview can fall back to showing the raw text.
 */
export class DefaultMathJsExpressionTexConverter implements MathJsExpressionTexConverter {
    public constructor(private readonly instanceProvider: MathJsInstanceProvider) {}

    public convertToTex(expressionText: string): ExpressionTexConversionResult {
        const math = this.instanceProvider.getInstance();

        try {
            const tex = math.parse(expressionText).toTex({
                handler: createCustomTexHandlers(),
            });

            return { tex: tex };
        } catch {
            return { tex: null };
        }
    }
}

interface TexHandlerOptions {
    readonly parenthesis?: string;
    readonly implicit?: string;
}

function createCustomTexHandlers(): Record<
    string,
    (node: TexFunctionNode, options: TexHandlerOptions) => string
> {
    return {
        log: (node, options) => {
            const args = node.args;

            if (args.length >= 2) {
                return `\\log_{${args[0]!.toTex(options)}}\\left(${args
                    .slice(1)
                    .map((argument) => argument.toTex(options))
                    .join(", ")}\\right)`;
            }

            return `\\log\\left(${args[0]!.toTex(options)}\\right)`;
        },
        ln: (node, options) => {
            return `\\ln\\left(${node.args[0]!.toTex(options)}\\right)`;
        },
    };
}

interface TexFunctionNode {
    readonly args: readonly { toTex(options: TexHandlerOptions): string }[];
}
