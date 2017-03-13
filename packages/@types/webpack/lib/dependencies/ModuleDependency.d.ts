import Dependency from "../Dependency";

export default class ModuleDependency extends Dependency {
    request: string;
    userRequest: string;

    constructor(request: string);
}
