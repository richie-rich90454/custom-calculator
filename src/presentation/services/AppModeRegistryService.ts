import type { AppModeDescriptor } from "./AppModeDescriptor";

export interface AppModeRegistryService {
    getAllApps(): readonly AppModeDescriptor[];
    getApp(appId: string): AppModeDescriptor | null;
    getDefaultAppId(): string;
}
