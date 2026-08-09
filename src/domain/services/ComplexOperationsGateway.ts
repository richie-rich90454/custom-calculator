import type { ComplexValue } from "../model/ComplexValue";

/**
 * Complex arithmetic through the math.js instance.
 *
 * The complex app depends on this gateway so math.js stays confined to the
 * infrastructure layer.
 */
export interface ComplexOperationsGateway {
    add(a: ComplexValue, b: ComplexValue): ComplexValue;
    subtract(a: ComplexValue, b: ComplexValue): ComplexValue;
    multiply(a: ComplexValue, b: ComplexValue): ComplexValue;
    divide(a: ComplexValue, b: ComplexValue): ComplexValue;
    conjugate(z: ComplexValue): ComplexValue;
    abs(z: ComplexValue): number;
    arg(z: ComplexValue): number;
    rectToPolar(z: ComplexValue): { radius: number; angle: number };
    polarToRect(radius: number, angle: number): ComplexValue;
}
