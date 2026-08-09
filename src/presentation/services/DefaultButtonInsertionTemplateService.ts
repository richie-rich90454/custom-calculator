import type { CalculatorButtonDefinition } from "./CalculatorButtonDefinition";
import { CalculatorButtonInsertionBehavior } from "./CalculatorButtonInsertionBehavior";
import type { CalculatorButtonTemplate } from "./CalculatorButtonTemplate";
import type { ButtonInsertionTemplateService } from "./ButtonInsertionTemplateService";

/**
 * Default button insertion template service.
 *
 * Plain characters, operators, functions, tokens, and calculus templates each
 * map to a template with a precise cursor offset. Calculus operation buttons
 * use placeholder templates so the cursor lands on the first editable slot.
 */
export class DefaultButtonInsertionTemplateService implements ButtonInsertionTemplateService {
    private static readonly TEMPLATE_BY_FUNCTION_NAME: Readonly<Record<string, string>> = {
        derivative: "derivative(, x)",
        numericDerivative: "numericDerivative(, x, )",
        integral: "integral(, x, a, b)",
        integrate: "integrate(, x)",
        limit: "limit(, x, 0)",
        taylor: "taylor(, x, 0, 5)",
        sum: "sum(, n, 1, 10)",
        product: "product(, n, 1, 5)",
        logBase: "log(, )",
        fraction: "/",
        mixedFraction: "+/",
    };

    public resolveTemplate(button: CalculatorButtonDefinition): CalculatorButtonTemplate {
        switch (button.behavior) {
            case CalculatorButtonInsertionBehavior.INSERT_CHARACTER:
                return this.resolveCharacterTemplate(button.value);
            case CalculatorButtonInsertionBehavior.INSERT_OPERATOR:
                return this.resolveOperatorTemplate(button.value);
            case CalculatorButtonInsertionBehavior.INSERT_FUNCTION:
            case CalculatorButtonInsertionBehavior.INSERT_WRAPPED_SELECTION:
                return this.resolveFunctionTemplate(button.value);
            case CalculatorButtonInsertionBehavior.INSERT_CONSTANT:
            case CalculatorButtonInsertionBehavior.INSERT_VARIABLE:
                return this.resolveTokenTemplate(button.value);
            case CalculatorButtonInsertionBehavior.INSERT_TEMPLATE:
                return this.resolveTemplateTemplate(button.value);
            default:
                return this.resolveCharacterTemplate(button.value);
        }
    }

    public resolveDigitTemplate(digit: string): CalculatorButtonTemplate {
        return this.resolveCharacterTemplate(digit);
    }

    public resolveOperatorTemplate(operator: string): CalculatorButtonTemplate {
        return {
            text: operator,
            cursorOffset: 1,
            wrapsSelection: false,
            wrapOpenText: "",
            wrapCloseText: "",
        };
    }

    public resolveFunctionTemplate(functionName: string): CalculatorButtonTemplate {
        const templateText =
            DefaultButtonInsertionTemplateService.TEMPLATE_BY_FUNCTION_NAME[functionName];

        if (templateText !== undefined) {
            return this.resolveTemplateTemplate(functionName);
        }

        const invocationText = `${functionName}(`;

        return {
            text: invocationText,
            cursorOffset: invocationText.length,
            wrapsSelection: true,
            wrapOpenText: invocationText,
            wrapCloseText: ")",
        };
    }

    public resolveTokenTemplate(token: string): CalculatorButtonTemplate {
        return {
            text: token,
            cursorOffset: token.length,
            wrapsSelection: false,
            wrapOpenText: "",
            wrapCloseText: "",
        };
    }

    public resolveCharacterTemplate(character: string): CalculatorButtonTemplate {
        return {
            text: character,
            cursorOffset: 1,
            wrapsSelection: false,
            wrapOpenText: "",
            wrapCloseText: "",
        };
    }

    private resolveTemplateTemplate(functionName: string): CalculatorButtonTemplate {
        const templateText =
            DefaultButtonInsertionTemplateService.TEMPLATE_BY_FUNCTION_NAME[functionName];
        const text = templateText ?? `${functionName}(`;

        return {
            text: text,
            cursorOffset: text.indexOf("(") + 1,
            wrapsSelection: false,
            wrapOpenText: "",
            wrapCloseText: "",
        };
    }
}
