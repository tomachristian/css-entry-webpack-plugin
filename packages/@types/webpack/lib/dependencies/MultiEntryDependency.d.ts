import Dependency from "../Dependency";
import SingleEntryDependency from "./SingleEntryDependency";

export default class MultiEntryDependency extends Dependency {
    type: "multi entry";   // ?
    name: string;
    dependencies: SingleEntryDependency[];

    constructor(dependencies: SingleEntryDependency[], name: string);
}
