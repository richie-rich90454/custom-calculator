import type { CalculatorButtonDefinition } from "./CalculatorButtonDefinition";
import type { CalculatorButtonTemplate } from "./CalculatorButtonTemplate";

/**
 * Resolves the insertion template for a calculator button.
 *
 * The template describes the exact text to insert and where the cursor must
 * land, so every button shares a consistent insertion model.
 */
export interface ButtonInsertionTemplateService {
    resolveTemplate(button: CalculatorButtonDefinition): CalculatorButtonTemplate;

    resolveDigitTemplate(digit: string): CalculatorButtonTemplate;

    resolveOperatorTemplate(operator: string): CalculatorButtonTemplate;

    resolveFunctionTemplate(functionName: string): CalculatorButtonTemplate;

    resolveTokenTemplate(token: string): CalculatorButtonTemplate;

    resolveCharacterTemplate(character: string): CalculatorButtonTemplate;
}
