import Module from "./Module";

export default class ModuleReason {
    module: Module;
    dependency: any;

    constructor(module: Module, dependency: any);
}
