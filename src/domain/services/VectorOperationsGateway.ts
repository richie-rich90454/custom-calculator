export type VectorValue = readonly number[];

export interface VectorOperationResult {
    readonly value: VectorValue | null;
    readonly errorMessage: string | null;
}

/**
 * Vector arithmetic through the math.js instance.
 *
 * The vector app depends on this gateway so math.js stays confined to the
 * infrastructure layer. Errors carry a clear message instead of throwing.
 */
export interface VectorOperationsGateway {
    dot(a: VectorValue, b: VectorValue): VectorOperationResult;
    cross(a: VectorValue, b: VectorValue): VectorOperationResult;
    magnitude(v: VectorValue): number;
    angleBetween(a: VectorValue, b: VectorValue): VectorOperationResult;
    unit(v: VectorValue): VectorOperationResult;
}
