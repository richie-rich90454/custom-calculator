import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CalculatorAppIconComponent } from "./CalculatorAppIconComponent";

describe("CalculatorAppIconComponent", () => {
    it.each([
        "calculate",
        "complex",
        "base-n",
        "matrix",
        "vector",
        "statistics",
        "table",
        "equation",
        "calculus",
        "ratio",
    ])("renders original line art for the %s icon", (iconId) => {
        const { container } = render(<CalculatorAppIconComponent iconId={iconId} />);

        expect(container.querySelector("svg")).not.toBeNull();
        expect(container.querySelectorAll("path, circle, line, rect").length).toBeGreaterThan(0);
    });

    it("renders a fallback icon for unknown ids", () => {
        const { container } = render(<CalculatorAppIconComponent iconId="missing" />);

        expect(container.querySelector("svg circle")).not.toBeNull();
    });
});
