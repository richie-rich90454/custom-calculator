import { create, all, type MathJsInstance, type FactoryFunctionMap } from "mathjs";
import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";

export class DefaultMathJsInstanceProvider implements MathJsInstanceProvider {
    private readonly instance: MathJsInstance;

    public constructor() {
        this.instance = create(all as FactoryFunctionMap, {});
    }

    public getInstance(): MathJsInstance {
        return this.instance;
    }
}
