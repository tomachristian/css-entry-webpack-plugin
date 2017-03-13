import Tapable, { AsyncWaterfallCallback } from "tapable";
import { Loader } from "./common-types";
import Dependency from "./Dependency";

export default class NormalModuleFactory extends Tapable {
    plugin(name: "after-resolve",
           handler: (this: NormalModuleFactory,
                     data: AfterResolveData, callback: AfterResolveCallback) => void): void;
}

export interface AfterResolveData {
    request: string;
    rawRequest: string;
    resource: string;
    loaders: Loader[];
    dependencies: Dependency[];
}

export type AfterResolveCallback = AsyncWaterfallCallback<AfterResolveData>;
