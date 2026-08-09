import type { Complex, MathJsInstance } from "mathjs";
import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";
import type { ComplexOperationsGateway } from "../../domain/services/ComplexOperationsGateway";
import type { ComplexValue } from "../../domain/model/ComplexValue";

/**
 * Complex arithmetic gateway backed by the math.js instance.
 */
export class MathJsComplexOperationsGateway implements ComplexOperationsGateway {
    public constructor(private readonly instanceProvider: MathJsInstanceProvider) {}

    public add(a: ComplexValue, b: ComplexValue): ComplexValue {
        return this.toDomain(this.math().add(this.toMath(a), this.toMath(b)) as Complex);
    }

    public subtract(a: ComplexValue, b: ComplexValue): ComplexValue {
        return this.toDomain(this.math().subtract(this.toMath(a), this.toMath(b)) as Complex);
    }

    public multiply(a: ComplexValue, b: ComplexValue): ComplexValue {
        return this.toDomain(this.math().multiply(this.toMath(a), this.toMath(b)) as Complex);
    }

    public divide(a: ComplexValue, b: ComplexValue): ComplexValue {
        return this.toDomain(this.math().divide(this.toMath(a), this.toMath(b)) as Complex);
    }

    public conjugate(z: ComplexValue): ComplexValue {
        return this.toDomain(this.math().conj(this.toMath(z)) as Complex);
    }

    public abs(z: ComplexValue): number {
        return Number(this.math().abs(this.toMath(z)));
    }

    public arg(z: ComplexValue): number {
        return Number(this.math().arg(this.toMath(z)));
    }

    public rectToPolar(z: ComplexValue): { radius: number; angle: number } {
        return { radius: this.abs(z), angle: this.arg(z) };
    }

    public polarToRect(radius: number, angle: number): ComplexValue {
        return {
            re: radius * Math.cos(angle),
            im: radius * Math.sin(angle),
        };
    }

    private math(): MathJsInstance {
        return this.instanceProvider.getInstance();
    }

    private toMath(value: ComplexValue): Complex {
        return this.math().complex(value.re, value.im);
    }

    private toDomain(value: Complex): ComplexValue {
        return {
            re: Number(value.re),
            im: Number(value.im),
        };
    }
}
