import Tapable from "tapable";
import Compilation, { CompilationParams } from "./Compilation";
import NormalModuleFactory from "./NormalModuleFactory";
import { Entry, Configuration } from "./common-types";

export default class Compiler extends Tapable {
    options: Configuration;
    context: string;

    apply(...plugins: (((this: this, compiler: this) => void) | CompilerPlugin)[]): void;

    plugin(name: "entry-option",
        handler: (this: Compiler, context: string, entry: Entry) => void): void;

    plugin(name: "normal-module-factory",
        handler: (this: Compiler, normalModuleFactory: NormalModuleFactory) => void): void;

    plugin(name: "compilation" | "this-compilation",
        handler: (this: Compiler,
                  compilation: Compilation, params: CompilationParams) => void): void;
}

export interface CompilerPlugin {
    apply(compiler: Compiler): void;
}
