import type { MathJsInstance } from "mathjs";

export interface MathJsInstanceProvider {
    getInstance(): MathJsInstance;
}
