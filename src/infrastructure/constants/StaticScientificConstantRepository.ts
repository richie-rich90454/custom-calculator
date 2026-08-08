import { ScientificConstant } from "../../domain/model/ScientificConstant";
import type { ScientificConstantRepository } from "../../domain/repositories/ScientificConstantRepository";
import { ScientificConstantRegistry } from "./constantRegistry";

export class StaticScientificConstantRepository implements ScientificConstantRepository {
    private readonly constants: readonly ScientificConstant[];

    public constructor() {
        this.constants = ScientificConstantRegistry.createAllConstants();
    }

    public loadConstants(): readonly ScientificConstant[] {
        return this.constants;
    }
}
