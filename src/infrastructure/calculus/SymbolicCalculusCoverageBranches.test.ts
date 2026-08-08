import { describe, expect, it, vi } from "vitest";
import type { MathJsInstance } from "mathjs";
import { AngleMode } from "../../domain/model/AngleMode";
import { CalculationError } from "../../domain/model/CalculationError";
import { CalculationErrorCode } from "../../domain/model/CalculationErrorCode";
import { DefaultResultFormattingService } from "../../domain/services/DefaultResultFormattingService";
import { DefaultCalculusAngleModePolicyService } from "../../application/calculus/DefaultCalculusAngleModePolicyService";
import { CalculusAngleModePolicy } from "../../application/calculus/CalculusAngleModePolicy";
import type { CalculusExpressionEvaluator } from "../../application/calculus/CalculusExpressionEvaluator";
import { DefaultMathJsInstanceProvider } from "../mathjs/DefaultMathJsInstanceProvider";
import type { MathJsInstanceProvider } from "../mathjs/MathJsInstanceProvider";
import { DefaultSymbolicDifferentiationService } from "./DefaultSymbolicDifferentiationService";
import { DefaultSymbolicIntegrationService } from "./DefaultSymbolicIntegrationService";
import { DefaultTaylorSeriesService } from "./DefaultTaylorSeriesService";

function providerWith(overrides: {
    readonly simplify?: unknown;
    readonly derivative?: unknown;
    readonly format?: unknown;
    readonly parse?: unknown;
    readonly evaluate?: unknown;
}): MathJsInstanceProvider {
    const realProvider = new DefaultMathJsInstanceProvider();
    const instance = realProvider.getInstance();

    const wrapped = Object.create(instance);

    for (const [methodName, implementation] of Object.entries(overrides)) {
        Object.defineProperty(wrapped, methodName, {
            value: implementation as never,
            configurable: true,
        });
    }

    return { getInstance: () => wrapped as MathJsInstance };
}

describe("DefaultSymbolicDifferentiationService defensive branches", () => {
    const angleModePolicyService = new DefaultCalculusAngleModePolicyService();
    const resultFormattingService = new DefaultResultFormattingService();

    it("falls back to the unsimplified node when simplification fails", () => {
        const provider = providerWith({
            simplify: vi.fn(() => {
                throw new Error("simplify exploded");
            }),
        });
        const service = new DefaultSymbolicDifferentiationService(
            provider,
            angleModePolicyService,
            resultFormattingService,
        );

        const result = service.differentiateSymbolically(
            "x^2",
            "x",
            AngleMode.RAD,
            CalculusAngleModePolicy.RADIANS_ONLY,
        );

        expect(result).toBe("2*x");
    });

    it("passes an existing calculation error through unchanged", () => {
        const existingError = new CalculationError(
            CalculationErrorCode.EVALUATION_FAILED,
            "original failure",
        );
        const provider = providerWith({
            derivative: vi.fn(() => {
                throw existingError;
            }),
        });
        const service = new DefaultSymbolicDifferentiationService(
            provider,
            angleModePolicyService,
            resultFormattingService,
        );

        expect(() =>
            service.differentiateSymbolically(
                "x^2",
                "x",
                AngleMode.RAD,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toThrow(existingError);
    });

    it("stringifies a non error thrown value", () => {
        const provider = providerWith({
            derivative: vi.fn(() => {
                throw "raw failure";
            }),
        });
        const service = new DefaultSymbolicDifferentiationService(
            provider,
            angleModePolicyService,
            resultFormattingService,
        );

        expect(() =>
            service.differentiateSymbolically(
                "x^2",
                "x",
                AngleMode.RAD,
                CalculusAngleModePolicy.RADIANS_ONLY,
            ),
        ).toThrow(/raw failure/);
    });
});

describe("DefaultSymbolicIntegrationService error path", () => {
    it("maps a non unsupported integration failure", () => {
        const provider = providerWith({
            format: vi.fn(() => {
                throw new Error("formatting exploded");
            }),
        });
        const service = new DefaultSymbolicIntegrationService(
            provider,
            new DefaultResultFormattingService(),
        );

        expect(() => service.integrateSymbolically("x", "x")).toThrow(
            /Symbolic integration failed/,
        );
    });

    it("maps a parse failure", () => {
        const provider = providerWith({
            parse: vi.fn(() => {
                throw new Error("parse exploded");
            }),
        });
        const service = new DefaultSymbolicIntegrationService(
            provider,
            new DefaultResultFormattingService(),
        );

        expect(() => service.integrateSymbolically("x", "x")).toThrow(
            /Symbolic integration failed/,
        );
    });

    it("falls back to the unsimplified node when simplification fails", () => {
        const provider = providerWith({
            simplify: vi.fn(() => {
                throw new Error("simplify exploded");
            }),
        });
        const service = new DefaultSymbolicIntegrationService(
            provider,
            new DefaultResultFormattingService(),
        );

        const result = service.integrateSymbolically("x", "x");

        expect(result).toBe("x^2/2");
    });

    it("stringifies a non error thrown value", () => {
        const provider = providerWith({
            format: vi.fn(() => {
                throw "raw failure";
            }),
        });
        const service = new DefaultSymbolicIntegrationService(
            provider,
            new DefaultResultFormattingService(),
        );

        expect(() => service.integrateSymbolically("x", "x")).toThrow(/raw failure/);
    });
});

describe("DefaultTaylorSeriesService error handling", () => {
    const differentiationService = new DefaultSymbolicDifferentiationService(
        new DefaultMathJsInstanceProvider(),
        new DefaultCalculusAngleModePolicyService(),
        new DefaultResultFormattingService(),
    );

    it("stringifies a non error thrown value from the evaluator", () => {
        const evaluator: CalculusExpressionEvaluator = {
            evaluate: () => {
                throw "raw failure";
            },
        };
        const service = new DefaultTaylorSeriesService(
            new DefaultMathJsInstanceProvider(),
            differentiationService,
            evaluator,
            new DefaultResultFormattingService(),
        );

        expect(() =>
            service.expand("1/x", "x", 0, 3, AngleMode.RAD, CalculusAngleModePolicy.RADIANS_ONLY),
        ).toThrow(/raw failure/);
    });
});
