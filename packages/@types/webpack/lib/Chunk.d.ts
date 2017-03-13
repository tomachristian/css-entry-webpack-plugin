import Module from "./Module";

export default class Chunk {
    name: string;
    files: string[];
    modules: Module[];
    entryModule?: Module;
}
