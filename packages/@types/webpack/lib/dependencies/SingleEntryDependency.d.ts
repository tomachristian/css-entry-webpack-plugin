import ModuleDependency from "./ModuleDependency";

export default class SingleEntryDependency extends ModuleDependency {
    type: "single entry";   // ?

    /**
     * Can be added to SingleEntryDependency.
     */
    loc?: string;

    constructor(request: string);
}
