import { Compilation } from "src/interop/webpack";
import CssEntryCompilation from "src/CssEntryCompilation";

export interface EntryInfo {
    isMulti: boolean;
    name: string;
}

export const isCssEntry = Symbol("isCssEntry");

export interface TaggedMultiModule {
    // NOTE: Should work after https://github.com/Microsoft/TypeScript/issues/5579
    // [isCssEntry]: boolean;
}

export interface WithCssEntryPlugin {
    applyPlugins(name: "css-entry-compilation", compilation: CssEntryCompilation): void;
}

export function getCssEntryPluginCompilation(compilation: Compilation): WithCssEntryPlugin {
    return compilation as any;
}
