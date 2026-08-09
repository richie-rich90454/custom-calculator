import type { MathJsInstance } from "mathjs";
import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";
import type {
    VectorOperationResult,
    VectorOperationsGateway,
} from "../../domain/services/VectorOperationsGateway";
import type { VectorValue } from "../../domain/model/VectorValue";

/**
 * Vector operations gateway backed by the math.js instance.
 *
 * Cross product requires three-component vectors, angleBetween clamps its
 * cosine argument to [-1, 1], and a zero vector has no unit form.
 */
export class MathJsVectorOperationsGateway implements VectorOperationsGateway {
    public constructor(private readonly instanceProvider: MathJsInstanceProvider) {}

    public dot(a: VectorValue, b: VectorValue): VectorOperationResult {
        if (!sameDimension(a, b)) {
            return { value: null, errorMessage: "Dot product needs vectors of equal dimension." };
        }

        return { value: [Number(this.math().dot([...a], [...b]))], errorMessage: null };
    }

    public cross(a: VectorValue, b: VectorValue): VectorOperationResult {
        if (a.length !== 3 || b.length !== 3) {
            return { value: null, errorMessage: "Cross product requires 3-component vectors." };
        }

        return { value: toVector(this.math().cross([...a], [...b])), errorMessage: null };
    }

    public magnitude(v: VectorValue): number {
        return Math.hypot(...v);
    }

    public angleBetween(a: VectorValue, b: VectorValue): VectorOperationResult {
        if (a.length === 0 || b.length === 0 || a.length !== b.length) {
            return {
                value: null,
                errorMessage: "Angle needs non-empty vectors of equal dimension.",
            };
        }

        const dotValue = this.dot(a, b).value as [number];
        const cosine = dotValue[0] / (this.magnitude(a) * this.magnitude(b));

        return { value: [Math.acos(clamp(cosine, -1, 1))], errorMessage: null };
    }

    public unit(v: VectorValue): VectorOperationResult {
        const length = this.magnitude(v);

        if (length === 0) {
            return { value: null, errorMessage: "The zero vector has no unit form." };
        }

        return { value: v.map((component) => component / length), errorMessage: null };
    }

    private math(): MathJsInstance {
        return this.instanceProvider.getInstance();
    }
}

function sameDimension(a: VectorValue, b: VectorValue): boolean {
    return a.length > 0 && a.length === b.length;
}

function clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(maximum, Math.max(minimum, value));
}

function toVector(value: unknown): VectorValue {
    return (value as number[]).map((component) => Number(component));
}
