import { describe, expect, it } from "vitest";
import { CalculatorCompositionRoot } from "../../app/CalculatorCompositionRoot";
import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import { MathJsCasService } from "../../infrastructure/mathjs/MathJsCasService";
import { CasOperationKind } from "./CasOperationKind";
import type { CasBlockDescriptor } from "./CasBlockDescriptor";
import { DefaultCasBlockParser } from "./DefaultCasBlockParser";
import { DefaultCasExpressionRouterService } from "./DefaultCasExpressionRouterService";
import type { CasService } from "../../domain/services/CasService";

describe("DefaultCasBlockParser operation resolution", () => {
    const parser = new DefaultCasBlockParser();

    it("classifies every supported function name", () => {
        expect(parser.resolveOperationKind("cas")).toBe(CasOperationKind.SIMPLIFY);
        expect(parser.resolveOperationKind("casSimplify")).toBe(CasOperationKind.SIMPLIFY);
        expect(parser.resolveOperationKind("casExpand")).toBe(CasOperationKind.EXPAND);
        expect(parser.resolveOperationKind("casDerivative")).toBe(CasOperationKind.DERIVATIVE);
    });

    it("defaults unknown CAS function names to simplify", () => {
        expect(parser.resolveOperationKind("casIntegrate")).toBe(CasOperationKind.SIMPLIFY);
    });
});

describe("DefaultCasExpressionRouterService operation dispatch", () => {
    const router = new DefaultCasExpressionRouterService();

    it("routes an unknown operation kind to simplification", () => {
        const casService: CasService = {
            simplifyExpression: () => "simplified",
            expandExpression: () => "expanded",
            differentiateExpression: () => "differentiated",
        };

        const descriptor: CasBlockDescriptor = {
            operationKind: "UNKNOWN" as CasOperationKind,
            innerExpressionText: "x+x",
            derivativeVariableName: null,
        };

        const resolution = router.routeBlock(descriptor, true, casService);

        expect(resolution.resultText).toBe("simplified");
    });

    it("stringifies a non error thrown value", () => {
        const casService: CasService = {
            simplifyExpression: () => {
                throw "raw failure";
            },
            expandExpression: () => "",
            differentiateExpression: () => "",
        };

        const resolution = router.routeBlock(
            {
                operationKind: CasOperationKind.SIMPLIFY,
                innerExpressionText: "x+x",
                derivativeVariableName: null,
            },
            true,
            casService,
        );

        expect(resolution.resultText).toBeNull();
        expect(resolution.errorText).toContain("raw failure");
    });
});

describe("MathJsCasService error mapping", () => {
    const root = new CalculatorCompositionRoot();
    const casService = root.casService as MathJsCasService;

    it("passes through an existing calculation error", () => {
        const existingError = new CalculationError(CalculationErrorCode.SYNTAX_ERROR, "original");

        expect(casService.mapError(existingError)).toBe(existingError);
    });

    it("wraps a generic error message", () => {
        const mapped = casService.mapError(new Error("generic"));

        expect(mapped).toBeInstanceOf(CalculationError);
        expect(mapped.code).toBe(CalculationErrorCode.EVALUATION_FAILED);
        expect(mapped.message).toContain("generic");
    });

    it("stringifies a non error thrown value", () => {
        const mapped = casService.mapError("raw failure");

        expect(mapped).toBeInstanceOf(CalculationError);
        expect(mapped.message).toContain("raw failure");
    });
});
