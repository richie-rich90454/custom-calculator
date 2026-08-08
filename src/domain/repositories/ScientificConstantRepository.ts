import { ScientificConstant } from "../model/ScientificConstant";

export interface ScientificConstantRepository {
    loadConstants(): readonly ScientificConstant[];
}
