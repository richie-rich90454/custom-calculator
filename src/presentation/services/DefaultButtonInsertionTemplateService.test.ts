import { describe, expect, it } from "vitest";
import type { CalculatorButtonDefinition } from "./CalculatorButtonDefinition";
import { CalculatorButtonInsertionBehavior } from "./CalculatorButtonInsertionBehavior";
import { CalculatorKeyKind } from "./CalculatorKeyDefinition";
import { DefaultButtonInsertionTemplateService } from "./DefaultButtonInsertionTemplateService";

describe("DefaultButtonInsertionTemplateService", () => {
  const service = new DefaultButtonInsertionTemplateService();

  const createButton = (
    behavior: CalculatorButtonInsertionBehavior,
    value: string
  ): CalculatorButtonDefinition => ({
    id: "test",
    label: value,
    ariaLabel: "Test button",
    kind: CalculatorKeyKind.FUNCTION,
    value: value,
    behavior: behavior,
  });

  it("resolves a character template for a digit", () => {
    const template = service.resolveDigitTemplate("7");

    expect(template.text).toBe("7");
    expect(template.cursorOffset).toBe(1);
    expect(template.wrapsSelection).toBe(false);
  });

  it("resolves an operator template with the cursor after the operator", () => {
    const template = service.resolveOperatorTemplate("+");

    expect(template.text).toBe("+");
    expect(template.cursorOffset).toBe(1);
  });

  it("resolves a plain function template with the cursor after the parenthesis", () => {
    const template = service.resolveFunctionTemplate("sin");

    expect(template.text).toBe("sin(");
    expect(template.cursorOffset).toBe(4);
    expect(template.wrapsSelection).toBe(true);
    expect(template.wrapOpenText).toBe("sin(");
    expect(template.wrapCloseText).toBe(")");
  });

  it("resolves a calculus template with the cursor at the first placeholder", () => {
    const template = service.resolveFunctionTemplate("derivative");

    expect(template.text).toBe("derivative(, x)");
    expect(template.cursorOffset).toBe(11);
    expect(template.wrapsSelection).toBe(false);
  });

  it("resolves an integral template with the cursor at the first placeholder", () => {
    const template = service.resolveFunctionTemplate("integral");

    expect(template.text).toBe("integral(, x, a, b)");
    expect(template.cursorOffset).toBe(9);
  });

  it("resolves a token template with the cursor after the token", () => {
    const template = service.resolveTokenTemplate("speedOfLight");

    expect(template.text).toBe("speedOfLight");
    expect(template.cursorOffset).toBe(12);
  });

  it("resolves a character template for a parenthesis", () => {
    const template = service.resolveCharacterTemplate("(");

    expect(template.text).toBe("(");
    expect(template.cursorOffset).toBe(1);
  });

  it("resolves a template from a button definition by behavior", () => {
    expect(
      service.resolveTemplate(createButton(CalculatorButtonInsertionBehavior.INSERT_CHARACTER, "7")).text
    ).toBe("7");
    expect(
      service.resolveTemplate(createButton(CalculatorButtonInsertionBehavior.INSERT_FUNCTION, "cos")).text
    ).toBe("cos(");
    expect(
      service.resolveTemplate(createButton(CalculatorButtonInsertionBehavior.INSERT_TEMPLATE, "sum")).text
    ).toBe("sum(, n, 1, 10)");
  });

  it("falls back to a character template for an unknown behavior", () => {
    const template = service.resolveTemplate(
      createButton(
        "UNKNOWN" as CalculatorButtonInsertionBehavior,
        "?"
      )
    );

    expect(template.text).toBe("?");
    expect(template.cursorOffset).toBe(1);
  });

  it("falls back to a plain function template for an unknown template function", () => {
    const template = service.resolveFunctionTemplate("unknownFunction");

    expect(template.text).toBe("unknownFunction(");
    expect(template.cursorOffset).toBe(16);
  });
});
