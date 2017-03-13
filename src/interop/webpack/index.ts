import Compiler from "webpack/lib/Compiler";
import Compilation, { AfterSealCallback, Assets } from "webpack/lib/Compilation";
import Module from "webpack/lib/Module";
import MultiModule from "webpack/lib/MultiModule";
import Chunk from "webpack/lib/Chunk";
import SingleEntryDependency from "webpack/lib/dependencies/SingleEntryDependency";
import MultiEntryDependency from "webpack/lib/dependencies/MultiEntryDependency";
import { AfterResolveData } from "webpack/lib/NormalModuleFactory";
import Source from "webpack-sources/lib/Source";
import Resolver from "enhanced-resolve/lib/Resolver";

export type Resolver = Resolver;

export * from "webpack";

export {
    Compilation, AfterSealCallback,
    Module, MultiModule,
    Chunk,
    SingleEntryDependency, MultiEntryDependency,
    AfterResolveData,
    Assets, Source };

export const multiEntryDependencyLocSeparator = ":";

export function loaderToIdent(data) {
    if (!data.options)
        return data.loader;
    if (typeof data.options === "string")
        return data.loader + "?" + data.options;
    if (typeof data.options !== "object")
        throw new Error("loader options must be string or object");
    if (data.ident)
        return data.loader + "??" + data.ident;
    return data.loader + "?" + JSON.stringify(data.options);
}

export function loadersToRequestIdent(loaders, resource) {
    return loaders.map(loaderToIdent).concat([resource]).join("!");
}

