import { Source, Resolver, Loader } from "webpack";
import Compiler, { CompilerPlugin } from "webpack/lib/Compiler";
import Compilation, { CompilationPlugin, AfterSealCallback, Assets } from "webpack/lib/Compilation";
import Module from "webpack/lib/Module";
import MultiModule from "webpack/lib/MultiModule";
import Chunk from "webpack/lib/Chunk";
import SingleEntryDependency from "webpack/lib/dependencies/SingleEntryDependency";
import MultiEntryDependency from "webpack/lib/dependencies/MultiEntryDependency";
import { AfterResolveData } from "webpack/lib/NormalModuleFactory";

export {
    Resolver, Source, Loader,
    Compiler, CompilerPlugin,
    Compilation, CompilationPlugin, AfterSealCallback, Assets,
    Module, MultiModule,
    Chunk,
    SingleEntryDependency, MultiEntryDependency,
    AfterResolveData };

export const multiEntryDependencyLocSeparator = ":";

export const webpackDevServerResourceTests = [
    /webpack-dev-server(\/|\\)client/,
    /webpack\/hot/
];

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

export function isWebpackDevServerResource(resource: string): boolean {
    return webpackDevServerResourceTests
        .some(resourceTest => resourceTest.test(resource));
}

export function excludeWebpackDevServerResources(resources: string[]): string[] {
    return resources.filter(resource => !isWebpackDevServerResource(resource));
}
