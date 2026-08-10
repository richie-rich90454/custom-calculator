import { create, all, type MathJsInstance, type FactoryFunctionMap } from "mathjs";
import type { MathJsInstanceProvider } from "./MathJsInstanceProvider";

export class DefaultMathJsInstanceProvider implements MathJsInstanceProvider {
    private readonly instance: MathJsInstance;

    public constructor() {
        this.instance = create(all as FactoryFunctionMap, {});
        this.registerMissingUnits(this.instance);
    }

    public getInstance(): MathJsInstance {
        return this.instance;
    }

    private registerMissingUnits(math: MathJsInstance): void {
        math.createUnit("ha", { definition: "1 hectare" });
        math.createUnit("mph", { definition: "1 mile/hour" });
        math.createUnit("knot", { definition: "1852 m/hour" });
        math.createUnit("gon", { definition: "1 grad" });
        math.createUnit("cal", { definition: "4.184 J" });
        math.createUnit("kcal", { definition: "4184 J" });
    }
}
