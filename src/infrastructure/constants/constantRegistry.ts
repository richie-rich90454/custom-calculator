import { ScientificConstant } from "../../domain/model/ScientificConstant";
import { mathConstants } from "./mathConstants";
import { physicsConstants } from "./physicsConstants";
import { atomicParticleConstants } from "./atomicParticleConstants";
import { chemistryConstants } from "./chemistryConstants";

export class ScientificConstantRegistry {
  public static createAllConstants(): readonly ScientificConstant[] {
    return [
      ...mathConstants,
      ...physicsConstants,
      ...atomicParticleConstants,
      ...chemistryConstants,
    ];
  }
}
