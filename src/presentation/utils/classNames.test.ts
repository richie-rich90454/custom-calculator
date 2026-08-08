import { describe, expect, it } from "vitest";
import { cssClass, joinClassNames } from "./classNames";

describe("classNames", () => {
    it("returns an empty string for an undefined value", () => {
        expect(cssClass(undefined)).toBe("");
    });

    it("returns the value when provided", () => {
        expect(cssClass("panel")).toBe("panel");
    });

    it("joins defined values", () => {
        expect(joinClassNames("a", undefined, "b")).toBe("a b");
    });
});
