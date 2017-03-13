import Module from "./Module";
import Dependency from "./Dependency";
import SingleEntryDependency from "./dependencies/SingleEntryDependency";

export default class MultiModule extends Module {
    context: string;
    dependencies: SingleEntryDependency[];
    name: string;
    built: boolean;
    cacheable: boolean;

    constructor(context: string, dependencies: any/*ModuleDependency*/[], name: string);

    identifier(): string;
    readableIdentifier(): string;
}

