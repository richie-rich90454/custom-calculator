import type { UniqueIdentifierFactory } from "./UniqueIdentifierFactory";

export class DefaultUniqueIdentifierFactory
  implements UniqueIdentifierFactory
{
  public createUniqueIdentifier(): string {
    const cryptoApi = globalThis.crypto;

    if (cryptoApi !== undefined && "randomUUID" in cryptoApi) {
      return cryptoApi.randomUUID();
    }

    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
