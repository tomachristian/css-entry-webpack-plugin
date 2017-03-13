import Tapable, { AsyncCallback } from "tapable";
import Chunk from "./Chunk";
import Module from "./Module";
import NormalModuleFactory from "./NormalModuleFactory";
import Entrypoint from "./Entrypoint";
import Source from "webpack-sources/lib/Source";
import Resolver from "enhanced-resolve/lib/Resolver";

export default class Compilation extends Tapable {
    chunks: Chunk[];
    assets: Assets;
    entries: Module[];
    resolvers: Resolvers;
    entrypoints: Entrypoints;

    errors: (Error | string)[];
    warnings: (Error | string)[];

    apply(...plugins: (((this: this, compilation: this) => void) | CompilationPlugin)[]): void;

    plugin(name: "after-seal",
           handler: (this: Compilation, callback: AfterSealCallback) => void): void;

    plugin(name: "optimize-tree",
           handler: (this: Compilation,
                     chunks: Chunk[], modules: Module[],
                     callback: OptimizeTreeCallback) => void): void;

    plugin(name: "additional-assets",
           handler: (this: Compilation, callback: AdditionalAssetsCallback) => void): void;
}

export interface CompilationPlugin {
    apply(compilation: Compilation): void;
}

export interface CompilationParams {
    normalModuleFactory: NormalModuleFactory;
}

export interface Assets {
    [assetName: string]: Source;
}

export type AfterSealCallback = AsyncCallback;
export type OptimizeTreeCallback = AsyncCallback;
export type AdditionalAssetsCallback = AsyncCallback;

export interface Resolvers {
    normal: Resolver;
    context: Resolver;
    loader: Resolver;
}

export interface Entrypoints {
    [entryName: string]: Entrypoint;
}
