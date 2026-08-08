import { ScientificConstant } from "../model/ScientificConstant";
import { ScientificConstantRepository } from "../repositories/ScientificConstantRepository";
import { ConstantCatalogService } from "./ConstantCatalogService";

export class DefaultConstantCatalogService implements ConstantCatalogService {
  private readonly constants: readonly ScientificConstant[];

  public constructor(
    private readonly constantRepository: ScientificConstantRepository
  ) {
    this.constants = this.constantRepository.loadConstants();
  }

  public getAllConstants(): readonly ScientificConstant[] {
    return this.constants;
  }

  public getConstantById(
    constantId: string
  ): ScientificConstant | null {
    const constant = this.constants.find(
      (candidate) => candidate.id === constantId
    );

    return constant ?? null;
  }

  public getConstantInsertText(constantId: string): string | null {
    const constant = this.getConstantById(constantId);

    if (constant === null) {
      return null;
    }

    return constant.id;
  }

  public hasIdentifier(identifier: string): boolean {
    return this.getConstantIdentifiers().includes(identifier);
  }

  public getConstantIdentifiers(): readonly string[] {
    return this.constants.map((constant) => constant.id);
  }
}
