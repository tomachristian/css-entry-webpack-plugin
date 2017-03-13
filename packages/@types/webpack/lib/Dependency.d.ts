export interface Reference {

}

export default class Dependency {
    isEqualResource(other: Dependency): boolean;
    getReference(): Reference;
    getExports(): null;
    getWarnings(): null;
    getErrors(): null;
    updateHash(hash: string): void;
    disconnect(): void;
    //compare(a: UnknownType<"location">, b: UnknownType<"location">): UnknownType<"some return type">;
    //static compare(a: UnknownType<"location">, b: UnknownType<"location">): UnknownType<"some return type">;
}
